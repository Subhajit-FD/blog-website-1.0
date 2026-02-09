"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface UserCardProps {
  user?: User | null;
  variant?: "default" | "sidebar";
}

const UserCard = ({ user: propUser, variant = "default" }: UserCardProps) => {
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!propUser);
  const [error, setError] = useState("");

  useEffect(() => {
    if (propUser) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        // Add cache: 'no-store' to ensure we seek fresh data if image updated
        const res = await fetch("/api/v1/user", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }

        setFetchedUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [propUser]);

  const user = propUser || fetchedUser;

  if (loading) {
    if (variant === "sidebar")
      return <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />;

    return (
      <Card className="w-full max-w-sm mx-auto mt-10">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !user) {
    if (variant === "sidebar")
      return <div className="text-red-500 text-xs">Error</div>;
    return (
      <Card className="w-full max-w-sm mx-auto mt-10 border-red-500">
        <CardContent className="pt-6 text-center text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <div className="flex items-center gap-3 w-full">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage
            src={user.image}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="text-xs font-bold text-muted-foreground">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-medium truncate leading-none mb-1">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground truncate leading-none">
            {user.email}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 shadow-md">
      <CardHeader className="flex flex-col items-center gap-4 pb-2">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage
            src={user.image}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-bold text-muted-foreground">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-1">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription className="text-sm">{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 pt-0">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            Email
          </span>
          <span>{user.email}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Refresh Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
