"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Search, Facebook, Twitter, Instagram } from "lucide-react";
import SocialLinks from "./social-links";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui/search-bar";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavbarClientProps {
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
}

export const NavbarClient = ({ categories }: NavbarClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    if (pathname === "/") return "/";
    if (pathname === "/about") return "/about";
    const activeCategory = categories.find((cat) =>
      pathname.startsWith(`/${cat.slug}`),
    );
    return activeCategory ? `/${activeCategory.slug}` : "";
  }, [pathname, categories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/Hide logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Glass effect logic
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300 transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent",
      )}
    >
      {/* Main Header (Logo) */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link
          href="/"
          className={cn(
            "text-2xl md:text-2xl tracking-tight transition-colors duration-300",
            isScrolled ? "text-foreground" : "mix-blend-difference",
          )}
        >
          Blogzenx
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="/" value={activeTab} className="w-full">
              <TabsList className="bg-accent-foreground px-2 py-1 rounded-full">
                <TabsTrigger
                  value="/"
                  asChild
                  className="data-[state=active]:bg-muted data-[state=active]:shadow-none hover:text-secondary rounded-full"
                >
                  <Link href="/" className="text-sm text-secondary">
                    Home
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  value="/about"
                  asChild
                  className="data-[state=active]:bg-muted data-[state=active]:shadow-none hover:text-secondary rounded-full"
                >
                  <Link href="/about" className="text-sm text-secondary">
                    About
                  </Link>
                </TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat._id}
                    value={`/${cat.slug}`}
                    asChild
                    className="data-[state=active]:bg-muted data-[state=active]:shadow-none hover:text-secondary rounded-full"
                  >
                    <Link
                      href={`/${cat.slug}`}
                      className="text-sm text-secondary"
                    >
                      {cat.name}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Search Bar and Social Media Icons */}
        <div className="hidden md:flex items-center gap-2">
          <SearchBar />
          <SocialLinks />
        </div>

        {/* Mobile Menu (Sheet) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-sm uppercase tracking-wider">Menu</button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-full sm:w-[540px] flex flex-col"
            >
              <div className="flex justify-between items-center p-4">
                <Link
                  href="/"
                  className="text-2xl tracking-tight"
                  onClick={() => setIsOpen(false)}
                >
                  Blogzenx
                </Link>
                <SheetClose asChild>
                  <button className="text-sm uppercase tracking-wider">
                    Close
                  </button>
                </SheetClose>
              </div>

              <SheetHeader className="px-4">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>{" "}
                {/* Accessibility */}
                <div className="w-full mt-4">
                  <SearchBar defaultOpen className="w-full" />
                </div>
              </SheetHeader>

              <div className="flex-1 px-4 py-6 overflow-y-auto">
                <Tabs
                  defaultValue="/"
                  value={activeTab}
                  orientation="vertical"
                  className="w-full flex-col"
                >
                  <TabsList className="bg-transparent flex flex-col h-auto items-start space-y-2 p-0 w-full">
                    <TabsTrigger
                      value="/"
                      asChild
                      className="w-full justify-start rounded-full px-4 py-3 text-lg font-medium tracking-wide data-[state=active]:bg-foreground data-[state=active]:text-secondary data-[state=active]:shadow-none hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Link href="/" onClick={() => setIsOpen(false)}>
                        Home
                      </Link>
                    </TabsTrigger>
                    <TabsTrigger
                      value="/about"
                      asChild
                      className="w-full justify-start rounded-full px-4 py-3 text-lg font-medium tracking-wide data-[state=active]:bg-foreground data-[state=active]:text-secondary data-[state=active]:shadow-none hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Link href="/about" onClick={() => setIsOpen(false)}>
                        About
                      </Link>
                    </TabsTrigger>
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat._id}
                        value={`/${cat.slug}`}
                        asChild
                        className="w-full justify-start rounded-full px-4 py-3 text-lg font-medium tracking-wide data-[state=active]:bg-foreground data-[state=active]:text-secondary data-[state=active]:shadow-none hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Link
                          href={`/${cat.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <SheetFooter className="px-4 py-6 sm:flex-col sm:space-x-0">
                <hr className="mb-3" />
                <div className="flex justify-center w-full">
                  <SocialLinks />
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
