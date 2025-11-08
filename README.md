Krytil - Ready to deploy (login-first)

Quick steps:
1. Add these environment variables in Vercel:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Ensure Supabase table `sites` exists with columns: id (uuid), user_id (uuid), username (text), title (text), description (text), color (text), sections (jsonb), created_at (timestamp)
3. Deploy on Vercel (or push to GitHub and connect Vercel).
4. Visit /login to start.
