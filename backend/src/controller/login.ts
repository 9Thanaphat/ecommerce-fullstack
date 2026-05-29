import { Elysia, t } from "elysia";
import { otps, users } from "../db/schema";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { jwt } from "@elysiajs/jwt";

type LoginBody = {
  email: string;
  password: string; 
};

type JwtHelper = {
  sign: (payload: Record<string, any>) => Promise<string>;
};

// jwt 
export const loginUser = async (body: LoginBody, jwt: JwtHelper) => {
  try {
    // Find user by email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUser.length === 0) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const user = existingUser[0];

    // Check if the user's email is verified
    if(!user.isVerified) {
      return {
        success: false,
        message: "Your account is not verified. Please verify your email before logging in.",
      };
    }

    const isPasswordValid = await Bun.password.verify(body.password, user.passwordHash);

    // If password is invalid, return an error response
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Generate JWT token with user information
    const token = await jwt.sign({
      email: user.email,
      id: user.id,
    });

    return {
      success: true,
      message: "Login successful",
      token,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
        success: false,
        message: "Failed to login user",
    }
  }
};