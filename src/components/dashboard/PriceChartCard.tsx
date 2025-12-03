
"use client";
import * as React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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
  type ChartConfig
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  cryptocurrencies,
  chartData as allChartData,
  newsArticles,
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { urlToDataUri } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { analyzeChartPatterns } from "@/ai/flows/analyze-chart-patterns";

type AnalysisResult = {
  analysis: string;
  tradingOpportunity: string;
  confidenceLevel: string;
};

export function PriceChartCard() {
  const [selectedCrypto, setSelectedCrypto] = React.useState("bitcoin");
  const [chartData, setChartData] = React.useState(allChartData.bitcoin);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { toast } = useToast();

  const currentCrypto = cryptocurrencies.find((c) => c.id === selectedCrypto);

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
    prediction: {
      label: "Prediction",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  React.useEffect(() => {
    setChartData(allChartData[selectedCrypto]);
  }, [selectedCrypto]);

  const handleAnalyze = async () => {
    if (!currentCrypto) return;
    setIsAnalyzing(true);
    try {
      const chartImage = PlaceHolderImages.find(img => img.id === 'chart-analysis-1');
      if (!chartImage) throw new Error("Chart image placeholder not found.");

      const chartDataUri = await urlToDataUri(chartImage.imageUrl);
      
      const newsSummary = newsArticles
        .filter(n => n.title.toLowerCase().includes(currentCrypto.name.toLowerCase()))
        .map(n => n.title)
        .join('. ');

      const result = await analyzeChartPatterns({
        chartDataUri,
        ticker: currentCrypto.ticker,
        news: newsSummary || "No specific news available.",
      });

      setAnalysisResult(result);
      setIsSheetOpen(true);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not get AI-powered analysis. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ConfidenceIcon = ({ level }: { level: string }) => {
    if (level === 'High') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (level === 'Medium') return <Minus className="h-4 w-4 text-yellow-500" />;
    if (level === 'Low') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="grid flex-1 gap-1">
            <CardTitle className="flex items-center gap-2">
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="w-[180px] border-none !bg-transparent p-0 text-2xl focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      <div className="flex items-center gap-2">
                        <crypto.icon className="h-6 w-6" />
                        {crypto.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
            <CardDescription>
              {currentCrypto &&
                `$${currentCrypto.price.toLocaleString()} USD (${currentCrypto.change > 0 ? "+" : ""}${currentCrypto.change}%)`}
            </CardDescription>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze with AI
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="price"
                type="natural"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="prediction"
                type="natural"
                stroke="var(--color-prediction)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--color-price)]" />
            Price
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--color-prediction)]" />
            Prediction
          </div>
        </CardFooter>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">AI-Powered Analysis: {currentCrypto?.name}</SheetTitle>
            <SheetDescription>
              This analysis is generated by CryptoVision AI based on chart patterns and recent news.
            </SheetDescription>
          </SheetHeader>
          {analysisResult && (
            <div className="mt-6 grid gap-6 text-sm">
                <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">Chart Pattern Analysis</h3>
                    <p className="text-muted-foreground">{analysisResult.analysis}</p>
                </div>
                <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">Trading Opportunity</h3>
                    <p className="text-muted-foreground">{analysisResult.tradingOpportunity}</p>
                </div>
                <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">Confidence Level</h3>
                    <div className="flex items-center gap-2">
                        <ConfidenceIcon level={analysisResult.confidenceLevel} />
                        <span className="font-medium">{analysisResult.confidenceLevel}</span>
                    </div>
                </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
