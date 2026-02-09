"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  _id: string;
  name: string;
  email: string; // valid but maybe hidden in UI? usually public comments don't show email.
  comment: string;
  createdAt: string;
}

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${blogId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, blogId }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Comment posted successfully!");
        setFormData({ name: "", email: "", comment: "" });
        setComments((prev) => [data.data, ...prev]);
      } else {
        toast.error(data.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-12">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-muted/30 p-6 rounded-xl border space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              required
              className="resize-y min-h-[100px]"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 group">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {comment.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(
                          undefined,
                          {
                            dateStyle: "medium",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
