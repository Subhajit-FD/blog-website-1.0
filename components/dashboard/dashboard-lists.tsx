"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DashboardView } from "./dashboard-client";
import { Edit, Trash, Search as SearchIcon } from "lucide-react";
import { useDeleteAlert } from "@/components/providers/delete-alert-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface DashboardListsProps {
  view: DashboardView;
}

export const DashboardLists = ({ view }: DashboardListsProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { confirmDelete } = useDeleteAlert();

  useEffect(() => {
    if (!view) return;
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Map view to api endpoint. Note: view 'users' -> api 'user' (singular based on folder structure)
      const endpoint =
        view === "users"
          ? "user?list=true"
          : view === "blogs"
            ? "blog"
            : view === "categories"
              ? "category"
              : "comment";
      const res = await fetch(`/api/v1/${endpoint}`);
      const result = await res.json();
      if (result.success || Array.isArray(result)) {
        // Handle different response structures if needed. Assuming result is array or result.data is array
        setData(Array.isArray(result) ? result : result.data || []);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete({
      title: "Delete Item",
      description:
        "Are you sure you want to delete this item? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const endpoint =
            view === "users"
              ? "user"
              : view === "blogs"
                ? "blog"
                : view === "categories"
                  ? "category"
                  : "comment";
          const res = await fetch(`/api/v1/${endpoint}?id=${id}`, {
            method: "DELETE",
          });
          const result = await res.json();

          if (res.ok) {
            toast.success("Item deleted successfully");
            fetchData(); // Refresh list
          } else {
            toast.error(result.message || "Failed to delete");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred");
        }
      },
    });
  };

  const handleEdit = (item: any) => {
    if (view === "users") {
      router.push(`/dashboard/register?id=${item._id}`);
    } else if (view === "blogs") {
      router.push(`/dashboard/create-blog?id=${item._id}`);
    } else if (view === "categories") {
      router.push(`/dashboard/create-category?id=${item._id}`);
    } else if (view === "comments") {
      toast.info("Editing comments is not supported yet.");
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredData = data.filter((item) => {
    const searchStr = (
      item.name ||
      item.title ||
      item.content ||
      item.comment ||
      item.email ||
      ""
    ).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${view}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground underline">
          No items found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {view === "comments" ? "Commenter" : "Name/Title"}
                </TableHead>
                {view === "users" && <TableHead>Email</TableHead>}
                {view === "blogs" && <TableHead>Author</TableHead>}
                {view === "comments" && <TableHead>Comment</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {item.name || item.title || item.email}
                  </TableCell>
                  {view === "users" && <TableCell>{item.email}</TableCell>}
                  {view === "blogs" && (
                    <TableCell>{item.user?.name || "Unknown"}</TableCell>
                  )}
                  {view === "comments" && (
                    <TableCell className="max-w-xs truncate">
                      {item.comment}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
