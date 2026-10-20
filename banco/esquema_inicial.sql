-- Sistema de Retenção e Reengajamento de Alunos para Academias
-- Esquema inicial do banco (PostgreSQL / Supabase) — versão preliminar.
-- Ainda em construção: faltam as regras de acesso, os perfis de usuário
-- e as tabelas de intervenções.

create table academias (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  cnpj       text unique,
  email      text,
  telefone   text,
  cidade     text,
  criado_em  timestamptz not null default now()
);

create table planos (
  id            uuid primary key default gen_random_uuid(),
  academia_id   uuid not null references academias (id),
  nome          text not null,
  valor_mensal  numeric(10, 2) not null,
  duracao_meses smallint not null default 1,
  ativo         boolean not null default true
);

create table alunos (
  id             uuid primary key default gen_random_uuid(),
  academia_id    uuid not null references academias (id),
  plano_id       uuid references planos (id),
  nome           text not null,
  email          text,
  telefone       text,
  data_matricula date not null default current_date,
  status         text not null default 'ativo'
                 check (status in ('ativo', 'inativo', 'cancelado')),
  criado_em      timestamptz not null default now()
);

create table frequencias (
  id         bigint generated always as identity primary key,
  aluno_id   uuid not null references alunos (id),
  data_hora  timestamptz not null default now()
);
