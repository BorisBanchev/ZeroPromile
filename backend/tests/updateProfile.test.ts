import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";

const TEST_USER = {
  name: "test user",
  email: "test_user@test.com",
  password: "12345678",
  gender: "male",
  weightKg: 80,
};

beforeAll(async () => {
  await connectDB();
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
  await disconnectDB();
});

describe("PATCH /api/update/profile", () => {
  it("updates gender and weight for authenticated user", async () => {
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER)
      .expect(201);

    const accessToken = registeredUser.body.data.accessToken;
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe("string");

    const updatedUser = await request(app)
      .patch("/api/update/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ gender: "male", weight: 80 })
      .expect(200);

    expect(updatedUser.body.status).toBe("success");
    expect(updatedUser.body.data).toHaveProperty("gender", "MALE");
    expect(updatedUser.body.data).toHaveProperty("weightKg", 80);

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser!.gender).toBe("MALE");
    expect(dbUser!.weightKg).toBe(80);
  });
  it("updating user with incorrect gender returns 400 and does not change DB", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(201);

    const accessToken = loginRes.body.data.accessToken;
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe("string");

    const res = await request(app)
      .patch("/api/update/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ gender: "invalid", weight: 80 })
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(Array.isArray(res.body.error)).toBe(true);
    expect(res.body.error[0]).toHaveProperty("message");
    expect(String(res.body.error[0].message)).toMatch(
      "Invalid gender: Must be either male or female",
    );

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    expect(dbUser).not.toBeNull();
    if (!dbUser) throw new Error("db user missing");
    expect(dbUser.gender).toBe("MALE");
    expect(dbUser.weightKg).toBe(80);
  });

  it("updating user with incorrect weight returns 400 and does not change DB", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(201);

    const accessToken = loginRes.body.data.accessToken;
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe("string");

    const res = await request(app)
      .patch("/api/update/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ gender: "male", weight: -200 })
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(Array.isArray(res.body.error)).toBe(true);
    expect(res.body.error[0]).toHaveProperty("message");
    expect(String(res.body.error[0].message)).toMatch(
      "Weight must be a positive number",
    );

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    expect(dbUser).not.toBeNull();
    if (!dbUser) throw new Error("db user missing");
    expect(dbUser.gender).toBe("MALE");
    expect(dbUser.weightKg).toBe(80);
  });
});
