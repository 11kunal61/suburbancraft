import { useState } from "react";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generateSite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setOutput(data.content);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Generate Your Website</h1>
      <textarea
        className="w-full max-w-md p-3 border rounded-md"
        rows={4}
        placeholder="Describe your business or project..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Generating..." : "Generate Site"}
      </button>

      {output && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Preview:</h2>
          <div dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}
