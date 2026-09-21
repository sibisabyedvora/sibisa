'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  upsertKnowledgeItem,
  deleteKnowledgeItem,
  applyFaqTemplate,
  type KnowledgeFormValues,
} from '@/lib/actions/knowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Plus,
  Sparkles,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  FileText,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export interface KnowledgeItem {
  id: string;
  business_id: string;
  type: 'product' | 'faq' | 'policy';
  title: string;
  content: string;
  price_min?: number | null;
  price_max?: number | null;
  price_note?: string | null;
  duration?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
}

interface KnowledgeManagerProps {
  business?: BusinessItem | null;
  initialItems: KnowledgeItem[];
  capacity: { totalChars: number; maxChars: number; percentage: number };
}

export function KnowledgeManager({ business, initialItems, capacity }: KnowledgeManagerProps) {
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplateCat, setSelectedTemplateCat] = useState(business?.category || 'kuliner');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<KnowledgeFormValues>({
    type: 'faq',
    title: '',
    content: '',
    price_min: null,
    price_max: null,
    price_note: '',
    duration: '',
    is_active: true,
  });

  if (!business) {
    return (
      <Card className="border border-amber-200 bg-amber-50 p-6 text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto" />
        <h3 className="text-lg font-bold text-amber-950">Profil Bisnis Belum Diisi</h3>
        <p className="text-xs text-amber-800 max-w-md mx-auto">
          Kamu perlu membuat profil bisnis terlebih dahulu sebelum dapat menambah item pengetahuan atau FAQ.
        </p>
        <Link href="/business">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">Isi Profil Bisnis</Button>
        </Link>
      </Card>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      type: 'faq',
      title: '',
      content: '',
      price_min: null,
      price_max: null,
      price_note: '',
      duration: '',
      is_active: true,
    });
    setErrorMsg('');
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (item: KnowledgeItem) => {
    setFormData({
      id: item.id,
      type: item.type,
      title: item.title,
      content: item.content,
      price_min: item.price_min,
      price_max: item.price_max,
      price_note: item.price_note || '',
      duration: item.duration || '',
      is_active: item.is_active,
    });
    setErrorMsg('');
    setIsDialogOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await upsertKnowledgeItem(formData);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setIsDialogOpen(false);
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus item ini?')) return;
    const res = await deleteKnowledgeItem(id);
    if (res.error) {
      alert(res.error);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleApplyTemplate = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await applyFaqTemplate(selectedTemplateCat);
    if (res.error) {
      alert(res.error);
    } else {
      setIsTemplateDialogOpen(false);
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Capacity Indicator Bar */}
      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Kapasitas Memory Knowledge AI</span>
              <span className="text-xs font-semibold text-muted-foreground">
                ({capacity.totalChars.toLocaleString('id-ID')} / {capacity.maxChars.toLocaleString('id-ID')} Karakter)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Semua data aktif dimasukkan ke memory AI agar jawaban 100% akurat tanpa halusinasi.
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
              capacity.percentage > 90
                ? 'bg-red-100 text-red-700'
                : capacity.percentage > 70
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {capacity.percentage}% Terpakai
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              capacity.percentage > 90
                ? 'bg-destructive'
                : capacity.percentage > 70
                ? 'bg-amber-500'
                : 'bg-primary'
            }`}
            style={{ width: `${capacity.percentage}%` }}
          />
        </div>

        {capacity.percentage >= 100 && (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>
              Kapasitas maksimum 10.000 karakter telah tercapai. Hapus atau nonaktifkan item lama untuk menambah data baru.
            </span>
          </div>
        )}
      </Card>

      {/* Control Bar & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterType === 'product'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Produk & Layanan
          </button>
          <button
            onClick={() => setFilterType('faq')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterType === 'faq'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            FAQ (Tanya Jawab)
          </button>
          <button
            onClick={() => setFilterType('policy')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterType === 'policy'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Kebijakan
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTemplateDialogOpen(true)}
            className="gap-2 text-xs"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Template FAQ
          </Button>

          <Button size="sm" onClick={handleOpenAddModal} className="gap-2 text-xs shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari produk, pertanyaan FAQ, atau kebijakan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items List Grid */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-base font-bold text-foreground">Belum Ada Data Knowledge</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Tambah item produk, FAQ, atau gunakan template FAQ kategori untuk langsung mengisi data tokomu.
          </p>
          <Button size="sm" onClick={handleOpenAddModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Data Pertama
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => {
            const isProduct = item.type === 'product';
            const isFaq = item.type === 'faq';
            const charCount = (item.title?.length || 0) + (item.content?.length || 0);

            return (
              <Card key={item.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                          isProduct
                            ? 'bg-indigo-100 text-indigo-700'
                            : isFaq
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isProduct && <Package className="h-3.5 w-3.5" />}
                        {isFaq && <HelpCircle className="h-3.5 w-3.5" />}
                        {!isProduct && !isFaq && <FileText className="h-3.5 w-3.5" />}
                        {isProduct ? 'Produk / Layanan' : isFaq ? 'FAQ' : 'Kebijakan'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-foreground leading-snug">{item.title}</h4>

                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  {/* Product Specific Metadata */}
                  {isProduct && (item.price_min || item.price_note || item.duration) && (
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                      {item.price_min && (
                        <span className="rounded-md bg-muted px-2 py-1 text-foreground">
                          Rp {item.price_min.toLocaleString('id-ID')}
                          {item.price_max ? ` - Rp ${item.price_max.toLocaleString('id-ID')}` : ''}
                        </span>
                      )}
                      {item.price_note && (
                        <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                          ({item.price_note})
                        </span>
                      )}
                      {item.duration && (
                        <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                          Durasi: {item.duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{charCount} karakter</span>
                  <span className={item.is_active ? 'text-emerald-600 font-semibold' : 'text-muted-foreground'}>
                    {item.is_active ? '● Aktif' : '○ Nonaktif'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Add / Edit Item */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Item Knowledge' : 'Tambah Item Knowledge Baru'}</DialogTitle>
            <DialogDescription>
              Informasi ini akan langsung dimasukkan ke dalam memory AI SIBISA.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveItem} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Tipe Informasi</label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'product' | 'faq' | 'policy' })}
              >
                <option value="faq">FAQ (Pertanyaan & Jawaban)</option>
                <option value="product">Produk atau Layanan</option>
                <option value="policy">Kebijakan / Ketentuan Toko</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {formData.type === 'faq' ? 'Pertanyaan Pelanggan' : 'Nama Produk / Judul Kebijakan'}
              </label>
              <Input
                placeholder={formData.type === 'faq' ? 'misal: Buka jam berapa hari Minggu?' : 'misal: Paket Foto Wedding Basic'}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {formData.type === 'faq' ? 'Jawaban Lengkap' : 'Deskripsi Penjelasan'}
              </label>
              <textarea
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tuliskan penjelasan detail yang akan dijawab AI kepada pelanggan..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            {formData.type === 'product' && (
              <div className="space-y-3 pt-1 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Harga Min (Rp)</label>
                    <Input
                      type="number"
                      placeholder="75000"
                      value={formData.price_min || ''}
                      onChange={(e) => setFormData({ ...formData, price_min: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Harga Max (Rp)</label>
                    <Input
                      type="number"
                      placeholder="150000"
                      value={formData.price_max || ''}
                      onChange={(e) => setFormData({ ...formData, price_max: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Catatan Harga</label>
                    <Input
                      placeholder="misal: per porsi / net"
                      value={formData.price_note || ''}
                      onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Durasi Layanan</label>
                    <Input
                      placeholder="misal: 45 menit"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Data'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Dialog Apply FAQ Template */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Terapkan Template FAQ Kategori
            </DialogTitle>
            <DialogDescription>
              Isi otomatis draf FAQ standar sesuai jenis usahamu. Data ini bisa kamu ubah kapan saja.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pilih Kategori Usaha</label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedTemplateCat}
                onChange={(e) => setSelectedTemplateCat(e.target.value)}
              >
                <option value="kuliner">Kuliner & Restaurant</option>
                <option value="salon">Barbershop, Salon & Spa</option>
                <option value="travel">Travel & Wisata</option>
                <option value="event">Wedding Organizer & Event</option>
                <option value="edukasi">Edukasi & Les Privat</option>
                <option value="ecommerce">E-Commerce & Online Shop</option>
                <option value="properti">Properti & Real Estate</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleApplyTemplate} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Terapkan Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
