import React from "react";

export default function BlogEditor({ onSave, initial }) {
  const [title, setTitle] = React.useState(initial?.title || "");
  const [body, setBody] = React.useState(initial?.body || "");

  return (
    <div className="space-y-3">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Post title" className="w-full p-2 border rounded" />
      <textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={6} placeholder="Write your post..." className="w-full p-2 border rounded" />
      <button onClick={() => onSave({ title, body })} className="px-4 py-2 bg-green-600 text-white rounded">Save Post</button>
    </div>
  );
}
