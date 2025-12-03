
import { BitcoinIcon } from '@/components/icons/Bitcoin';
import { EthereumIcon } from '@/components/icons/Ethereum';
import { DogecoinIcon } from '@/components/icons/Dogecoin';

export interface CryptoCurrency {
  id: string;
  name: string;
  ticker: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  price: number;
  change: number;
}

export interface ChartData {
  date: string;
  price: number;
  prediction?: number;
}

export interface NewsArticle {
  id: string;
  source: string;
  title: string;
  time: string;
  url: string;
}

export interface PerformanceMetric {
  month: string;
  accuracy: number;
}

export interface Alert {
  id: string;
  crypto: string;
  condition: string;
  active: boolean;
}

export const cryptocurrencies: CryptoCurrency[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', icon: BitcoinIcon, price: 68123.45, change: 2.5 },
  { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', icon: EthereumIcon, price: 3543.21, change: -1.2 },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', icon: DogecoinIcon, price: 0.158, change: 5.7 },
];

const generateChartData = (startPrice: number, days: number): ChartData[] => {
  const data: ChartData[] = [];
  let currentPrice = startPrice;
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    currentPrice *= 1 + (Math.random() - 0.49) * 0.1; // Fluctuate price by up to 10%
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  // Add a future prediction
  const lastPrice = data[data.length - 1].price;
  const predictionPrice = lastPrice * (1 + (Math.random() - 0.4) * 0.1);
  data[data.length-2].prediction = data[data.length-2].price;
  data[data.length-1].prediction = parseFloat(predictionPrice.toFixed(2));
  
  return data;
};

export const chartData: Record<string, ChartData[]> = {
  bitcoin: generateChartData(68123.45, 30),
  ethereum: generateChartData(3543.21, 30),
  dogecoin: generateChartData(0.158, 30),
};

export const newsArticles: NewsArticle[] = [
  { id: '1', source: 'CoinDesk', title: 'Bitcoin Breaks $68,000 as Market Optimism Surges', time: '2h ago', url: '#' },
  { id: '2', source: 'Bloomberg', title: 'Ethereum "Dencun" Upgrade Finalized, Gas Fees Expected to Drop', time: '5h ago', url: '#' },
  { id: '3', source: 'Reuters', title: 'Regulatory Landscape for Crypto Shifts in European Union', time: '8h ago', url: '#' },
  { id: '4', source: 'The Block', title: 'Dogecoin Rallies as Elon Musk Hints at X Integration', time: '1d ago', url: '#' },
];

export const performanceMetrics: PerformanceMetric[] = [
    { month: 'Jan', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
    { month: 'Feb', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
    { month: 'Mar', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
    { month: 'Apr', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
    { month: 'May', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
    { month: 'Jun', accuracy: Math.floor(Math.random() * (90 - 70 + 1) + 70) },
];

export const alerts: Alert[] = [
    { id: '1', crypto: 'BTC', condition: 'Price > $70,000', active: true },
    { id: '2', crypto: 'ETH', condition: 'Price < $3,200', active: true },
    { id: '3', crypto: 'DOGE', condition: 'Price > $0.20', active: false },
]
