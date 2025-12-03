
import AuthGuard from '@/components/auth/AuthGuard';
import { Header } from '@/components/layout/Header';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ChartsPageContent() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed charts will be available here.</p>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ChartsPage() {
  return (
    <AuthGuard>
      <ChartsPageContent />
    </AuthGuard>
  );
}
