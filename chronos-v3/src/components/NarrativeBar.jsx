// ── LECTEUR DE PARCOURS ───────────────────────────────────────────────────────
// S'affiche en bas de la frise pendant un parcours narratif.
export function NarrativeBar({ story, index, onPrev, onNext, onExit, onShuffle }) {
  if (!story) return null;
  const step = story.steps[index];
  const total = story.steps.length;
  const first = index === 0, last = index === total - 1;

  return (
    <div style={{
      position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)",
      width: "min(680px, calc(100% - 28px))", zIndex: 60,
      background: "rgba(255,253,248,.97)", backdropFilter: "blur(6px)",
      border: "1px solid rgba(28,25,23,.12)", borderRadius: 16,
      boxShadow: "0 20px 50px rgba(28,25,23,.18)", overflow: "hidden",
      fontFamily: "'DM Mono', ui-monospace, monospace",
    }}>
      {/* progression */}
      <div style={{ display: "flex", gap: 4, padding: "10px 16px 0" }}>
        {story.steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= index ? "#c8963c" : "rgba(28,25,23,.12)",
            transition: "background .3s",
          }} />
        ))}
      </div>

      <div style={{ padding: "12px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#9a7b34" }}>
            {story.emoji} {story.title}
          </span>
          <span style={{ fontSize: 10, color: "rgba(28,25,23,.4)" }}>
            {index + 1} / {total}
          </span>
        </div>

        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, color: "#1c1917", marginBottom: 5, lineHeight: 1.15 }}>
          {step.title}
        </div>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.62, color: "rgba(28,25,23,.74)", margin: 0 }}>
          {step.text}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <button onClick={onExit} style={btnGhost}>Quitter</button>
          <button onClick={onShuffle} style={btnGhost} title="Autre parcours au hasard">🎲 Autre histoire</button>
          <div style={{ flex: 1 }} />
          <button onClick={onPrev} disabled={first} style={{ ...btnGhost, opacity: first ? .4 : 1, cursor: first ? "default" : "pointer" }}>← Précédent</button>
          <button onClick={onNext} style={btnPrimary}>
            {last ? "Terminer ✓" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const btnGhost = {
  padding: "7px 13px", borderRadius: 9, fontSize: 12, cursor: "pointer",
  fontFamily: "inherit", border: "1px solid rgba(28,25,23,.15)",
  background: "transparent", color: "rgba(28,25,23,.66)",
};
const btnPrimary = {
  padding: "7px 15px", borderRadius: 9, fontSize: 12, cursor: "pointer",
  fontFamily: "inherit", border: "none",
  background: "#1f1c17", color: "#f7f0e2", fontWeight: 600,
};
