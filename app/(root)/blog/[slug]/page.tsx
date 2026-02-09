import dbConnect from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model"; // Ensure User model is registered
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogInteractions } from "@/components/blog/blog-interactions";
import { CommentSection } from "@/components/blog/comment-section";

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlog(slug: string) {
  await dbConnect();
  try {
    const blog = await Blog.findOne({ slug })
      .populate("user", "name image")
      .lean();
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  // View increment handling moved to client-side component (BlogInteractions)

  return (
    <article className="flex flex-col min-h-screen mb-20">
      {/* Header Section */}
      <div className="bg-foreground/20 w-full pt-20 pb-32 px-4 border-b">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground text-sm border-y py-4 w-fit mx-auto px-6">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-background">
                {blog.user?.image ? (
                  <Image
                    src={blog.user.image}
                    alt={blog.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold uppercase">
                    {blog.user?.name?.[0] || "A"}
                  </div>
                )}
              </div>
              <span className="font-medium text-foreground text-base">
                {blog.user?.name || "Anonymous"}
              </span>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </span>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <BlogInteractions
              slug={slug}
              initialViews={blog.views || 0}
              initialLikes={blog.likes?.length || 0}
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto -mt-24 px-4 sm:px-6 lg:px-8 space-y-10 w-full relative z-10">
        {/* Featured Image */}
        {blog.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted border-8 border-background">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        )}

        {/* Description / Lead */}
        <div className="max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl font-serif italic text-muted-foreground text-center leading-relaxed">
            {blog.description}
          </p>
        </div>

        <hr className="border-border/40 max-w-xs mx-auto" />

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mx-auto leading-loose">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <hr className="border-border/40 max-w-xs mx-auto my-12" />

        <CommentSection blogId={blog._id.toString()} />

        <div className="border-t pt-10 mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 bg-foreground text-accent"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
