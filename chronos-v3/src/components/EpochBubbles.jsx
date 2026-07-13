// ── BULLES DES GRANDES ÉPOQUES ────────────────────────────────────────────────
// Navigation éditoriale par grandes périodes : bulles lisibles, cliquables,
// qui zooment la frise sur l'ère choisie. Inspiré des "régimes" de ChronoZoom
// et des cartes de neal.fun.
const EPOCHS_UI = [
  { title: "Univers",       range: "13,8 – 4,6 Ga", from: 13.8e9, to: 4.6e9,  color: "#7c5cf0", bg: "#f2eeff", note: "Big Bang, étoiles, galaxies" },
  { title: "Terre primitive", range: "4,6 – 2,5 Ga", from: 4.6e9,  to: 2.5e9,  color: "#0e7ac0", bg: "#e9f5ff", note: "Océans, atmosphère, roches" },
  { title: "Vie microbienne", range: "3,5 – 0,54 Ga", from: 3.5e9, to: 541e6,  color: "#0f9d6b", bg: "#e8f8f0", note: "Bactéries, oxygène, cellules" },
  { title: "Explosion du vivant", range: "541 – 252 Ma", from: 541e6, to: 252e6, color: "#12a3a3", bg: "#e6f7f7", note: "Cambrien, poissons, forêts" },
  { title: "Dinosaures",    range: "252 – 66 Ma",  from: 252e6,  to: 66e6,   color: "#c9631a", bg: "#fff0e4", note: "Mésozoïque, reptiles géants" },
  { title: "Mammifères",    range: "66 – 2,6 Ma",  from: 66e6,   to: 2.6e6,  color: "#b8447a", bg: "#fdeaf3", note: "Cénozoïque, oiseaux, primates" },
  { title: "Préhistoire",   range: "2,6 Ma – 3000 av.", from: 2.6e6, to: 5e3, color: "#a8551f", bg: "#f7ede3", note: "Homo, feu, art rupestre" },
  { title: "Histoire",      range: "5000 ans – aujourd'hui", from: 5200, to: 0.1, color: "#2457c5", bg: "#eaf0ff", note: "Écriture, empires, sciences" },
];

export function EpochBubbles({ navigateToEpoch }) {
  return (
    <section className="chronos-epochs" aria-label="Naviguer par grande époque"
      style={{ padding: "8px 18px 14px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {EPOCHS_UI.map(e => (
        <button key={e.title} type="button"
          onClick={() => navigateToEpoch({ from: e.from, to: e.to })}
          style={{
            display: "flex", flexDirection: "column", gap: 6, textAlign: "left",
            padding: "13px 15px", borderRadius: 16, cursor: "pointer",
            border: `1px solid ${e.color}33`,
            background: `linear-gradient(165deg, ${e.bg}, #ffffff 80%)`,
            boxShadow: "0 6px 18px rgba(28,25,23,.05)",
            fontFamily: "'DM Mono', ui-monospace, monospace",
            transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
          }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: e.color, flexShrink: 0, boxShadow: `0 0 0 4px ${e.color}1e` }} />
            <span style={{ fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(28,25,23,.5)" }}>{e.range}</span>
          </span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, lineHeight: 1.08, color: "#1c1917" }}>{e.title}</span>
          <span style={{ fontSize: 10.5, lineHeight: 1.4, color: "rgba(28,25,23,.55)" }}>{e.note}</span>
          <span style={{ fontSize: 10, color: e.color, marginTop: 2, fontWeight: 600 }}>Explorer →</span>
        </button>
      ))}
    </section>
  );
}
