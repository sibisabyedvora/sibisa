import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKey, sessionId, name, contact, note, source } = body || {};

    if (!publicKey || !contact || !source) {
      return NextResponse.json(
        { error: 'Missing required parameters (publicKey, contact, source)' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch Chatbot
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

    // Optional conversation reference
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

    const { error: insertErr } = await supabaseAdmin.from('leads').insert({
      chatbot_id: chatbot.id,
      conversation_id: conversationId,
      name: name || null,
      contact: contact.trim(),
      note: note || null,
      source: ['whatsapp_click', 'form', 'quotation'].includes(source) ? source : 'form',
      status: 'new',
    });

    if (insertErr) {
      console.error('[SIBISA Lead API] Error saving lead:', insertErr);
      return NextResponse.json(
        { error: 'Gagal menyimpan lead' },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    console.error('[SIBISA Lead API] Exception:', err);
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
