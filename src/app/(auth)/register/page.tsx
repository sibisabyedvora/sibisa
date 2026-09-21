'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        // Automatically logged in (if email confirmation disabled in Supabase)
        router.push('/dashboard');
        router.refresh();
      } else {
        // Confirmation email sent
        setSuccess(true);
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border border-border text-center p-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold">Cek Email Kamu!</CardTitle>
          <CardDescription className="mt-2">
            Kami telah mengirimkan tautan konfirmasi ke <strong className="text-foreground">{email}</strong>. Silakan klik tautan tersebut untuk mengaktifkan akun trial 14 harimu.
          </CardDescription>
          <div className="mt-6">
            <Link href="/login">
              <Button className="w-full">Ke Halaman Masuk</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">SIBISA</span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          Buat akun baru dan nikmati trial gratis 14 hari (100 balasan AI)
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-bold">Buat Akun SIBISA</CardTitle>
          <CardDescription>
            Siapkan chatbot AI untuk tokomu dalam waktu 5 menit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="fullName">
                Nama Lengkap / Owner
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="email">
                Email Aktif
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nama@bisnismu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground" htmlFor="password">
                Kata Sandi (Minimal 6 karakter)
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full shadow-md shadow-primary/20" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Sekarang (Trial 14 Hari)
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full gap-2"
            onClick={handleGoogleLogin}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Daftar dengan Google
          </Button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
