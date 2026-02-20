"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2, FileText, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTopBlogsByViews } from "@/hooks/blog";

export function ProductPillWidget() {
  const router = useRouter();
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-blogs-by-views"],
    queryFn: () => fetchTopBlogsByViews(8),
  });

  const totalViews = posts?.reduce((sum, p) => sum + (p.views ?? 0), 0) ?? 0;
  const maxViews =
    posts && posts.length > 0 ? Math.max(...posts.map((p) => p.views ?? 0)) : 1;

  return (
    <Card className="rounded-[32px] flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground font-bold text-xs tracking-wider uppercase">
            Top Posts by Views
          </CardTitle>
          <Eye size={14} className="text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin w-6 h-6 opacity-40" />
          </div>
        ) : isError || !posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <FileText className="w-8 h-8 opacity-20" />
            <p className="text-xs">No posts yet</p>
          </div>
        ) : (
          posts.map((post) => {
            const barWidth = Math.max(
              8,
              Math.round(((post.views ?? 0) / maxViews) * 100),
            );
            return (
              <button
                key={post.id}
                onClick={() =>
                  post.slug && router.push(`/dashboard/blog/${post.slug}`)
                }
                disabled={!post.slug}
                className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/5 transition-colors text-left w-full"
              >
                {/* View bar */}
                <div className="relative w-1 self-stretch rounded-full bg-white/5 flex-shrink-0">
                  <div
                    className={
                      post.status === "published"
                        ? "absolute bottom-0 left-0 right-0 rounded-full bg-primary"
                        : "absolute bottom-0 left-0 right-0 rounded-full bg-secondary"
                    }
                    style={{ height: `${barWidth}%` }}
                  />
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-snug">
                    {post.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {post.category || "Uncategorized"}
                  </p>
                </div>

                {/* Views + status */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye size={11} />
                    <span className="text-xs">
                      {(post.views ?? 0) >= 1000
                        ? `${((post.views ?? 0) / 1000).toFixed(1)}k`
                        : (post.views ?? 0)}
                    </span>
                  </div>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                    className="text-[9px] px-1.5 py-0 h-4"
                  >
                    {post.status}
                  </Badge>
                  <ChevronRight
                    size={12}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </button>
            );
          })
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs text-muted-foreground">
          Showing top {posts?.length ?? 0} posts
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          Total views:{" "}
          <span className="text-foreground ml-1">
            {totalViews.toLocaleString()}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
