'use client';

import { useState } from 'react';
import { saveBusinessProfile, type BusinessFormValues } from '@/lib/actions/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Phone, Clock, Share2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  { value: 'kuliner', label: 'Kuliner (Cafe, Resto, Catering, Bakery)' },
  { value: 'salon', label: 'Jasa Perorangan (Barbershop, Salon, Spa)' },
  { value: 'travel', label: 'Travel & Wisata (Tour, Open Trip, Rental)' },
  { value: 'event', label: 'Event & Kreatif (Wedding Organizer, Dekorasi, Foto)' },
  { value: 'edukasi', label: 'Edukasi & Kesehatan (Bimbel, Kursus, Klinik)' },
  { value: 'ecommerce', label: 'E-Commerce & Fashion (Boutique, Online Shop)' },
  { value: 'properti', label: 'Properti & Real Estate (Agent, Indekost)' },
  { value: 'jasa_lainnya', label: 'Jasa Lainnya' },
];

const DAYS = [
  { key: 'mon', label: 'Senin' },
  { key: 'tue', label: 'Selasa' },
  { key: 'wed', label: 'Rabu' },
  { key: 'thu', label: 'Kamis' },
  { key: 'fri', label: 'Jumat' },
  { key: 'sat', label: 'Sabtu' },
  { key: 'sun', label: 'Minggu' },
];

export interface OpeningHourItem {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessData {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  maps_url?: string;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  opening_hours?: Record<string, OpeningHourItem>;
}

interface BusinessProfileFormProps {
  initialData?: BusinessData | null;
}

export function BusinessProfileForm({ initialData }: BusinessProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const defaultHours = DAYS.reduce((acc, day) => {
    acc[day.key] = initialData?.opening_hours?.[day.key] || {
      open: '09:00',
      close: '21:00',
      closed: false,
    };
    return acc;
  }, {} as Record<string, OpeningHourItem>);

  const [formData, setFormData] = useState<BusinessFormValues>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'kuliner',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    website: initialData?.website || '',
    maps_url: initialData?.maps_url || '',
    social_links: {
      instagram: initialData?.social_links?.instagram || '',
      tiktok: initialData?.social_links?.tiktok || '',
      facebook: initialData?.social_links?.facebook || '',
    },
    opening_hours: defaultHours,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await saveBusinessProfile(formData);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg('Profil bisnis berhasil disimpan!');
    }
    setLoading(false);
  };

  const handleHourChange = (dayKey: string, field: keyof OpeningHourItem, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [dayKey]: {
          open: '09:00',
          close: '21:00',
          closed: false,
          ...(prev.opening_hours?.[dayKey] || {}),
          [field]: value,
        },
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Informasi Utama Bisnis
          </CardTitle>
          <CardDescription>
            Detail identitas toko/usaha yang akan dipahami oleh AI Chatbot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Bisnis / Toko <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="misal: Kopi Kenangan Manis"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kategori Bisnis <span className="text-destructive">*</span>
              </label>
              <select
                className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Deskripsi Singkat Usaha</label>
            <textarea
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan jenis makanan, spesialisasi, atau layanan utama usaha kamu..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Phone className="h-5 w-5 text-secondary" />
            Kontak WhatsApp & Alamat
          </CardTitle>
          <CardDescription>
            Digunakan saat AI melakukan handover percakapan ke admin manusia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nomor WhatsApp Handover <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="6281234567890 (Tanpa tanda +)"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Nomor ini yang akan dihubungi pelanggan saat butuh admin manusia.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nomor Telepon Toko (Opsional)</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="021-5551234"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Alamat Fisik / Lokasi Toko</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jl. Raya Utama No. 45, Jakarta Selatan"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Link Google Maps (Maps URL)</label>
              <Input
                value={formData.maps_url}
                onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Website (URL)</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://tokoku.id"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Jam Operasional Toko
          </CardTitle>
          <CardDescription>
            AI SIBISA akan otomatis menjawab pertanyaan pelanggan mengenai jam buka toko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const hourState: OpeningHourItem = formData.opening_hours?.[day.key] || {
                open: '09:00',
                close: '21:00',
                closed: false,
              };

              return (
                <div
                  key={day.key}
                  className="flex flex-col gap-2 rounded-xl border border-border p-3 sm:flex-row sm:items-center sm:justify-between bg-card"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`closed-${day.key}`}
                      checked={!hourState.closed}
                      onChange={(e) => handleHourChange(day.key, 'closed', !e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor={`closed-${day.key}`} className="text-xs font-bold text-foreground w-16">
                      {day.label}
                    </label>
                  </div>

                  {hourState.closed ? (
                    <span className="text-xs font-semibold text-muted-foreground italic px-2 py-1 bg-muted rounded-md">
                      Tutup / Libur
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hourState.open}
                        onChange={(e) => handleHourChange(day.key, 'open', e.target.value)}
                        className="h-9 w-28 text-xs"
                      />
                      <span className="text-xs text-muted-foreground font-bold">s/d</span>
                      <Input
                        type="time"
                        value={hourState.close}
                        onChange={(e) => handleHourChange(day.key, 'close', e.target.value)}
                        className="h-9 w-28 text-xs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-500" />
            Media Sosial Usaha
          </CardTitle>
          <CardDescription>
            Membantu AI memberikan link sosmed resmi saat ditanyakan pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Instagram</label>
              <Input
                value={formData.social_links?.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...(formData.social_links || {}), instagram: e.target.value },
                  })
                }
                placeholder="@tokoku.id"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">TikTok</label>
              <Input
                value={formData.social_links?.tiktok || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...(formData.social_links || {}), tiktok: e.target.value },
                  })
                }
                placeholder="@tokoku_official"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Facebook Page</label>
              <Input
                value={formData.social_links?.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_links: { ...(formData.social_links || {}), facebook: e.target.value },
                  })
                }
                placeholder="TokoKu Official"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button size="lg" type="submit" className="gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Menyimpan Profil...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Simpan Profil Bisnis
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
