import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

type AuthUser = {
  id: number;
  email: string;
  role: string;
};

export const requireAuth = new Elysia({ name: "requireAuth" })
  .use(jwt({ name: "jwt", secret: Bun.env.JWT_SECRET as string }))
  .derive(async ({ cookie: { auth_token }, jwt }) => {
    if (!auth_token?.value) {
      throw new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const payload = await jwt.verify(auth_token.value as string);
    if (!payload || !payload.id) {
      throw new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, Number(payload.id)));

    if (!dbUser) {
      throw new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    return { user: dbUser as AuthUser };
  });

export const requireAdmin = new Elysia({ name: "requireAdmin" })
  .use(requireAuth)
  .onBeforeHandle(({ user }) => {
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, message: "Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }
  });
