import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { users } from "../db/schema";
import { db } from "../db";
import { registerUser, resendOtp, verifyOtp } from "../controller/register";
import { loginUser } from "../controller/login";
import { cors } from "@elysiajs/cors";

const frontendUrl = Bun.env.FRONTEND_URL;

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(
    cors({
      origin: frontendUrl,
      // allowCredentials: true, // If you need to send cookies or authentication headers
      credentials: true,
    }),
  )

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
        const cookieOptions: any = {
          value: result.token,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        };
        if (body.isRemember) {
          cookieOptions.maxAge = 7 * 24 * 60 * 60; // 7 days
        }
        auth_token.set(cookieOptions);
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
        isRemember: t.Boolean(),
      }),
    },
  )

  .get("/check-auth", async ({ jwt, cookie: { auth_token } }) => {
    if (!auth_token.value) {
      return {
        authenticated: false,
        message: "No authentication token provided",
      };
    }
    const profile = await jwt.verify(auth_token.value as string);
    if (!profile) {
      return { success: false, message: "Token is invalid or expired" };
    }

    return {
      authenticated: true,
      user: profile,
    };
  });
