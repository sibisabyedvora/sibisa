import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { ChatbotSettingsForm } from '@/components/dashboard/chatbot-settings-form';
import { PlaygroundDrawer } from '@/components/dashboard/playground-drawer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';

function generatePublicKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 24; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `pk_live_${randomStr}`;
}

export default async function ChatbotSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user?.id || '')
    .maybeSingle();

  let chatbot = null;

  if (business) {
    const { data: existingChatbot } = await supabase
      .from('chatbots')
      .select('*')
      .eq('business_id', business.id)
      .maybeSingle();

    if (!existingChatbot) {
      const publicKey = generatePublicKey();
      const { data: newChatbot } = await supabase
        .from('chatbots')
        .insert({
          business_id: business.id,
          public_key: publicKey,
          name: `Asisten ${business.name}`,
          greeting: `Halo! Selamat datang di ${business.name}. Ada yang bisa kami bantu?`,
          tone: 'ramah',
          fallback_message: 'Maaf, untuk hal ini silakan hubungi admin kami via WhatsApp ya.',
          primary_color: '#4F46E5',
          position: 'bottom-right',
          allowed_domains: [],
          wa_cta_text: 'Lanjut chat via WhatsApp',
          is_active: true,
        })
        .select('*')
        .maybeSingle();
      chatbot = newChatbot;
    } else {
      if (!existingChatbot.public_key || existingChatbot.public_key === 'pk_live_sample' || existingChatbot.public_key.includes('sample') || existingChatbot.public_key.includes('demo')) {
        const freshKey = generatePublicKey();
        await supabase
          .from('chatbots')
          .update({ public_key: freshKey })
          .eq('id', existingChatbot.id);
        existingChatbot.public_key = freshKey;
      }
      chatbot = existingChatbot;
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Pengaturan Chatbot & Playground
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Konfigurasi tampilan widget, sapaan AI, dan salin script widget untuk dipasang di website kamu.
          </p>
        </div>

        <PlaygroundDrawer
          chatbotName={chatbot?.name || `Asisten ${business?.name || ''}`}
          greeting={chatbot?.greeting}
          primaryColor={chatbot?.primary_color}
        />
      </div>

      {/* Warning Card if Business is not created yet */}
      {!business && (
        <Card className="border border-amber-300 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-base font-bold text-amber-950">Lengkapi Profil Bisnismu Terlebih Dahulu</h3>
                <p className="text-xs text-amber-800 mt-1">
                  Kamu masih menggunakan kode contoh (`pk_live_sample`). Lengkapi nama usaha & nomor WhatsApp admin kamu terlebih dahulu agar <strong>Script Widget & Public Key asli</strong> bisnismu terbentuk secara otomatis.
                </p>
              </div>
              <Link href="/business">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                  Isi Profil Bisnis Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Chatbot Form */}
      <ChatbotSettingsForm
        initialChatbot={chatbot}
        appUrl={env.NEXT_PUBLIC_APP_URL}
      />
    </div>
  );
}
