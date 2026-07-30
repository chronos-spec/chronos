import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { PLATE_IDS, PLATES, PROJ_W, PROJ_H, transformsAt, platePathAt, projectPointAt, eraLabelAt } from "../data/geography.js";
import { SPECIES_GEO } from "../data/speciesGeo.js";
import { JOURNEYS, positionAt } from "../data/journeys.js";
import { ALL_NODES } from "./LifeTree.jsx";
import { fmt } from "../utils/time.js";

const WORLD_VIEW = { x: 0, y: 0, w: PROJ_W, h: PROJ_H };
const MIN_VIEW_W = PROJ_W * 0.06;   // zoom max ≈ ×16
const MAX_VIEW_W = PROJ_W;          // vue plein monde

function clampView(v) {
  const w = Math.min(MAX_VIEW_W, Math.max(MIN_VIEW_W, v.w));
  const h = w * (PROJ_H / PROJ_W);
  let x = Math.min(PROJ_W - w, Math.max(0, v.x));
  let y = Math.min(PROJ_H - h, Math.max(0, v.y));
  if (w >= PROJ_W) x = 0;
  if (h >= PROJ_H) y = 0;
  return { x, y, w, h };
}

const REDUCED_MOTION = typeof window!=="undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

const ERA_PRESETS = [
  { label:"Aujourd'hui",      ya:0 },
  { label:"Néogène",          ya:15e6 },
  { label:"Extinction K-Pg",  ya:66e6 },
  { label:"Crétacé",          ya:100e6 },
  { label:"Jurassique",       ya:152e6 },
  { label:"Pangée",           ya:335e6 },
  { label:"Pannotia",         ya:600e6 },
  { label:"Rodinia",          ya:750e6 },
  { label:"Rodinia assemblée",ya:1000e6 },
  { label:"Columbia/Nuna",    ya:1650e6 },
  { label:"Kenorland",        ya:2700e6 },
  { label:"Vaalbara",         ya:3200e6 },
];

const SPECIES_LIST = Object.keys(SPECIES_GEO)
  .map(id => ALL_NODES.find(n => n.id === id))
  .filter(Boolean);

const clean = (label="") => label.replace(/💀|⭐|🔀/g,"").trim();

export function Planisphere({ focusYa = null, selectedSpecies = null, onSelectSpecies, onClearSpecies, focusRegion = null, onClearRegion }) {
  const [localYa, setLocalYa]         = useState(0);
  const [displayedYa, setDisplayedYa] = useState(0);
  const [search, setSearch]           = useState("");
  const [fade, setFade]               = useState(false);
  const [journeyId, setJourneyId]     = useState(null);
  const [journeyYa, setJourneyYa]     = useState(null);
  const [playing, setPlaying]         = useState(false);
  const [view, setView]               = useState(WORLD_VIEW);   // viewBox courant (zoom/pan)
  const journey = JOURNEYS.find(j => j.id === journeyId) || null;

  const svgWrapRef = useRef(null);
  const viewAnimRef = useRef(null);
  const dragRef = useRef(null);

  // Anime le viewBox courant vers une cible (zoom/déplacement de caméra fluide).
  const animateViewTo = useCallback((target) => {
    if (viewAnimRef.current) cancelAnimationFrame(viewAnimRef.current);
    const dest = clampView(target);
    if (REDUCED_MOTION) { setView(dest); return; }
    const start = view, t0 = performance.now(), dur = 650;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setView({
        x: start.x + (dest.x-start.x)*ease, y: start.y + (dest.y-start.y)*ease,
        w: start.w + (dest.w-start.w)*ease, h: start.h + (dest.h-start.h)*ease,
      });
      if (t < 1) viewAnimRef.current = requestAnimationFrame(tick);
    };
    viewAnimRef.current = requestAnimationFrame(tick);
  }, [view]);

  // Cadre une zone (points ou boîte projetés) avec une marge confortable.
  const zoomToPoints = useCallback((pts, padFrac = 0.6) => {
    if (!pts?.length) return;
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const w0 = Math.max(x1-x0, 24), h0 = Math.max(y1-y0, 24);
    const padX = w0*padFrac + 40, padY = h0*padFrac + 40;
    x0 -= padX; x1 += padX; y0 -= padY; y1 += padY;
    const w = x1-x0, ratio = PROJ_W/PROJ_H;
    let vw = w, vh = w/ratio;
    if (vh < y1-y0) { vh = y1-y0; vw = vh*ratio; }
    const cx = (x0+x1)/2, cy = (y0+y1)/2;
    animateViewTo({ x: cx-vw/2, y: cy-vh/2, w: vw, h: vh });
  }, [animateViewTo]);

  const resetView = useCallback(() => animateViewTo(WORLD_VIEW), [animateViewTo]);

  // ── Molette = zoom, glisser = déplacer (comme la frise) ───────────────────
  useEffect(() => {
    const el = svgWrapRef.current; if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const fx = (e.clientX-rect.left)/rect.width, fy = (e.clientY-rect.top)/rect.height;
      setView(v => {
        const pivotX = v.x + fx*v.w, pivotY = v.y + fy*v.h;
        const factor = e.deltaY > 0 ? 1.16 : 0.86;
        const w = v.w*factor, h = w*(PROJ_H/PROJ_W);
        return clampView({ x: pivotX - fx*w, y: pivotY - fy*h, w, h });
      });
    };
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; el.style.cursor = "grabbing"; };
    const onMove = (e) => {
      if (!dragging) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX-lastX)/rect.width * view.w, dy = (e.clientY-lastY)/rect.height * view.h;
      lastX = e.clientX; lastY = e.clientY;
      setView(v => clampView({ ...v, x: v.x-dx, y: v.y-dy }));
    };
    const onUp = () => { dragging = false; el.style.cursor = "grab"; };
    el.addEventListener("wheel", onWheel, { passive:false });
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [view.w, view.h]);

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
        if (Math.abs(diff) < eps || REDUCED_MOTION) { done = true; return localYa; }
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
  // Facteur maintenant la taille à l'écran des marqueurs constante quel que soit le zoom.
  const zoomK = view.w / PROJ_W;

  // Choisir une espèce cadre aussi la carte sur l'endroit où elle a vécu —
  // calculé indépendamment de l'animation de caméra pour rester exact tout de suite.
  useEffect(() => {
    if (!selectedSpecies?.id) return;
    const geoPts = SPECIES_GEO[selectedSpecies.id];
    if (!geoPts?.length) return;
    const speciesEra = selectedSpecies.to != null ? (selectedSpecies.from + selectedSpecies.to) / 2 : selectedSpecies.from;
    const tr = transformsAt(speciesEra);
    zoomToPoints(geoPts.map(p => projectPointAt(p.plate, p.lon, p.lat, tr)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecies?.id]);

  // Un événement choisi sur la frise (avec coordonnées) cadre la carte sur sa région.
  useEffect(() => {
    if (!focusRegion?.points?.length) return;
    const tr = transformsAt(focusRegion.ya ?? localYa);
    zoomToPoints(focusRegion.points.map(p => projectPointAt(p.plate, p.lon, p.lat, tr)), focusRegion.padFrac ?? 0.7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRegion?.id]);

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

  // Événements de la même région que celui choisi sur la frise — projetés pour
  // être affichés ensemble, celui cliqué mis en évidence, les autres estompés.
  const regionProjected = useMemo(() => {
    if (!focusRegion?.events?.length) return [];
    return focusRegion.events.map(e => ({ ...e, ...projectPointAt(e.plate, e.lon, e.lat, transforms) }));
  }, [focusRegion, transforms]);
  const currentRegionEvent = regionProjected.find(e => e.id === focusRegion?.currentId) || null;

  // Petit fondu à chaque changement d'espèce plutôt qu'un pop-in brutal.
  useEffect(() => {
    setFade(false);
    if (selectedSpecies) {
      const t = setTimeout(() => setFade(true), 30);
      return () => clearTimeout(t);
    }
  }, [selectedSpecies?.id]);

  // Le curseur remonte jusqu'à Rodinia (750 Ma) : au-delà, la résolution linéaire
  // deviendrait inutilisable pour l'ère récente (mieux peuplée en évènements/espèces).
  // Les supercontinents plus anciens (Rodinia assemblée, Columbia/Nuna, Kenorland,
  // Vaalbara) restent accessibles via les boutons de préréglages ci-dessus.
  const sliderMax = 750e6;
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
        <span style={{ fontSize:10.5, color:"rgba(28,25,23,.5)", width:56, flexShrink:0, textAlign:"right" }}>750 Ma</span>
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
        background:"#0a2f4d" }}>
        <div style={{ position:"absolute", top:12, left:14, zIndex:2, fontSize:11.5, color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,.55)", pointerEvents:"none" }}>
          <span style={{ fontWeight:700 }}>{era}</span>
          <span style={{ marginLeft:8 }}>· il y a {fmt(Math.max(displayedYa, 0.1))}</span>
        </div>
        <div style={{ position:"absolute", top:12, right:14, zIndex:2, display:"flex", alignItems:"center", gap:8 }}>
          {(view.w < PROJ_W*0.995) && (
            <button onClick={resetView} title="Revenir à la vue plein monde"
              style={{ padding:"4px 11px", borderRadius:999, border:"1px solid rgba(23,20,18,.15)", background:"rgba(255,255,255,.92)",
                color:"rgba(23,20,18,.65)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              ⤢ Vue mondiale
            </button>
          )}
          <span style={{ fontSize:9.5, color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,.55)", pointerEvents:"none" }}>Molette = zoom · Glisser = déplacer</span>
        </div>

        <svg ref={svgWrapRef} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          style={{ display:"block", width:"100%", height:"auto", cursor:"grab", touchAction:"none" }}>
          <defs>
            {/* Océan : plus profond aux pôles, plus clair sous les tropiques — comme vu de l'espace */}
            <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2={PROJ_H} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#0d3a5c" />
              <stop offset="12%"  stopColor="#134f74" />
              <stop offset="28%"  stopColor="#1c6f96" />
              <stop offset="42%"  stopColor="#2790a8" />
              <stop offset="50%"  stopColor="#2f9cae" />
              <stop offset="58%"  stopColor="#2790a8" />
              <stop offset="72%"  stopColor="#1c6f96" />
              <stop offset="88%"  stopColor="#134f74" />
              <stop offset="100%" stopColor="#0d3a5c" />
            </linearGradient>
            {/* Terre : bandes de biomes par latitude — calottes glaciaires, forêts
                boréales, déserts subtropicaux, bande équatoriale verte — un seul
                dégradé partagé par tous les continents pour un rendu cohérent
                façon composite satellite (dans l'esprit d'une NASA Blue Marble). */}
            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2={PROJ_H} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#eef3f6" />
              <stop offset="7%"   stopColor="#d7e2d3" />
              <stop offset="16%"  stopColor="#5f8f5a" />
              <stop offset="28%"  stopColor="#4f8c4f" />
              <stop offset="36%"  stopColor="#9aa85f" />
              <stop offset="42%"  stopColor="#d9c27a" />
              <stop offset="48%"  stopColor="#c3b168" />
              <stop offset="50%"  stopColor="#2f6b3f" />
              <stop offset="52%"  stopColor="#c3b168" />
              <stop offset="58%"  stopColor="#d9c27a" />
              <stop offset="64%"  stopColor="#9aa85f" />
              <stop offset="76%"  stopColor="#4f8c4f" />
              <stop offset="88%"  stopColor="#5f8f5a" />
              <stop offset="95%"  stopColor="#d7e2d3" />
              <stop offset="100%" stopColor="#eef3f6" />
            </linearGradient>
          </defs>

          <rect x={0} y={0} width={PROJ_W} height={PROJ_H} fill="url(#oceanGrad)" />

          {/* Graticule discret */}
          {Array.from({ length:9 }, (_, i) => (i + 1) * (PROJ_W / 10)).map(x => (
            <line key={"vx"+x} x1={x} y1={0} x2={x} y2={PROJ_H} stroke="rgba(255,255,255,.07)" strokeWidth={1} />
          ))}
          {Array.from({ length:4 }, (_, i) => (i + 1) * (PROJ_H / 5)).map(y => (
            <line key={"hy"+y} x1={0} y1={y} x2={PROJ_W} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth={1} />
          ))}
          <line x1={0} y1={PROJ_H/2} x2={PROJ_W} y2={PROJ_H/2} stroke="rgba(255,255,255,.12)" strokeWidth={1} strokeDasharray="3,4" />

          {/* Plaques continentales — dégradé de biomes partagé, contour propre à chaque plaque */}
          {PLATE_IDS.map(id => (
            <path key={id} d={platePathAt(id, transforms)} fill="url(#landGrad)"
              stroke={PLATES[id].color} strokeOpacity={0.55} strokeWidth={1.1} strokeLinejoin="round" />
          ))}
          {PLATE_IDS.map(id => {
            const t = transforms[id], pivot = PLATES[id].pivot;
            return (
              <text key={id+"-lbl"} x={pivot.x + t.dx} y={pivot.y + t.dy} textAnchor="middle"
                fontSize="9" fill="#1c1917" opacity={0.55} style={{ pointerEvents:"none" }}>
                {PLATES[id].label}
              </text>
            );
          })}

          {/* Zones de l'espèce sélectionnée */}
          {projected.length > 1 && (
            <polyline points={projected.map(p => `${p.x},${p.y}`).join(" ")} fill="none"
              stroke={speciesColor + "66"} strokeWidth={zoomK} strokeDasharray={`${zoomK*3},${zoomK*3}`}
              style={{ opacity:fade?1:0, transition:"opacity .5s ease" }} />
          )}
          {projected.map((p, i) => (
            <g key={i} style={{ opacity:fade?1:0, transition:`opacity .5s ease ${i*0.06}s` }}>
              <circle cx={p.x} cy={p.y} r={15*zoomK} fill={speciesColor + "26"} />
              <circle cx={p.x} cy={p.y} r={5.5*zoomK} fill={speciesColor} stroke="#fff" strokeWidth={1.5*zoomK} />
            </g>
          ))}

          {/* Trajet animé */}
          {journey && journeyProjected.length > 1 && (
            <polyline points={journeyProjected.map(p => `${p.x},${p.y}`).join(" ")} fill="none"
              stroke={journey.color} strokeWidth={1.4*zoomK} strokeDasharray={`${5*zoomK},${4*zoomK}`} opacity={0.55} />
          )}
          {journey && journeyProjected.map((p, i) => (
            <g key={"jstep"+i}>
              <circle cx={p.x} cy={p.y} r={3*zoomK} fill={journey.color} opacity={0.6} />
            </g>
          ))}
          {journey && journeyMarker && (
            <g>
              <circle cx={journeyMarker.x} cy={journeyMarker.y} r={13*zoomK} fill={journey.color + "30"} />
              <circle cx={journeyMarker.x} cy={journeyMarker.y} r={5.5*zoomK} fill={journey.color} stroke="#fff" strokeWidth={1.6*zoomK} />
            </g>
          )}

          {/* Événements de la région choisie sur la frise — l'un d'eux mis en évidence */}
          {regionProjected.map(e => {
            const isCurrent = e.id === focusRegion?.currentId;
            return (
              <g key={e.id}>
                {isCurrent && <circle cx={e.x} cy={e.y} r={16*zoomK} fill="#c2703d26" />}
                <circle cx={e.x} cy={e.y} r={(isCurrent?6.5:4)*zoomK} fill={isCurrent ? "#c2703d" : "#0e7490"}
                  stroke="#fff" strokeWidth={(isCurrent?1.8:1.2)*zoomK} />
              </g>
            );
          })}
        </svg>

        {focusRegion && regionProjected.length > 0 ? (
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(255,253,248,.97)",
            borderTop:"1px solid rgba(23,20,18,.1)", padding:"8px 12px" }}>
            <div style={{ fontSize:10.5, color:"rgba(28,25,23,.5)", marginBottom:5, display:"flex", alignItems:"center", gap:8 }}>
              <span>📍 <strong style={{ color:"#1c1917" }}>{focusRegion.regionLabel}</strong>
              {" "}· {regionProjected.length} événement{regionProjected.length>1?"s":""} connu{regionProjected.length>1?"s":""} ici</span>
              {onClearRegion && (
                <button onClick={onClearRegion} aria-label="Fermer"
                  style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", border:"none", background:"transparent",
                    color:"rgba(23,20,18,.4)", fontSize:12, cursor:"pointer", lineHeight:1, flexShrink:0 }}>
                  ✕
                </button>
              )}
            </div>
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
              {regionProjected.map(e => {
                const isCurrent = e.id === focusRegion.currentId;
                return (
                  <span key={e.id} style={{ flexShrink:0, display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999,
                    border:`1px solid ${isCurrent ? "#c2703d" : "rgba(23,20,18,.15)"}`, background:isCurrent ? "rgba(194,112,61,.12)" : "#fff",
                    fontSize:11, color:isCurrent ? "#c2703d" : "rgba(23,20,18,.65)", fontWeight:isCurrent?700:500, whiteSpace:"nowrap" }}>
                    {e.title} <span style={{ opacity:.65 }}>· {fmt(e.yearsAgo)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : journey && journeyPos ? (
          <div style={{ position:"absolute", bottom:10, left:14, right:14, display:"flex", alignItems:"center", gap:8,
            flexWrap:"wrap", pointerEvents:"none" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:journey.color, flexShrink:0 }} />
            <strong style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#1c1917" }}>{journeyPos.label}</strong>
            <span style={{ fontSize:11, color:"rgba(28,25,23,.6)" }}>il y a {fmt(Math.max(journeyYa, 0.1))}</span>
          </div>
        ) : selectedSpecies ? (
          <div style={{ position:"absolute", bottom:10, left:14, right:14, display:"flex", alignItems:"center", gap:8,
            flexWrap:"wrap", opacity:fade?1:0, transition:"opacity .5s ease", pointerEvents:"none" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:speciesColor, flexShrink:0 }} />
            <strong style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#1c1917" }}>{clean(selectedSpecies.label)}</strong>
            <span style={{ fontSize:11, color:"rgba(28,25,23,.6)" }}>
              {projected.map(p => p.note).join("  ·  ")}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
