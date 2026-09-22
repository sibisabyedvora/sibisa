'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Download,
  PhoneCall,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { LeadItem, updateLeadStatus } from '@/lib/actions/leads';

export function LeadsView({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = leads.filter((l) => {
    if (activeFilter !== 'all' && l.status !== activeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (l.name || '').toLowerCase().includes(q);
      const matchContact = (l.contact || '').toLowerCase().includes(q);
      const matchNote = (l.note || '').toLowerCase().includes(q);
      return matchName || matchContact || matchNote;
    }
    return true;
  });

  async function handleStatusChange(leadId: string, newStatus: 'new' | 'contacted' | 'won' | 'lost') {
    const res = await updateLeadStatus(leadId, newStatus);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    }
  }

  function handleExportCSV() {
    if (leads.length === 0) {
      alert('Tidak ada data leads untuk diexport.');
      return;
    }

    const headers = ['Nama', 'Kontak', 'Sumber', 'Status', 'Catatan', 'Tanggal Dibuat'];
    const rows = leads.map((l) => [
      `"${l.name || 'Tanpa Nama'}"`,
      `"${l.contact || '-'}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.note || '').replace(/"/g, '""')}"`,
      `"${new Date(l.created_at).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_sibisa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Summary counts
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Leads Terkumpul</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">{totalLeads}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Dari widget website & WA</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Closing (Won)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">{wonLeads}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Calon pembeli yang berhasil transaksi</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Tingkat Konversi Lead</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <PhoneCall className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-foreground">{conversionRate}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">Rasio Won / Total Lead</p>
        </Card>
      </div>

      {/* Controls: Filters, Search, Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-3 py-1.5 transition-colors shrink-0 ${
              activeFilter === 'all'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua ({leads.length})
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`rounded-lg px-3 py-1.5 transition-colors shrink-0 ${
              activeFilter === 'new'
                ? 'bg-card text-indigo-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Baru
          </button>
          <button
            onClick={() => setActiveFilter('contacted')}
            className={`rounded-lg px-3 py-1.5 transition-colors shrink-0 ${
              activeFilter === 'contacted'
                ? 'bg-card text-amber-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dihubungi
          </button>
          <button
            onClick={() => setActiveFilter('won')}
            className={`rounded-lg px-3 py-1.5 transition-colors shrink-0 ${
              activeFilter === 'won'
                ? 'bg-card text-emerald-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Won (Closing)
          </button>
          <button
            onClick={() => setActiveFilter('lost')}
            className={`rounded-lg px-3 py-1.5 transition-colors shrink-0 ${
              activeFilter === 'lost'
                ? 'bg-card text-rose-700 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lost (Batal)
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, kontak, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-xs font-semibold shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden shadow-sm border border-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Belum Ada Lead Terdaftar</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Lead baru akan terkumpul otomatis saat pengunjung mengeklik tombol WhatsApp atau mengisi mini-form di widget.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3.5 pl-5">Nama Lead</th>
                  <th className="p-3.5">Kontak</th>
                  <th className="p-3.5">Sumber</th>
                  <th className="p-3.5">Catatan Intent</th>
                  <th className="p-3.5">Status Lead</th>
                  <th className="p-3.5">Tanggal</th>
                  <th className="p-3.5 pr-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => {
                  const cleanPhone = (lead.contact || '').replace(/[^0-9]/g, '');
                  const waUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone}`
                    : null;

                  return (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-foreground">
                        {lead.name || 'Pengunjung WA'}
                      </td>
                      <td className="p-3.5 text-muted-foreground font-mono">
                        {lead.contact || '-'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            lead.source === 'whatsapp_click'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.source === 'form'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lead.source === 'whatsapp_click'
                            ? 'Klik WA'
                            : lead.source === 'form'
                            ? 'Form Lead'
                            : 'Penawaran'}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted-foreground max-w-xs truncate">
                        {lead.note || '-'}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(
                              lead.id,
                              e.target.value as 'new' | 'contacted' | 'won' | 'lost'
                            )
                          }
                          className={`text-[11px] font-bold border rounded-lg px-2 py-1 bg-background ${
                            lead.status === 'won'
                              ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                              : lead.status === 'lost'
                              ? 'border-rose-300 text-rose-700 bg-rose-50'
                              : lead.status === 'contacted'
                              ? 'border-amber-300 text-amber-700 bg-amber-50'
                              : 'border-indigo-300 text-indigo-700 bg-indigo-50'
                          }`}
                        >
                          <option value="new">Baru</option>
                          <option value="contacted">Dihubungi</option>
                          <option value="won">Closing (Won)</option>
                          <option value="lost">Batal (Lost)</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-muted-foreground text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-semibold transition-colors shadow-sm"
                          >
                            Hubungi WA
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
