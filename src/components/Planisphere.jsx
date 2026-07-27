import { useState, useEffect, useMemo } from "react";
import { PLATE_IDS, PLATES, PROJ_W, PROJ_H, transformsAt, platePathAt, projectPointAt, eraLabelAt } from "../data/geography.js";
import { SPECIES_GEO } from "../data/speciesGeo.js";
import { JOURNEYS, positionAt } from "../data/journeys.js";
import { ALL_NODES } from "./LifeTree.jsx";
import { fmt } from "../utils/time.js";

const ERA_PRESETS = [
  { label:"Aujourd'hui",      ya:0 },
  { label:"Néogène",          ya:15e6 },
  { label:"Extinction K-Pg",  ya:66e6 },
  { label:"Crétacé",          ya:100e6 },
  { label:"Jurassique",       ya:150e6 },
  { label:"Pangée",           ya:252e6 },
  { label:"Cambrien",         ya:500e6 },
];

const SPECIES_LIST = Object.keys(SPECIES_GEO)
  .map(id => ALL_NODES.find(n => n.id === id))
  .filter(Boolean);

const clean = (label="") => label.replace(/💀|⭐|🔀/g,"").trim();

export function Planisphere({ focusYa = null, selectedSpecies = null, onSelectSpecies, onClearSpecies }) {
  const [localYa, setLocalYa]         = useState(0);
  const [displayedYa, setDisplayedYa] = useState(0);
  const [search, setSearch]           = useState("");
  const [fade, setFade]               = useState(false);
  const [journeyId, setJourneyId]     = useState(null);
  const [journeyYa, setJourneyYa]     = useState(null);
  const [playing, setPlaying]         = useState(false);
  const journey = JOURNEYS.find(j => j.id === journeyId) || null;

  // La frise / l'arbre pilotent la carte via focusYa (navigation partagée).
  useEffect(() => { if (focusYa != null) setLocalYa(focusYa); }, [focusYa]);

  // Choisir une espèce recentre la carte sur son époque.
  useEffect(() => {
    if (selectedSpecies?.from != null) {
      const era = selectedSpecies.to != null ? (selectedSpecies.from + selectedSpecies.to) / 2 : selectedSpecies.from;
      setLocalYa(era);
    }
  }, [selectedSpecies]);

  // Animation fluide : la position affichée glisse vers la cible à chaque frame,
  // quelle que soit l'ampleur du saut temporel (durée perçue toujours similaire).
  useEffect(() => {
    let raf, alive = true;
    function tick() {
      let done = false;
      setDisplayedYa(prev => {
        const diff = localYa - prev;
        const eps = Math.max(1e3, Math.abs(localYa) * 0.0008);
        if (Math.abs(diff) < eps) { done = true; return localYa; }
        return prev + diff * 0.1;
      });
      if (!done && alive) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [localYa]);

  // Choisir un trajet : recentre la carte sur son point de départ.
  useEffect(() => {
    if (journey) {
      setJourneyYa(journey.steps[0].yearsAgo);
      setLocalYa(journey.steps[0].yearsAgo);
      setPlaying(false);
    } else {
      setJourneyYa(null);
      setPlaying(false);
    }
  }, [journeyId]);

  // Lecture automatique : fait défiler le temps du début à la fin du trajet,
  // durée perçue constante quelle que soit l'ampleur de l'écart de dates.
  useEffect(() => {
    if (!playing || !journey) return;
    const start = journey.steps[0].yearsAgo;
    const end = journey.steps[journey.steps.length - 1].yearsAgo;
    const duration = 7000;
    const t0 = performance.now();
    let raf, alive = true;
    function tick(now) {
      const f = Math.min(1, (now - t0) / duration);
      const ya = start + (end - start) * f;
      setJourneyYa(ya);
      setLocalYa(ya);
      if (f >= 1) { setPlaying(false); return; }
      if (alive) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [playing, journey]);

  const transforms = useMemo(() => transformsAt(displayedYa), [displayedYa]);
  const era = useMemo(() => eraLabelAt(displayedYa), [displayedYa]);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return SPECIES_LIST.filter(n => n.label.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  const geoPoints = selectedSpecies ? SPECIES_GEO[selectedSpecies.id] : null;
  const projected = useMemo(() => {
    if (!geoPoints) return [];
    return geoPoints.map(p => ({ ...p, ...projectPointAt(p.plate, p.lon, p.lat, transforms) }));
  }, [geoPoints, transforms]);

  const journeyPos = journey && journeyYa != null ? positionAt(journey, journeyYa) : null;
  const journeyProjected = useMemo(() => {
    if (!journey) return [];
    return journey.steps.map(s => ({ ...s, ...projectPointAt(s.plate, s.lon, s.lat, transforms) }));
  }, [journey, transforms]);
  const journeyMarker = useMemo(() => {
    if (!journey || !journeyPos) return null;
    return projectPointAt(journeyPos.plate, journeyPos.lon, journeyPos.lat, transforms);
  }, [journey, journeyPos, transforms]);

  // Petit fondu à chaque changement d'espèce plutôt qu'un pop-in brutal.
  useEffect(() => {
    setFade(false);
    if (selectedSpecies) {
      const t = setTimeout(() => setFade(true), 30);
      return () => clearTimeout(t);
    }
  }, [selectedSpecies?.id]);

  const sliderMax = 540e6;
  const sliderVal = Math.min(Math.max(localYa, 0), sliderMax);
  const speciesColor = selectedSpecies?.color || "#c2703d";

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"8px 32px 70px", fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:"#1c1917" }}>🌍 Le planisphère à travers les âges</div>
          <div style={{ fontSize:12.5, color:"rgba(28,25,23,.55)", marginTop:3, maxWidth:560 }}>
            Les continents dérivent selon la période choisie. Situez une espèce pour voir où elle a existé sur le globe.
          </div>
        </div>
        {selectedSpecies && (
          <button onClick={onClearSpecies}
            style={{ height:30, padding:"0 12px", borderRadius:999, border:"1px solid rgba(23,20,18,.15)",
              background:"#fff", color:"rgba(23,20,18,.6)", fontSize:11.5, cursor:"pointer", fontFamily:"inherit" }}>
            ✕ Effacer la sélection
          </button>
        )}
      </div>

      {/* Époques rapides */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {ERA_PRESETS.map(p => {
          const active = Math.abs(localYa - p.ya) < Math.max(2e6, p.ya * 0.03);
          return (
            <button key={p.label} onClick={() => setLocalYa(p.ya)}
              style={{ padding:"5px 11px", borderRadius:999, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                border:`1px solid ${active ? "#0e7490" : "rgba(23,20,18,.15)"}`,
                background: active ? "rgba(14,116,144,.1)" : "transparent",
                color: active ? "#0e7490" : "rgba(23,20,18,.6)", transition:"all .15s" }}>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Trajets animés */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:11, color:"rgba(28,25,23,.5)", marginRight:2 }}>Trajets :</span>
        {JOURNEYS.map(j => {
          const active = journeyId === j.id;
          return (
            <button key={j.id} onClick={() => setJourneyId(active ? null : j.id)}
              style={{ padding:"5px 11px", borderRadius:999, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                border:`1px solid ${active ? j.color : "rgba(23,20,18,.15)"}`,
                background: active ? j.color + "18" : "transparent",
                color: active ? j.color : "rgba(23,20,18,.6)", transition:"all .15s" }}>
              {j.label}
            </button>
          );
        })}
        {journey && (
          <>
            <button onClick={() => setPlaying(p => !p)}
              style={{ padding:"5px 13px", borderRadius:999, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                border:`1px solid ${journey.color}`, background:journey.color, color:"#fff" }}>
              {playing ? "⏸ Pause" : "▶ Lecture"}
            </button>
            <button onClick={() => setJourneyId(null)}
              style={{ height:26, padding:"0 10px", borderRadius:999, border:"1px solid rgba(23,20,18,.15)",
                background:"#fff", color:"rgba(23,20,18,.6)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
              ✕
            </button>
          </>
        )}
      </div>

      {/* Curseur temporel */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <span style={{ fontSize:10.5, color:"rgba(28,25,23,.5)", width:78, flexShrink:0 }}>Aujourd'hui</span>
        <input type="range" min={0} max={sliderMax} step={1e6} value={sliderVal}
          onChange={e => setLocalYa(Number(e.target.value))}
          style={{ flex:1, accentColor:"#0e7490" }} />
        <span style={{ fontSize:10.5, color:"rgba(28,25,23,.5)", width:56, flexShrink:0, textAlign:"right" }}>540 Ma</span>
      </div>

      {/* Recherche d'espèce */}
      <div style={{ position:"relative", marginBottom:18 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"rgba(23,20,18,.35)" }}>🔍</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Situer une espèce : Lucy, T-Rex, Mammouth, Néandertal…"
          style={{ width:"100%", height:40, borderRadius:9, border:"1px solid rgba(23,20,18,.14)", background:"#fff",
            padding:"0 14px 0 36px", fontSize:13, fontFamily:"inherit", color:"#171412", outline:"none", boxSizing:"border-box" }} />
        {results.length > 0 && (
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff",
            border:"1px solid rgba(23,20,18,.12)", borderRadius:9, boxShadow:"0 14px 34px rgba(23,20,18,.14)", zIndex:5, overflow:"hidden" }}>
            {results.map(n => (
              <div key={n.id} onClick={() => { onSelectSpecies(n); setSearch(""); }}
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 13px", cursor:"pointer",
                  borderBottom:"1px solid rgba(23,20,18,.06)", fontSize:13, color:"#171412" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(23,20,18,.03)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:n.color, flexShrink:0, opacity:n.eteint?.5:1 }} />
                <span>{clean(n.label)}</span>
                <span style={{ marginLeft:"auto", fontSize:11, color:"rgba(23,20,18,.4)" }}>{n.period}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carte */}
      <div style={{ position:"relative", borderRadius:16, overflow:"hidden",
        border:"1px solid rgba(23,20,18,.1)", boxShadow:"0 14px 36px rgba(23,20,18,.10)",
        background:"linear-gradient(180deg,#eef3f2,#e2eae7)" }}>
        <div style={{ position:"absolute", top:12, left:14, zIndex:2, fontSize:11.5, color:"rgba(28,25,23,.6)", pointerEvents:"none" }}>
          <span style={{ fontWeight:700, color:"#1c1917" }}>{era}</span>
          <span style={{ marginLeft:8 }}>· il y a {fmt(Math.max(displayedYa, 0.1))}</span>
        </div>

        <svg viewBox={`0 0 ${PROJ_W} ${PROJ_H}`} style={{ display:"block", width:"100%", height:"auto" }}>
          {/* Graticule discret */}
          {Array.from({ length:9 }, (_, i) => (i + 1) * (PROJ_W / 10)).map(x => (
            <line key={"vx"+x} x1={x} y1={0} x2={x} y2={PROJ_H} stroke="rgba(23,20,18,.05)" strokeWidth={1} />
          ))}
          {Array.from({ length:4 }, (_, i) => (i + 1) * (PROJ_H / 5)).map(y => (
            <line key={"hy"+y} x1={0} y1={y} x2={PROJ_W} y2={y} stroke="rgba(23,20,18,.05)" strokeWidth={1} />
          ))}
          <line x1={0} y1={PROJ_H/2} x2={PROJ_W} y2={PROJ_H/2} stroke="rgba(23,20,18,.09)" strokeWidth={1} strokeDasharray="3,4" />

          {/* Plaques continentales */}
          {PLATE_IDS.map(id => (
            <path key={id} d={platePathAt(id, transforms)} fill={PLATES[id].color + "cc"}
              stroke="rgba(23,20,18,.3)" strokeWidth={1.1} strokeLinejoin="round" />
          ))}
          {PLATE_IDS.map(id => {
            const t = transforms[id], pivot = PLATES[id].pivot;
            return (
              <text key={id+"-lbl"} x={pivot.x + t.dx} y={pivot.y + t.dy} textAnchor="middle"
                fontSize="9" fill="rgba(23,20,18,.42)" style={{ pointerEvents:"none" }}>
                {PLATES[id].label}
              </text>
            );
          })}

          {/* Zones de l'espèce sélectionnée */}
          {projected.length > 1 && (
            <polyline points={projected.map(p => `${p.x},${p.y}`).join(" ")} fill="none"
              stroke={speciesColor + "66"} strokeWidth={1} strokeDasharray="3,3"
              style={{ opacity:fade?1:0, transition:"opacity .5s ease" }} />
          )}
          {projected.map((p, i) => (
            <g key={i} style={{ opacity:fade?1:0, transition:`opacity .5s ease ${i*0.06}s` }}>
              <circle cx={p.x} cy={p.y} r={15} fill={speciesColor + "26"} />
              <circle cx={p.x} cy={p.y} r={5.5} fill={speciesColor} stroke="#fff" strokeWidth={1.5} />
            </g>
          ))}

          {/* Trajet animé */}
          {journey && journeyProjected.length > 1 && (
            <polyline points={journeyProjected.map(p => `${p.x},${p.y}`).join(" ")} fill="none"
              stroke={journey.color} strokeWidth={1.4} strokeDasharray="5,4" opacity={0.55} />
          )}
          {journey && journeyProjected.map((p, i) => (
            <g key={"jstep"+i}>
              <circle cx={p.x} cy={p.y} r={3} fill={journey.color} opacity={0.6} />
            </g>
          ))}
          {journey && journeyMarker && (
            <g>
              <circle cx={journeyMarker.x} cy={journeyMarker.y} r={13} fill={journey.color + "30"} />
              <circle cx={journeyMarker.x} cy={journeyMarker.y} r={5.5} fill={journey.color} stroke="#fff" strokeWidth={1.6} />
            </g>
          )}
        </svg>

        {journey && journeyPos && (
          <div style={{ position:"absolute", bottom:10, left:14, right:14, display:"flex", alignItems:"center", gap:8,
            flexWrap:"wrap", pointerEvents:"none" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:journey.color, flexShrink:0 }} />
            <strong style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#1c1917" }}>{journeyPos.label}</strong>
            <span style={{ fontSize:11, color:"rgba(28,25,23,.6)" }}>il y a {fmt(Math.max(journeyYa, 0.1))}</span>
          </div>
        )}

        {!journey && selectedSpecies && (
          <div style={{ position:"absolute", bottom:10, left:14, right:14, display:"flex", alignItems:"center", gap:8,
            flexWrap:"wrap", opacity:fade?1:0, transition:"opacity .5s ease", pointerEvents:"none" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:speciesColor, flexShrink:0 }} />
            <strong style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#1c1917" }}>{clean(selectedSpecies.label)}</strong>
            <span style={{ fontSize:11, color:"rgba(28,25,23,.6)" }}>
              {projected.map(p => p.note).join("  ·  ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
