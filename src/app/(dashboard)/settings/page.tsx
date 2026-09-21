import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Shield, Save } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola informasi profil pemilik akun dan keamanan kata sandi SIBISA.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informasi Profil Owner
          </CardTitle>
          <CardDescription>
            Detail identitas pengguna yang terdaftar di SIBISA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
              <Input
                defaultValue={user?.user_metadata?.full_name || ''}
                placeholder="Nama Owner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Terdaftar</label>
              <div className="relative">
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Peran akun: <strong>Owner (Pemilik Bisnis)</strong></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Perbarui kata sandi akunmu secara berkala untuk menjaga keamanan data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Kata Sandi Baru</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Konfirmasi Kata Sandi Baru</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div className="pt-2">
            <Button size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
