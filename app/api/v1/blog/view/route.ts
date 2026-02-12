import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog, Interaction } from "@/models";

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

    // Check if device already viewed using Interaction model
    const existingInteraction = await Interaction.findOne({
      blog: blog._id,
      deviceId,
      type: "view",
    });

    if (existingInteraction) {
      return NextResponse.json({
        message: "Already viewed",
        views: blog.views,
      });
    }

    // Record new interaction
    await Interaction.create({
      blog: blog._id,
      deviceId,
      type: "view",
    });

    // Update blog document (for legacy views count and performance)
    if (!blog.viewedBy.includes(deviceId)) {
      blog.viewedBy.push(deviceId);
    }
    blog.views = await Interaction.countDocuments({
      blog: blog._id,
      type: "view",
    });
    await blog.save();

    return NextResponse.json({
      message: "View recorded",
      views: blog.views,
    });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json(
      { message: "Error recording view" },
      { status: 500 },
    );
  }
}
