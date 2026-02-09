import dbConnect from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Category } from "@/models/category.model";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/ui/blog-card";
import Link from "next/link";

interface PageProps {
  params: {
    category: string;
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  await dbConnect();

  const { category: slug } = await params;

  const categoryDoc = await Category.findOne({ slug });

  if (!categoryDoc) {
    return (
      <div className="container mx-auto py-10 text-center mt-20">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <p className="text-muted-foreground mt-4">
          The category "{slug}" does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const blogs = await Blog.find({ category: categoryDoc._id })
    .populate("user", "name image")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Section */}
      <section className="w-full py-24 bg-foreground/20 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wider uppercase">
          {categoryDoc.name}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl px-4">
          {categoryDoc.description ||
            `Explore our latest articles and insights on ${categoryDoc.name}.`}
        </p>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 py-12 flex-1">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl">
            <h3 className="text-xl font-semibold">No articles yet</h3>
            <p className="text-muted-foreground mt-2">
              We haven't published any articles in this category yet. Check back
              later!
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/">Explore other categories</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <BlogCard
                key={blog._id}
                blog={{ ...blog, category: categoryDoc }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
