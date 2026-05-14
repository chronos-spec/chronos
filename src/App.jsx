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
  const canvasRef = useRef(null);
  const miniRef = useRef(null);
  const wrapRef = useRef(null);

  const S = useRef({
    vs: UA * 1.04,
    ve: 20,
    aiEvents: [],
    selectedId: null,
    hoveredId: null,
    fetchedZones: new Set(),
    fetching: false,
    fetchQueue: [],
    panelCache: {},
    placed: [],
    lineY: 0,
    periodY: 0,
    periodH: 0,
  });

  const rafRef = useRef(null);
  const fetchDebRef = useRef(null);
  const animRef = useRef(null);

  // États UI
  const [ui, setUi] = useState({
    epochLabel: "Vue globale",
    range: "",
    aiVisible: false,
    aiLabel: "",
    legendOpen: false,
    panelOpen: false,
    panelCat: "",
    panelCatColor: "#555",
    panelDate: "",
    panelTitle: "",
    panelContent: null,
    panelError: null,
    tooltip: null,
    searchOpen: false,
    searchQuery: "",
    searchResults: [],
    searchLoading: false,
    searchDone: false,
    panelEventId: null,
    showBookmarkMenu: false,
    showBookmarksView: false,
  });

  const [bookmarks, setBookmarks] = useState({});
  const [customTags, setCustomTags] = useState(["Favori", "À revoir", "Intéressant"]);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Redraw
  const redraw = useCallback(() => {
    const cnv = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cnv || !wrap) return;

    cnv.width = wrap.offsetWidth;
    cnv.height = wrap.offsetHeight;

    const s = S.current;
    const result = drawAll(cnv, miniRef.current, {
      vs: s.vs,
      ve: s.ve,
      aiEvents: s.aiEvents,
      selectedId: s.selectedId,
      hoveredId: s.hoveredId,
    });

    s.placed = result.placed || [];
    s.lineY = result.LINE_Y || 0;
    s.periodY = result.PERIOD_Y || 0;
    s.periodH = result.PERIOD_H || 0;

    const mid = makeCoord(s.vs, s.ve, cnv.width).toYa(cnv.width / 2);
    const ep = epochAt(mid);

    setUi(u => ({
      ...u,
      epochLabel: `${ep.label}  ·  ${fmt(s.vs)} → ${fmt(Math.max(s.ve, 0.1))}`,
      range: `zoom ×${Math.pow(10, zoomLvl(s.vs, s.ve)).toFixed(0)}`
    }));
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(redraw);
  }, [redraw]);

  // ==================== CLIC HANDLER ====================
  const handleCanvasClick = useCallback((e) => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const rect = cnv.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const s = S.current;

    // Events
    for (const p of s.placed) {
      if (Math.abs(p.x - mx) < 18 && Math.abs(s.lineY - my) < 90) {
        openPanel(p.ev);
        return;
      }
    }

    // Periods / Epochs
    if (s.periodY && my >= s.periodY && my <= s.periodY + s.periodH) {
      const coord = makeCoord(s.vs, s.ve, cnv.width);
      const ya = coord.toYa(mx);
      const per = PERIODS.find(p => ya <= p.from && ya >= p.to);
      if (per) {
        openPeriodPanel(per);
        return;
      }
    }

    if (s.periodY && my < s.periodY && my > 50) {
      const coord = makeCoord(s.vs, s.ve, cnv.width);
      const ya = coord.toYa(mx);
      const ep = EPOCHS.find(p => ya <= p.from && ya >= p.to);
      if (ep) {
        openPeriodPanel(ep);
        return;
      }
    }

    closePanel();
  }, []);

  // ==================== useEffect principal ====================
  useEffect(() => {
    const wrap = wrapRef.current;
    const cnv = canvasRef.current;
    if (!wrap || !cnv) return;

    const onClick = (e) => handleCanvasClick(e);

    cnv.addEventListener("click", onClick);
    window.addEventListener("resize", scheduleRedraw);

    // Premier affichage
    scheduleRedraw();

    return () => {
      cnv.removeEventListener("click", onClick);
      window.removeEventListener("resize", scheduleRedraw);
    };
  }, [handleCanvasClick, scheduleRedraw]);

  // Placeholder pour les autres fonctions (à compléter ensuite)
  const openPanel = useCallback((ev) => {
    console.log("Ouverture panel :", ev.title);
    setUi(u => ({ ...u, panelOpen: true, panelTitle: ev.title }));
  }, []);

  const openPeriodPanel = useCallback((item) => {
    console.log("Ouverture période :", item.label);
    setUi(u => ({ ...u, panelOpen: true, panelTitle: item.label }));
  }, []);

  const closePanel = useCallback(() => {
    setUi(u => ({ ...u, panelOpen: false }));
  }, []);

  return (
    <div style={css.app}>
      <div className="chronos-shell" style={css.shell}>
        <Topbar ui={ui} setUi={setUi} />

        <main className="chronos-main" style={css.main}>
          <header className="chronos-header" style={css.mainHeader}>
            <h1>Chronos Atlas</h1>
          </header>

          <ExploreCards navigateToEpoch={() => {}} />

          <section style={css.timelineCard}>
            <div ref={wrapRef} style={css.wrap}>
              <canvas ref={canvasRef} style={css.cnv} />
              <Legend open={ui.legendOpen} />
              <ZoomControls />
              <TimelineTooltip tooltip={ui.tooltip} />
              <BookmarksPanel open={ui.showBookmarksView} />
              <EventPanel ui={ui} closePanel={closePanel} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
