import { generateBioWithAI } from '../../lib/aiServer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, profession, style } = req.body;
  try {
    const bio = await generateBioWithAI({ name, profession, tone: style });
    const data = {
      name,
      profession,
      bio,
      projects: [{ title: 'Sample project', summary: 'Auto-generated sample' }]
    };
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
