'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { buildSystemPrompt } from '@/lib/ai/prompt';
import { generateAICustomerReply } from '@/lib/ai/respond';

const chatbotSettingsSchema = z.object({
  name: z.string().min(2, 'Nama chatbot minimal 2 karakter.'),
  greeting: z.string().min(2, 'Pesan sapaan minimal 2 karakter.'),
  tone: z.enum(['ramah', 'formal', 'santai']),
  fallback_message: z.string().min(5, 'Pesan fallback minimal 5 karakter.'),
  primary_color: z.string().default('#4F46E5'),
  position: z.enum(['bottom-right', 'bottom-left']),
  allowed_domains: z.array(z.string()).default([]),
  wa_cta_text: z.string().min(2, 'Teks tombol WhatsApp minimal 2 karakter.'),
  is_active: z.boolean().default(true),
});

export type ChatbotSettingsFormValues = z.infer<typeof chatbotSettingsSchema>;

export async function saveChatbotSettings(formData: ChatbotSettingsFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Sesi kamu telah berakhir. Silakan login kembali.' };

  const validated = chatbotSettingsSchema.safeParse(formData);
  if (!validated.success) {
    const firstErr = validated.error.issues[0]?.message || 'Input tidak valid.';
    return { error: firstErr };
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    return { error: 'Profil bisnis belum diisi. Isi profil bisnis terlebih dahulu.' };
  }

  const payload = {
    name: validated.data.name,
    greeting: validated.data.greeting,
    tone: validated.data.tone,
    fallback_message: validated.data.fallback_message,
    primary_color: validated.data.primary_color,
    position: validated.data.position,
    allowed_domains: validated.data.allowed_domains,
    wa_cta_text: validated.data.wa_cta_text,
    is_active: validated.data.is_active,
  };

  const { error } = await supabase
    .from('chatbots')
    .update(payload)
    .eq('business_id', business.id);

  if (error) return { error: error.message };

  revalidatePath('/chatbot');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function toggleChatbotActive(isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Sesi kamu telah berakhir.' };

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) return { error: 'Profil bisnis belum diisi.' };

  const { error } = await supabase
    .from('chatbots')
    .update({ is_active: isActive })
    .eq('business_id', business.id);

  if (error) return { error: error.message };

  revalidatePath('/chatbot');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function playgroundChatAction(
  messagesHistory: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Sesi kamu telah berakhir.' };

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    return { error: 'Profil bisnis belum diisi. Lengkapi profil bisnis terlebih dahulu.' };
  }

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle();

  const { data: knowledgeItems } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('business_id', business.id)
    .eq('is_active', true);

  const chatbotSettings = {
    name: chatbot?.name || `Asisten ${business.name}`,
    tone: chatbot?.tone || 'ramah',
    fallback_message: chatbot?.fallback_message || 'Silakan hubungi admin kami via WhatsApp ya.',
  };

  const systemPrompt = buildSystemPrompt(business, knowledgeItems || [], chatbotSettings);

  const result = await generateAICustomerReply(
    systemPrompt,
    messagesHistory,
    chatbotSettings.fallback_message
  );

  return {
    success: true,
    result: {
      reply: result.reply,
      needsHandover: result.needsHandover,
      handoverReason: result.handoverReason,
      leadIntent: result.leadIntent,
      suggestedCta: result.suggestedCta,
      latencyMs: result.latencyMs,
      whatsappUrl: business.whatsapp
        ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
            `Halo Admin ${business.name}, saya ingin bertanya perihal: "${messagesHistory[messagesHistory.length - 1]?.content || ''}"`
          )}`
        : null,
      waCtaText: chatbot?.wa_cta_text || 'Lanjut chat via WhatsApp',
    },
  };
}
