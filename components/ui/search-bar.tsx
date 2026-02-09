"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Simple debounce hook if not present in project
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchBarProps {
  className?: string; // Add className prop
  defaultOpen?: boolean;
}

export function SearchBar({ className, defaultOpen = false }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounceValue(query, 300);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !defaultOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, defaultOpen]);

  // Handle click outside to close - disabled if defaultOpen
  useEffect(() => {
    if (defaultOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [defaultOpen]);

  // Fetch results
  useEffect(() => {
    const searchBlogs = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        console.error("Failed to search blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    searchBlogs();
  }, [debouncedQuery]);

  const toggleSearch = () => {
    if (defaultOpen) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center", className)}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
          isOpen
            ? "bg-background/95 backdrop-blur-sm rounded-full border border-input pl-3 pr-10 shadow-sm"
            : "w-0 border-transparent",
          defaultOpen ? "w-full" : isOpen ? "w-64" : "",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className={cn(
            "h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {!defaultOpen && (
        <button
          onClick={toggleSearch}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300 z-10",
            isOpen
              ? "absolute right-1 w-7 h-7 bg-transparent text-foreground hover:bg-muted"
              : "bg-foreground text-secondary p-1.5 hover:opacity-90",
          )}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Search size={16} />}
        </button>
      )}
      {defaultOpen && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={16} />
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full right-0 mt-3 w-80 rounded-xl border bg-popover/95 backdrop-blur-md p-2 shadow-lg animate-in fade-in-0 zoom-in-95 z-50 ring-1 ring-black/5 dark:ring-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {results.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/${blog.category?.slug || "blog"}/${blog.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-muted">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium leading-snug line-clamp-2">
                    {blog.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
