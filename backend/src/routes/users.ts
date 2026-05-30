import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { users } from "../db/schema";
import { db } from "../db";
import { registerUser, resendOtp, verifyOtp } from "../controller/register";
import { loginUser } from "../controller/login";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(jwt({ name: "jwt", secret: Bun.env.JWT_SECRET! }))
  .get("/", async () => {
    try {
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        message: "Failed to fetch users",
        data: [],
      };
    }
  })

  .post(
    "/register",
    async ({ body }) => {
      return await registerUser(body);
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    },
  )

  .post(
    "/verify-otp",
    async ({ body }) => {
      return await verifyOtp(body);
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        otp: t.String({ minLength: 6, maxLength: 6 }),
      }),
    },
  )

  .post(
    "/resend-otp",
    async ({ body }) => {
      return await resendOtp(body);
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
      }),
    },
  )

  .post(
    "/login",
    async ({ body, jwt, cookie: { auth_token } }) => {
      const result = await loginUser(body, jwt);
      if (result.token) {
        auth_token.set({
          value: result.token,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
      return {
        message: result.message,
        success: result.success,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    },
  );
