import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";

const TEST_USER = {
  name: "Test User1",
  email: "test_user1@example.com",
  password: "password123",
};

beforeAll(async () => {
  await connectDB();
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
  await disconnectDB();
});

describe("POST /api/auth/register", () => {
  it("creates a user when none exists", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER)
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user.email).toBe(TEST_USER.email);

    const dbUser = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser!.password).not.toBe(TEST_USER.password);
  });
  it("responds 400 with error when user already exists", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER)
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "User already exists with this email",
    );
  });
});
