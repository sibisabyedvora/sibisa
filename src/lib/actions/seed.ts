'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function seedDemoDataAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Ensure business exists
  let { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    const { data: newBusiness, error: bErr } = await supabase
      .from('businesses')
      .insert({
        owner_id: user.id,
        name: 'Kopi Senja & Roastery UMKM',
        category: 'kuliner',
        description: 'Kedai kopi pilihan dengan biji kopi lokal kualitas komersial & spesialti.',
        address: 'Jl. Pemuda No. 45, Bandung',
        whatsapp: '6281234567890',
        opening_hours: {
          mon: { open: '09:00', close: '22:00', closed: false },
          tue: { open: '09:00', close: '22:00', closed: false },
          wed: { open: '09:00', close: '22:00', closed: false },
          thu: { open: '09:00', close: '22:00', closed: false },
          fri: { open: '09:00', close: '23:00', closed: false },
          sat: { open: '10:00', close: '23:00', closed: false },
          sun: { open: '10:00', close: '21:00', closed: false },
        },
      })
      .select('id')
      .single();

    if (bErr || !newBusiness) {
      return { success: false, error: 'Gagal membuat bisnis demo' };
    }
    business = newBusiness;
  }

  // 2. Ensure chatbot exists
  let { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!chatbot) {
    const randomPk = 'pk_demo_' + Math.random().toString(36).substring(2, 18);
    const { data: newChatbot, error: cErr } = await supabase
      .from('chatbots')
      .insert({
        business_id: business.id,
        public_key: randomPk,
        name: 'Asisten Senja',
        greeting: 'Halo! Selamat datang di Kopi Senja. Ada yang bisa kami bantu?',
        tone: 'ramah',
        is_active: true,
      })
      .select('id')
      .single();

    if (cErr || !newChatbot) {
      return { success: false, error: 'Gagal membuat chatbot demo' };
    }
    chatbot = newChatbot;
  }

  const now = new Date();

  // Sample scenarios for seed conversations
  const scenarios = [
    {
      session: 'sess_demo_01',
      daysAgo: 0,
      hour: 10,
      status: 'open',
      userMsg: 'Halo, kopi rasa gula arennya ready gak hari ini?',
      aiReply: 'Halo! Kopi Gula Aren Senja ready setiap hari ya. Kami buka dari jam 09:00 - 22:00 WIB.',
      answered: true,
      intent: 'interested',
    },
    {
      session: 'sess_demo_02',
      daysAgo: 1,
      hour: 14,
      status: 'handover',
      userMsg: 'Bisa pesan catering 50 cup buat acara kantor besok dengan diskon 30%?',
      aiReply: 'Untuk pesanan khusus catering dalam jumlah besar dan negosiasi diskon, admin kami yang akan membantu ya.',
      answered: false,
      intent: 'ready_to_book',
    },
    {
      session: 'sess_demo_03',
      daysAgo: 2,
      hour: 16,
      status: 'closed',
      userMsg: 'Buka jam berapa kalau hari Minggu?',
      aiReply: 'Hari Minggu Kopi Senja buka dari jam 10:00 sampai 21:00 WIB ya!',
      answered: true,
      intent: 'none',
    },
    {
      session: 'sess_demo_04',
      daysAgo: 3,
      hour: 19,
      status: 'handover',
      userMsg: 'Apakah stok biji kopi Arabica Gayo yang 1kg masih ada di kedai?',
      aiReply: 'Untuk kepastian stok biji kopi real-time di kedai hari ini, silakan langsung tanya admin via WhatsApp ya.',
      answered: false,
      intent: 'interested',
    },
    {
      session: 'sess_demo_05',
      daysAgo: 4,
      hour: 11,
      status: 'closed',
      userMsg: 'Ada lokasi parkir mobil gak di sana?',
      aiReply: 'Area kedai kami memiliki fasilitas parkir mobil dan motor yang luas & gratis untuk pengunjung.',
      answered: true,
      intent: 'none',
    },
    {
      session: 'sess_demo_06',
      daysAgo: 5,
      hour: 13,
      status: 'handover',
      userMsg: 'Bisa minta brosur paket hampers Lebaran terbarunya?',
      aiReply: 'Untuk brosur dan daftar harga hampers terbaru, silakan klik tombol WhatsApp untuk menghubungi tim kami.',
      answered: false,
      intent: 'interested',
    },
    {
      session: 'sess_demo_07',
      daysAgo: 7,
      hour: 20,
      status: 'closed',
      userMsg: 'Metode pembayaran apa saja yang diterima?',
      aiReply: 'Kami menerima pembayaran tunai, QRIS (Gopay/OVO/ShopeePay/DANA), dan transfer bank.',
      answered: true,
      intent: 'none',
    },
  ];

  for (const s of scenarios) {
    const d = new Date(now);
    d.setDate(d.getDate() - s.daysAgo);
    d.setHours(s.hour, 15, 0, 0);

    const startedAt = d.toISOString();

    // Check if conversation with this session exists
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .eq('chatbot_id', chatbot.id)
      .eq('session_id', s.session)
      .maybeSingle();

    let convId = existingConv?.id;

    if (!convId) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          chatbot_id: chatbot.id,
          session_id: s.session,
          visitor_meta: { page: '/menu', device: 'mobile' },
          status: s.status,
          started_at: startedAt,
          last_message_at: startedAt,
        })
        .select('id')
        .single();

      if (newConv) convId = newConv.id;
    }

    if (convId) {
      // Add messages
      const userTime = new Date(d.getTime()).toISOString();
      const assistantTime = new Date(d.getTime() + 2000).toISOString();

      await supabase.from('messages').insert([
        {
          conversation_id: convId,
          role: 'user',
          content: s.userMsg,
          created_at: userTime,
        },
        {
          conversation_id: convId,
          role: 'assistant',
          content: s.aiReply,
          answered: s.answered,
          lead_intent: s.intent,
          tokens_in: 210,
          tokens_out: 45,
          latency_ms: 1200,
          created_at: assistantTime,
        },
      ]);
    }
  }

  // Insert Sample Leads
  const sampleLeads = [
    {
      name: 'Budi Pratama',
      contact: '081298765432',
      note: 'Tertarik pesan hampers kopi isi 5 pack',
      source: 'whatsapp_click' as const,
      status: 'new' as const,
    },
    {
      name: 'Siti Aminah',
      contact: 'siti.aminah@gmail.com',
      note: 'Tanya promo pesanan gathering 30 cup',
      source: 'form' as const,
      status: 'contacted' as const,
    },
    {
      name: 'Rian Kurnia',
      contact: '085711223344',
      note: 'Pesan roasted beans Gayo 2kg',
      source: 'quotation' as const,
      status: 'won' as const,
    },
  ];

  for (const l of sampleLeads) {
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('chatbot_id', chatbot.id)
      .eq('contact', l.contact)
      .maybeSingle();

    if (!existingLead) {
      await supabase.from('leads').insert({
        chatbot_id: chatbot.id,
        name: l.name,
        contact: l.contact,
        note: l.note,
        source: l.source,
        status: l.status,
      });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/history');
  revalidatePath('/leads');
  revalidatePath('/analytics');

  return { success: true };
}
