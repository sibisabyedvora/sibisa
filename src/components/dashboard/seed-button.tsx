'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { seedDemoDataAction } from '@/lib/actions/seed';

export function SeedDemoButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const res = await seedDemoDataAction();
      if (res.success) {
        setDone(true);
        setTimeout(() => setDone(false), 3000);
      } else {
        alert(res.error || 'Gagal mengisi data demo');
      }
    } catch {
      alert('Terjadi kesalahan saat mengisi data demo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSeed}
      disabled={loading}
      className="gap-2 text-xs font-semibold"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : done ? (
        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Database className="h-3.5 w-3.5 text-primary" />
      )}
      {done ? 'Data Demo Terisi!' : 'Isi Data Demo'}
    </Button>
  );
}
