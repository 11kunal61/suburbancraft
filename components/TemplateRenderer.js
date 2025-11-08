export default function TemplateRenderer({ siteHtml, siteData }) {
  // siteHtml takes priority (AI generated)
  if (siteHtml) {
    return <div dangerouslySetInnerHTML={{ __html: siteHtml }} />;
  }
  if (!siteData) return <div className="p-6">No preview available</div>;

  return (
    <div style={{ fontFamily: 'system-ui' }} className="p-6">
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>{siteData.title || 'Untitled'}</h1>
      <p style={{ marginBottom: 12 }}>{siteData.description}</p>
      {(siteData.sections || []).map((s, i) => (
        <section key={i} style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 18 }}>{s.heading}</h2>
          <p>{s.content}</p>
        </section>
      ))}
    </div>
  );
}
