import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { site_id } = req.body;
  if (!site_id) return res.status(400).json({ error: 'Missing site_id' });

  const { error } = await supabase.from('sites').update({ published: true }).eq('id', site_id);
  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.json({ ok: true });
}
