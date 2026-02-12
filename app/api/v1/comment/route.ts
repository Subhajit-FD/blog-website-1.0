import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Comment, User, Blog } from "@/models";

export async function GET() {
  await dbConnect();
  try {
    const comments = await Comment.find()
      .populate("blog", "title")
      .sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching comments" },
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

    const updatedComment = await Comment.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating comment", error },
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
    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting comment" },
      { status: 500 },
    );
  }
}
