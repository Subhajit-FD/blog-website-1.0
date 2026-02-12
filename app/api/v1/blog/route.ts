import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog, Category, User } from "@/models";
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

export async function POST(req: Request) {
  await dbConnect();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, content, image, category, type } = body;

    // Basic Validation
    if (!title || !slug || !description || !content || !image || !category) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // Verify Category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Invalid Category" },
        { status: 400 },
      );
    }

    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      image,
      category,
      type: type || "latest",
      user: user.id, // Link to authenticated user
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { message: "Error creating blog post", error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const blog = await Blog.findById(id)
        .populate("user", "name")
        .populate("category", "name");
      if (!blog) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(blog);
    }

    const blogs = await Blog.find()
      .populate("user", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching blogs", error },
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

    // Prevent CastError for empty category
    if (updateData.category === "") {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 },
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog", error: (error as Error).message },
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
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 },
    );
  }
}
