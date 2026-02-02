import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { connectDB, disconnectDB, prisma } from "../src/config/db";

const TEST_USER = {
  name: "Test User1",
  email: "test_user1@example.com",
  password: "password123",
  gender: "male",
  weightKg: 80,
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
    expect(res.body.data.user.gender).toBe(TEST_USER.gender);
    expect(res.body.data.user.weightKg).toBe(TEST_USER.weightKg);

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
    gender: "male",
    weightKg: 80,
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

describe("POST /api/auth/logout", () => {
  it("logs out and prevents access to protected routes", async () => {
    const USER = {
      name: "Logout User",
      email: "logout_user@example.com",
      password: "password123",
      gender: "male",
      weightKg: 80,
    };

    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(USER)
      .expect(201);

    const setCookie = registerRes.headers["set-cookie"];
    expect(setCookie).toBeDefined();

    const logoutRes = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", Array.isArray(setCookie) ? setCookie : String(setCookie))
      .expect(200);

    expect(logoutRes.body.status).toBe("success");
    const cleared = logoutRes.headers["set-cookie"];
    expect(cleared).toBeDefined();
    const cookieHeader = Array.isArray(cleared)
      ? cleared.join("; ")
      : String(cleared);
    expect(cookieHeader).toMatch(/jwt=/);
    expect(cookieHeader).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);

    const protectedRes = await request(app)
      .patch("/api/update/profile")
      .set("Cookie", cookieHeader)
      .send({ gender: "male", weight: 75 })
      .expect(401);

    expect(protectedRes.body).toHaveProperty("error");
  });
});
