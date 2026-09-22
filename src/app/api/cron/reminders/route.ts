import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const now = new Date();
  const h3Date = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  // Find subscriptions expiring in 3 days
  const { data: expiringSubs } = await adminClient
    .from('subscriptions')
    .select('id, owner_id, plan, status, trial_ends_at, current_period_end')
    .in('status', ['trialing', 'active'])
    .lte('trial_ends_at', h3Date);

  const remindersSent = expiringSubs?.length || 0;

  return NextResponse.json({
    success: true,
    remindersSent,
    timestamp: now.toISOString(),
  });
}
