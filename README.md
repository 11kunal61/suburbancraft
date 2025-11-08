Krytil - Prompt-based AI site generator (ready-to-deploy)

How to deploy:
1. Add environment variables in Vercel:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   OPENROUTER_API_KEY (optional but recommended for AI)
2. Ensure Supabase table `sites` exists with columns:
   - id (uuid primary key)
   - user_id (uuid)
   - username (text, unique)
   - title (text)
   - description (text)
   - color (text)
   - sections (jsonb) optional
   - ai_html (text)
   - created_at (timestamp default now())
3. Deploy on Vercel and visit /login to start.

Notes:
- If OPENROUTER_API_KEY is missing, a basic fallback HTML is generated.
- This project intentionally keeps UI simple to focus on core mechanics.
