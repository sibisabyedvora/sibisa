import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashIp, verifyAllowedDomain, verifySubscriptionAndQuota } from '@/lib/guard';
import { checkRateLimit } from '@/lib/ratelimit';
import { buildSystemPrompt } from '@/lib/ai/prompt';
import { generateAICustomerReply } from '@/lib/ai/respond';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKey, sessionId, message } = body || {};

    if (!publicKey || !sessionId || !message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const trimmedMsg = message.trim().substring(0, 500); // Limit input to 500 characters
    if (trimmedMsg.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Hashvisitor IP
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = hashIp(clientIp);

    // Rate Limiting (10 msgs/min/IP & 60 msgs/hr/session)
    const rateLimitResult = await checkRateLimit(ipHash, sessionId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak pesan. Silakan tunggu 1 menit.' },
        { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch Chatbot & Business
    const { data: chatbot, error: chatbotErr } = await supabaseAdmin
      .from('chatbots')
      .select('*, businesses!inner(*)')
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

    // Verify Allowed Domain
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    if (!verifyAllowedDomain(chatbot.allowed_domains || [], origin, referer)) {
      return NextResponse.json(
        { error: 'Domain tidak diizinkan' },
        { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const business = chatbot.businesses;
    const whatsappNum = business?.whatsapp;
    const waUrl = whatsappNum
      ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
          `Halo Admin ${business.name}, saya pengunjung website yang ingin bertanya tentang: "${trimmedMsg}"`
        )}`
      : null;

    // Check Subscription & Monthly Quota Guard
    const quotaGuard = await verifySubscriptionAndQuota(chatbot.id, business.id);
    if (!quotaGuard.allowed) {
      return NextResponse.json(
        {
          reply:
            chatbot.fallback_message ||
            'Maaf, kuota balasan AI bulanan telah mencapai batas. Silakan hubungi admin kami via WhatsApp.',
          handover: true,
          handoverReason: quotaGuard.reason,
          cta: waUrl ? { type: 'whatsapp', label: chatbot.wa_cta_text, url: waUrl } : null,
          leadIntent: 'none',
          limitReached: quotaGuard.limitReached,
        },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Upsert Conversation
    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('conversations')
      .upsert(
        {
          chatbot_id: chatbot.id,
          session_id: sessionId,
          visitor_meta: { ip_hash: ipHash, origin, referer },
          last_message_at: new Date().toISOString(),
        },
        { onConflict: 'chatbot_id,session_id' }
      )
      .select('id')
      .single();

    if (convErr || !conversation) {
      console.error('[SIBISA Widget API] Failed to upsert conversation:', convErr);
      return NextResponse.json(
        { error: 'Gagal membuat percakapan' },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Save User Message
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      content: trimmedMsg,
    });

    // Fetch Recent History (last 6 messages)
    const { data: recentMsgs } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(6);

    // Fetch Active Knowledge Items
    const { data: knowledgeItems } = await supabaseAdmin
      .from('knowledge_items')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_active', true);

    const systemPrompt = buildSystemPrompt(business, knowledgeItems || [], {
      name: chatbot.name,
      tone: chatbot.tone,
      fallback_message: chatbot.fallback_message,
    });

    // Call Gemini AI
    const historyInputs = (recentMsgs || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const aiResult = await generateAICustomerReply(
      systemPrompt,
      historyInputs,
      chatbot.fallback_message
    );

    // Atomically increment monthly usage counter
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0];

    try {
      await supabaseAdmin.rpc('increment_usage', {
        p_chatbot: chatbot.id,
        p_period: firstDayOfMonth,
      });
    } catch (incErr) {
      console.warn('[SIBISA Widget API] Increment usage failed:', incErr);
    }

    // Save Assistant Message
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: aiResult.reply,
      answered: !aiResult.needsHandover,
      lead_intent: aiResult.leadIntent,
      latency_ms: aiResult.latencyMs,
    });

    // Update conversation status if handover
    if (aiResult.needsHandover) {
      await supabaseAdmin
        .from('conversations')
        .update({ status: 'handover' })
        .eq('id', conversation.id);
    }

    return NextResponse.json(
      {
        reply: aiResult.reply,
        handover: aiResult.needsHandover,
        handoverReason: aiResult.handoverReason || null,
        cta:
          aiResult.needsHandover && waUrl
            ? { type: 'whatsapp', label: chatbot.wa_cta_text, url: waUrl }
            : null,
        leadIntent: aiResult.leadIntent,
        limitReached: false,
      },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    console.error('[SIBISA Widget API] Error handling chat:', err);
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
