import Link from "next/link";
import SocialLinks from "@/components/ui/social-links";
import dbConnect from "@/lib/db";
import { Category } from "@/models";

export async function Footer() {
  await dbConnect();
  const categories = await Category.find().sort({ name: 1 }).limit(6).lean();

  return (
    <footer className="border-t bg-foreground text-accent">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter">Blogzenx</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Delivering the latest news, insights, and stories from around the
              world. Your trusted source for diverse perspectives.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat._id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
          </div>
        </div>

        <div className="mt-12 pt-8 text-center text-sm text-muted-foreground space-y-4">
          <div className="flex items-center justify-center gap-4">
            <SocialLinks />
          </div>
          <hr/>
          <p>© {new Date().getFullYear()} Blogzenx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
