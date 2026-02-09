"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DashboardView } from "./dashboard-client";

interface DashboardEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  view: DashboardView;
  onSuccess: () => void;
}

export const DashboardEditSheet = ({
  open,
  onOpenChange,
  data,
  view,
  onSuccess,
}: DashboardEditSheetProps) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map view to api endpoint. Note: view 'users' -> api 'user' (singular based on folder structure)
      const endpoint =
        view === "users"
          ? "user"
          : view === "blogs"
            ? "blog"
            : view === "categories"
              ? "category"
              : "comment";

      const res = await fetch(`/api/v1/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Item updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!view || !data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit {view?.slice(0, -1)}</SheetTitle>
          <SheetDescription>
            Make changes to your {view?.slice(0, -1)} here. Click save when
            you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {view === "users" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {view === "blogs" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  className="min-h-[200px]"
                  value={formData.content || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {view === "categories" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {view === "comments" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Comment</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
