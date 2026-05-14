import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_EVENTS, EPOCHS, PERIODS, PERIOD_DESCRIPTIONS, STATIC_CONTENT, UA, cc } from "./data/timelineData.js";
import { buildPrompt, epochAt, fmt, L, makeCoord, zoomLvl } from "./utils/time.js";
import { drawAll } from "./canvas/drawTimeline.js";
import { css } from "./styles.js";
import { Topbar } from "./components/Topbar.jsx";
import { Legend } from "./components/Legend.jsx";
import { ZoomControls } from "./components/ZoomControls.jsx";
import { TimelineTooltip } from "./components/TimelineTooltip.jsx";
import { BookmarksPanel } from "./components/BookmarksPanel.jsx";
import { EventPanel } from "./components/EventPanel.jsx";
import { StatusBar } from "./components/StatusBar.jsx";
import { ExploreCards } from "./components/ExploreCards.jsx";

export default function Chronos() {
  const canvasRef = useRef(null), miniRef = useRef(null), wrapRef = useRef(null);
  const S = useRef({ vs: UA * 1.04, ve: 20, aiEvents: [], selectedId: null, hoveredId: null, fetchedZones: new Set(), fetching: false, fetchQueue: [], panelCache: {}, placed: [], lineY: 0 });
  const rafRef = useRef(null), fetchDebRef = useRef(null), animRef = useRef(null);

  // ── STORAGE ──
  useEffect(() => {
    (async () => {
      try {
        const cached = JSON.parse(localStorage.getItem("chronos-cache") || "null");
        if (cached && typeof cached === "object") Object.assign(S.current.panelCache, cached);
      } catch (e) {}
      try {
        const bm = JSON.parse(localStorage.getItem("chronos-bookmarks") || "null");
        if (bm && typeof bm === "object") setBookmarks(bm);
      } catch (e) {}
      try {
        const tags = JSON.parse(localStorage.getItem("chronos-tags") || "null");
        if (Array.isArray(tags)) setCustomTags(tags);
      } catch (e) {}
    })();
  }, []);

  const saveCache = useCallback(async () => {
    try { localStorage.setItem("chronos-cache", JSON.stringify(S.current.panelCache)); } catch (e) {}
  }, []);

  const saveBookmarks = useCallback(async (bm) => {
    try { localStorage.setItem("chronos-bookmarks", JSON.stringify(bm)); } catch (e) {}
  }, []);

  const saveTags = useCallback(async (tags) => {
    try { localStorage.setItem("chronos-tags", JSON.stringify(tags)); } catch (e) {}
  }, []);

  // États
  const [ui, setUi] = useState({ /* ... ton état initial */ });
  const [bookmarks, setBookmarks] = useState({});
  const [customTags, setCustomTags] = useState(["Favori", "À revoir", "Intéressant"]);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 760);

  const redraw = useCallback(() => {
    const cnv = canvasRef.current, mcnv = miniRef.current, wrap = wrapRef.current;
    if (!cnv || !wrap) return;

    const nextW = wrap.offsetWidth, nextH = wrap.offsetHeight;
    if (cnv.width !== nextW) cnv.width = nextW;
    if (cnv.height !== nextH) cnv.height = nextH;
    if (mcnv) {
      mcnv.width = 160;
      mcnv.height = 28;
    }

    const s = S.current;
    const r = drawAll(cnv, mcnv, { vs: s.vs, ve: s.ve, aiEvents: s.aiEvents, selectedId: s.selectedId, hoveredId: s.hoveredId });
    
    s.placed = r.placed;
    s.lineY = r.LINE_Y;
    s.periodY = r.PERIOD_Y;
    s.periodH = r.PERIOD_H;
    s.treeTop = r.TREE_TOP;

    const mid = makeCoord(s.vs, s.ve, cnv.width).toYa(cnv.width / 2);
    const ep = epochAt(mid);
    setUi(u => ({ ...u, 
      epochLabel: ep.label + "  ·  " + fmt(s.vs) + " → " + fmt(Math.max(s.ve, 0.1)),
      range: `zoom ×${Math.pow(10, zoomLvl(s.vs, s.ve)).toFixed(0)}` 
    }));
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(redraw);
  }, [redraw]);

  // ... (tes autres fonctions : navigateToEpoch, fetchZone, triggerFetch, fetchRich, etc. restent inchangées)

  const openPeriodPanel = useCallback((item) => {
    S.current.selectedId = null;
    scheduleRedraw();
    // ... ton code existant
  }, [scheduleRedraw]);

  const openPanel = useCallback((ev) => {
    S.current._currentPanelEv = ev;
    scheduleRedraw();
    setUi(u => ({ ...u, panelOpen: true, /* ... */ }));
    fetchRich(ev);
  }, [scheduleRedraw, fetchRich]);

  const closePanel = useCallback(() => {
    S.current.selectedId = null;
    scheduleRedraw();
    setUi(u => ({ ...u, panelOpen: false }));
  }, [scheduleRedraw]);

  // ====================== USEEFFECT PRINCIPAL (CLICS) ======================
  useEffect(() => {
    const wrap = wrapRef.current;
    const cnv = canvasRef.current;
    if (!wrap || !cnv) return;

    const onWheel = (e) => { /* ton code existant */ };

    let dragging = false;
    const onMD = (e) => { dragging = true; wrap.style.cursor = "grabbing"; };
    const onMU = () => { dragging = false; wrap.style.cursor = "grab"; };

    const onMM = (e) => { /* ton code existant */ };

    const onClick = (e) => {
      const rect = cnv.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const s = S.current;

      console.log("Click détecté →", { mx, my, placed: s.placed.length }); // ← debug temporaire

      // 1. Events
      for (const p of s.placed) {
        if (Math.abs(p.x - mx) < 16 && Math.abs(s.lineY - my) < 80) {
          openPanel(p.ev);
          return;
        }
      }

      // 2. Period band
      if (s.periodY && my >= s.periodY && my <= s.periodY + s.periodH) {
        const coord = makeCoord(s.vs, s.ve, cnv.width);
        const ya = coord.toYa(mx);
        const per = PERIODS.find(p => ya <= p.from && ya >= p.to);
        if (per) {
          openPeriodPanel(per);
          return;
        }
      }

      // 3. Epoch band
      if (s.periodY && my < s.periodY && my > 56) {
        const coord = makeCoord(s.vs, s.ve, cnv.width);
        const ya = coord.toYa(mx);
        const ep = EPOCHS.find(p => ya <= p.from && ya >= p.to);
        if (ep) {
          openPeriodPanel(ep);
          return;
        }
      }

      closePanel();
    };

    // Attachement des listeners
    cnv.addEventListener("wheel", onWheel, { passive: false });
    cnv.addEventListener("mousedown", onMD);
    cnv.addEventListener("click", onClick);
    cnv.addEventListener("touchstart", onTS, { passive: false });
    cnv.addEventListener("touchmove", onTM, { passive: false });
    cnv.addEventListener("touchend", onTE);

    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("resize", scheduleRedraw);

    scheduleRedraw();
    triggerFetch();

    return () => {
      // cleanup...
      cnv.removeEventListener("wheel", onWheel);
      cnv.removeEventListener("mousedown", onMD);
      cnv.removeEventListener("click", onClick);
      // ... autres remove
    };
  }, [scheduleRedraw, triggerFetch, zoomAround, openPanel, openPeriodPanel, closePanel]);

  return (
    <div style={css.app}>
      {/* style global ... */}

      <div className="chronos-shell" style={css.shell}>
        <Topbar /* ... */ />

        <main className="chronos-main" style={css.main}>
          {/* Header + ExploreCards */}

          <section style={css.timelineCard}>
            <div style={css.timelineToolbar}> {/* ... */} </div>

            <div ref={wrapRef} style={css.wrap}>
              <canvas ref={canvasRef} style={css.cnv} aria-label="Frise chronologique interactive" />

              {/* Overlays avec pointer-events contrôlés */}
              <Legend open={ui.legendOpen} style={{ pointerEvents: ui.legendOpen ? 'auto' : 'none' }} />
              
              <ZoomControls onZoomIn={() => zoomFromCenter(0.72)} onZoomOut={() => zoomFromCenter(1.38)} />

              <div className="chronos-mini" style={css.mini}>
                <canvas ref={miniRef} aria-hidden="true" />
              </div>

              <TimelineTooltip tooltip={ui.tooltip} />

              <BookmarksPanel
                open={ui.showBookmarksView}
                /* ... props */
                style={{ pointerEvents: ui.showBookmarksView ? 'auto' : 'none' }}
              />

              <EventPanel
                ui={ui}
                /* ... props */
                style={{ pointerEvents: ui.panelOpen ? 'auto' : 'none' }}
              />
            </div>
          </section>

          <StatusBar ui={ui} />
        </main>
      </div>
    </div>
  );
}
