// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // user inputs
  const [category, setCategory] = useState("portfolio");
  const [palette, setPalette] = useState("pastel");
  const [style, setStyle] = useState("modern");
  const [prompt, setPrompt] = useState("");

  // generated output
  const [aiHtml, setAiHtml] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
    }
    check();
  }, []);

  function buildFinalPrompt() {
    const paletteText =
      palette === "pastel"
        ? "soft pastel colors"
        : palette === "dark"
        ? "dark theme with neon accents"
        : "vibrant energetic colors";

    return `
Create a fully responsive ${category} website.
Style: ${style}.
Color Palette: ${paletteText}.

Custom user instructions:
${prompt}

IMPORTANT:
Return ONLY clean HTML + CSS in one file. NO scripts unless needed for layout.
    `;
  }

  async function handleGenerate() {
    const finalPrompt = buildFinalPrompt();

    setAiHtml("");
    try {
      const res = await fetch("/api/generateSite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();
      if (data?.content) setAiHtml(data.content);
      else alert("Generation failed");
    } catch (err) {
      console.error(err);
      alert("Error generating page");
    }
  }

  async function handleSave() {
    if (!user) return;
    if (!aiHtml) return alert("Generate first!");

    setSaving(true);

    const payload = {
      user_id: user.id,
      username: user.email.split("@")[0],
      title: "Generated Portfolio",
      description: `AI generated ${category} page`,
      ai_html: aiHtml,
      category,
      style,
      palette,
    };

    try {
      const { data, error } = await supabase
        .from("sites")
        .upsert(payload)
        .select()
        .single();

      setSaving(false);
      if (error) throw error;

      alert("Saved! Visit /" + data.username);
    } catch (err) {
      setSaving(false);
      console.error(err);
      alert("Save failed");
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-5">Generate Your Website</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* INPUTS */}
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="portfolio">Portfolio</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="artist">Artist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="futuristic">Futuristic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Color Palette</label>
            <select
              value={palette}
              onChange={(e) => setPalette(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
              <option value="vibrant">Vibrant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="border p-3 rounded w-full"
              placeholder="Describe what you want in the website..."
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Preview</h2>

          {aiHtml ? (
            <iframe
              srcDoc={aiHtml}
              style={{
                width: "100%",
                height: "700px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div className="text-gray-500">Nothing generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
