import fetch from 'node-fetch';
export async function generateBioWithAI({ profession, tone, name }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return `${name||'Passionate'} ${profession||'professional'} eager to learn and build.`;
  const prompt = `Write a 1-line professional bio for a ${profession} in a ${tone} tone.`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST', headers:{Authorization:`Bearer ${key}`, 'Content-Type':'application/json'}, body: JSON.stringify({
      model: 'gpt-4o-mini', messages:[{role:'system',content:'You are a helpful copywriter.'},{role:'user',content:prompt}], max_tokens:60
    })
  });
  const json = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() ?? `${name||'Passionate'} ${profession||'professional'} eager to learn and build.`;
}
