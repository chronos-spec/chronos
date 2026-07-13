import { useEffect, useState } from "react";

// ── PAGE D'ACCUEIL ────────────────────────────────────────────────────────────
// Direction claire & éditoriale. Une couverture calme avant de plonger.
export function Landing({ onStart }) {
  const [in_, setIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setIn(true), 40); return () => clearTimeout(t); }, []);

  const MARKS = [
    { l: "13,8 Ga", t: "Big Bang" },
    { l: "4,6 Ga", t: "Terre" },
    { l: "3,5 Ga", t: "Vie" },
    { l: "230 Ma", t: "Dinosaures" },
    { l: "300 ka", t: "Sapiens" },
    { l: "Aujourd'hui", t: "" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #faf7f0 55%, #f1ebdf 100%)",
      color: "#1c1917", fontFamily: "'DM Mono', ui-monospace, monospace",
      display: "flex", flexDirection: "column", overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes drift{0%{transform:translateX(0)}100%{transform:translateX(-30px)}}
        .ld-in{opacity:0;transform:translateY(14px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        .ld-in.on{opacity:1;transform:none}
        .ld-cta{transition:transform .18s ease, box-shadow .18s ease, background .18s ease}
        .ld-cta:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(120,80,20,.24)}
        .ld-cta:active{transform:translateY(0)}
      `}</style>

      {/* Filet supérieur */}
      <div style={{ padding: "22px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(28,25,23,.5)" }}>
        <span>Chronos</span>
        <span>Une frise du vivant &amp; de l'univers</span>
      </div>

      {/* Cœur */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px 24px 40px", gap: 26 }}>
        <div className={`ld-in ${in_ ? "on" : ""}`} style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#9a7b34" }}>
          13,8 milliards d'années · une seule page
        </div>

        <h1 className={`ld-in ${in_ ? "on" : ""}`} style={{
          fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500,
          fontSize: "clamp(44px, 8vw, 108px)", lineHeight: .98, letterSpacing: "-.02em",
          margin: 0, maxWidth: 900, transitionDelay: ".05s",
        }}>
          Le temps,<br />d'un seul regard.
        </h1>

        <p className={`ld-in ${in_ ? "on" : ""}`} style={{
          fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.7, color: "rgba(28,25,23,.66)",
          maxWidth: 560, margin: 0, transitionDelay: ".12s",
        }}>
          Du Big Bang à aujourd'hui, explorez librement la frise — puis
          plongez dans l'arbre du vivant, synchronisé à chaque instant de l'histoire.
        </p>

        <div className={`ld-in ${in_ ? "on" : ""}`} style={{ transitionDelay: ".2s", marginTop: 6 }}>
          <button className="ld-cta" onClick={onStart} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 15, letterSpacing: ".02em",
            padding: "16px 34px", borderRadius: 999, cursor: "pointer",
            border: "1px solid rgba(120,80,20,.28)",
            background: "linear-gradient(180deg,#1f1c17,#141210)", color: "#f7f0e2",
            boxShadow: "0 10px 26px rgba(20,18,16,.22)",
          }}>
            Commencer l'expérience →
          </button>
        </div>
      </div>

      {/* Frise-aperçu en bas */}
      <div className={`ld-in ${in_ ? "on" : ""}`} style={{ transitionDelay: ".28s", padding: "0 0 30px" }}>
        <div style={{ position: "relative", height: 74, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 37, height: 1, background: "linear-gradient(90deg, transparent, rgba(28,25,23,.18) 12%, rgba(28,25,23,.18) 88%, transparent)" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(26px,7vw,90px)", padding: "0 24px", position: "relative" }}>
            {MARKS.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 10, color: "rgba(28,25,23,.5)", whiteSpace: "nowrap" }}>{m.l}</div>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: i === MARKS.length - 1 ? "#c0392b" : "#c8963c", boxShadow: "0 0 0 4px rgba(200,150,60,.14)" }} />
                <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 12, color: "rgba(28,25,23,.7)", whiteSpace: "nowrap" }}>{m.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
