import { getLeads } from '@/lib/actions/leads';
import { LeadsView } from '@/components/dashboard/leads-view';
import { Users } from 'lucide-react';

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2.5">
          <Users className="h-7 w-7 text-primary" />
          Leads / Calon Pelanggan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola calon pelanggan hasil tangkapan widget (klik WhatsApp, mini-form, & permintaan penawaran).
        </p>
      </div>

      <LeadsView initialLeads={leads} />
    </div>
  );
}
