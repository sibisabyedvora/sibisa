'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const businessSchema = z.object({
  name: z.string().min(2, 'Nama bisnis minimal 2 karakter.'),
  description: z.string().optional().default(''),
  category: z.string().min(1, 'Pilih kategori bisnis.'),
  address: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  whatsapp: z.string().min(8, 'Nomor WhatsApp minimal 8 digit (contoh: 6281234567890).'),
  website: z.string().optional().default(''),
  maps_url: z.string().optional().default(''),
  social_links: z.record(z.string(), z.string()).optional().default({}),
  opening_hours: z.record(z.string(), z.any()).optional().default({}),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

function generatePublicKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 24; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `pk_live_${randomStr}`;
}

export async function saveBusinessProfile(formData: BusinessFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Sesi kamu telah berakhir. Silakan login kembali.' };
  }

  const validated = businessSchema.safeParse(formData);
  if (!validated.success) {
    const firstErr = validated.error.issues[0]?.message || 'Input tidak valid.';
    return { error: firstErr };
  }

  // Clean WhatsApp number (ensure no leading '+' or spaces)
  let cleanWa = validated.data.whatsapp.replace(/[^0-9]/g, '');
  if (cleanWa.startsWith('0')) {
    cleanWa = '62' + cleanWa.slice(1);
  }

  const businessData = {
    owner_id: user.id,
    name: validated.data.name,
    description: validated.data.description,
    category: validated.data.category,
    address: validated.data.address,
    phone: validated.data.phone,
    whatsapp: cleanWa,
    website: validated.data.website,
    maps_url: validated.data.maps_url,
    social_links: validated.data.social_links,
    opening_hours: validated.data.opening_hours,
    updated_at: new Date().toISOString(),
  };

  // Check existing business
  const { data: existingBusiness } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  let businessId = existingBusiness?.id;

  if (existingBusiness) {
    const { error: updateErr } = await supabase
      .from('businesses')
      .update(businessData)
      .eq('id', existingBusiness.id);

    if (updateErr) {
      return { error: `Gagal memperbarui profil: ${updateErr.message}` };
    }
  } else {
    const { data: newBus, error: insertErr } = await supabase
      .from('businesses')
      .insert(businessData)
      .select('id')
      .single();

    if (insertErr || !newBus) {
      return { error: `Gagal membuat profil bisnis: ${insertErr?.message || 'Unknown error'}` };
    }
    businessId = newBus.id;
  }

  // Ensure chatbot entry exists for this business
  if (businessId) {
    const { data: existingChatbot } = await supabase
      .from('chatbots')
      .select('id')
      .eq('business_id', businessId)
      .maybeSingle();

    if (!existingChatbot) {
      const publicKey = generatePublicKey();
      await supabase.from('chatbots').insert({
        business_id: businessId,
        public_key: publicKey,
        name: `Asisten ${validated.data.name}`,
        greeting: `Halo! Ada yang bisa kami bantu seputar ${validated.data.name}?`,
        tone: 'ramah',
        fallback_message: 'Maaf, untuk hal ini silakan hubungi admin kami via WhatsApp ya.',
        primary_color: '#4F46E5',
        position: 'bottom-right',
        allowed_domains: [],
        wa_cta_text: 'Lanjut chat via WhatsApp',
        is_active: true,
      });
    }
  }

  revalidatePath('/business');
  revalidatePath('/dashboard');
  revalidatePath('/knowledge');
  return { success: true };
}
