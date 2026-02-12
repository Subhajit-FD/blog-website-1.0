import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog, Interaction } from "@/models";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const deviceId = searchParams.get("deviceId");

    if (!slug || !deviceId) {
      return NextResponse.json(
        { message: "Slug and Device ID are required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const isLiked = blog.likes.includes(deviceId);
    const likesCount = await Interaction.countDocuments({
      blog: blog._id,
      type: "like",
    });
    const views = await Interaction.countDocuments({
      blog: blog._id,
      type: "view",
    });

    return NextResponse.json({
      isLiked,
      likesCount,
      views,
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    return NextResponse.json(
      { message: "Error fetching status" },
      { status: 500 },
    );
  }
}
