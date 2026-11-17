-- Run this once in Supabase: SQL Editor > New query > paste > Run

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  category text not null,
  expense_date date not null,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

-- Each user can only see and change their own rows
create policy "read own expenses"   on public.expenses for select using (auth.uid() = user_id);
create policy "insert own expenses" on public.expenses for insert with check (auth.uid() = user_id);
create policy "update own expenses" on public.expenses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own expenses" on public.expenses for delete using (auth.uid() = user_id);
