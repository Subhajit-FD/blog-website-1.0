"use client";

import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogInteractionsProps {
  slug: string;
  initialViews: number;
  initialLikes?: number;
}

export function BlogInteractions({
  slug,
  initialViews,
  initialLikes = 0,
}: BlogInteractionsProps) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // Initialize FingerprintJS
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      setDeviceId(visitorId);

      // Record View
      try {
        const viewRes = await fetch("/api/v1/blog/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, deviceId: visitorId }),
        });
        if (viewRes.ok) {
          const data = await viewRes.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error("View recording failed", error);
      }

      // Check Status (Liked state)
      try {
        const statusRes = await fetch(
          `/api/v1/blog/status?slug=${slug}&deviceId=${visitorId}`,
        );
        if (statusRes.ok) {
          const data = await statusRes.json();
          setIsLiked(data.isLiked);
          setLikes(data.likesCount);
          // Sync views if newer (optional, but good)
          if (data.views > views) setViews(data.views);
        }
      } catch (error) {
        console.error("Status check failed", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [slug]);

  const handleLike = async () => {
    if (!deviceId) return;

    // Optimistic Update
    const previousLikes = likes;
    const previousIsLiked = isLiked;

    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    try {
      const res = await fetch("/api/v1/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, deviceId }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();
      // data.isLiked is the confirmed state from server
      // data.likesCount is confirmed count
      setIsLiked(data.isLiked);
      setLikes(data.likesCount);
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
      toast.error("Failed to like post");
    }
  };

  return (
    <div className="flex items-center gap-6 text-muted-foreground text-sm">
      <div className="flex items-center gap-1.5" title="Unique Views">
        <Eye className="h-5 w-5" />
        <span className="font-medium">{views}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading || !deviceId}
        className={`flex items-center gap-1.5 px-2 hover:bg-transparent ${
          isLiked ? "text-red-500 hover:text-red-600" : "hover:text-foreground"
        }`}
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="font-medium">{likes}</span>
      </Button>
    </div>
  );
}
