"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { useRouter } from "next/navigation";
import { useDeleteAlert } from "@/components/providers/delete-alert-provider";

const SettingsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/user");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.user.name,
            email: data.user.email,
            image: data.user.image || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const { confirmDelete } = useDeleteAlert();

  const handleDelete = () => {
    confirmDelete({
      title: "Delete Account",
      description:
        "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
      verificationText: formData.email, // Require email as verification
      onConfirm: async () => {
        try {
          const res = await fetch("/api/v1/user", {
            method: "DELETE",
          });

          const data = await res.json();

          if (res.ok) {
            toast.success(data.message || "Account deleted successfully");
            router.push("/dashboard");
            router.refresh();
          } else {
            toast.error(data.message || "Failed to delete account");
          }
        } catch (error) {
          toast.error("An error occurred");
        }
      },
    });
  };

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-4">Settings</h1>
        </div>
        <div className="p-6 space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your Name"
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
                    placeholder="your.email@example.com"
                    required
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

                        const uploadToast = toast.loading(
                          "Uploading new profile image...",
                        );

                        try {
                          const data = new FormData();
                          data.append("file", file);
                          data.append("type", "profile");

                          const res = await fetch("/api/v1/files", {
                            method: "POST", // Using POST for now as we don't track fileId easily to use PUT (update)
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
                      disabled={loading}
                    />
                    {formData.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.image}
                        alt="Profile Preview"
                        className="h-16 w-16 rounded-full object-cover border"
                      />
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay
                secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Helper to just update password
                  const form = e.target as HTMLFormElement;
                  const password = (
                    form.elements.namedItem("password") as HTMLInputElement
                  ).value;
                  if (!password) return;

                  setLoading(true);
                  try {
                    const res = await fetch("/api/v1/user", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ password }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.success("Password updated successfully");
                      (
                        form.elements.namedItem("password") as HTMLInputElement
                      ).value = "";
                    } else {
                      toast.error(data.message || "Failed to update password");
                    }
                  } catch (err) {
                    toast.error("An error occurred");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min 6 characters"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your account will efficiently remove all your data from
                our system. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SettingsPage;
