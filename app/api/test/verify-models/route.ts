import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User, Category, Blog } from "@/models";

export async function GET() {
  await dbConnect();

  try {
    // 1. Find a user (or create dummy if none exists)
    let user = await User.findOne();
    if (!user) {
      // Stop if no user, or create one? For safety, let's just error if no user.
      return NextResponse.json(
        { message: "No users found. Please register a user first." },
        { status: 400 },
      );
    }

    // 2. Create a Test Category
    const categoryName = `Test Category ${Date.now()}`;
    const category = await Category.create({
      name: categoryName,
      slug: `test-category-${Date.now()}`,
      description:
        "This is a test category created by the verification script.",
    });

    // 3. Create a Test Blog linked to User and Category
    const blogTitle = `Test Blog Post ${Date.now()}`;
    const blog = await Blog.create({
      title: blogTitle,
      slug: `test-blog-${Date.now()}`,
      description: "This is a test blog post.",
      content: "Lorem ipsum dolor sit amet...",
      image: "https://example.com/test-image.jpg",
      user: user._id,
      category: category._id,
      type: "latest",
    });

    // 4. Return the results
    return NextResponse.json(
      {
        message: "Verification successful",
        data: {
          user: { id: user._id, name: user.name },
          category,
          blog,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Verification failed", error: (error as Error).message },
      { status: 500 },
    );
  }
}
