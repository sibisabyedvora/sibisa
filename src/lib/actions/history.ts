'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ConversationItem {
  id: string;
  chatbot_id: string;
  session_id: string;
  visitor_meta: Record<string, unknown>;
  status: 'open' | 'handover' | 'closed';
  started_at: string;
  last_message_at: string;
  message_count?: number;
  last_message?: string;
  has_handover?: boolean;
}

export interface MessageItem {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  answered: boolean | null;
  lead_intent: string | null;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  created_at: string;
}

export async function getChatHistory(statusFilter?: string, searchQuery?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get user's chatbot ID first
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
    .from('conversations')
    .select(`
      id,
      chatbot_id,
      session_id,
      visitor_meta,
      status,
      started_at,
      last_message_at
    `)
    .eq('chatbot_id', chatbot.id)
    .order('last_message_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: conversations, error } = await query;

  if (error || !conversations) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  // Fetch latest message for each conversation
  const result: ConversationItem[] = [];

  for (const conv of conversations) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('content, answered, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conv.id);

    const lastMsg = msgs && msgs.length > 0 ? msgs[0].content : '';
    const hasHandover = Boolean(conv.status === 'handover' || (msgs && msgs[0]?.answered === false));

    // Apply search query filter if present
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMeta = JSON.stringify(conv.visitor_meta || {}).toLowerCase().includes(q);
      const matchMsg = lastMsg.toLowerCase().includes(q);
      const matchSess = conv.session_id.toLowerCase().includes(q);
      if (!matchMeta && !matchMsg && !matchSess) {
        continue;
      }
    }

    result.push({
      ...conv,
      visitor_meta: (conv.visitor_meta || {}) as Record<string, unknown>,
      message_count: count || 0,
      last_message: lastMsg,
      has_handover: hasHandover,
    });
  }

  return result;
}

export async function getConversationDetail(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (!conversation) return null;

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return {
    conversation,
    messages: (messages || []) as MessageItem[],
  };
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'open' | 'handover' | 'closed'
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/history');
  revalidatePath('/dashboard');
  return { success: true };
}
