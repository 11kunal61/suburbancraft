Krytil - Resume-powered AI site generator (ready-to-deploy)

How to deploy:
1. Add environment variables in Vercel:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   OPENROUTER_API_KEY (optional but recommended to use OpenRouter Llama models)
   HUGGINGFACE_API_KEY (optional fallback)
   NEXT_PUBLIC_BASE_URL=https://suburbancraft.vercel.app
2. Ensure Supabase table `sites` exists with columns:
   - id (uuid primary key)
   - user_id (uuid)
   - username (text unique)
   - title (text)
   - description (text)
   - color (text)
   - sections (jsonb) optional
   - ai_html (text)
   - created_at (timestamp default now())
3. In Supabase Auth -> URL Configuration -> add Redirect URL:
   https://suburbancraft.vercel.app/dashboard
4. Deploy the ZIP to Vercel, set env vars, and test /login -> email link -> dashboard -> upload resume -> generate -> save -> visit /username

Notes:
- This version extracts text from PDF/DOCX server-side using pdf-parse and mammoth. Keep an eye on function cold-start time and upload size limits.
- Consider adding server-side HTML sanitization before saving to DB (I can add this next).
