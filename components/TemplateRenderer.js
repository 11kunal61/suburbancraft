export default function TemplateRenderer({ site }) {
  if (!site) return <div className="p-6">No site to show.</div>;
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: site.color || '#2563eb' }}>
      <header className="text-center py-8 bg-black bg-opacity-20">
        <h1 className="text-4xl font-bold">{site.title}</h1>
        <p className="text-lg mt-2">{site.description}</p>
      </header>

      <main className="p-6 space-y-6">
        {site.sections && site.sections.length > 0 ? (
          site.sections.map((s, i) => (
            <section key={i} className="bg-white text-black p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              <p className="mt-2">{s.content}</p>
            </section>
          ))
        ) : (
          <div className="p-6 bg-white rounded-lg shadow">No sections yet.</div>
        )}
      </main>

      <footer className="text-center text-sm py-4 bg-black bg-opacity-20">Built with ❤️ by Krytil</footer>
    </div>
  );
}
