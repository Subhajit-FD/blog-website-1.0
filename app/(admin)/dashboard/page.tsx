import Login from "@/components/ui/login";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FolderTree, MessageSquare } from "lucide-react";
import dbConnect from "@/lib/db";
import { User } from "@/models/user.model";
import { Blog } from "@/models/blog.model";
import { Category } from "@/models/category.model";
import { Comment } from "@/models/comment.model";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Login />
      </div>
    );
  }

  let userCount = 0;
  let blogCount = 0;
  let categoryCount = 0;
  let commentCount = 0;

  try {
    await dbConnect();
    [userCount, blogCount, categoryCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Category.countDocuments(),
      Comment.countDocuments(),
    ]);
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
  }

  const analytics = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Blogs",
      value: blogCount,
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: FolderTree,
      color: "text-yellow-500",
    },
    {
      title: "Comments",
      value: commentCount,
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-4">Dashboard Overview</h1>
        </div>
        <div className="p-6 space-y-8">
          <DashboardClient
            userCount={userCount}
            blogCount={blogCount}
            categoryCount={categoryCount}
            commentCount={commentCount}
          />

          <div className="border-t pt-8">
            <AnalyticsDashboard />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
