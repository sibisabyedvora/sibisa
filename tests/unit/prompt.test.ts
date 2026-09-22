import { buildSystemPrompt } from '../../src/lib/ai/prompt';

export function runPromptTest() {
  const business = {
    name: 'Toko Buku Cerdas',
    category: 'edukasi',
    description: 'Toko buku pelajaran dan umum lengkap.',
    whatsapp: '6281234567890',
  };

  const knowledgeItems = [
    {
      type: 'faq' as const,
      title: 'Apakah ada diskon?',
      content: 'Diskon 10% untuk pembelian di atas Rp100.000.',
    },
  ];

  const chatbot = {
    name: 'Asisten Cerdas',
    tone: 'formal' as const,
    fallback_message: 'Admin akan membantu.',
  };

  const prompt = buildSystemPrompt(business, knowledgeItems, chatbot);

  if (!prompt.includes('Toko Buku Cerdas') || !prompt.includes('<business_data>')) {
    throw new Error('Prompt builder test failed!');
  }
  return true;
}
