"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Loader2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { fetchBlogPostStats } from "@/hooks/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog-post-stats"],
    queryFn: fetchBlogPostStats,
  });

  return (
    <Card className="rounded-[32px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground font-bold text-xs tracking-wider uppercase">
          Blog Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="animate-spin w-6 h-6 opacity-40" />
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-10">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen size={13} className="text-primary" />
                    <span className="text-3xl font-bold text-foreground">
                      {data?.published ?? 0}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                    Published
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText size={13} className="text-secondary" />
                    <span className="text-3xl font-bold text-foreground">
                      {data?.draft ?? 0}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                    Drafts
                  </p>
                </div>
              </div>
            </div>

          </>
        )}
      </CardContent>
    </Card>
  );
}
