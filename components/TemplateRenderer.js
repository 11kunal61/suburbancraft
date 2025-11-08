import React from "react";

const palettes = {
  pastel: { bg: "#F7F7FC", text: "#0F172A", accent: "#A78BFA" },
  dark: { bg: "#0F172A", text: "#E6EEF8", accent: "#06B6D4" },
  vibrant: { bg: "#FFFBEB", text: "#052F5F", accent: "#F97316" },
};

export default function TemplateRenderer({ data = {}, theme = "pastel", template = "modern" }) {
  const colors = palettes[theme] || palettes.pastel;
  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh", fontFamily: "Inter, system-ui" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 34 }}>{data.name || "Your Name"}</h1>
            <p style={{ opacity: 0.8 }}>{data.bio || "Short tagline or bio"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: 600 }}>{data.profession || "Profession"}</p>
            <p style={{ opacity: 0.7 }}>{data.goal || ""}</p>
          </div>
        </header>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ borderBottom: `2px solid ${colors.accent}`, paddingBottom: 8 }}>Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 12 }}>
            {(data.projects || []).map((p, i) => (
              <article key={i} style={{ border: `1px solid ${colors.accent}`, padding: 12, borderRadius: 8 }}>
                <h3 style={{ fontWeight: 700 }}>{p.title}</h3>
                <p style={{ opacity: 0.8 }}>{p.summary}</p>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ color: colors.accent }}>View</a>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
