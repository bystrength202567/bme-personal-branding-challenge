-- 달빛 한국사 여행: Supabase SQL Editor에 그대로 붙여 넣고 Run 하세요.
-- 회원 정보(members)와 학습 기록(progress)을 저장하고, 각 회원은 자기 정보만 읽고 쓸 수 있어요(RLS).

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null check (char_length(name) between 1 and 20),
  country text not null,
  age_group text not null check (age_group in ('14plus', 'under14')),
  guardian_email text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  -- 만 14세 미만은 보호자 이메일이 있어야 해요
  constraint guardian_required check (age_group = '14plus' or guardian_email is not null)
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stamps jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.progress enable row level security;

create policy "members: read own" on public.members for select using (auth.uid() = id);
create policy "members: insert own" on public.members for insert with check (auth.uid() = id);
create policy "members: update own" on public.members for update using (auth.uid() = id);
create policy "progress: read own" on public.progress for select using (auth.uid() = user_id);
create policy "progress: insert own" on public.progress for insert with check (auth.uid() = user_id);
create policy "progress: update own" on public.progress for update using (auth.uid() = user_id);

-- 회원 탈퇴: 로그인한 본인의 계정과 모든 기록을 지워요 (members·progress는 cascade로 함께 지워져요)
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
