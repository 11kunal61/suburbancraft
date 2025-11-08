import archiver from 'archiver';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { site_id } = req.body;
  if (!site_id) return res.status(400).json({ error: 'Missing site_id' });

  const { data: site } = await supabase.from('sites').select('*').eq('id', site_id).single();
  if (!site) return res.status(404).json({ error: 'Not found' });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${site.username || 'site'}.zip`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  const html = `<!doctype html>
  <html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${site.data.name || 'My Site'}</title>
  <style>body{font-family:system-ui,Arial;color:#111;padding:28px}</style></head><body>
  <h1>${site.data.name || ''}</h1><p>${site.data.bio || ''}</p><h2>Projects</h2><ul>
  ${ (site.data.projects || []).map(p => `<li><strong>${p.title}</strong> - ${p.summary}</li>`).join('') }
  </ul></body></html>`;

  archive.append(html, { name: 'index.html' });
  await archive.finalize();
}
