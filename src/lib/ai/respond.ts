import { GoogleGenAI, type Schema } from '@google/genai';
import { env } from '@/lib/env';
import { CUSTOMER_REPLY_SCHEMA, CustomerReplyOutput } from './schema';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponseResult {
  reply: string;
  needsHandover: boolean;
  handoverReason?: string;
  leadIntent: 'none' | 'interested' | 'ready_to_book';
  suggestedCta?: string;
  latencyMs: number;
}

export async function generateAICustomerReply(
  systemPrompt: string,
  messagesHistory: ChatMessageInput[],
  fallbackMessage: string
): Promise<AIResponseResult> {
  const startTime = Date.now();

  const fallbackResult: AIResponseResult = {
    reply: fallbackMessage || 'Maaf, untuk pertanyaan ini silakan hubungi admin kami via WhatsApp ya.',
    needsHandover: true,
    handoverReason: 'AI unavailable or fallback triggered',
    leadIntent: 'none',
    suggestedCta: 'whatsapp',
    latencyMs: Date.now() - startTime,
  };

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey || apiKey === '' || apiKey.startsWith('sk-ant-')) {
    console.warn('[SIBISA AI] GEMINI_API_KEY not configured. Returning fallback reply.');
    return fallbackResult;
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Format message history (limit to last 6 messages)
  const recentMessages = messagesHistory.slice(-6);
  const contents = recentMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Promise with 15-second timeout
  const timeoutMs = 15000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI API request timed out after 15 seconds')), timeoutMs)
  );

  const fetchAIResponse = async (): Promise<CustomerReplyOutput> => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: CUSTOMER_REPLY_SCHEMA as unknown as Schema,
        maxOutputTokens: env.AI_MAX_OUTPUT_TOKENS,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini API');
    }

    const parsed: CustomerReplyOutput = JSON.parse(text);
    return parsed;
  };

  try {
    // Execute with 1x retry on failure
    let parsedOutput: CustomerReplyOutput;
    try {
      parsedOutput = await Promise.race([fetchAIResponse(), timeoutPromise]);
    } catch (firstErr) {
      console.warn('[SIBISA AI] First attempt failed, retrying once...', firstErr);
      parsedOutput = await Promise.race([fetchAIResponse(), timeoutPromise]);
    }

    const latencyMs = Date.now() - startTime;

    return {
      reply: parsedOutput.message || fallbackMessage,
      needsHandover: Boolean(parsedOutput.needs_handover),
      handoverReason: parsedOutput.handover_reason || undefined,
      leadIntent: parsedOutput.lead_intent || 'none',
      suggestedCta: parsedOutput.suggested_cta || undefined,
      latencyMs,
    };
  } catch (err) {
    console.error('[SIBISA AI] Error generating AI customer reply:', err);
    return {
      ...fallbackResult,
      latencyMs: Date.now() - startTime,
    };
  }
}
