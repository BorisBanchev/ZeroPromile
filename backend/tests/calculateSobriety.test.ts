import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";

const TEST_USER = {
  name: "session user",
  email: "session_user@test.com",
  password: "password123",
  gender: "male",
  weightKg: 80,
};

let cookieHeader: string | undefined;

beforeAll(async () => {
  await connectDB();

  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });

  const registered = await request(app)
    .post("/api/auth/register")
    .send(TEST_USER)
    .expect(201);

  const setCookie = registered.headers["set-cookie"];
  cookieHeader = Array.isArray(setCookie)
    ? setCookie.map((c) => c.split(";")[0]).join("; ")
    : String(setCookie).split(";")[0];
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

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    if (!dbUser) throw new Error("User missing in DB");

    await prisma.sessionDrink.deleteMany({
      where: { session: { userId: dbUser.id } },
    });
    await prisma.session.deleteMany({ where: { userId: dbUser.id } });

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
});
