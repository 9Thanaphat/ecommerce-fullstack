import { Elysia, t } from "elysia";
import { otps, users } from "../db/schema";
import { db } from "../db";
import { eq, and } from "drizzle-orm";

type RegisterBody = {
  email: string;
  password: string; 
};

type VerifyOtpBody = {
  email: string;
  otp: string;
};

type ResendOtpBody = {
  email: string;
};  

export const registerUser = async (body: RegisterBody) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Hash the password using Bun's built-in hashing function
    const hashedPassword = await Bun.password.hash(body.password!);

    const newUser = await db
      .insert(users)
      .values({
        email: body.email,
        passwordHash: hashedPassword,
      })
      .returning();

    // Generate OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (e.g., 5 minutes from now)
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    // Delete any existing OTPs for this email before inserting a new one
    await db.delete(otps).where(eq(otps.email, body.email));

    // Store OTP in the database
    await db.insert(otps).values({
      email: body.email,
      otp: otpCode,
      expiresAt: expireTime,
    });

    // test
    console.log(`\n📧 [SYSTEM] กำลังส่งอีเมลไปที่: ${body.email}`);
    console.log(`🔑 [SYSTEM] รหัส OTP ของคุณคือ: ${otpCode}\n`);

    return {
      success: true,
      message:
        "User registered successfully! Please check your email for the OTP code.",
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      message: "Failed to register user",
      success: false,
    };
  }
};

export const verifyOtp = async (body: VerifyOtpBody) => {
  try {
    // Find OTP record for the given email and OTP code
    const otpRecord = await db
      .select()
      .from(otps)
      .where(
        // Use AND condition to match both email and OTP code
        and(eq(otps.email, body.email), eq(otps.otp, body.otp)),
      );

    // Check if OTP record exists
    if (otpRecord.length === 0) {
      return {
        success: false,
        message: "Invalid OTP code",
      };
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > otpRecord[0].expiresAt) {
      return {
        success: false,
        message: "OTP code has expired",
      };
    }

    // Mark user as verified
    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.email, body.email));

    await db.delete(otps).where(eq(otps.email, body.email));

    return {
      success: true,
      message: "OTP verified successfully! Your account is now active.",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "Failed to verify OTP",
    };
  }
};

export const resendOtp = async (body: ResendOtpBody) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));

    if (existingUser.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Generate new OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    // Delete any existing OTPs for this email before inserting a new one
    await db.delete(otps).where(eq(otps.email, body.email));
    await db.insert(otps).values({
      email: body.email,
      otp: otpCode,
      expiresAt: expireTime,
    });

    // test
    console.log(`\n📧 [SYSTEM] กำลังส่งอีเมลไปที่: ${body.email}`);
    console.log(`🔑 [SYSTEM] รหัส OTP ใหม่ของคุณคือ: ${otpCode}\n`);

    return {
      success: true,
      message:
        "OTP resend successfully! Please check your email for the new OTP code.",
    };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return {
      success: false,
      message: "Failed to resend OTP",
    };
  }
};
