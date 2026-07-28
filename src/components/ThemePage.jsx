import { useEffect, useMemo, useRef, useState } from "react";
import { THEMES } from "../canvas/drawTimeline.js";
import { THEME_NARRATIVES } from "../data/themeNarratives.js";
import { fmt } from "../utils/time.js";

const WPM = 200; // vitesse de lecture moyenne, pour l'estimation "N min de lecture"

// ── PAGE DÉDIÉE À UN THÈME ───────────────────────────────────────────────────
// Récit chronologique de haut en bas (le plus ancien en premier), avec liens
// entre événements/personnages liés, ouvert en plein écran depuis la frise.
export function ThemePage({ themeKey, onClose }) {
  const theme = THEMES[themeKey];
  const narrative = THEME_NARRATIVES[themeKey];
  const itemRefs = useRef({});
  const [flashId, setFlashId] = useState(null);

  const items = useMemo(() => {
    if (!theme) return [];
    return [...theme.items].sort((a, b) => b.from - a.from);
  }, [theme]);

  const readingMinutes = useMemo(() => {
    if (!narrative) return 1;
    const words = [narrative.intro, narrative.closing, ...Object.values(narrative.notes || {})]
      .join(" ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / WPM));
  }, [narrative]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const jumpTo = (id) => {
    itemRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1400);
  };

  if (!theme || !narrative) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={`Récit du thème ${theme.label}`}
      style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#fbfaf7", overflowY: "auto",
        fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif" }}>

      {/* En-tête sticky */}
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: "rgba(251,250,247,.96)",
        backdropFilter: "blur(6px)", borderBottom: `2px solid ${theme.color}`, padding: "14px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onClose} aria-label="Retour à la frise"
            style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid rgba(23,20,18,.15)",
              background: "#fff", color: "rgba(23,20,18,.6)", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>
            ←
          </button>
          <span style={{ fontSize: 22 }}>{theme.icon}</span>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 20, color: "#1c1917", fontWeight: 600 }}>
              {theme.label}
            </div>
            <div style={{ fontSize: 11.5, color: "rgba(23,20,18,.5)" }}>
              Récit chronologique · ~{readingMinutes} min de lecture · {items.length} événements
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px 100px" }}>
        {/* Introduction */}
        <p style={{ fontFamily: "Georgia,serif", fontSize: 16.5, lineHeight: 1.75, color: "#1c1917", marginBottom: 32 }}>
          {narrative.intro}
        </p>

        {/* Fil chronologique */}
        <div style={{ position: "relative", paddingLeft: 26 }}>
          <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: `${theme.color}33` }} />
          {items.map((item) => {
            const links = (narrative.links?.[item.id] || []).map(id => items.find(i => i.id === id)).filter(Boolean);
            const flashing = flashId === item.id;
            return (
              <div key={item.id} id={`theme-item-${item.id}`} ref={el => { itemRefs.current[item.id] = el; }}
                style={{ position: "relative", marginBottom: 26, padding: "12px 16px", borderRadius: 12,
                  background: flashing ? `${item.color}22` : "transparent", transition: "background .5s ease" }}>
                <div style={{ position: "absolute", left: -26, top: 16, width: 12, height: 12, borderRadius: "50%",
                  background: item.color, border: "2px solid #fbfaf7", boxShadow: `0 0 0 2px ${item.color}55` }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 17, color: "#1c1917", fontWeight: 600 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>
                    {fmt(item.from)} → {item.to != null ? fmt(item.to) : "aujourd'hui"}
                  </span>
                </div>
                {narrative.notes?.[item.id] && (
                  <p style={{ fontFamily: "Georgia,serif", fontSize: 14.5, lineHeight: 1.65, color: "rgba(23,20,18,.75)", margin: "0 0 6px" }}>
                    {narrative.notes[item.id]}
                  </p>
                )}
                {links.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    {links.map(l => (
                      <button key={l.id} onClick={() => jumpTo(l.id)}
                        style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 999, cursor: "pointer",
                          fontFamily: "inherit", border: `1px solid ${l.color}55`, background: `${l.color}12`, color: l.color }}>
                        → voir aussi : {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conclusion */}
        <p style={{ fontFamily: "Georgia,serif", fontSize: 16.5, lineHeight: 1.75, color: "#1c1917", marginTop: 20 }}>
          {narrative.closing}
        </p>

        <button onClick={onClose}
          style={{ marginTop: 24, padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(23,20,18,.15)",
            background: "#fff", color: "rgba(23,20,18,.65)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          ← Retour à la frise
        </button>
      </div>
    </div>
  );
}
