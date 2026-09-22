'use server';

import { createClient } from '@/lib/supabase/server';
import { getSubscriptionInfo } from '@/lib/billing/state';
import { revalidatePath } from 'next/cache';

export async function getSubscriptionStatusAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return await getSubscriptionInfo(user.id);
}

export async function adminActivateSubscriptionAction(
  targetOwnerId?: string,
  days: number = 30
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const ownerIdToUpdate = targetOwnerId || user.id;

  const now = new Date();
  const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan: 'basic',
      status: 'active',
      current_period_end: periodEnd,
    })
    .eq('owner_id', ownerIdToUpdate);

  if (error) return { success: false, error: error.message };

  revalidatePath('/subscription');
  revalidatePath('/dashboard');
  return { success: true };
}
