# T-Bridge

A bilingual handover and staff-development tool for international preschools.

*The "T" stands for the point where different cultures cross, and for Teaching and Team: the bridge this tool builds between staff.*

> **Status:** Phase 1 foundation is in place: Next.js + Supabase schema with RLS, fictional seed data, and a classroom list page. Phases 2–4 are not started yet.

## The problem

In bilingual preschools, English-speaking and Japanese-speaking staff work side by side, but information is often lost at handovers. Many native English teachers also join without childcare training or familiarity with Japanese early-childhood practice. As a licensed childcare worker and homeroom teacher in this setting, my main role is bridging these two groups, and these gaps come up daily.

## Planned modules

1. **Bilingual handover logs**
   Staff record each child's condition, health notes, and parent messages in either Japanese or English. Entries are displayed in both languages, with the original always visible so translation errors can be caught.

2. **Staffing-ratio checks**
   Each classroom's current staff count is checked in real time against Japan's age-based staff-to-child ratio standards.

3. **Personalized intercultural training**
   Each staff member completes a short self-reported questionnaire about their background and the situations they find difficult. The tool generates a training plan built around concrete workplace scenarios, not national stereotypes.

## Planned stack

- Next.js
- Supabase (Postgres, auth, row-level security for role-based access)
- LLM API for translation and training generation

## Getting started

1. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the `sb_publishable_...` key from the Supabase dashboard).
2. Apply the migrations and fictional seed data with the Supabase CLI:
   ```sh
   npx supabase login                          # first time only
   npx supabase link --project-ref <your-ref>  # first time only
   npx supabase db push --remote --include-seed
   ```
3. Start the dev server:
   ```sh
   npm install
   npm run dev
   ```

## Design principles

- **Fictional data only.** No real children, families, staff, or facilities. See [docs/data-policy.md](docs/data-policy.md).
  - The anonymous read-only RLS policy (`supabase/migrations/*_TEMP_dev_anon_read_access.sql`) is temporary, for development only, and will be removed when auth is added.
- **Original text is the source of truth.** Translations are aids, never replacements.
- **No stereotypes.** Training content addresses situations and behaviors, not nationalities. See [docs/training-design.md](docs/training-design.md).
- **The questionnaire is not a psychological test.** It is a self-reported needs survey with original questions; it does not reproduce or imitate any commercial assessment instrument.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md).
