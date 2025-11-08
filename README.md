Fixed Krytil for suburbancraft deployment - ready-to-deploy

IMPORTANT: before deploying to Vercel, set these Environment Variables in your Vercel project settings:

NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
OPENROUTER_API_KEY=<your openrouter key>
NEXT_PUBLIC_BASE_URL=https://suburbancraft.vercel.app

Why NEXT_PUBLIC_BASE_URL: the login system will pass this as the redirect URL to Supabase

Supabase table `sites` should include columns: id (uuid primary), user_id (uuid), username (text unique), title (text), description (text), color (text), sections (jsonb), ai_html (text), created_at (timestamp default now())

Deploy: upload this zip to Vercel, set env vars, and deploy. Then go to Supabase Auth > URL Configuration and add the redirect URL:

https://suburbancraft.vercel.app/dashboard

