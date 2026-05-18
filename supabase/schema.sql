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

  -- pagamento (preenchido/validado pelo webhook do Stripe)
  status            text not null default 'pendente'
                       check (status in ('pendente','pago','cancelado')),
  amount_cents      integer,
  payment_method    text,
  stripe_session_id text unique,
  paid_at           timestamptz
);

create index if not exists inscricoes_status_idx on public.inscricoes (status);
create index if not exists inscricoes_created_idx on public.inscricoes (created_at desc);

-- RLS ligado: nenhuma policy pública. Todo acesso é via service_role
-- (server-side), que ignora RLS. O browser nunca toca esta tabela.
alter table public.inscricoes enable row level security;
