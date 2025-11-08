import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TemplateRenderer from '../components/TemplateRenderer';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [aiHtml, setAiHtml] = useState('');
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState('portfolio');
  const [palette, setPalette] = useState('pastel');
  const [style, setStyle] = useState('modern');
  const [extra, setExtra] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      setUser(u || null);
      if (u) {
        const { data: s } = await supabase.from('sites').select('*').eq('user_id', u.id).single().catch(()=>({}));
        if (s) setSite(s);
      }
      setLoading(false);
    }
    load();
  }, []);

  function buildFinalPrompt() {
    const paletteText = palette === 'pastel' ? 'soft pastel colors' : palette === 'dark' ? 'dark theme with neon accents' : 'vibrant colors';
    return `Create a ${style} ${category} website with ${paletteText}. Include a header with name/title, an about section, projects (3 items), and a contact section. Tone: professional. Details: ${extra}`;
  }

  async function handleGenerate() {
    setAiHtml('');
    const prompt = buildFinalPrompt();
    const res = await fetch('/api/generateSite', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    setAiHtml(data.content || '<p>Error generating</p>');
  }

  async function handleSave() {
    if (!user) return alert('Login required');
    setSaving(true);
    const payload = {
      user_id: user.id,
      username: user.email.split('@')[0],
      title: `${user.email.split('@')[0]}'s site`,
      description: `Generated ${category} site`,
      color: palette,
      sections: [],
      ai_html: aiHtml
    };
    const { data, error } = await supabase.from('sites').upsert(payload).select().single();
    setSaving(false);
    if (error) return alert(error.message);
    setSite(data);
    alert('Saved! Visit /' + data.username);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-8">
      <div className="card mb-6">
        <h2 className="text-xl font-semibold">Generate a site from prompts</h2>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="portfolio">Portfolio</option>
              <option value="resume">Resume</option>
              <option value="startup">Startup</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Style</label>
            <select value={style} onChange={(e)=>setStyle(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="futuristic">Futuristic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Color palette</label>
            <select value={palette} onChange={(e)=>setPalette(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
              <option value="vibrant">Vibrant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Extra details</label>
            <input value={extra} onChange={(e)=>setExtra(e.target.value)} placeholder="e.g., 3D artist, Bangalore" className="mt-1 p-2 border w-full rounded" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleGenerate} className="px-4 py-2 bg-sky-600 text-white rounded">Generate</button>
          <button onClick={handleSave} disabled={!aiHtml || saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save Site'}</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        {aiHtml ? <TemplateRenderer siteHtml={aiHtml} /> : <p>No preview yet. Click Generate.</p>}
      </div>
    </div>
  );
}
