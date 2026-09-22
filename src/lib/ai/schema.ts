export interface CustomerReplyOutput {
  message: string;
  needs_handover: boolean;
  handover_reason?: string;
  lead_intent: 'none' | 'interested' | 'ready_to_book';
  suggested_cta?: 'none' | 'whatsapp' | 'booking' | 'catalog' | 'quotation';
}

export const CUSTOMER_REPLY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    message: {
      type: 'STRING',
      description: 'Balasan untuk pelanggan, ramah, singkat, dan jelas (maks ±4 kalimat).',
    },
    needs_handover: {
      type: 'BOOLEAN',
      description: 'Set true jika informasi tidak ada di business_data atau pertanyaan butuh tindakan manusia (negosiasi, komplain, kepastian stok real-time, pembayaran).',
    },
    handover_reason: {
      type: 'STRING',
      description: 'Alasan singkat kenapa butuh handover (misal: "stok real-time", "negosiasi harga").',
    },
    lead_intent: {
      type: 'STRING',
      enum: ['none', 'interested', 'ready_to_book'],
      description: 'Tingkat ketertarikan pelanggan: none (tanya biasa), interested (tertarik paket/produk), ready_to_book (siap pesan/booking).',
    },
    suggested_cta: {
      type: 'STRING',
      enum: ['none', 'whatsapp', 'booking', 'catalog', 'quotation'],
      description: 'Rekomendasi tindakan aksi untuk pelanggan.',
    },
  },
  required: ['message', 'needs_handover', 'lead_intent'],
};
