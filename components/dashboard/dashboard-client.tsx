"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FolderTree, MessageSquare } from "lucide-react";
import { DashboardLists } from "./dashboard-lists";

interface DashboardClientProps {
  userCount: number;
  blogCount: number;
  categoryCount: number;
  commentCount: number;
}

export type DashboardView =
  | "users"
  | "blogs"
  | "categories"
  | "comments"
  | null;

export const DashboardClient = ({
  userCount,
  blogCount,
  categoryCount,
  commentCount,
}: DashboardClientProps) => {
  const [activeView, setActiveView] = useState<DashboardView>(null);

  const analytics = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      color: "text-blue-500",
      view: "users" as const,
    },
    {
      title: "Total Blogs",
      value: blogCount,
      icon: FileText,
      color: "text-green-500",
      view: "blogs" as const,
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: FolderTree,
      color: "text-yellow-500",
      view: "categories" as const,
    },
    {
      title: "Comments",
      value: commentCount,
      icon: MessageSquare,
      color: "text-purple-500",
      view: "comments" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analytics.map((item, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeView === item.view ? "ring-2 ring-primary" : ""
            }`}
            onClick={() =>
              setActiveView(item.view === activeView ? null : item.view)
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">Click to manage</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeView && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {activeView} Management
          </h2>
          <DashboardLists view={activeView} />
        </Card>
      )}
    </div>
  );
};
