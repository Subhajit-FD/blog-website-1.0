import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ success: true, daa: [] });
    }

    await dbConnect();

    const blogs = await Blog.find({
      title: { $regex: new RegExp(query, "i") },
    })
      .select("title slug image category")
      .populate("category", "slug")
      .limit(5)
      .lean();

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
