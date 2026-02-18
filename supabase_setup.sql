-- Tabela de Submissões
create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  answers jsonb,
  completed boolean default false
);

-- Habilitar RLS (Row Level Security) é recomendado
alter table submissions enable row level security;

-- Política para permitir inserção pública (qualquer um pode enviar respostas)
create policy "Enable insert for everyone" on submissions for insert with check (true);

-- Política para permitir leitura apenas para admins (aqui simplificado para todos, ajuste conforme necessário)
-- Em produção, você deve restringir isso
create policy "Enable read access for all users" on submissions for select using (true);