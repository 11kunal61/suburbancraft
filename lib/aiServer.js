import fetch from 'node-fetch';

export async function generateHTMLFromPrompt(prompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    // fallback simple generator
    return `<section style="padding:24px;font-family:system-ui;"><h1>Generated site</h1><p>${escapeHtml(prompt)}</p></section>`;
  }

  const body = {
    model: "meta-llama/llama-3-8b-instruct",
    messages: [
      { role: "system", content: "You are an assistant that outputs a single HTML landing page. Output ONLY the HTML for the page (no explanations). Use inline CSS styles and keep it simple and responsive." },
      { role: "user", content: `Create a clean HTML landing page for: ${prompt}. Include a header with name/title, an about section, projects (3 items), and a contact section. Tone: professional. Details: ${prompt}` }
    ],
    max_tokens: 1200,
    temperature: 0.7
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from AI");
  return content;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function(m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
