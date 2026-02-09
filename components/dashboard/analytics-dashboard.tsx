"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Loader2, Filter, ChevronDown } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const RANGES = [
  { label: "Past 24h", value: "day" },
  { label: "Past Week", value: "week" },
  { label: "Past Month", value: "month" },
  { label: "All Time", value: "all" },
];

export function AnalyticsDashboard() {
  const [range, setRange] = useState("all");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/analytics?range=${range}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentRangeLabel = RANGES.find((r) => r.value === range)?.label;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Overall Analytics</h2>

        {/* Mobile: Popover with Button */}
        <div className="md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter: {currentRangeLabel}</span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="flex flex-col">
                {RANGES.map((r) => (
                  <Button
                    key={r.value}
                    variant="ghost"
                    className={`justify-start font-normal ${
                      range === r.value ? "bg-accent" : ""
                    }`}
                    onClick={() => setRange(r.value)}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden md:block">
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              {RANGES.map((r) => (
                <TabsTrigger key={r.value} value={r.value}>
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalViews}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Viewed Blogs</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data?.topViews.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topViews} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="title"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickFormatter={(val) =>
                      val.length > 15 ? `${val.substring(0, 15)}...` : val
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [`${value} Views`, "Views"]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.topViews.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">
                No view data for this period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Liked Blogs</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data?.topLikes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topLikes} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="title"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickFormatter={(val) =>
                      val.length > 15 ? `${val.substring(0, 15)}...` : val
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [`${value} Likes`, "Likes"]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.topLikes.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">
                No like data for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
