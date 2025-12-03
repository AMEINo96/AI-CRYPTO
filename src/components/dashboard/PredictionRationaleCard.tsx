

'use client';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { cryptocurrencies, newsArticles, chartData } from '@/lib/data';
import { generatePredictionRationale } from '@/ai/flows/generate-prediction-rationale';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function PredictionRationaleCard() {
  const [rationale, setRationale] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const getRationale = async () => {
    setIsLoading(true);
    try {
      const currentCrypto = cryptocurrencies[0]; // Default to Bitcoin
      const newsSummary = newsArticles
        .filter((n) =>
          n.title.toLowerCase().includes(currentCrypto.name.toLowerCase())
        )
        .map((n) => n.title)
        .join('. ');

      const pricePoints = chartData[currentCrypto.id].slice(-30).map(d => d.price);
      const prediction = chartData[currentCrypto.id].slice(-1)[0].prediction || pricePoints[pricePoints.length-1];
      const avgPrice = pricePoints.reduce((a, b) => a + b, 0) / pricePoints.length;
      const trend = pricePoints[pricePoints.length - 1] > pricePoints[0] ? 'upward' : 'downward';
      const chartSummary = `The recent 30-day trend for ${currentCrypto.ticker} is ${trend}. The average price was around $${avgPrice.toFixed(2)}. The current price is $${currentCrypto.price.toLocaleString()}.`;

      const result = await generatePredictionRationale({
        ticker: currentCrypto.ticker,
        predictedPrice: prediction,
        relevantData: `Current Price: $${currentCrypto.price.toLocaleString()}, 24h Change: ${currentCrypto.change}%`,
        newsEvents: newsSummary || 'No specific news available.',
        chartAnalysis: chartSummary,
      });

      setRationale(result.rationale);
    } catch (error) {
      console.error('Failed to get prediction rationale:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get AI prediction rationale. Please try again.',
      });
      setRationale('Failed to load rationale.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getRationale();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Prediction Rationale</CardTitle>
            <CardDescription>The "why" behind the forecast.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={getRationale} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {rationale}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
