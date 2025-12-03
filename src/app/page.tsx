
'use client';
import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PriceChartCard } from '@/components/dashboard/PriceChartCard';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';
import { NewsFeedCard } from '@/components/dashboard/NewsFeedCard';
import { PredictionRationaleCard } from '@/components/dashboard/PredictionRationaleCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Coins, Activity, Gauge, Bell } from 'lucide-react';
import Link from 'next/link';
import { generateTradeSuggestion } from '@/ai/flows/generate-trade-suggestion';
import { cryptocurrencies, newsArticles } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import AuthGuard from '@/components/auth/AuthGuard';

function Dashboard() {
  const [suggestion, setSuggestion] = React.useState<{confidence: string, summary: string} | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sentiment, setSentiment] = React.useState<{value: string, description: string} | null>(null);


  React.useEffect(() => {
    const getInitialSuggestion = async () => {
      setLoading(true);
      const currentCrypto = cryptocurrencies[0]; // Default to Bitcoin
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

        // Calculate sentiment only after data is fetched
        let newSentiment = "Neutral";
        const summary = result.summary.toLowerCase();
        if (summary.includes('bullish') || summary.includes('positive') || summary.includes('upward') || summary.includes('buy')) {
            newSentiment = "Bullish";
        } else if (summary.includes('bearish') || summary.includes('negative') || summary.includes('downward') || summary.includes('sell')) {
            newSentiment = "Bearish";
        }
        
        let newDescription = 'Market is uncertain.';
        if (newSentiment === 'Bullish') newDescription = 'Market is optimistic.';
        if (newSentiment === 'Bearish') newDescription = 'Market is pessimistic.';

        setSentiment({ value: newSentiment, description: newDescription });

      } catch (error) {
        console.error("Failed to get initial suggestion", error);
        // Set a default/error state if the AI call fails
        setSuggestion({ confidence: 'N/A', summary: 'Could not load market sentiment.' });
        setSentiment({ value: 'Error', description: 'Could not load data.' });
      }
      setLoading(false);
    };

    getInitialSuggestion();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Value"
              value="$12,842.34"
              change="+1.2%"
              icon={<Coins className="text-primary" />}
            />
            {loading ? (
              <CardSkeleton />
            ) : (
              <StatCard
                title="AI Confidence"
                value={suggestion?.confidence || "N/A"}
                change="BTC/USD"
                icon={<Gauge className="text-primary" />}
              />
            )}
            {loading || !sentiment ? (
              <CardSkeleton />
            ) : (
               <StatCard
                title="Market Sentiment"
                value={sentiment.value}
                change={sentiment.description}
                icon={<Activity className="text-primary" />}
              />
            )}
            <Link href="/alerts">
              <StatCard
                title="Active Alerts"
                value="3"
                change="View All"
                icon={<Bell className="text-primary" />}
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceChartCard />
            </div>
            <div>
              <PerformanceCard />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewsFeedCard />
            </div>
            <div>
              <PredictionRationaleCard />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


function CardSkeleton() {
    return (
        <div className="p-6 bg-card rounded-lg border">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div>
                <Skeleton className="h-7 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
