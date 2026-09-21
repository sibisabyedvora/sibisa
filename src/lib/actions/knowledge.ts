'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { env } from '@/lib/env';
import { FAQ_TEMPLATES } from '@/lib/constants/faq-templates';

const knowledgeSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['product', 'faq', 'policy']),
  title: z.string().min(2, 'Judul minimal 2 karakter.'),
  content: z.string().min(3, 'Isi penjelasan minimal 3 karakter.'),
  price_min: z.coerce.number().optional().nullable(),
  price_max: z.coerce.number().optional().nullable(),
  price_note: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>;

export async function getKnowledgeCapacity() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { totalChars: 0, maxChars: env.KB_MAX_CHARS, percentage: 0 };

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) return { totalChars: 0, maxChars: env.KB_MAX_CHARS, percentage: 0 };

  const { data: items } = await supabase
    .from('knowledge_items')
    .select('title, content')
    .eq('business_id', business.id)
    .eq('is_active', true);

  const totalChars = (items || []).reduce(
    (acc, item) => acc + (item.title?.length || 0) + (item.content?.length || 0),
    0
  );

  const percentage = Math.min(Math.round((totalChars / env.KB_MAX_CHARS) * 100), 100);

  return { totalChars, maxChars: env.KB_MAX_CHARS, percentage };
}

export async function upsertKnowledgeItem(formData: KnowledgeFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Sesi kamu telah berakhir. Silakan login kembali.' };

  const validated = knowledgeSchema.safeParse(formData);
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
    return { error: 'Profil bisnis belum dibuat. Isi profil bisnis terlebih dahulu.' };
  }

  // Calculate projected capacity
  const { data: existingItems } = await supabase
    .from('knowledge_items')
    .select('id, title, content')
    .eq('business_id', business.id)
    .eq('is_active', true);

  let currentChars = 0;
  (existingItems || []).forEach((item) => {
    // Exclude the item being edited
    if (item.id !== validated.data.id) {
      currentChars += (item.title?.length || 0) + (item.content?.length || 0);
    }
  });

  const newItemChars = validated.data.title.length + validated.data.content.length;
  if (currentChars + newItemChars > env.KB_MAX_CHARS) {
    return {
      error: `Kapasitas Knowledge Base melebihi batas ${env.KB_MAX_CHARS.toLocaleString('id-ID')} karakter. Kurangi atau hapus data lama terlebih dahulu.`,
    };
  }

  const itemPayload = {
    business_id: business.id,
    type: validated.data.type,
    title: validated.data.title,
    content: validated.data.content,
    price_min: validated.data.price_min || null,
    price_max: validated.data.price_max || null,
    price_note: validated.data.price_note || null,
    duration: validated.data.duration || null,
    is_active: validated.data.is_active,
    updated_at: new Date().toISOString(),
  };

  if (validated.data.id) {
    const { error: updateErr } = await supabase
      .from('knowledge_items')
      .update(itemPayload)
      .eq('id', validated.data.id)
      .eq('business_id', business.id);

    if (updateErr) return { error: updateErr.message };
  } else {
    const { error: insertErr } = await supabase
      .from('knowledge_items')
      .insert(itemPayload);

    if (insertErr) return { error: insertErr.message };
  }

  revalidatePath('/knowledge');
  return { success: true };
}

export async function deleteKnowledgeItem(id: string) {
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

  if (!business) return { error: 'Bisnis tidak ditemukan.' };

  const { error } = await supabase
    .from('knowledge_items')
    .delete()
    .eq('id', id)
    .eq('business_id', business.id);

  if (error) return { error: error.message };

  revalidatePath('/knowledge');
  return { success: true };
}

export async function applyFaqTemplate(categoryKey: string) {
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

  if (!business) return { error: 'Profil bisnis belum dibuat.' };

  const templates = FAQ_TEMPLATES[categoryKey] || FAQ_TEMPLATES.kuliner;

  const rows = templates.map((tpl) => ({
    business_id: business.id,
    type: tpl.type,
    title: tpl.title,
    content: tpl.content,
    price_min: tpl.price_min || null,
    price_max: tpl.price_max || null,
    price_note: tpl.price_note || null,
    duration: tpl.duration || null,
    is_active: true,
  }));

  const { error } = await supabase.from('knowledge_items').insert(rows);

  if (error) return { error: error.message };

  revalidatePath('/knowledge');
  return { success: true, count: rows.length };
}
