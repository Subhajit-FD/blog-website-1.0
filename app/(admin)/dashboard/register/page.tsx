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
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useSearchParams, useRouter } from "next/navigation";

const RegisterContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          // Temporary: let's fetch the specific user.
          // I'll update the GET API in the next step to support ?id=...
          const res = await fetch(`/api/v1/user?id=${editId}`);
          if (res.ok) {
            const data = await res.json();
            // The API might return { user: ... } or just ...
            // Based on my previous `route.js` view, GET returns current user.
            // I'll need to fix this.
            if (data.user) setFormData({ ...data.user, password: "" });
            else if (data._id) setFormData({ ...data, password: "" });
          }
        } catch (e) {
          console.error(e);
        }
      };
      // fetchUser();
      // Actually, since I haven't updated the GET API yet to fetch by ID for admin,
      // I should do that. But I can implement the UI logic first.
    }
  }, [isEditMode, editId]);

  // Fetch logic for when the API is ready
  useEffect(() => {
    if (!editId) return;
    const fetchUser = async () => {
      try {
        // We need a way to fetch a specific user.
        // Currently GET /api/v1/user gets the *current* user.
        // I will modify GET /api/v1/user to accept ?id=... and if admin, return that user.
        const res = await fetch(`/api/v1/user?id=${editId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.user?.name || data.name || "",
            email: data.user?.email || data.email || "",
            password: "", // Don't prefill password
            image: data.user?.image || data.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user", error);
        toast.error("Failed to fetch user details");
      }
    };
    fetchUser();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? "/api/v1/user" : "/api/v1/auth/register";
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
          data.message || (isEditMode ? "User updated" : "User registered"),
        );
        if (!isEditMode) {
          setFormData({ name: "", email: "", password: "", image: "" });
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(data.message || "Operation failed");
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
          {isEditMode ? "Edit User" : "Register User"}
        </h1>
      </div>
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit User" : "Create New User"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update user details."
                : "Add a new user to the system."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditMode
                    ? "Password (leave blank to keep current)"
                    : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="******"
                  required={!isEditMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploadToast = toast.loading("Uploading image...");

                      try {
                        const data = new FormData();
                        data.append("file", file);
                        data.append("type", "profile");

                        const res = await fetch("/api/v1/files", {
                          method: "POST",
                          body: data,
                        });

                        const result = await res.json();

                        if (res.ok) {
                          setFormData({ ...formData, image: result.url });
                          toast.success("Image uploaded successfully", {
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
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Registering..."
                  : isEditMode
                    ? "Update User"
                    : "Register User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const RegisterPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterContent />
      </Suspense>
    </SidebarProvider>
  );
};

export default RegisterPage;
