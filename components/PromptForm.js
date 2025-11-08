import React from "react";

export default function PromptForm({ onSubmit, initial }) {
  const [form, setForm] = React.useState({
    name: initial?.name || "",
    profession: initial?.profession || "developer",
    goal: initial?.goal || "internship",
    style: initial?.style || "minimal",
    palette: initial?.palette || "pastel",
  });

  function change(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input name="name" value={form.name} onChange={change} className="mt-1 p-2 border w-full rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Profession</label>
        <select name="profession" value={form.profession} onChange={change} className="mt-1 p-2 border w-full rounded">
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Goal</label>
        <select name="goal" value={form.goal} onChange={change} className="mt-1 p-2 border w-full rounded">
          <option value="internship">Get internship</option>
          <option value="job">Full-time job</option>
          <option value="freelance">Freelance clients</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Style</label>
        <select name="style" value={form.style} onChange={change} className="mt-1 p-2 border w-full rounded">
          <option value="minimal">Minimal</option>
          <option value="creative">Creative</option>
          <option value="corporate">Corporate</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Color palette</label>
        <select name="palette" value={form.palette} onChange={change} className="mt-1 p-2 border w-full rounded">
          <option value="pastel">Pastel</option>
          <option value="dark">Dark</option>
          <option value="vibrant">Vibrant</option>
        </select>
      </div>

      <div>
        <button className="px-4 py-2 bg-sky-600 text-white rounded">Generate & Preview</button>
      </div>
    </form>
  );
}
