import { createClient } from '@/lib/supabase/server';

export interface SubscriptionInfo {
  id: string;
  owner_id: string;
  plan: 'trial' | 'basic';
  status: 'trialing' | 'active' | 'past_due' | 'expired' | 'canceled';
  trial_ends_at: string | null;
  current_period_end: string | null;
  is_valid: boolean;
  days_remaining: number;
  quota_max: number;
  usage_current: number;
  usage_percent: number;
}

export async function getSubscriptionInfo(ownerId: string): Promise<SubscriptionInfo | null> {
  const supabase = await createClient();

  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error || !sub) {
    return null;
  }

  const now = new Date();
  let isValid = false;
  let daysRemaining = 0;

  if (sub.status === 'trialing' && sub.trial_ends_at) {
    const endsAt = new Date(sub.trial_ends_at);
    isValid = now <= endsAt;
    const diffMs = endsAt.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  } else if (sub.status === 'active' && sub.current_period_end) {
    const endsAt = new Date(sub.current_period_end);
    isValid = now <= endsAt;
    const diffMs = endsAt.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  const quotaMax = sub.plan === 'basic' ? 600 : 100;

  // Get current month usage
  let usageCurrent = 0;
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (business) {
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id')
      .eq('business_id', business.id)
      .maybeSingle();

    if (chatbot) {
      const today = new Date();
      const periodStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
      const { data: usage } = await supabase
        .from('usage_counters')
        .select('ai_replies')
        .eq('chatbot_id', chatbot.id)
        .eq('period', periodStr)
        .maybeSingle();

      if (usage) usageCurrent = usage.ai_replies;
    }
  }

  const usagePercent = Math.min(100, Math.round((usageCurrent / quotaMax) * 100));

  return {
    ...sub,
    is_valid: isValid,
    days_remaining: daysRemaining,
    quota_max: quotaMax,
    usage_current: usageCurrent,
    usage_percent: usagePercent,
  };
}
