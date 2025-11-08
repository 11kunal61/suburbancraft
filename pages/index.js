import Link from "next/link";

export default function Home() {
  return (
    <main className="container py-12">
      <div className="card">
        <h1 className="text-3xl font-bold">Krytil — Personal Website Builder (MVP)</h1>
        <p className="mt-2">Create a portfolio/resume website from prompts, host it, and share.</p>

        <div className="mt-6 flex gap-4">
          <Link href="/dashboard"><a className="px-4 py-2 bg-sky-600 text-white rounded">Open Dashboard</a></Link>
          <a className="px-4 py-2 bg-gray-200 rounded" href="https://supabase.com">Supabase</a>
        </div>
      </div>
    </main>
  );
}
