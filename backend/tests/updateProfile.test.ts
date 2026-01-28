import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";

const TEST_USER = {
  name: "test user",
  email: "test_user@test.com",
  password: "12345678",
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

    const setCookie = registeredUser.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.join("; ")
      : String(setCookie);

    const updatedUser = await request(app)
      .patch("/api/update/profile")
      .set("Cookie", cookieHeader)
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
});
