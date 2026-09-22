'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface LeadItem {
  id: string;
  chatbot_id: string;
  conversation_id: string | null;
  name: string | null;
  contact: string | null;
  note: string | null;
  source: 'whatsapp_click' | 'form' | 'quotation';
  status: 'new' | 'contacted' | 'won' | 'lost';
  created_at: string;
}

export async function getLeads(statusFilter?: string, searchQuery?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) return [];

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!chatbot) return [];

  let query = supabase
    .from('leads')
    .select('*')
    .eq('chatbot_id', chatbot.id)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: leads, error } = await query;

  if (error || !leads) {
    console.error('Error fetching leads:', error);
    return [];
  }

  let result = leads as LeadItem[];

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.contact && l.contact.toLowerCase().includes(q)) ||
        (l.note && l.note.toLowerCase().includes(q)) ||
        l.source.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function updateLeadStatus(
  leadId: string,
  status: 'new' | 'contacted' | 'won' | 'lost'
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/leads');
  revalidatePath('/dashboard');
  return { success: true };
}
