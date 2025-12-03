
'use client';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Bot, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cryptocurrencies, newsArticles } from '@/lib/data';
import { generateTradeSuggestion } from '@/ai/flows/generate-trade-suggestion';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type Suggestion = {
  action: "Buy" | "Sell" | "Hold";
  strategy: "Long" | "Short" | "None";
  leverage: string | number;
  timeframe: string;
  confidence: "High" | "Medium" | "Low";
  summary: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
};

const StatItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const ConfidenceBadge = ({ level }: { level: "High" | "Medium" | "Low" }) => {
    const variant = level === 'High' ? 'default' : level === 'Medium' ? 'secondary' : 'destructive';
    const icon = level === 'High' ? <ArrowUp /> : level === 'Medium' ? <Minus /> : <ArrowDown />;
    return (
        <Badge variant={variant} className="gap-1">
            {icon}
            {level}
        </Badge>
    )
}

export function TradeAdvisor() {
  const [selectedCrypto, setSelectedCrypto] = React.useState('bitcoin');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<Suggestion | null>(null);
  const { toast } = useToast();

  const currentCrypto = cryptocurrencies.find((c) => c.id === selectedCrypto);

  const handleAnalyze = async () => {
    if (!currentCrypto) return;
    setIsAnalyzing(true);
    setSuggestion(null);
    try {
      const newsSummary = newsArticles
        .filter((n) =>
          n.title.toLowerCase().includes(currentCrypto.name.toLowerCase())
        )
        .map((n) => n.title)
        .join('. ');
      
      const result = await generateTradeSuggestion({
        ticker: currentCrypto.ticker,
        news: newsSummary || 'No specific news available.',
      });

      setSuggestion(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Could not get AI-powered trading advice. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatLeverage = (leverage: string | number) => {
    if (typeof leverage === 'number') {
      if (leverage === 0) return 'None';
      return `${leverage}x`;
    }
    return leverage;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                <Bot className="text-primary" />
                AI Trade Advisor
                </CardTitle>
                <CardDescription>
                Get a clear, AI-driven trade suggestion for any cryptocurrency.
                </CardDescription>
            </div>
             <div className="flex items-center gap-2">
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger className="w-[180px]">
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
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-32">
                    {isAnalyzing ? (
                    <Loader2 className="animate-spin" />
                    ) : (
                    'Get Advice'
                    )}
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-semibold">Analyzing Market Data...</p>
                <p className="text-sm text-muted-foreground">The AI is processing charts, news, and sentiment to find the best strategy for you.</p>
            </div>
        )}
        {!isAnalyzing && !suggestion && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
                <Bot className="h-8 w-8 text-muted-foreground" />
                <p className="font-semibold">Select a currency and click "Get Advice"</p>
                <p className="text-sm text-muted-foreground">Your personalized AI trading plan will appear here.</p>
            </div>
        )}
        {suggestion && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">AI Recommendation: <span className={`font-bold ${suggestion.action === 'Buy' ? 'text-green-500' : suggestion.action === 'Sell' ? 'text-red-500' : ''}`}>{suggestion.action} {currentCrypto?.ticker}</span></h3>
                    <p className="text-muted-foreground">{suggestion.summary}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatItem label="Strategy" value={suggestion.strategy} />
                    <StatItem label="Leverage" value={formatLeverage(suggestion.leverage)} />
                    <StatItem label="Timeframe" value={suggestion.timeframe} />
                    <StatItem label="Confidence" value={<ConfidenceBadge level={suggestion.confidence} />} />
                </div>
                 <Separator />
                <div>
                     <h3 className="font-semibold text-lg text-foreground mb-3">Execution Plan</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <Card className="p-4 bg-secondary">
                            <p className="text-sm text-muted-foreground">Entry Price</p>
                            <p className="text-lg font-bold text-foreground">{suggestion.entryPrice}</p>
                        </Card>
                         <Card className="p-4 bg-secondary">
                            <p className="text-sm text-muted-foreground">Stop-Loss</p>
                            <p className="text-lg font-bold text-red-500">{suggestion.stopLoss}</p>
                        </Card>
                         <Card className="p-4 bg-secondary">
                            <p className="text-sm text-muted-foreground">Take-Profit</p>
                            <p className="text-lg font-bold text-green-500">{suggestion.takeProfit}</p>
                        </Card>
                     </div>
                </div>
            </div>
        )}
      </CardContent>
      {suggestion &&
        <CardFooter>
            <p className="text-xs text-muted-foreground">Disclaimer: This is not financial advice. AI analysis may be inaccurate. Always do your own research.</p>
        </CardFooter>
      }
    </Card>
  );
}
