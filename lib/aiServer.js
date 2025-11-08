// lib/aiServer.js
import fetch from "node-fetch";

async function callOpenRouter(prompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("No OpenRouter key");
  const body = {
    model: "meta-llama/llama-3-8b-instruct",
    messages: [
      { role: "system", content: "You are a website generator. Output only HTML (no explanations)." },
      { role: "user", content: `Create a single-page responsive HTML landing page for: ${prompt}. Include header, about, 3 projects, contact. Use inline CSS and the requested color palette.` }
    ],
    max_tokens: 1200,
    temperature: 0.7
  };
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter: no content");
  return content;
}

async function callHuggingFace(prompt) {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) throw new Error("No Hugging Face key");
  // we use a relatively small instruct model — adjust model name if you prefer
  // NOTE: HF requires an API token (free-tier available)
  const model = "google/flan-t5-large"; // example text model; you can change to a better instruct model
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: `Generate an HTML landing page for: ${prompt}. Output only HTML. Use inline CSS.` , options: { wait_for_model: true } })
  });
  const text = await res.text();
  if (!text) throw new Error("HuggingFace: no content");
  return text;
}

export async function generateHTMLFromPrompt(prompt) {
  // try OpenRouter
  try {
    if (process.env.OPENROUTER_API_KEY) {
      return await callOpenRouter(prompt);
    }
    // then try Hugging Face
    if (process.env.HUGGINGFACE_API_KEY) {
      return await callHuggingFace(prompt);
    }
  } catch (err) {
    // log then continue to fallback
    console.error("AI provider error:", err.message || err);
  }

  // fallback: generate deterministic, simple HTML (safe offline)
  const safeHtml = `
  <!doctype html>
  <html>
  <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body{font-family:system-ui,Arial,Helvetica,sans-serif;margin:0;padding:0}
    .hero{padding:48px;text-align:center;background:#f7fafc}
    .container{max-width:900px;margin:0 auto;padding:24px}
    .card{background:white;border-radius:8px;padding:18px;margin:12px 0;box-shadow:0 4px 10px rgba(0,0,0,0.06)}
  </style>
  </head>
  <body>
    <section class="hero"><div class="container"><h1>Generated Page</h1><p>${escapeHtml(prompt)}</p></div></section>
    <section class="container"><div class="card"><h2>About</h2><p>A short generated about section.</p></div>
    <div class="card"><h2>Projects</h2><ul><li>Project A</li><li>Project B</li><li>Project C</li></ul></div>
    <div class="card"><h2>Contact</h2><p>Email: you@example.com</p></div></section>
  </body>
  </html>`;
  return safeHtml;
}

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
