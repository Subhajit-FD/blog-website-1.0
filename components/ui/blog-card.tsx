import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShareButtons } from "../blog/share-buttons";

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    image: string;
    category?: {
      name: string;
      slug: string;
    };
    user?: {
      name: string;
      image?: string;
    };
    createdAt: string;
  };
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const categorySlug = blog.category?.slug || "post";
  const postUrl = `/${categorySlug}/${blog.slug}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 bg-white dark:bg-neutral-900 rounded-[2rem] p-4 transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-[1.5rem] bg-background">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}

        {/* Category Badge - Bottom Right over Image */}
        <Badge className="absolute bottom-3 right-3 z-10 rounded-full bg-black text-white hover:bg-black/90 px-3 py-1 text-xs font-medium uppercase tracking-wider">
          {blog.category?.name || "Latest"}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-4 px-1 pb-2">
        <h3 className="line-clamp-2 text-xl font-medium leading-tight tracking-tight text-foreground group-hover:text-primary/90 transition-colors">
          <Link href={postUrl} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {blog.title}
          </Link>
        </h3>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-background ring-1 ring-background">
              {blog.user?.image ? (
                <Image
                  src={blog.user.image}
                  alt={blog.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] font-bold text-gray-700 uppercase">
                  {blog.user?.name?.[0] || "A"}
                </div>
              )}
            </div>
            <div className="flex flex-col text-xs text-muted-foreground/80">
              <span className="font-semibold text-foreground">
                {blog.user?.name || "Author"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>


          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 dark:bg-white dark:text-black">
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
