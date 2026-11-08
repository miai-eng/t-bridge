# Data policy

This project handles a domain (children's care records) where real data would be highly sensitive. To keep development safe:

- All children, families, staff, classrooms, and facilities used in development are **fictional**.
- No data from any real preschool, including the author's workplace, is used, copied, or referenced.
- Seed data is generated and clearly marked as fictional.
- Health notes in seed data are generic (e.g. "slight fever, picked up early") and not modeled on real individuals.
- Secrets (API keys, database credentials) are never committed. Use `.env.local` based on `.env.example`.
