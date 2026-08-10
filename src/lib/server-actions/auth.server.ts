"use server";

import "server-only";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import connectDB from "@/db/connectDB";
import User from "@/models/UserModel";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginState = {
  success: boolean;
  error: string | null;
};


export async function login(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      error:
        result.error.issues[0]?.message ??
        "Invalid login details.",
    };
  }

  const { email, password } = result.data;

  try {
    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).lean<{
      _id: unknown;
      email: string;
      password: string;
    }>();

    // Don't reveal whether the email exists.
    if (!user) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
      console.error(
        "[login] TOKEN_SECRET is not configured."
      );

      return {
        success: false,
        error: "Authentication service is unavailable.",
      };
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        email: user.email,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("[login]", error);

    return {
      success: false,
      error: "Unable to login. Please try again.",
    };
  }
}


export async function logout(): Promise<LoginState> {
  try {
      const cookieStore = await cookies();

      cookieStore.delete("token");

      return {
          success: true,
          error: null,
      };
  } catch (error) {
      console.error("[logout]", error);

      return {
          success: false,
          error:
              "Unable to sign out. Please try again.",
      };
  }
}