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

describe("POST /api/auth/login", () => {
  const LOGIN_USER = {
    name: "Login User",
    email: "login_user@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: LOGIN_USER.email } });
    await request(app).post("/api/auth/register").send(LOGIN_USER).expect(201);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: LOGIN_USER.email } });
  });

  it("responds 401 when email doesn't exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "incorrect@example.com", password: "password123" })
      .expect(401);

    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("responds 401 when password invalid", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login_user@example.com", password: "invalid" })
      .expect(401);

    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("logs in the user with correct credentials and returns user & token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: LOGIN_USER.email, password: LOGIN_USER.password })
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user.email).toBe(LOGIN_USER.email);
    expect(res.body.data).toHaveProperty("token");
    expect(typeof res.body.data.token).toBe("string");
  });
});
