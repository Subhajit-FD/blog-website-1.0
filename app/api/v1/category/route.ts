import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models/category.model";
import { User } from "@/models/user.model"; // Ensure User model is registered
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper to get authenticated user
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    return { ...decoded, id: decoded.userId };
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(category);
    }

    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and Slug are required" },
        { status: 400 },
      );
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category with this slug already exists" },
        { status: 400 },
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating category", error },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating category", error },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID required" }, { status: 400 });
  }

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 },
    );
  }
}
