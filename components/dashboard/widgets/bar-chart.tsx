"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { fetchPostCountsByCategory } from "@/hooks/blog";
import { Loader2, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Posts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function CategoryBarChartWidget() {
  const {
    data: rawData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-category-counts"],
    queryFn: fetchPostCountsByCategory,
  });

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return rawData;
  }, [rawData]);

  return (
    <Card className="rounded-[24px]">
      <CardHeader>
        <CardTitle>Posts by Category</CardTitle>
        <CardDescription>
          Total number of posts grouped by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <Loader2 className="animate-spin w-8 h-8 opacity-50" />
          </div>
        ) : isError || !chartData || chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-3">
            <FileText className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">No data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            >
              <XAxis type="number" dataKey="count" hide />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={130}
                tickFormatter={(value) =>
                  value.length > 18 ? value.slice(0, 16) + "..." : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total posts per category
        </div>
      </CardFooter>
    </Card>
  );
}
