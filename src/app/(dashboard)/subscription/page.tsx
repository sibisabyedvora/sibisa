import { createClient } from '@/lib/supabase/server';
import { getSubscriptionInfo } from '@/lib/billing/state';
import { SubscriptionView } from '@/components/dashboard/subscription-view';
import { CreditCard } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const subInfo = await getSubscriptionInfo(user.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2.5">
          <CreditCard className="h-7 w-7 text-primary" />
          Status Langganan & Kuota
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pantau status paket langganan bisnis kamu, penggunaan kuota balasan AI bulanan, dan informasi perpanjangan.
        </p>
      </div>

      <SubscriptionView initialSub={subInfo} />
    </div>
  );
}
