# Krytil - Prompt→Site MVP (Full ZIP)

## Quickstart (deploy on Vercel)
1. Set environment vars in Vercel (Project Settings → Environment Variables):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - (Optional) OPENAI_API_KEY for AI bios
2. Connect this repo to Vercel or upload the ZIP.
3. Deploy and visit /dashboard to create your site.

## Supabase tables
- sites (id,user_id,username,template,theme,data,published)
- templates (id,slug,meta,default_theme,components)
- projects, certificates, purchases (optional)

