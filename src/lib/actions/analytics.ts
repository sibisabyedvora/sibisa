'use server';

import { createClient } from '@/lib/supabase/server';

export interface UnansweredQuestion {
  id: string;
  question: string;
  timestamp: string;
  session_id: string;
  conversation_id: string;
}

export interface DayTrend {
  date: string;
  conversations: number;
  aiReplies: number;
}

export interface HourDistribution {
  hour: string;
  count: number;
}

export interface AnalyticsSummary {
  totalConversations: number;
  totalMessages: number;
  totalAiReplies: number;
  answerRate: number; // percentage (0-100)
  handoverRate: number; // percentage (0-100)
  totalLeads: number;
  avgLatencyMs: number;
  trend14Days: DayTrend[];
  hourlyDistribution: HourDistribution[];
  unansweredQuestions: UnansweredQuestion[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emptyResult: AnalyticsSummary = {
    totalConversations: 0,
    totalMessages: 0,
    totalAiReplies: 0,
    answerRate: 100,
    handoverRate: 0,
    totalLeads: 0,
    avgLatencyMs: 0,
    trend14Days: [],
    hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      count: 0,
    })),
    unansweredQuestions: [],
  };

  if (!user) return emptyResult;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) return emptyResult;

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('business_id', business.id)
    .maybeSingle();

  if (!chatbot) return emptyResult;

  // 1. Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, status, started_at, last_message_at, session_id')
    .eq('chatbot_id', chatbot.id);

  const convList = conversations || [];
  const totalConversations = convList.length;

  // 2. Fetch leads count
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbot.id);

  const totalLeads = leadsCount || 0;

  if (totalConversations === 0) {
    return {
      ...emptyResult,
      totalLeads,
    };
  }

  const convIds = convList.map((c) => c.id);

  // 3. Fetch messages for all conversations
  const { data: messages } = await supabase
    .from('messages')
    .select('id, conversation_id, role, content, answered, latency_ms, created_at')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: true });

  const msgList = messages || [];
  const totalMessages = msgList.length;

  const assistantMsgs = msgList.filter((m) => m.role === 'assistant');
  const totalAiReplies = assistantMsgs.length;

  const answeredMsgs = assistantMsgs.filter((m) => m.answered === true);
  const answerRate =
    totalAiReplies > 0
      ? Math.round((answeredMsgs.length / totalAiReplies) * 100)
      : 100;

  const handoverConvs = convList.filter((c) => c.status === 'handover').length;
  const handoverRate =
    totalConversations > 0
      ? Math.round((handoverConvs / totalConversations) * 100)
      : 0;

  const latencies = assistantMsgs
    .map((m) => m.latency_ms)
    .filter((l): l is number => typeof l === 'number');
  const avgLatencyMs =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;

  // 4. Calculate 14-day trend
  const now = new Date();
  const trendMap: Record<string, { conversations: number; aiReplies: number }> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    trendMap[dateStr] = { conversations: 0, aiReplies: 0 };
  }

  convList.forEach((c) => {
    const dateStr = c.started_at.split('T')[0];
    if (trendMap[dateStr]) {
      trendMap[dateStr].conversations += 1;
    }
  });

  assistantMsgs.forEach((m) => {
    const dateStr = m.created_at.split('T')[0];
    if (trendMap[dateStr]) {
      trendMap[dateStr].aiReplies += 1;
    }
  });

  const trend14Days: DayTrend[] = Object.entries(trendMap).map(([dateStr, data]) => {
    const parts = dateStr.split('-');
    const label = `${parts[2]}/${parts[1]}`;
    return {
      date: label,
      conversations: data.conversations,
      aiReplies: data.aiReplies,
    };
  });

  // 5. Calculate Hourly Distribution (00 to 23)
  const hourlyCounts = Array(24).fill(0);
  convList.forEach((c) => {
    const hour = new Date(c.started_at).getHours();
    if (hour >= 0 && hour < 24) {
      hourlyCounts[hour] += 1;
    }
  });

  const hourlyDistribution: HourDistribution[] = hourlyCounts.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    count,
  }));

  // 6. Find Unanswered Questions (user questions that resulted in answered = false or handover)
  const unansweredQuestions: UnansweredQuestion[] = [];
  const convMap = new Map(convList.map((c) => [c.id, c]));

  for (let i = 0; i < msgList.length; i++) {
    const current = msgList[i];
    if (current.role === 'user') {
      const next = msgList[i + 1];
      if (next && next.role === 'assistant' && next.answered === false) {
        const conv = convMap.get(current.conversation_id);
        unansweredQuestions.push({
          id: current.id,
          question: current.content,
          timestamp: current.created_at,
          session_id: conv ? conv.session_id : 'Unknown',
          conversation_id: current.conversation_id,
        });
      }
    }
  }

  return {
    totalConversations,
    totalMessages,
    totalAiReplies,
    answerRate,
    handoverRate,
    totalLeads,
    avgLatencyMs,
    trend14Days,
    hourlyDistribution,
    unansweredQuestions: unansweredQuestions.reverse().slice(0, 15), // top 15 recent
  };
}
