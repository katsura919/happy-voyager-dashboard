"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchCommentStats } from "@/hooks/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductDotWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["comment-stats"],
    queryFn: fetchCommentStats,
  });

  return (
    <Card className="rounded-[32px] ">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground font-bold text-xs tracking-wider uppercase">
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="animate-spin w-6 h-6 opacity-40" />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-10">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block flex-shrink-0" />
                  <span className="text-3xl font-bold text-foreground">
                    {data?.pending ?? 0}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Pending
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block flex-shrink-0" />
                  <span className="text-3xl font-bold text-foreground">
                    {data?.approved ?? 0}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  Approved
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
