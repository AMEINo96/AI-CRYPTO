
import AuthGuard from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TradeAdvisor } from '@/components/trade/TradeAdvisor';

function TradePageContent() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <TradeAdvisor />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function TradePage() {
  return (
    <AuthGuard>
        <TradePageContent />
    </AuthGuard>
  )
}
