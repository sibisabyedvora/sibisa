import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  LayoutDashboard,
  Store,
  BookOpen,
  Bot,
  MessageSquare,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profil Bisnis', href: '/business', icon: Store },
  { name: 'Knowledge & FAQ', href: '/knowledge', icon: BookOpen },
  { name: 'Pengaturan Chatbot', href: '/chatbot', icon: Bot },
  { name: 'Riwayat Chat', href: '/history', icon: MessageSquare },
  { name: 'Leads / Prospek', href: '/leads', icon: Users },
  { name: 'Analitik', href: '/analytics', icon: BarChart3 },
  { name: 'Langganan', href: '/subscription', icon: CreditCard },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card sticky top-0 h-screen">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-foreground">SIBISA</span>
            <span className="text-[10px] font-medium text-muted-foreground -mt-1">Dashboard Owner</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary-light hover:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-semibold text-foreground">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        {/* Top Header for Mobile */}
        <header className="flex md:hidden h-14 items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
              S
            </div>
            <span className="text-base font-extrabold tracking-tight text-foreground">SIBISA</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-light text-primary">
            Trial 14 Hari
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (HP Viewport <= 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-around h-16 px-2">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/business"
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Store className="h-5 w-5" />
          <span>Profil</span>
        </Link>
        <Link
          href="/knowledge"
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          <span>Knowledge</span>
        </Link>
        <Link
          href="/chatbot"
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Bot className="h-5 w-5" />
          <span>Chatbot</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Pengaturan</span>
        </Link>
      </nav>
    </div>
  );
}
