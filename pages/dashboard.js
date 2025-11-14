// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import TemplateRenderer from "../components/TemplateRenderer";

export default function Dashboard() {
  const router = useRouter();

  // instant UI state
  const [user, setUser] = useState(null);
  const [site, setSite] = useState(null);
  const [aiHtml, setAiHtml] = useState("");
  const [saving, setSaving] = useState(false);
  const [resumeText, setResumeText] = useState("");

  // prompt options
  const [category, setCategory] = useState("portfolio");
  const [palette, setPalette] = useState("pastel");
  const [style, setStyle] = useState("modern");
  const [extra, setExtra] = useState("");

  useEffect(() => {
    // background session check (doesn't block UI)
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data?.user ?? null;
        setUser(u);
        if (!u) {
          // if not logged in, redirect to login but UI is already visible
          router.replace("/login");
          return;
        }
        // load user site if exists
        const { data: s } = await supabase.from("sites").select("*").eq("user_id", u.id).single().catch(() => null);
        if (s) setSite(s);
      } catch (err) {
        console.error("session error:", err);
      }
    }
    checkSession();

    // listen for auth state changes to keep UI in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else {
        setUser(null);
        router.replace("/login");
      }
    });
    // cleanup
    return () => sub?.subscription?.unsubscribe?.();
  }, [router]);

  function buildFinalPrompt() {
    const paletteText =
      palette === "pastel"
        ? "soft pastel colors"
        : palette === "dark"
        ? "dark theme with neon accents"
        : "vibrant colors";
    const resumePart = resumeText ? `Use these resume details: ${resumeText}` : "";
    return `Create a ${style} ${category} website with ${paletteText}. Include header with name/title, an about section, three project items, and contact. Tone: professional. ${resumePart} Details: ${extra}`;
  }

  async function handleGenerate() {
    setAiHtml("");
    const prompt = buildFinalPrompt();
    try {
      const res = await fetch("/api/generateSite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          palette,
          style,
          resumeText,
          extra,
          // included for backwards compatibility with some implementations that read `prompt`
          prompt,
        }),
      });
      const data = await res.json();
      if (data?.content) setAiHtml(data.content);
      else alert("Generation failed: " + (data?.error || "unknown"));
    } catch (err) {
      console.error("generate error:", err);
      alert("Generation error: " + err.message);
    }
  }

  async function handleSave() {
    if (!user) return alert("Login required");
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        username: (user.email || "user").split("@")[0],
        title: `${(user.email || "user").split("@")[0]}'s site`,
        description: `Generated ${category} site`,
        color: palette,
        style,
        category,
        sections: [],
        ai_html: aiHtml,
      };
      const { data, error } = await supabase.from("sites").upsert(payload).select().single();
      setSaving(false);
      if (error) throw error;
      setSite(data);
      alert("Saved! Visit /" + data.username);
    } catch (err) {
      setSaving(false);
      console.error("save error:", err);
      alert("Save failed: " + (err?.message || err));
    }
  }

  async function handleResumeUpload(file) {
    if (!file) return;
    const form = new FormData();
    form.append("resume", file);
    try {
      const r = await fetch("/api/extractResume", { method: "POST", body: form });
      const j = await r.json();
      if (j?.text) setResumeText(j.text);
      else alert("Resume extraction failed: " + (j?.error || "unknown"));
    } catch (err) {
      console.error("upload error:", err);
      alert("Upload error: " + err.message);
    }
  }

  // Render UI immediately (instant), preview uses iframe to isolate HTML
  return (
    <div className="container py-8">
      <div className="card mb-6">
        <h2 className="text-xl font-semibold">Generate portfolio from prompts</h2>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Job type / Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="portfolio">Portfolio</option>
              <option value="designer">Designer</option>
              <option value="developer">Developer</option>
              <option value="photographer">Photographer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="futuristic">Futuristic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Color palette</label>
            <select value={palette} onChange={(e) => setPalette(e.target.value)} className="mt-1 p-2 border w-full rounded">
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
              <option value="vibrant">Vibrant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Upload resume (PDF / DOCX) — required</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleResumeUpload(e.target.files?.[0])} className="mt-1 p-2 border w-full rounded" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleGenerate} className="px-4 py-2 bg-sky-600 text-white rounded">Generate</button>
          <button onClick={handleSave} disabled={!aiHtml || saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? "Saving..." : "Save Site"}</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>

        {aiHtml ? (
          <iframe title="preview" srcDoc={aiHtml} style={{ width: "100%", height: 700, border: "1px solid #ddd" }} />
        ) : (
          <p>No preview yet. Click Generate after you upload your resume.</p>
        )}
      </div>
    </div>
  );
}
