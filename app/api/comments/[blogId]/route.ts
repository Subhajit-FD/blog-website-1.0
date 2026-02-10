import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Comment } from "@/models/comment.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> },
) {
  try {
    await dbConnect();
    // Await params in Next.js 15+ (doing it safely here for 16.1.6 turbo)
    const { blogId } = await params;

    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
