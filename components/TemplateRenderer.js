export default function TemplateRenderer({ siteHtml }) {
  if (!siteHtml) return <div className="p-6">No preview available</div>;
  return <div dangerouslySetInnerHTML={{ __html: siteHtml }} />;
}
