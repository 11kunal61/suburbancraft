import React from "react";

export default function TemplateRenderer({ site }) {
  if (!site) return <p>No site data found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow p-6 text-center">
        <h1 className="text-3xl font-bold">{site.title || "Untitled Site"}</h1>
        <p className="text-gray-500">{site.description || "No description yet"}</p>
      </header>

      <main className="p-8 space-y-6">
        {site.sections && site.sections.length > 0 ? (
          site.sections.map((section, index) => (
            <section key={index} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
              <p>{section.content}</p>
            </section>
          ))
        ) : (
          <p>No sections added yet.</p>
        )}
      </main>

      <footer className="text-center py-4 text-sm text-gray-500">
        Built with ❤️ using Krytil
      </footer>
    </div>
  );
}
