
import AuthGuard from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AlertsCard } from '@/components/dashboard/AlertsCard';

function AlertsPageContent() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <AlertsCard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AlertsPage() {
  return (
    <AuthGuard>
      <AlertsPageContent />
    </AuthGuard>
  );
}
