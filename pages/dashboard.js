import React from "react";
import { supabase } from "../lib/supabaseClient";
import PromptForm from "../components/PromptForm";
import TemplateRenderer from "../components/TemplateRenderer";
import BlogEditor from "../components/BlogEditor";

export default function Dashboard() {
  const [user, setUser] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [site, setSite] = React.useState(null);
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  React.useEffect(() => {
    if (user) loadSite();
  }, [user]);

  async function loadSite() {
    const { data } = await supabase.from("sites").select("*").eq("user_id", user.id).limit(1).single();
    if (data) {
      setSite(data);
      setPreview({ data: data.data, theme: data.theme?.palette || "pastel" });
      const { data: posts } = await supabase.from("projects").select("*").eq("site_id", data.id);
      setPosts(posts || []);
    }
  }

  async function handleGenerate(values) {
    const payload = {
      name: values.name,
      profession: values.profession,
      goal: values.goal,
      style: values.style,
      palette: values.palette,
      bio: "Loading... (AI can fill this)",
      projects: [{ title: "Demo project", summary: "Example summary" }],
    };
    setPreview({ data: payload, theme: values.palette });
  }

  async function handleSave() {
    if (!user || !preview) {
      alert("Login required and generate preview first");
      return;
    }
    setSaving(true);
    const siteObj = {
      user_id: user.id,
      username: (user.email || "user").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 20),
      template: "modern-resume",
      theme: { palette: preview.theme || "pastel" },
      data: preview.data,
      published: false,
    };
    const { data, error } = await supabase.from("sites").upsert(siteObj).select().single();
    setSaving(false);
    if (error) return alert(error.message);
    setSite(data);
    alert("Saved! You can now Publish.");
  }

  async function handlePublish() {
    if (!site) return alert("Save first.");
    const { error } = await supabase.from("sites").update({ published: true }).eq("id", site.id);
    if (error) return alert(error.message);
    alert("Published! Visit /" + site.username);
  }

  async function handleSavePost(post) {
    if (!site) return alert("Save site first");
    const { data, error } = await supabase.from("projects").insert([{ site_id: site.id, name: post.title, description: post.body }]);
    if (error) return alert(error.message);
    setPosts((p) => [...p, data[0]]);
  }

  if (!user) {
    return (
      <main className="container py-10">
        <div className="card">
          <h2 className="text-xl font-semibold">Login / Register</h2>
          <p className="mt-2">Sign in with Magic Link (Supabase)</p>
          <LoginForm onSuccess={() => supabase.auth.getUser().then(({ data }) => setUser(data.user))} />
        </div>
      </main>
    );
  }

  return (
    <main className="container py-10 grid gap-6" style={{ gridTemplateColumns: "360px 1fr" }}>
      <div className="card">
        <h3 className="font-bold">Create your site</h3>
        <PromptForm onSubmit={handleGenerate} initial={site?.data} />
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-sky-600 text-white rounded">
            {saving ? "Saving..." : "Save Site"}
          </button>
          <button onClick={handlePublish} className="px-4 py-2 bg-green-600 text-white rounded">Publish</button>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">Blog / Journal</h4>
          <BlogEditor onSave={handleSavePost} />
          <div className="mt-3">
            {posts.map((p) => <div key={p.id} className="p-2 border rounded mt-2">{p.name}</div>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-4">Live Preview</h3>
        {preview ? <TemplateRenderer data={preview.data} theme={preview.theme} /> : <div className="p-4">Generate a preview to see your site.</div>}
      </div>
    </main>
  );
}

function LoginForm({ onSuccess }) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function sendLink(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("Check your email for a magic link.");
      if (onSuccess) onSuccess();
    }
  }

  return (
    <form onSubmit={sendLink} className="space-y-2">
      <input placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">{loading ? "Sending..." : "Send magic link"}</button>
    </form>
  );
}
