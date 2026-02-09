import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Interaction } from "@/models/interaction.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { slug, deviceId } = await req.json();

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

    // Check if device already liked using Interaction model
    const existingLike = await Interaction.findOne({
      blog: blog._id,
      deviceId,
      type: "like",
    });

    let isLikedNow = false;

    if (existingLike) {
      // Toggle off: remove from Interaction and Blog
      await Interaction.findByIdAndDelete(existingLike._id);
      blog.likes = blog.likes.filter((id: string) => id !== deviceId);
      isLikedNow = false;
    } else {
      // Toggle on: add to Interaction and Blog
      await Interaction.create({
        blog: blog._id,
        deviceId,
        type: "like",
      });
      if (!blog.likes.includes(deviceId)) {
        blog.likes.push(deviceId);
      }
      isLikedNow = true;
    }

    await blog.save();
    const likesCount = await Interaction.countDocuments({
      blog: blog._id,
      type: "like",
    });

    return NextResponse.json({
      success: true,
      message: isLikedNow ? "Liked" : "Unliked",
      isLiked: isLikedNow,
      likesCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: "Error toggling like" },
      { status: 500 },
    );
  }
}
