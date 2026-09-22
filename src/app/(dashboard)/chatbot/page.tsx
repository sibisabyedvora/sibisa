import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { ChatbotSettingsForm } from '@/components/dashboard/chatbot-settings-form';
import { PlaygroundDrawer } from '@/components/dashboard/playground-drawer';

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

  const { data: chatbot } = business
    ? await supabase
        .from('chatbots')
        .select('*')
        .eq('business_id', business.id)
        .maybeSingle()
    : { data: null };

  return (
    <div className="space-y-6 max-w-4xl">
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

      <ChatbotSettingsForm
        initialChatbot={chatbot}
        appUrl={env.NEXT_PUBLIC_APP_URL}
      />
    </div>
  );
}
