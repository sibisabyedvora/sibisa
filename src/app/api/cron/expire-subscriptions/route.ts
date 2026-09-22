import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  // Validate Cron Secret Header
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const nowIso = new Date().toISOString();

  // Find and update expired trialing subscriptions
  const { data: expiredTrials, error: trialErr } = await adminClient
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'trialing')
    .lt('trial_ends_at', nowIso)
    .select('id, owner_id');

  // Find and update expired active subscriptions
  const { data: expiredActives, error: activeErr } = await adminClient
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('current_period_end', nowIso)
    .select('id, owner_id');

  if (trialErr || activeErr) {
    console.error('Error expiring subscriptions:', trialErr || activeErr);
    return NextResponse.json({ error: 'Failed to expire subscriptions' }, { status: 500 });
  }

  const expiredCount = (expiredTrials?.length || 0) + (expiredActives?.length || 0);

  return NextResponse.json({
    success: true,
    expiredCount,
    timestamp: nowIso,
  });
}
