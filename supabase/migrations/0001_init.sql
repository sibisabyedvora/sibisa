-- supabase/migrations/0001_init.sql
create extension if not exists pgcrypto;

-- 1. Businesses
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  address text,
  phone text,
  whatsapp text,
  website text,
  maps_url text,
  social_links jsonb not null default '{}',
  opening_hours jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Chatbots
create table chatbots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references businesses(id) on delete cascade,
  public_key text not null unique,
  name text not null default 'Asisten',
  greeting text not null default 'Halo! Ada yang bisa kami bantu?',
  tone text not null default 'ramah' check (tone in ('ramah','formal','santai')),
  fallback_message text not null default 'Maaf, untuk hal ini silakan hubungi admin kami ya.',
  primary_color text not null default '#4F46E5',
  position text not null default 'bottom-right' check (position in ('bottom-right','bottom-left')),
  allowed_domains text[] not null default '{}',
  wa_cta_text text not null default 'Lanjut chat via WhatsApp',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Knowledge Items
create table knowledge_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  type text not null check (type in ('product','faq','policy')),
  title text not null,
  content text not null,
  price_min numeric,
  price_max numeric,
  price_note text,
  duration text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_knowledge_items_business_active on knowledge_items (business_id, type) where is_active;

-- 4. Conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  session_id text not null,
  visitor_meta jsonb not null default '{}',
  status text not null default 'open' check (status in ('open','handover','closed')),
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (chatbot_id, session_id)
);

-- 5. Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  answered boolean,
  lead_intent text,
  tokens_in int,
  tokens_out int,
  latency_ms int,
  created_at timestamptz not null default now()
);
create index idx_messages_conversation_created on messages (conversation_id, created_at);

-- 6. Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  name text,
  contact text,
  note text,
  source text not null check (source in ('whatsapp_click','form','quotation')),
  status text not null default 'new' check (status in ('new','contacted','won','lost')),
  created_at timestamptz not null default now()
);

-- 7. Subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('trial','basic')),
  status text not null default 'trialing' check (status in ('trialing','active','past_due','expired','canceled')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- 8. Payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  order_id text not null unique,
  amount int not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','expired')),
  provider text not null default 'midtrans',
  provider_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- 9. Usage Counters
create table usage_counters (
  chatbot_id uuid not null references chatbots(id) on delete cascade,
  period date not null,
  ai_replies int not null default 0,
  primary key (chatbot_id, period)
);

-- Functions & Triggers
create or replace function increment_usage(p_chatbot uuid, p_period date) returns int language sql as $$
  insert into usage_counters (chatbot_id, period, ai_replies) values (p_chatbot, p_period, 1)
  on conflict (chatbot_id, period) do update set ai_replies = usage_counters.ai_replies + 1
  returning ai_replies;
$$;

create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into subscriptions (owner_id, plan, status, trial_ends_at)
  values (new.id, 'trial', 'trialing', now() + interval '14 days');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Row Level Security (RLS)
alter table businesses enable row level security;
create policy owner_all_businesses on businesses for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

alter table chatbots enable row level security;
create policy owner_all_chatbots on chatbots for all
  using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

alter table knowledge_items enable row level security;
create policy owner_all_knowledge_items on knowledge_items for all
  using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

alter table conversations enable row level security;
create policy owner_all_conversations on conversations for all
  using (chatbot_id in (select id from chatbots where business_id in (select id from businesses where owner_id = auth.uid())));

alter table messages enable row level security;
create policy owner_all_messages on messages for all
  using (conversation_id in (select id from conversations where chatbot_id in (select id from chatbots where business_id in (select id from businesses where owner_id = auth.uid()))));

alter table leads enable row level security;
create policy owner_all_leads on leads for all
  using (chatbot_id in (select id from chatbots where business_id in (select id from businesses where owner_id = auth.uid())));

alter table subscriptions enable row level security;
create policy owner_read_subscriptions on subscriptions for select using (owner_id = auth.uid());

alter table payments enable row level security;
create policy owner_read_payments on payments for select using (owner_id = auth.uid());
