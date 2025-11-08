// components/TemplateRenderer.js

export default function TemplateRenderer({ site }) {
  if (!site) return <div className="p-4 text-gray-500">No preview available.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{site.title || "Untitled Site"}</h1>
      <p className="text-lg text-gray-700 mb-6">{site.description || "No description yet."}</p>

      {site.sections?.map((section, i) => (
        <div key={i} className="mb-8 border-t pt-4">
          <h2 className="text-2xl font-semibold mb-2">{section.heading}</h2>
          <p className="text-gray-600">{section.content}</p>
        </div>
      ))}

      <footer className="mt-12 text-center text-gray-400 text-sm">
        Built with <span className="font-semibold text-gray-600">Krytil</span>
      </footer>
    </div>
  );
}
