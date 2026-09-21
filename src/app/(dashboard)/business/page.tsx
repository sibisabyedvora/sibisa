import { createClient } from '@/lib/supabase/server';
import { BusinessProfileForm } from '@/components/dashboard/business-profile-form';

export default async function BusinessProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user?.id || '')
    .maybeSingle();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Profil Bisnis
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Informasi profil ini digunakan oleh AI SIBISA untuk menjawab pertanyaan umum pelanggan 24/7.
        </p>
      </div>

      <BusinessProfileForm initialData={business} />
    </div>
  );
}
