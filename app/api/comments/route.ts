import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Comment } from "@/models/comment.model";
import { Blog } from "@/models/blog.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, comment, blogId } = body;

    if (!name || !email || !comment || !blogId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    const newComment = await Comment.create({
      name,
      email,
      comment,
      blog: blogId,
    });

    return NextResponse.json(
      { success: true, data: newComment },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
