import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const response = NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 201 },
    );

    // Cookie setting removed to prevent auto-login of new user
    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    // });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
