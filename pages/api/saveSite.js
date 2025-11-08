import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { user_id, username, title, description, color, ai_html } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    const payload = { user_id, username, title, description, color, ai_html };
    const { data, error } = await supabase.from('sites').upsert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true, site: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
