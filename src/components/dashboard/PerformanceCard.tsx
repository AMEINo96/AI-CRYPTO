
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

export function PerformanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Performance</CardTitle>
        <CardDescription>Prediction accuracy over time.</CardDescription>
      </CardHeader>
      <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
        Performance data will appear here once enough trading history is available.
      </CardContent>
    </Card>
  );
}
