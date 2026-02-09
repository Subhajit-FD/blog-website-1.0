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
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useSearchParams, useRouter } from "next/navigation";

const CreateCategoryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const [loading, setLoading] = useState(false);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          // We don't have a specific GET by ID for categories yet, only GET all.
          // However, GET /api/v1/category returns all. We can filter client side or update API.
          // Better to simple findById since we have access to DB in API.
          // Let's assume we'll use a filter on the list if API doesn't support ID,
          // BUT `GET /api/v1/category` currently returns ALL.
          // I will update the API to support ID for better performance/correctness.
          const res = await fetch(`/api/v1/category?id=${editId}`);
          if (res.ok) {
            const data = await res.json();
            // If API returns array (current behavior for list), we need to find it.
            // If I update API to return object for ?id=, then:
            if (Array.isArray(data)) {
              const found = data.find((c: any) => c._id === editId);
              if (found) {
                setFormData({
                  name: found.name,
                  slug: found.slug,
                  description: found.description || "",
                });
                setManualSlugEdit(true);
              }
            } else {
              setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || "",
              });
              setManualSlugEdit(true);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategory();
    }
  }, [isEditMode, editId]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: manualSlugEdit ? prev.slug : slugify(name),
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
      const url = "/api/v1/category";
      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode ? { ...formData, _id: editId } : formData;

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
            ? "Category updated successfully"
            : "Category created successfully",
        );
        if (!isEditMode) {
          setFormData({ name: "", slug: "", description: "" });
          setManualSlugEdit(false);
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(data.message || "Failed to save category");
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
          {isEditMode ? "Edit Category" : "Create Category"}
        </h1>
      </div>
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Category" : "New Category"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update category details."
                : "Define a new category for blog posts."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Technology"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder="technology"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Category description..."
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const CreateCategoryPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateCategoryContent />
      </Suspense>
    </SidebarProvider>
  );
};

export default CreateCategoryPage;
