import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">🚀 SuburbanCraft + Supabase</h1>
      <p className="text-lg">
        Connection status: {supabase ? "✅ Connected to Supabase" : "❌ Not Connected"}
      </p>
      <p className="mt-4 opacity-70 text-sm">
        Production-ready build deployed on Vercel
      </p>
    </div>
  )
}
