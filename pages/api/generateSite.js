export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI that creates simple HTML landing pages with inline CSS. Output ONLY clean HTML, no explanations.",
          },
          { role: "user", content: `Make a personal website for: ${prompt}` },
        ],
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "<p>Error generating site.</p>";
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ content: `<p>Error: ${error.message}</p>` });
  }
}
