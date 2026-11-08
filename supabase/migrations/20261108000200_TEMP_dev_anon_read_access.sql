-- ===========================================================================
-- TEMPORARY: development-only anonymous read access.
--
-- Lets the publishable key (anon role) read every Phase 1 table so the
-- classroom page works before auth exists. This is acceptable ONLY because
-- all data is fictional (docs/data-policy.md).
--
-- REMOVE when auth and real RLS policies are built. Applied migrations
-- should not be edited or deleted, so add a new migration containing:
--
--   drop policy "TEMP dev anon read" on public.facilities;
--   drop policy "TEMP dev anon read" on public.classrooms;
--   drop policy "TEMP dev anon read" on public.children;
--   drop policy "TEMP dev anon read" on public.staff;
--   drop policy "TEMP dev anon read" on public.staff_assignments;
--   revoke select on public.facilities, public.classrooms, public.children,
--     public.staff, public.staff_assignments from anon;
-- ===========================================================================

grant select on public.facilities,
                public.classrooms,
                public.children,
                public.staff,
                public.staff_assignments
  to anon;

create policy "TEMP dev anon read" on public.facilities
  for select to anon using (true);

create policy "TEMP dev anon read" on public.classrooms
  for select to anon using (true);

create policy "TEMP dev anon read" on public.children
  for select to anon using (true);

create policy "TEMP dev anon read" on public.staff
  for select to anon using (true);

create policy "TEMP dev anon read" on public.staff_assignments
  for select to anon using (true);
