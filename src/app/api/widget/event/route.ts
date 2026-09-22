import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKey, sessionId, eventName, metadata } = body || {};

    if (!publicKey || !eventName) {
      return NextResponse.json(
        { error: 'Missing required parameters (publicKey, eventName)' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data: chatbot } = await supabaseAdmin
      .from('chatbots')
      .select('id')
      .eq('public_key', publicKey)
      .maybeSingle();

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot tidak ditemukan' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    let conversationId: string | null = null;
    if (sessionId) {
      const { data: conv } = await supabaseAdmin
        .from('conversations')
        .select('id')
        .eq('chatbot_id', chatbot.id)
        .eq('session_id', sessionId)
        .maybeSingle();
      if (conv) conversationId = conv.id;
    }

    // If event is whatsapp_click, record lead
    if (eventName === 'whatsapp_click') {
      await supabaseAdmin.from('leads').insert({
        chatbot_id: chatbot.id,
        conversation_id: conversationId,
        name: metadata?.name || 'Visitor WA Click',
        contact: metadata?.contact || 'Klik CTA WhatsApp',
        note: `Klik CTA WhatsApp dari widget. Metadata: ${JSON.stringify(metadata || {})}`,
        source: 'whatsapp_click',
        status: 'new',
      });
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    console.error('[SIBISA Event API] Exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
