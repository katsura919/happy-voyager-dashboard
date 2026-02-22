"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowUpRight, TrendingUp } from "lucide-react";
import { fetchBlogPostStats } from "@/hooks/blog";
import { Card, CardContent } from "@/components/ui/card";

export function CustomerWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog-post-stats"],
    queryFn: fetchBlogPostStats,
  });

  if (isLoading) {
    return (
      <>
        <Card className="rounded-[32px] bg-primary text-primary-foreground border-none">
          <CardContent className="p-6 flex items-center justify-center h-full min-h-[160px]">
            <Loader2 className="animate-spin w-6 h-6 opacity-40" />
          </CardContent>
        </Card>
        <Card className="rounded-[32px] border">
          <CardContent className="p-6 flex items-center justify-center h-full min-h-[160px]">
            <Loader2 className="animate-spin w-6 h-6 opacity-40 text-muted-foreground" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="rounded-[32px] bg-card text-primary-foreground border-none">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-foreground">Published Blogs</span>
            <div className="w-8 h-8 border border-border rounded-full bg-card text-muted-foreground flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="mt-4 mb-2 text-4xl text-foreground font-bold">
            {data?.published ?? 0}
          </div>
          <div className="flex items-center gap-2 mt-auto text-xs text-primary-foreground/80">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-primary-foreground/20 text-foreground">
              <TrendingUp size={12} />
            </div>
            <span className="text-foreground">Increased from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border">
        <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-foreground">Draft Blogs</span>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="mt-4 mb-2 text-4xl font-bold text-foreground">
            {data?.draft ?? 0}
          </div>
          <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
            <div className="flex items-center justify-center w-5 h-5 rounded border border-border text-primary">
              <TrendingUp size={12} />
            </div>
            <span>Increased from last month</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
