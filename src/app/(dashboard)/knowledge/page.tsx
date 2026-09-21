import { createClient } from '@/lib/supabase/server';
import { getKnowledgeCapacity } from '@/lib/actions/knowledge';
import { KnowledgeManager } from '@/components/dashboard/knowledge-manager';

export default async function KnowledgePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, category')
    .eq('owner_id', user?.id || '')
    .maybeSingle();

  const { data: items } = business
    ? await supabase
        .from('knowledge_items')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
    : { data: [] };

  const capacity = await getKnowledgeCapacity();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Knowledge Base & FAQ
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola katalog produk, daftar harga, FAQ, dan kebijakan usaha yang akan dijawab oleh AI Chatbot.
        </p>
      </div>

      <KnowledgeManager
        business={business}
        initialItems={items || []}
        capacity={capacity}
      />
    </div>
  );
}
