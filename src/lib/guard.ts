import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip || '127.0.0.1').digest('hex').substring(0, 16);
}

export interface ChatbotConfigRecord {
  id: string;
  business_id: string;
  public_key: string;
  name: string;
  greeting: string;
  tone: 'ramah' | 'formal' | 'santai';
  fallback_message: string;
  primary_color: string;
  position: 'bottom-right' | 'bottom-left';
  allowed_domains: string[];
  wa_cta_text: string;
  is_active: boolean;
}

export function verifyAllowedDomain(allowedDomains: string[], requestOrigin?: string | null, requestReferer?: string | null): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true; // Empty array = all domains allowed
  }

  const originHost = requestOrigin ? new URL(requestOrigin).hostname : '';
  const refererHost = requestReferer ? new URL(requestReferer).hostname : '';

  return allowedDomains.some((domain) => {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    return (
      originHost.toLowerCase() === cleanDomain ||
      refererHost.toLowerCase() === cleanDomain ||
      originHost.endsWith('.' + cleanDomain) ||
      refererHost.endsWith('.' + cleanDomain)
    );
  });
}

export async function verifySubscriptionAndQuota(chatbotId: string, businessId: string) {
  const supabaseAdmin = createAdminClient();

  // Get business owner
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('owner_id')
    .eq('id', businessId)
    .single();

  if (!business) {
    return { allowed: false, reason: 'Bisnis tidak ditemukan', limitReached: false };
  }

  // Get subscription
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status, trial_ends_at, current_period_end')
    .eq('owner_id', business.owner_id)
    .maybeSingle();

  const isTrial = subscription?.plan !== 'basic';
  const maxQuota = isTrial ? env.TRIAL_QUOTA : env.PLAN_BASIC_QUOTA;

  // Check subscription expiration
  const now = new Date();
  if (subscription) {
    if (subscription.status === 'expired' || subscription.status === 'canceled') {
      return { allowed: false, reason: 'Masa langganan telah berakhir', limitReached: false };
    }

    if (isTrial && subscription.trial_ends_at) {
      const trialEnds = new Date(subscription.trial_ends_at);
      if (now > trialEnds) {
        return { allowed: false, reason: 'Masa trial 14 hari telah habis', limitReached: false };
      }
    }
  }

  // Check monthly usage counter
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  const { data: usage } = await supabaseAdmin
    .from('usage_counters')
    .select('ai_replies')
    .eq('chatbot_id', chatbotId)
    .eq('period', firstDayOfMonth)
    .maybeSingle();

  const currentReplies = usage?.ai_replies || 0;

  if (currentReplies >= maxQuota) {
    return {
      allowed: false,
      reason: `Kuota balasan AI bulanan (${maxQuota} balasan) telah habis`,
      limitReached: true,
      currentReplies,
      maxQuota,
    };
  }

  return {
    allowed: true,
    limitReached: false,
    currentReplies,
    maxQuota,
  };
}
