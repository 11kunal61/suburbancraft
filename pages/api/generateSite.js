import { generateHTMLFromPrompt } from '../../lib/aiServer';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const html = await generateHTMLFromPrompt(prompt);
    res.status(200).json({ content: html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ content: `<p>Error: ${err.message}</p>` });
  }
}
