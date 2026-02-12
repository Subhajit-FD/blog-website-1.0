import dbConnect from "@/lib/db";
import { Blog, Category } from "@/models";
import "@/models/user.model";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/ui/blog-card";

export const revalidate = 60; // Revalidate every 60 seconds

async function getCategoryBlogs(slug: string, limit: number = 3) {
  const category = await Category.findOne({
    slug: { $regex: new RegExp(slug, "i") },
  });
  if (!category) return [];
  return Blog.find({ category: category._id })
    .populate("user", "name")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export default async function Home() {
  await dbConnect();

  // Fetch Featured Blog (Type 'featured' or just the latest one)
  const featuredBlog =
    (await Blog.findOne({ type: "featured" })
      .populate("user", "name")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()) ||
    (await Blog.findOne()
      .populate("user", "name")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean());

  // Fetch Latest Blogs (Excluding featured if possible, for now just latest 4)
  const latestBlogs = await Blog.find({ _id: { $ne: featuredBlog?._id } })
    .populate("user", "name")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  // Popular Blogs
  const popularBlogs = await Blog.find({})
    .populate("user", "name")
    .populate("category", "name slug")
    .sort({ views: -1 })
    .limit(4)
    .lean();

  // Featured Blogs (List)
  const featuredList = await Blog.find({
    type: "featured",
    _id: { $ne: featuredBlog?._id },
  })
    .populate("user", "name")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  // Fetch Specific Categories - REMOVED to focus on types
  // const worldBlogs = await getCategoryBlogs("world", 3);
  // const techBlogs = await getCategoryBlogs("technology", 3);

  // Collect images for the banner
  const bannerImages = [
    featuredBlog?.image,
    ...latestBlogs.map((b: any) => b.image),
    ...popularBlogs.map((b: any) => b.image),
    ...featuredList.map((b: any) => b.image),
  ]
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section / Featured Article */}
      {featuredBlog && (
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-end">
          <Image
            src={featuredBlog.image}
            alt={featuredBlog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

          <div className="container mx-auto px-4 pb-10 relative z-10 w-full">
            <div className="max-w-xl space-y-4">
              <Badge variant="secondary" className="uppercase tracking-wide">
                {featuredBlog.category?.name || "Featured"}
              </Badge>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-black leading-tight text-white capitalize">
                {featuredBlog.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-200">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden relative">
                    {/* Avatar placeholder or use a default image */}
                    <div className="flex items-center justify-center w-full h-full bg-primary text-white text-[10px] font-bold">
                      {featuredBlog.user?.name?.charAt(0) || "E"}
                    </div>
                  </div>
                  <span className="font-medium text-sm">
                    {featuredBlog.user?.name || "Editor"}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date(featuredBlog.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="prose prose-base prose-invert text-gray-300 line-clamp-3 md:line-clamp-3 text-sm">
                <div
                  dangerouslySetInnerHTML={{
                    __html: featuredBlog.description,
                  }}
                />
              </div>
              <Button
                asChild
                size="default"
                className="rounded-full px-4 py-6 bg-foreground"
              >
                <Link
                  href={`/${featuredBlog.category?.slug || "blog"}/${featuredBlog.slug}`}
                >
                  Read Full Story{" "}
                  <span className="p-1.5 rounded-full bg-accent text-foreground">
                    <ArrowUpRight />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Latest News Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 border-b pb-4">
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              Latest
            </h2>
            <Link
              href="/latest"
              className="text-sm font-medium hover:text-primary flex items-center transition-colors"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBlogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>

        {/* Popular News Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 border-b pb-4">
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              Popular
            </h2>
            <Link
              href="/popular"
              className="text-sm font-medium hover:text-primary flex items-center transition-colors"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBlogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>

        {/* Featured News Grid */}
        <section>
          <div className="flex items-center justify-between mb-10 border-b pb-4">
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              Featured
            </h2>
            <Link
              href="/featured"
              className="text-sm font-medium hover:text-primary flex items-center transition-colors"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredList.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
