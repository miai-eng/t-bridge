-- T-Bridge Phase 1: core schema
-- Facilities, classrooms, children, staff, and staff-to-classroom assignments.
-- All data in development is fictional (see docs/data-policy.md).

-- ---------------------------------------------------------------------------
-- facilities
-- ---------------------------------------------------------------------------
create table public.facilities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- classrooms
-- Classes are reorganized every April, so each classroom belongs to one
-- fiscal year. Records (e.g. future handover logs) link to the classroom row
-- for that year, so history stays tied to the class the child was in then.
-- ---------------------------------------------------------------------------
create table public.classrooms (
  id           uuid primary key default gen_random_uuid(),
  facility_id  uuid not null references public.facilities (id) on delete restrict,
  -- Japanese fiscal year, identified by its starting year:
  -- fiscal_year 2026 = April 2026 to March 2027.
  fiscal_year  smallint not null check (fiscal_year between 2000 and 2100),
  name         text not null,
  -- Age class (0歳児 to 5歳児), based on the child's age on April 1.
  age_group    smallint not null check (age_group between 0 and 5),
  created_at   timestamptz not null default now(),
  unique (facility_id, fiscal_year, name)
);

-- ---------------------------------------------------------------------------
-- children
-- classroom_id is the child's current classroom.
-- Name readings let staff who cannot read kanji use kana or romaji.
-- ---------------------------------------------------------------------------
create table public.children (
  id                  uuid primary key default gen_random_uuid(),
  classroom_id        uuid not null references public.classrooms (id) on delete restrict,
  family_name         text not null,
  given_name          text not null,
  family_name_kana    text not null,
  given_name_kana     text not null,
  family_name_romaji  text not null,
  given_name_romaji   text not null,
  birth_date          date not null,
  created_at          timestamptz not null default now()
);

create index children_classroom_id_idx on public.children (classroom_id);

-- ---------------------------------------------------------------------------
-- staff
-- qualification matters for Phase 3: only certain qualifications count
-- toward Japan's staffing-ratio standards.
-- ---------------------------------------------------------------------------
create table public.staff (
  id                  uuid primary key default gen_random_uuid(),
  facility_id         uuid not null references public.facilities (id) on delete restrict,
  family_name         text not null,
  given_name          text not null,
  family_name_kana    text not null,
  given_name_kana     text not null,
  family_name_romaji  text not null,
  given_name_romaji   text not null,
  primary_language    text not null check (primary_language in ('ja', 'en')),
  qualification       text not null
                      check (qualification in ('hoikushi', 'kindergarten_teacher', 'nurse', 'none')),
  created_at          timestamptz not null default now()
);

comment on column public.staff.qualification is
  'hoikushi = licensed childcare worker (保育士); kindergarten_teacher = 幼稚園教諭; nurse = 看護師; none = unlicensed.';

create index staff_facility_id_idx on public.staff (facility_id);

-- ---------------------------------------------------------------------------
-- staff_assignments
-- A classroom may have several homeroom staff (e.g. a co-homeroom pair of an
-- English teacher and a Japanese childcare worker), so there is deliberately
-- no "one homeroom per classroom" constraint.
-- ---------------------------------------------------------------------------
create table public.staff_assignments (
  id            uuid primary key default gen_random_uuid(),
  staff_id      uuid not null references public.staff (id) on delete cascade,
  classroom_id  uuid not null references public.classrooms (id) on delete cascade,
  role          text not null check (role in ('homeroom', 'assistant', 'floating')),
  created_at    timestamptz not null default now(),
  unique (staff_id, classroom_id)
);

create index staff_assignments_classroom_id_idx on public.staff_assignments (classroom_id);

-- ---------------------------------------------------------------------------
-- Row-level security: enabled on every table. With no policies, the anon and
-- authenticated roles see nothing. Real policies arrive with auth; until then,
-- a separate temporary migration grants read-only access for development.
-- ---------------------------------------------------------------------------
alter table public.facilities        enable row level security;
alter table public.classrooms        enable row level security;
alter table public.children          enable row level security;
alter table public.staff             enable row level security;
alter table public.staff_assignments enable row level security;
