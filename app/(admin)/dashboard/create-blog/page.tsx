"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef, Suspense } from "react";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useSearchParams, useRouter } from "next/navigation";

const CreateBlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [categories, setCategories] = useState<any[]>([]);
  const quillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null); // Store Quill instance
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    image: "",
    type: "latest",
  });
  const [loading, setLoading] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  // Initialize Quill
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      quillRef.current &&
      !editorRef.current
    ) {
      import("quill").then((Quill) => {
        if (!quillRef.current) return;

        editorRef.current = new Quill.default(quillRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
          },
        });

        editorRef.current.on("text-change", () => {
          setFormData((prev) => ({
            ...prev,
            content: editorRef.current.root.innerHTML,
          }));
        });

        setIsEditorReady(true);
      });
    }
  }, []);

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode && isEditorReady) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`/api/v1/blog?id=${editId}`);
          if (res.ok) {
            const data = await res.json();
            // Assume data is object for ?id= or handle list similarly if API not updated yet
            // (We will update API to be safe)
            let blog = data;
            if (Array.isArray(data)) {
              blog = data.find((b: any) => b._id === editId);
            }

            if (blog) {
              setFormData({
                title: blog.title || "",
                slug: blog.slug || "",
                content: blog.content || "",
                excerpt: blog.description || "", // excerpt mapped to description
                category: blog.category?._id || blog.category || "", // Handle populated vs unpopulated
                image: blog.image || "",
                type: blog.type || "latest",
              });
              setManualSlugEdit(true);

              if (editorRef.current) {
                // Set html content
                // editorRef.current.root.innerHTML = blog.content;
                // Using clipboard dangerouslyPasteHTML is safer/standard for setting HTML
                editorRef.current.clipboard.dangerouslyPasteHTML(blog.content);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching blog", error);
        }
      };
      fetchBlog();
    }
  }, [isEditMode, editId, isEditorReady]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: manualSlugEdit ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
    setManualSlugEdit(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.category) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }
      const url = "/api/v1/blog";
      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode
        ? { ...formData, description: formData.excerpt, _id: editId }
        : { ...formData, description: formData.excerpt };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEditMode
            ? "Blog updated successfully"
            : "Blog post created successfully",
        );
        if (!isEditMode) {
          setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            category: "",
            image: "",
            type: "latest",
          });
          setManualSlugEdit(false);
          if (editorRef.current) {
            editorRef.current.setText("");
          }
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(data.message || "Failed to save blog post");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full">
      <div className="flex items-center p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold ml-4">
          {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
        </h1>
      </div>
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Blog Post" : "New Blog Post"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update your blog post."
                : "Write and publish a new blog post."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Blog Post Title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="blog-post-title"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Popular</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploadToast = toast.loading(
                        "Uploading cover image...",
                      );

                      try {
                        const data = new FormData();
                        data.append("file", file);
                        data.append("type", "blog");

                        const res = await fetch("/api/v1/files", {
                          method: "POST",
                          body: data,
                        });

                        const result = await res.json();

                        if (res.ok) {
                          setFormData({ ...formData, image: result.url });
                          toast.success("Cover image uploaded", {
                            id: uploadToast,
                          });
                        } else {
                          toast.error(result.message || "Upload failed", {
                            id: uploadToast,
                          });
                        }
                      } catch (error) {
                        console.error(error);
                        toast.error("Upload error", { id: uploadToast });
                      }
                    }}
                    disabled={loading}
                  />
                  {formData.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-20 w-32 object-cover rounded-md border"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Description)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="bg-white rounded-md border border-input min-h-full">
                  <div ref={quillRef} className="h-full" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : isEditMode
                    ? "Update Blog Post"
                    : "Publish Blog Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const CreateBlogPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateBlogContent />
      </Suspense>
    </SidebarProvider>
  );
};

export default CreateBlogPage;
