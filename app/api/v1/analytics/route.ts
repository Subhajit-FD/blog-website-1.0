import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Blog, Interaction } from "@/models";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "all"; // all, month, week, day

    let dateFilter = {};
    const now = new Date();

    if (range === "day") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) },
      };
    } else if (range === "week") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) },
      };
    } else if (range === "month") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) },
      };
    }

    // Aggregate Views
    const topViews = await Interaction.aggregate([
      { $match: { type: "view", ...dateFilter } },
      { $group: { _id: "$blog", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "_id",
          as: "blogDetails",
        },
      },
      { $unwind: "$blogDetails" },
      { $project: { title: "$blogDetails.title", count: 1 } },
    ]);

    // Aggregate Likes
    const topLikes = await Interaction.aggregate([
      { $match: { type: "like", ...dateFilter } },
      { $group: { _id: "$blog", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "_id",
          as: "blogDetails",
        },
      },
      { $unwind: "$blogDetails" },
      { $project: { title: "$blogDetails.title", count: 1 } },
    ]);

    // Total Overall Stats (for the range)
    const totalViews = await Interaction.countDocuments({
      type: "view",
      ...dateFilter,
    });
    const totalLikes = await Interaction.countDocuments({
      type: "like",
      ...dateFilter,
    });

    return NextResponse.json({
      success: true,
      data: {
        topViews,
        topLikes,
        totalViews,
        totalLikes,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching analytics" },
      { status: 500 },
    );
  }
}
