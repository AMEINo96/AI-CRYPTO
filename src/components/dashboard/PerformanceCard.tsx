
"use client";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { performanceMetrics } from "@/lib/data";

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

import * as React from "react";
import { getAccuracyStats } from "@/firebase/predictions";

export function PerformanceCard() {
  const [stats, setStats] = React.useState({ accuracy: 0, total: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      const data = await getAccuracyStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Performance</CardTitle>
        <CardDescription>Based on {stats.total} verified predictions.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[200px]">
        {stats.total > 0 ? (
          <>
            <div className="text-5xl font-bold text-primary">{stats.accuracy}%</div>
            <p className="text-muted-foreground mt-2">Win Rate</p>
          </>
        ) : (
          <p className="text-muted-foreground text-center">
            Performance data will appear here once enough trading history is available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
