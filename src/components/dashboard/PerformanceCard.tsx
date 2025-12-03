
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
        <CardDescription>Prediction accuracy over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={performanceMetrics} margin={{ top: 5, right: 10, left: -20, bottom: -10 }}>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={12}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
             />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="accuracy"
              fill="var(--color-accuracy)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
