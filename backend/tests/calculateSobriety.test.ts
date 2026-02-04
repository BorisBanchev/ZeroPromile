import { beforeAll, afterAll, describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";
import { currentBAC } from "../src/utils/calculateSobriety";

const TEST_USER = {
  name: "session user",
  email: "session_user@test.com",
  password: "password123",
  gender: "male",
  weightKg: 80,
};
const TEST_USER_FEMALE = {
  name: "female user",
  email: "female_user@test.com",
  password: "password123",
  gender: "female",
  weightKg: 60,
};

let cookieHeader: string | undefined;
let userId: string | undefined;

beforeAll(async () => {
  await connectDB();

  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });

  const registered = await request(app)
    .post("/api/auth/register")
    .send(TEST_USER)
    .expect(201);

  userId = registered.body.data.user.id;

  const setCookie = registered.headers["set-cookie"];
  cookieHeader = Array.isArray(setCookie)
    ? setCookie.map((c) => c.split(";")[0]).join("; ")
    : String(setCookie).split(";")[0];
});

beforeEach(async () => {
  if (!userId) return;

  await prisma.sessionDrink.deleteMany({
    where: { session: { userId } },
  });
  await prisma.session.deleteMany({ where: { userId } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
  await disconnectDB();
});
describe("POST /api/sessions", () => {
  it("creates session and first drink when authenticated", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Evening Session",
      drink: { name: "Beer", volumeMl: 330, abv: 5 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Session started");

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });

    expect(dbUser).not.toBeNull();
    if (!dbUser) throw new Error("User missing in DB");

    const dbSession = await prisma.session.findFirst({
      where: { userId: dbUser.id },
      include: { drinks: true },
    });
    expect(dbSession).not.toBeNull();
    if (!dbSession) throw new Error("Session missing in DB");

    expect(dbSession!.name).toBe(body.sessionName);
    expect(dbSession!.drinks.length).toBe(1);

    const createdDrink = dbSession!.drinks[0];
    expect(createdDrink.name).toBe(body.drink.name);
    expect(createdDrink.volumeMl).toBe(body.drink.volumeMl);
    expect(createdDrink.abv).toBe(body.drink.abv);
    expect(typeof createdDrink.bacContribution).toBe("number");
  });

  it("returns 401 with error when not authenticated", async () => {
    const body = {
      sessionName: "NoAuth Session",
      drink: { name: "Rum", volumeMl: 50, abv: 40 },
    };

    const res = await request(app).post("/api/sessions").send(body).expect(401);
    expect(res.body).toHaveProperty(
      "error",
      "Not authorized, no token provided",
    );
  });

  it("returns 400 when there is already an active session", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const first = {
      sessionName: "First Session",
      drink: { name: "Wine", volumeMl: 150, abv: 12 },
    };

    await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(first)
      .expect(201);

    const second = {
      sessionName: "Second Session",
      drink: { name: "Shot", volumeMl: 40, abv: 40 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(second)
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "There is already an active session",
    );
  });

  it("returns 400 when drink object is missing from request body", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Invalid Session",
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(400);
  });
});

describe("POST /api/sessions/drinks", () => {
  it("adds second drink to active session and updates BAC calculation", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const firstDrink = {
      sessionName: "Party Session",
      drink: { name: "Beer", volumeMl: 330, abv: 5 },
    };
    // start a session
    const sessionRes = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(firstDrink)
      .expect(201);

    const firstSoberTime = sessionRes.body.data.timeUntilSobriety;
    expect(firstSoberTime).toHaveProperty("hours");
    expect(firstSoberTime).toHaveProperty("minutes");

    const secondDrink = {
      drink: { name: "Wine", volumeMl: 150, abv: 12 },
    };

    const addDrinkRes = await request(app)
      .post("/api/sessions/drinks")
      .set("Cookie", cookieHeader)
      .send(secondDrink)
      .expect(201);

    expect(addDrinkRes.body.status).toBe("success");
    expect(addDrinkRes.body.message).toBe("Drink added to session");
    expect(addDrinkRes.body.data.drink.name).toBe(secondDrink.drink.name);

    const secondSoberTime = addDrinkRes.body.data.timeUntilSobriety;
    const firstTotalMinutes =
      firstSoberTime.hours * 60 + firstSoberTime.minutes;
    const secondTotalMinutes =
      secondSoberTime.hours * 60 + secondSoberTime.minutes;

    // Second drink should increase time until sober
    expect(secondTotalMinutes).toBeGreaterThan(firstTotalMinutes);

    // Verify both drinks are in DB
    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    if (!dbUser) throw new Error("User missing in DB");

    const dbSession = await prisma.session.findFirst({
      where: { userId: dbUser.id, active: true },
      include: { drinks: true },
    });

    expect(dbSession).not.toBeNull();
    expect(dbSession!.drinks.length).toBe(2);
    expect(dbSession!.drinks[0].name).toBe(firstDrink.drink.name);
    expect(dbSession!.drinks[1].name).toBe(secondDrink.drink.name);
  });

  it("returns 401 when not authenticated", async () => {
    const body = {
      drink: { name: "Vodka", volumeMl: 50, abv: 40 },
    };

    const res = await request(app)
      .post("/api/sessions/drinks")
      .send(body)
      .expect(401);

    expect(res.body).toHaveProperty("error");
  });

  it("returns 404 when no active session exists", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      drink: { name: "Whiskey", volumeMl: 40, abv: 43 },
    };

    const res = await request(app)
      .post("/api/sessions/drinks")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(404);

    expect(res.body).toHaveProperty("error", "Active session not found");
  });
});

describe("Edge cases for BAC calculation", () => {
  it("calculates higher time until sobriety for female", async () => {
    await prisma.user.deleteMany({ where: { email: TEST_USER_FEMALE.email } });

    const femaleReg = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER_FEMALE)
      .expect(201);

    const femaleCookie = Array.isArray(femaleReg.headers["set-cookie"])
      ? femaleReg.headers["set-cookie"].map((c) => c.split(";")[0]).join("; ")
      : String(femaleReg.headers["set-cookie"]).split(";")[0];

    const body = {
      sessionName: "Female User Session",
      drink: { name: "Wine", volumeMl: 150, abv: 12 },
    };

    const femaleRes = await request(app)
      .post("/api/sessions")
      .set("Cookie", femaleCookie)
      .send(body)
      .expect(201);

    const maleRes = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader!)
      .send(body)
      .expect(201);

    const femaleSoberMinutes =
      femaleRes.body.data.timeUntilSobriety.hours * 60 +
      femaleRes.body.data.timeUntilSobriety.minutes;
    const maleSoberMinutes =
      maleRes.body.data.timeUntilSobriety.hours * 60 +
      maleRes.body.data.timeUntilSobriety.minutes;

    expect(femaleSoberMinutes).toBeGreaterThan(maleSoberMinutes);
  });

  it("accumulates BAC correctly with multiple drinks", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Multi Drink Session",
      drink: { name: "Beer 1", volumeMl: 330, abv: 5 },
    };

    const firstRes = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(201);

    const firstTime =
      firstRes.body.data.timeUntilSobriety.hours * 60 +
      firstRes.body.data.timeUntilSobriety.minutes;

    await request(app)
      .post("/api/sessions/drinks")
      .set("Cookie", cookieHeader)
      .send({ drink: { name: "Beer 2", volumeMl: 330, abv: 5 } })
      .expect(201);

    const thirdRes = await request(app)
      .post("/api/sessions/drinks")
      .set("Cookie", cookieHeader)
      .send({ drink: { name: "Beer 3", volumeMl: 330, abv: 5 } })
      .expect(201);

    const thirdTime =
      thirdRes.body.data.timeUntilSobriety.hours * 60 +
      thirdRes.body.data.timeUntilSobriety.minutes;

    // Time should roughly triple when adding drinks one after another
    expect(thirdTime).toBeGreaterThan(firstTime * 2.5);
    expect(thirdTime).toBeLessThan(firstTime * 3.5);

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    if (!dbUser) throw new Error("User missing in DB");

    const dbSession = await prisma.session.findFirst({
      where: { userId: dbUser.id },
      include: { drinks: true },
    });

    expect(dbSession!.drinks.length).toBe(3);
  });

  it("rejects drinks with invalid ABV (over 100%)", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Invalid ABV Session",
      drink: { name: "Impossible Drink", volumeMl: 50, abv: 150 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(Array.isArray(res.body.error)).toBe(true);
    expect(res.body.error[0]).toHaveProperty("message");
    expect(String(res.body.error[0].message)).toMatch(
      "Drink abv must be at most 100",
    );
  });

  it("rejects drinks with negative volume", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Invalid Volume Session",
      drink: { name: "No Volume", volumeMl: -50, abv: 5 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(Array.isArray(res.body.error)).toBe(true);
    expect(res.body.error[0]).toHaveProperty("message");
    expect(String(res.body.error[0].message)).toMatch(
      "Drink amount in Ml must be a positive number",
    );
  });

  it("rejects drinks with zero ABV", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Zero ABV Session",
      drink: { name: "Water", volumeMl: 330, abv: 0 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(Array.isArray(res.body.error)).toBe(true);
    expect(res.body.error[0]).toHaveProperty("message");
    expect(String(res.body.error[0].message)).toMatch(
      "Drink abv must be greater than 0",
    );
  });
  it("calculates BAC as 0 after sufficient time has elapsed for metabolism", async () => {
    if (!cookieHeader) throw new Error("Missing auth cookie");

    const body = {
      sessionName: "Metabolized Session",
      drink: { name: "Small Beer", volumeMl: 250, abv: 4 },
    };

    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", cookieHeader)
      .send(body)
      .expect(201);

    const soberTime = res.body.data.timeUntilSobriety;
    const totalMinutes = soberTime.hours * 60 + soberTime.minutes;

    // Verify initial sobriety time is greater than 0
    expect(totalMinutes).toBeGreaterThan(0);

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    if (!dbUser) throw new Error("User missing in DB");

    const dbSession = await prisma.session.findFirst({
      where: { userId: dbUser.id, active: true },
      include: { drinks: true },
    });

    if (!dbSession) throw new Error("Session missing in DB");

    // Get the drink's BAC contribution and consumed time
    const drink = dbSession.drinks[0];
    const bacContribution = drink.bacContribution ?? 0;

    // Calculate BAC immediately
    const nowMs = Date.now();
    const drinksForCalc = [
      {
        time: new Date(drink.consumedAt).getTime(),
        bac: bacContribution,
      },
    ];

    const currentBacNow = currentBAC(drinksForCalc, nowMs);
    expect(currentBacNow).toBeGreaterThan(0);

    // calculate BAC after metabolism time
    // BETA = 0.15 promilles/hour, so time = bacContribution / 0.15 hours
    const hoursToMetabolize = bacContribution / 0.15;
    const msToMetabolize = hoursToMetabolize * 60 * 60 * 1000;

    // Add 5min extra to ensure complete metabolism
    const futureTimeMs = nowMs + msToMetabolize + 5 * 60 * 1000;

    const bacAfterMetabolism = currentBAC(drinksForCalc, futureTimeMs);

    // BAC should be 0
    expect(bacAfterMetabolism).toEqual(0);
  });
});
