import fs from 'fs';
import path from 'path';
import { buildSystemPrompt } from '../src/lib/ai/prompt';
import { generateAICustomerReply } from '../src/lib/ai/respond';

async function runGoldenEval() {
  console.log('--------------------------------------------------');
  console.log('🤖 SIBISA AI Golden Test Suite Evaluator');
  console.log('--------------------------------------------------\n');

  const goldenPath = path.join(process.cwd(), 'tests', 'ai-golden.json');
  const testCases = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));

  const mockBusiness = {
    name: 'Kopi Kenangan Manis',
    category: 'kuliner',
    description: 'Cafe coffee shop hits dengan menu kopi susu gula aren terbaik.',
    address: 'Jl. Raya Utama No. 45, Jakarta Selatan',
    whatsapp: '6281234567890',
    maps_url: 'https://maps.app.goo.gl/sample',
    opening_hours: {
      mon: { open: '09:00', close: '21:00', closed: false },
      tue: { open: '09:00', close: '21:00', closed: false },
      wed: { open: '09:00', close: '21:00', closed: false },
      thu: { open: '09:00', close: '21:00', closed: false },
      fri: { open: '09:00', close: '21:00', closed: false },
      sat: { open: '09:00', close: '22:00', closed: false },
      sun: { open: '09:00', close: '22:00', closed: false },
    },
  };

  const mockKnowledge = [
    {
      type: 'product' as const,
      title: 'Kopi Susu Gula Aren Signature',
      content: 'Kopi espresso dengan susu segar dan gula aren murni.',
      price_min: 25000,
    },
    {
      type: 'product' as const,
      title: 'Paket Hair Cut & Styling',
      content: 'Cuci rambut dan potong gaya modern.',
      price_min: 75000,
    },
    {
      type: 'faq' as const,
      title: 'Apakah ada menu halal?',
      content: 'Semua produk 100% halal.',
    },
  ];

  const mockSettings = {
    name: 'Asisten Kopi Kenangan',
    tone: 'ramah' as const,
    fallback_message: 'Silakan hubungi admin kami via WhatsApp ya.',
  };

  const systemPrompt = buildSystemPrompt(mockBusiness, mockKnowledge, mockSettings);

  let passedCount = 0;
  const totalCount = testCases.length;

  for (const tc of testCases) {
    console.log(`[Test #${tc.id}] ${tc.description}`);
    console.log(`💬 User: "${tc.input}"`);

    const result = await generateAICustomerReply(
      systemPrompt,
      [{ role: 'user', content: tc.input }],
      mockSettings.fallback_message
    );

    const handoverMatch = result.needsHandover === tc.expected_handover;
    const passed = handoverMatch;

    if (passed) {
      passedCount++;
      console.log(`✅ LULUS (Handover: ${result.needsHandover}, Latency: ${result.latencyMs}ms)`);
    } else {
      console.log(`❌ GAGAL (Ekspektasi handover: ${tc.expected_handover}, Hasil: ${result.needsHandover})`);
    }

    console.log(`🤖 AI: "${result.reply}"\n`);
  }

  const passRate = Math.round((passedCount / totalCount) * 100);
  console.log('--------------------------------------------------');
  console.log(`Hasil Evaluasi: ${passedCount} / ${totalCount} Lulus (${passRate}%)`);
  console.log('--------------------------------------------------');

  if (passRate < 90) {
    console.error('Target evaluasi golden test ≥ 90% belum tercapai.');
    process.exit(1);
  }
}

runGoldenEval().catch((err) => {
  console.error('Error running golden evaluation:', err);
  process.exit(1);
});
