import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAllowedDomain } from '@/lib/guard';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKey = searchParams.get('key');

  if (!publicKey) {
    return NextResponse.json(
      { error: 'Public key is required' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const supabaseAdmin = createAdminClient();

  // Fetch chatbot config
  const { data: chatbot, error: chatbotErr } = await supabaseAdmin
    .from('chatbots')
    .select('*, businesses!inner(name, whatsapp, category)')
    .eq('public_key', publicKey)
    .maybeSingle();

  if (chatbotErr || !chatbot) {
    return NextResponse.json(
      { error: 'Chatbot tidak ditemukan' },
      { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  if (!chatbot.is_active) {
    return NextResponse.json(
      { error: 'Chatbot sedang nonaktif' },
      { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Domain verification
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const isDomainAllowed = verifyAllowedDomain(chatbot.allowed_domains || [], origin, referer);

  if (!isDomainAllowed) {
    return NextResponse.json(
      { error: 'Domain tidak diizinkan menggunakan widget ini' },
      { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Fetch top 3 FAQ titles for quick reply chips
  const { data: faqs } = await supabaseAdmin
    .from('knowledge_items')
    .select('title')
    .eq('business_id', chatbot.business_id)
    .eq('type', 'faq')
    .eq('is_active', true)
    .limit(3);

  const quickReplies = (faqs || []).map((f) => f.title);

  const responsePayload = {
    publicKey: chatbot.public_key,
    name: chatbot.name,
    greeting: chatbot.greeting,
    tone: chatbot.tone,
    primaryColor: chatbot.primary_color,
    position: chatbot.position,
    waCtaText: chatbot.wa_cta_text,
    quickReplies,
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
