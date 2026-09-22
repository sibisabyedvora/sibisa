'use client';

import { useState } from 'react';
import { saveChatbotSettings, toggleChatbotActive, type ChatbotSettingsFormValues } from '@/lib/actions/chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Palette, Code, CheckCircle2, AlertCircle, Save, Copy, Check, Power, Globe, MessageCircle } from 'lucide-react';

export interface ChatbotData {
  id?: string;
  business_id?: string;
  public_key?: string;
  name?: string;
  greeting?: string;
  tone?: 'ramah' | 'formal' | 'santai';
  fallback_message?: string;
  primary_color?: string;
  position?: 'bottom-right' | 'bottom-left';
  allowed_domains?: string[];
  wa_cta_text?: string;
  is_active?: boolean;
}

interface ChatbotSettingsFormProps {
  initialChatbot?: ChatbotData | null;
  appUrl: string;
}

const COLOR_SWATCHES = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#0284C7', '#7C3AED', '#DB2777'];

export function ChatbotSettingsForm({ initialChatbot, appUrl }: ChatbotSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isActive, setIsActive] = useState(initialChatbot?.is_active ?? true);

  const [formData, setFormData] = useState<ChatbotSettingsFormValues>({
    name: initialChatbot?.name || 'Asisten',
    greeting: initialChatbot?.greeting || 'Halo! Ada yang bisa kami bantu?',
    tone: initialChatbot?.tone || 'ramah',
    fallback_message: initialChatbot?.fallback_message || 'Maaf, untuk hal ini silakan hubungi admin kami via WhatsApp ya.',
    primary_color: initialChatbot?.primary_color || '#4F46E5',
    position: initialChatbot?.position || 'bottom-right',
    allowed_domains: initialChatbot?.allowed_domains || [],
    wa_cta_text: initialChatbot?.wa_cta_text || 'Lanjut chat via WhatsApp',
    is_active: initialChatbot?.is_active ?? true,
  });

  const [domainsInput, setDomainsInput] = useState((initialChatbot?.allowed_domains || []).join(', '));

  const embedScript = `<script src="${appUrl}/widget.js" data-key="${initialChatbot?.public_key || 'pk_live_sample'}" defer></script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleActive = async () => {
    const nextState = !isActive;
    setIsActive(nextState);
    const res = await toggleChatbotActive(nextState);
    if (res.error) {
      setIsActive(!nextState);
      alert(res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const domainList = domainsInput
      .split(',')
      .map((d: string) => d.trim())
      .filter((d: string) => d.length > 0);

    const payload = {
      ...formData,
      allowed_domains: domainList,
      is_active: isActive,
    };

    const res = await saveChatbotSettings(payload);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Pengaturan chatbot berhasil diperbarui!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle Status Card */}
      <Card className="border border-primary/20 p-5 bg-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-sm ${
                isActive ? 'bg-emerald-500' : 'bg-muted-foreground'
              }`}
            >
              <Power className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">Status Widget Chatbot</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isActive ? '● Aktif' : '○ Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isActive
                  ? 'Widget SIBISA tampil dan siap melayani pengunjung di website kamu.'
                  : 'Widget disembunyikan sementara dari website pelanggan.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={isActive ? 'destructive' : 'secondary'}
            size="sm"
            onClick={handleToggleActive}
          >
            {isActive ? 'Nonaktifkan Chatbot' : 'Aktifkan Chatbot'}
          </Button>
        </div>
      </Card>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Embed Code Snippet Box */}
      <Card className="border border-border bg-slate-900 text-slate-100 p-6 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Kode Script Embed Widget</h3>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleCopyScript}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Salin Script
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Tempelkan 1 baris kode script di bawah ini sebelum tag <code>&lt;/body&gt;</code> di website tokomu.
        </p>
        <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
          {embedScript}
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>Public Key: <code className="text-indigo-300 font-mono">{initialChatbot?.public_key || 'pk_live_...'}</code></span>
          <span>Ukuran loader ≤ 5 KB</span>
        </div>
      </Card>

      {/* Personality & Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Identitas &amp; Perilaku AI
          </CardTitle>
          <CardDescription>
            Atur nama asisten, sapaan awal, dan sapaan gaya bahasa AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Asisten AI</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="misal: Asisten Kenangan"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Gaya Bahasa (Tone)</label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.tone}
                onChange={(e) =>
                  setFormData({ ...formData, tone: e.target.value as 'ramah' | 'formal' | 'santai' })
                }
              >
                <option value="ramah">Ramah &amp; Sapaan &quot;Kamu / Kak&quot;</option>
                <option value="formal">Formal &amp; Sapaan &quot;Bapak / Ibu / Anda&quot;</option>
                <option value="santai">Santai, Ceria &amp; Kasual</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Pesan Sapaan Awal (Greeting)</label>
            <Input
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              placeholder="Halo! Ada yang bisa kami bantu seputar produk kami?"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Pesan ini langsung muncul di bubble chat saat pengunjung membuka widget.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Pesan Fallback (Saat Ragu / Handover)</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-xl border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.fallback_message}
              onChange={(e) => setFormData({ ...formData, fallback_message: e.target.value })}
              placeholder="Maaf, untuk informasi hal ini silakan hubungi admin kami ya."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Teks Tombol WhatsApp Handover</label>
            <div className="relative">
              <Input
                value={formData.wa_cta_text}
                onChange={(e) => setFormData({ ...formData, wa_cta_text: e.target.value })}
                className="pl-9"
                placeholder="Lanjut chat via WhatsApp"
                required
              />
              <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Customization & Domain Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-500" />
            Tampilan &amp; Keamanan Widget
          </CardTitle>
          <CardDescription>
            Sesuaikan warna utama widget dan batasi domain yang diizinkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Warna Utama Widget (Primary Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-border p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, primary_color: hex })}
                    className="h-6 w-6 rounded-full border border-white/50 shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Posisi Bubble Widget</label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value as 'bottom-right' | 'bottom-left' })
                }
              >
                <option value="bottom-right">Pojok Kanan Bawah (Bottom-Right)</option>
                <option value="bottom-left">Pojok Kiri Bawah (Bottom-Left)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <label className="text-xs font-semibold text-foreground">Domain Diizinkan (Allowed Domains)</label>
            </div>
            <Input
              value={domainsInput}
              onChange={(e) => setDomainsInput(e.target.value)}
              placeholder="misal: tokoku.id, www.tokoku.id (Kosongkan bila izinkan semua domain)"
            />
            <p className="text-[11px] text-muted-foreground">
              Pisahkan dengan koma. Jika diisi, widget hanya akan tampil pada domain yang tercantum.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button size="lg" type="submit" className="gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto" disabled={loading}>
          <Save className="h-5 w-5" />
          Simpan Pengaturan Chatbot
        </Button>
      </div>
    </form>
  );
}
