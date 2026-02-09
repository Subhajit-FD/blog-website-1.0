import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url); // Use standard URL object for next js app dir
  const isList = searchParams.get("list");
  const id = searchParams.get("id");

  if (id) {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching user" },
        { status: 500 },
      );
    }
  }

  if (isList === "true") {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching users" },
        { status: 500 },
      );
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User fetched successfully", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    const body = await req.json();
    const { name, email, image, password } = body;

    const updateData = { name, email, image };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      decodedToken.userId,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 },
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
