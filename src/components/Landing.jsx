import { useEffect, useMemo, useState } from "react";

// ── PAGE D'ACCUEIL ────────────────────────────────────────────────────────────
// Direction claire & éditoriale, sur un fond d'univers : la page s'ouvre sur
// le Big Bang, alors le décor est un ciel étoilé plutôt qu'une page blanche.
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

  // Champ d'étoiles généré une fois : positions/tailles/délais aléatoires,
  // rendu en simples divs (léger, pas de canvas nécessaire pour une page fixe).
  const starsSmall = useMemo(() => Array.from({ length: 160 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 1.4 + 0.6, o: Math.random() * 0.5 + 0.25,
  })), []);
  const starsBig = useMemo(() => Array.from({ length: 40 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 1.6 + 1.6, delay: Math.random() * 6, dur: Math.random() * 3 + 2.5,
  })), []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "radial-gradient(120% 90% at 50% 0%, #1a1440 0%, #100b2e 38%, #050510 78%, #020207 100%)",
      color: "#f2eee6", fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif",
      display: "flex", flexDirection: "column", overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes drift{0%{transform:translateX(0)}100%{transform:translateX(-30px)}}
        @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:1}}
        .ld-in{opacity:0;transform:translateY(14px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        .ld-in.on{opacity:1;transform:none}
        .ld-cta{transition:transform .18s ease, box-shadow .18s ease, background .18s ease}
        .ld-cta:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(180,150,255,.28)}
        .ld-cta:active{transform:translateY(0)}
      `}</style>

      {/* Nébuleuses — halos de couleur doux, flous, en arrière-plan */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "8%", width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(122,90,220,.30) 0%, rgba(122,90,220,0) 70%)", filter: "blur(10px)" }} />
        <div style={{ position: "absolute", top: "12%", right: "4%", width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(60,130,220,.22) 0%, rgba(60,130,220,0) 70%)", filter: "blur(10px)" }} />
        <div style={{ position: "absolute", bottom: "-8%", left: "30%", width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,150,90,.14) 0%, rgba(200,150,90,0) 70%)", filter: "blur(14px)" }} />
      </div>

      {/* Champ d'étoiles */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {starsSmall.map((st, i) => (
          <div key={`s${i}`} style={{
            position: "absolute", left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s,
            borderRadius: "50%", background: "#fff", opacity: st.o,
          }} />
        ))}
        {starsBig.map((st, i) => (
          <div key={`b${i}`} style={{
            position: "absolute", left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s,
            borderRadius: "50%", background: "#fff",
            boxShadow: "0 0 6px 1px rgba(255,255,255,.55)",
            animation: `twinkle ${st.dur}s ease-in-out ${st.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Filet supérieur */}
      <div style={{ position: "relative", zIndex: 1, padding: "22px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(242,238,230,.55)" }}>
        <span>Chronos</span>
        <span>Une frise du vivant &amp; de l'univers</span>
      </div>

      {/* Cœur */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px 24px 40px", gap: 26 }}>
        <div className={`ld-in ${in_ ? "on" : ""}`} style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#c9a94e" }}>
          13,8 milliards d'années · une seule page
        </div>

        <h1 className={`ld-in ${in_ ? "on" : ""}`} style={{
          fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500,
          fontSize: "clamp(44px, 8vw, 108px)", lineHeight: .98, letterSpacing: "-.02em",
          margin: 0, maxWidth: 900, transitionDelay: ".05s",
          color: "#f7f4ec", textShadow: "0 2px 40px rgba(150,120,255,.25)",
        }}>
          Le temps,<br />d'un seul regard.
        </h1>

        <p className={`ld-in ${in_ ? "on" : ""}`} style={{
          fontSize: "clamp(14px,1.5vw,17px)", lineHeight: 1.7, color: "rgba(242,238,230,.68)",
          maxWidth: 560, margin: 0, transitionDelay: ".12s",
        }}>
          Du Big Bang à aujourd'hui, explorez librement la frise — puis
          plongez dans l'arbre du vivant, synchronisé à chaque instant de l'histoire.
        </p>

        <div className={`ld-in ${in_ ? "on" : ""}`} style={{ transitionDelay: ".2s", marginTop: 6 }}>
          <button className="ld-cta" onClick={onStart} style={{
            fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif", fontSize: 15, letterSpacing: ".02em",
            padding: "16px 34px", borderRadius: 999, cursor: "pointer",
            border: "1px solid rgba(200,180,255,.35)",
            background: "linear-gradient(180deg,#f7f0e2,#e9dfc9)", color: "#141018",
            boxShadow: "0 10px 30px rgba(120,90,220,.28)",
          }}>
            Commencer l'expérience →
          </button>
        </div>
      </div>

      {/* Frise-aperçu en bas */}
      <div className={`ld-in ${in_ ? "on" : ""}`} style={{ position: "relative", zIndex: 1, transitionDelay: ".28s", padding: "0 0 30px" }}>
        <div style={{ position: "relative", height: 74, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 37, height: 1, background: "linear-gradient(90deg, transparent, rgba(242,238,230,.22) 12%, rgba(242,238,230,.22) 88%, transparent)" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(26px,7vw,90px)", padding: "0 24px", position: "relative" }}>
            {MARKS.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 10, color: "rgba(242,238,230,.55)", whiteSpace: "nowrap" }}>{m.l}</div>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: i === MARKS.length - 1 ? "#e0685a" : "#d7ae5c", boxShadow: "0 0 8px 2px rgba(215,174,92,.35)" }} />
                <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 12, color: "rgba(242,238,230,.8)", whiteSpace: "nowrap" }}>{m.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
