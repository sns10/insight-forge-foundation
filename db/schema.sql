-- Learning Intelligence System: core content + attempts schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL).

-- =========================================================
-- 1. Roles (separate table to avoid privilege escalation)
-- =========================================================
do $$ begin
  create type public.app_role as enum ('student', 'teacher', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

drop policy if exists "Users can read their own roles" on public.user_roles;
create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- =========================================================
-- 2. Content tables
-- =========================================================
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  description text
);

create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  name text not null,
  description text
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts(id) on delete cascade,
  question text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_option text,
  difficulty text,
  explanation text
);

create index if not exists chapters_subject_id_idx on public.chapters(subject_id);
create index if not exists concepts_chapter_id_idx on public.concepts(chapter_id);
create index if not exists questions_concept_id_idx on public.questions(concept_id);

grant select, insert, update, delete on
  public.subjects, public.chapters, public.concepts, public.questions
  to authenticated;
grant all on
  public.subjects, public.chapters, public.concepts, public.questions
  to service_role;

alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.concepts enable row level security;
alter table public.questions enable row level security;

-- Students (any authenticated user): read only
drop policy if exists "Authenticated can read subjects" on public.subjects;
create policy "Authenticated can read subjects" on public.subjects
  for select to authenticated using (true);

drop policy if exists "Authenticated can read chapters" on public.chapters;
create policy "Authenticated can read chapters" on public.chapters
  for select to authenticated using (true);

drop policy if exists "Authenticated can read concepts" on public.concepts;
create policy "Authenticated can read concepts" on public.concepts
  for select to authenticated using (true);

drop policy if exists "Authenticated can read questions" on public.questions;
create policy "Authenticated can read questions" on public.questions
  for select to authenticated using (true);

-- Teachers / admins: full manage
drop policy if exists "Teachers manage subjects" on public.subjects;
create policy "Teachers manage subjects" on public.subjects
  for all to authenticated
  using (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Teachers manage chapters" on public.chapters;
create policy "Teachers manage chapters" on public.chapters
  for all to authenticated
  using (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Teachers manage concepts" on public.concepts;
create policy "Teachers manage concepts" on public.concepts
  for all to authenticated
  using (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Teachers manage questions" on public.questions;
create policy "Teachers manage questions" on public.questions
  for all to authenticated
  using (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'teacher') or public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 3. Question attempts
-- =========================================================
create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option text,
  correct boolean,
  response_time integer,
  attempt_number integer,
  hint_used boolean,
  created_at timestamptz not null default now()
);

create index if not exists question_attempts_student_idx on public.question_attempts(student_id);
create index if not exists question_attempts_question_idx on public.question_attempts(question_id);

grant select, insert on public.question_attempts to authenticated;
grant all on public.question_attempts to service_role;

alter table public.question_attempts enable row level security;

drop policy if exists "Students read own attempts" on public.question_attempts;
create policy "Students read own attempts" on public.question_attempts
  for select to authenticated
  using (auth.uid() = student_id
    or public.has_role(auth.uid(), 'teacher')
    or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Students insert own attempts" on public.question_attempts;
create policy "Students insert own attempts" on public.question_attempts
  for insert to authenticated
  with check (auth.uid() = student_id);
