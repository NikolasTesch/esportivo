-- ============================================================
-- Schema da Corrida pela Consciência — tabela de inscrições
-- Rode no Supabase: Dashboard > SQL Editor > New query > cole > Run
-- ============================================================

create table if not exists public.inscricoes (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- dados pessoais (informados antes do pagamento)
  nome              text not null,
  email             text not null,
  telefone          text not null,
  cpf               text not null,
  data_nascimento   date not null,

  -- categoria da corrida
  genero            text not null check (genero in ('masculino','feminino')),
  faixa_etaria      text not null,
  distancia         text not null check (distancia in ('5K','10K','21K')),
  tamanho_camisa    text not null,
  kit               text not null default 'basico',

  -- pagamento (confirmado pelo webhook do Mercado Pago)
  status            text not null default 'pendente'
                       check (status in ('pendente','pago','cancelado')),
  amount_cents      integer,
  payment_method    text,            -- 'credit_card', 'pix', etc. (preenchido pelo webhook)
  provider          text not null default 'mercadopago'
                       check (provider in ('mercadopago','stripe','pix','infinitepay')),
  stripe_session_id text unique,     -- legado (fluxo /contratar via Stripe)
  order_nsu         text unique,     -- preference_id do Mercado Pago
  paid_at           timestamptz
);

create index if not exists inscricoes_status_idx on public.inscricoes (status);
create index if not exists inscricoes_created_idx on public.inscricoes (created_at desc);

-- RLS ligado: nenhuma policy pública. Todo acesso é via service_role
-- (server-side), que ignora RLS. O browser nunca toca esta tabela.
alter table public.inscricoes enable row level security;

-- ------------------------------------------------------------
-- MIGRAÇÃO: se a tabela já existia, rode apenas este bloco.
-- ------------------------------------------------------------
-- alter table public.inscricoes
--   drop constraint if exists inscricoes_provider_check;
-- alter table public.inscricoes
--   add constraint inscricoes_provider_check
--     check (provider in ('mercadopago','stripe','pix','infinitepay'));
