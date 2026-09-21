export interface FaqTemplateItem {
  type: 'product' | 'faq' | 'policy';
  title: string;
  content: string;
  price_min?: number;
  price_max?: number;
  price_note?: string;
  duration?: string;
}

export const FAQ_TEMPLATES: Record<string, FaqTemplateItem[]> = {
  kuliner: [
    {
      type: 'faq',
      title: 'Jam berapa toko/restoran buka?',
      content: 'Kami buka setiap hari Senin - Minggu dari jam 10:00 hingga 22:00 WIB.',
    },
    {
      type: 'faq',
      title: 'Apakah ada menu halal / opsi vegetarian?',
      content: 'Semua hidangan kami 100% halal dan kami menyediakan beberapa pilihan menu vegetarian pilihan.',
    },
    {
      type: 'faq',
      title: 'Bagaimana cara pemesanan / reservasi meja?',
      content: 'Pemesanan meja atau pesanan makanan jumlah besar dapat langsung mengontak admin kami via WhatsApp.',
    },
    {
      type: 'policy',
      title: 'Kebijakan Pengiriman & Pesanan Antar',
      content: 'Pengiriman pesanan menggunakan layanan Ojek Online (GoSend/GrabExpress) dengan ongkir ditanggung pembeli.',
    },
  ],
  salon: [
    {
      type: 'faq',
      title: 'Apakah harus booking jadwal terlebih dahulu?',
      content: 'Sangat disarankan untuk booking H-1 agar kamu mendapatkan slot jadwal tanpa perlu mengantre.',
    },
    {
      type: 'product',
      title: 'Paket Hair Cut & Styling',
      content: 'Termasuk cuci rambut, potong rambut dengan stylist profesional, dan hair styling.',
      price_min: 75000,
      price_max: 150000,
      duration: '45 menit',
    },
    {
      type: 'policy',
      title: 'Kebijakan Keterlambatan Booking',
      content: 'Batas toleransi keterlambatan adalah 15 menit dari jam booking. Lewat dari itu jadwal akan disesuaikan kembali.',
    },
  ],
  travel: [
    {
      type: 'faq',
      title: 'Fasilitas apa saja yang termasuk dalam paket tour?',
      content: 'Paket tour kami sudah termasuk transportasi AC, dokumentasi foto, tiket masuk wisata, dan makan sesuai itinerary.',
    },
    {
      type: 'policy',
      title: 'Syarat Pembayaran & Pembatalan Tour',
      content: 'DP minimal 30% saat booking. Pembatalan H-3 DP hangus, pembatalan H-7 mendapatkan pengembalian 50% DP.',
    },
  ],
  event: [
    {
      type: 'faq',
      title: 'Berapa lama estimasi pengerjaan / persiapan event?',
      content: 'Untuk acara pernikahan/event besar minimal konsul H-30 hari. Untuk party kecil H-7 hari.',
    },
    {
      type: 'policy',
      title: 'Metode Pembayaran Event',
      content: 'Pembayaran dilakukan 3 tahap: DP 30% saat kontrak, 50% H-7 acara, dan pelunasan 20% pada hari H.',
    },
  ],
  edukasi: [
    {
      type: 'faq',
      title: 'Apakah ada kelas online dan tatap muka?',
      content: 'Kami menyediakan kelas online via Zoom dan kelas offline terbatas dengan jadwal fleksibel.',
    },
    {
      type: 'policy',
      title: 'Kebijakan Refund Bimbingan Belajar',
      content: 'Biaya pendaftaran yang sudah dibayarkan tidak dapat dikembalikan namun dapat dipindahtangankan ke peserta lain.',
    },
  ],
  ecommerce: [
    {
      type: 'faq',
      title: 'Berapa lama proses pengemasan dan kirim?',
      content: 'Pesanan di bawah jam 15:00 WIB dikirim di hari yang sama. Pengiriman menggunakan JNE, J&T, SiCepat, dan Sameday.',
    },
    {
      type: 'policy',
      title: 'Kebijakan Retur / Garansi Produk',
      content: 'Garansi retur 3 hari setelah barang diterima wajib menyertakan video unboxing tanpa terputus.',
    },
  ],
  properti: [
    {
      type: 'faq',
      title: 'Bagaimana prosedur survei lokasi rumah/unit?',
      content: 'Survei lokasi gratis setiap hari Sabtu & Minggu jam 09:00 - 16:00 dengan janji temu via admin WhatsApp.',
    },
    {
      type: 'policy',
      title: 'Syarat Pengajuan KPR / Cash Bertahap',
      content: 'Persyaratan KPR mencakup KTP, NPWP, Slip Gaji 3 bulan terakhir, dan Rekening Koran 3 bulan.',
    },
  ],
};
