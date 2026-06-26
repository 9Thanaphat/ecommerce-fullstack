import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { registerUser, resendOtp, verifyOtp } from "../controller/registerController";
import { loginUser } from "../controller/loginController";
import { cors } from "@elysiajs/cors";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const frontendUrl = Bun.env.FRONTEND_URL;

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    cors({
      origin: frontendUrl,
      credentials: true,
    }),
  )

  .use(jwt({ name: "jwt", secret: Bun.env.JWT_SECRET! }))

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
      return { authenticated: false, message: "No authentication token provided" };
    }
    const profile = await jwt.verify(auth_token.value as string);
    if (!profile || !profile.id) {
      return { success: false, message: "Token is invalid or expired" };
    }

    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        address: users.address,
        subdistrict: users.subdistrict,
        city: users.city,
        province: users.province,
        postalCode: users.postalCode,
      })
      .from(users)
      .where(eq(users.id, Number(profile.id)));

    if (!dbUser) {
      return { success: false, message: "User not found" };
    }

    return { authenticated: true, user: dbUser };
  })

  .put(
    "/profile",
    async ({ jwt, cookie: { auth_token }, body }) => {
      if (!auth_token.value) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
      }
      const payload = await jwt.verify(auth_token.value as string);
      if (!payload?.id) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
      }

      await db
        .update(users)
        .set({
          firstName: body.firstName ?? null,
          lastName: body.lastName ?? null,
          phone: body.phone ?? null,
          address: body.address ?? null,
          subdistrict: body.subdistrict ?? null,
          city: body.city ?? null,
          province: body.province ?? null,
          postalCode: body.postalCode ?? null,
        })
        .where(eq(users.id, Number(payload.id)));

      return { success: true, message: "Profile updated" };
    },
    {
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        subdistrict: t.Optional(t.String()),
        city: t.Optional(t.String()),
        province: t.Optional(t.String()),
        postalCode: t.Optional(t.String()),
      }),
    },
  )

  .put(
    "/change-password",
    async ({ jwt, cookie: { auth_token }, body }) => {
      if (!auth_token.value) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
      }
      const payload = await jwt.verify(auth_token.value as string);
      if (!payload?.id) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
      }
      const [user] = await db.select().from(users).where(eq(users.id, Number(payload.id)));
      if (!user) {
        return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
      }
      const valid = await Bun.password.verify(body.currentPassword, user.passwordHash);
      if (!valid) {
        return new Response(JSON.stringify({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }), { status: 400 });
      }
      const newHash = await Bun.password.hash(body.newPassword);
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, Number(payload.id)));
      return { success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" };
    },
    {
      body: t.Object({
        currentPassword: t.String({ minLength: 1 }),
        newPassword: t.String({ minLength: 6 }),
      }),
    },
  )

  .post("/logout", ({ cookie: { auth_token } }) => {
    auth_token.set({
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
    });
    return { success: true, message: "Logged out successfully" };
  });
