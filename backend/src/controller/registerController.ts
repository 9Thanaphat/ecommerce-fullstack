import { Elysia, t } from "elysia";
import { otps, users } from "../db/schema";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import nodemailer from "nodemailer";

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
      // case 1: user exists and is verified, return error
      if (existingUser[0].isVerified) {
        return {
          success: false,
          message: "Email already registered and verified",
        };
      }
      // case 2: user exists but not verified, update password and resend OTP
      const hashedPassword = await Bun.password.hash(body.password!);
      await db
        .update(users)
        .set({ passwordHash: hashedPassword })
        .where(eq(users.email, body.email));
    } else {
      // case 3: user does not exist, create new user
      const hashedPassword = await Bun.password.hash(body.password!);
      await db.insert(users).values({
        email: body.email,
        passwordHash: hashedPassword,
        isVerified: false,
      });
    }

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

    // Send OTP email to the user
    const mailOptions = {
      from: `"Ecommerce" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: "Your OTP Verification Code",
      html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; color: #333;">
            <h2 style="color: #000;">Welcome!</h2>
            <p>Your One-Time Password (OTP) for login is:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #000; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code is valid for the next 5 minutes. Please do not share this code with anyone.</p>
          </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

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

    console.log(otpCode);

    // Send OTP email to the user
    const mailOptions = {
      from: `"Ecommerce" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: "Your OTP Verification Code",
      html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; color: #333;">
            <h2 style="color: #000;">Welcome!</h2>
            <p>Your One-Time Password (OTP) for login is:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #000; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code is valid for the next 5 minutes. Please do not share this code with anyone.</p>
          </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

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
