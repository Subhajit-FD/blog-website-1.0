import dbConnect from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/ui/blog-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

async function getPopularBlogs() {
  await dbConnect();
  // Popular: Sorted by views descending
  return Blog.find({})
    .populate("user", "name image")
    .populate("category", "name slug")
    .sort({ views: -1 })
    .limit(20)
    .lean();
}

export default async function PopularPage() {
  const blogs = await getPopularBlogs();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="w-full py-24 bg-foreground/20 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wider uppercase mb-4">
          Trending Now
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl px-4">
          The most read and discussed stories on our platform right now.
        </p>
      </section>

      <section className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl">
            <h3 className="text-xl font-semibold">No popular stories yet</h3>
            <p className="text-muted-foreground mt-2">
              Start reading to make stories popular!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
