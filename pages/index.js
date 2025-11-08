import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">🚀 Krytil Starter</h1>
      <p className="text-lg text-gray-700 mb-4">
        If you see this, your Next.js + Supabase + Tailwind app is working!
      </p>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p>Supabase URL: <code>{process.env.NEXT_PUBLIC_SUPABASE_URL}</code></p>
      </div>
    </main>
  )
}
