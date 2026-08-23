import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ALL_EVENTS, CAT_COL } from "../data/timelineData.js";
import { L, fmt } from "../utils/time.js";

// ══════════════════════════════════════════════════════════════════════════
// FRISE 3D — mêmes données que la frise 2D (ALL_EVENTS), rejouées comme un
// vrai « couloir du temps » en WebGL (three.js) plutôt qu'une simple
// perspective CSS. L'axe Z porte le temps (échelle log10, comme la frise
// 2D) ; chaque catégorie occupe un secteur angulaire autour de cet axe, ce
// qui donne une sorte de galaxie en spirale où les époques se distinguent
// visuellement. Molette = avancer/reculer dans le temps, glisser = orbiter,
// clic = fiche.
// ══════════════════════════════════════════════════════════════════════════

const CAT_LABELS = { cosmique:"Cosmique", geologique:"Géologie", biologique:"Biologie", prehistoire:"Préhistoire", histoire:"Histoire", biblique:"Biblique" };
const CAT_ORDER = Object.keys(CAT_COL);

const Z_SCALE = 14;
const L0 = L(0.1); // référence "aujourd'hui"
function yaToZ(ya) { return -(L(Math.max(ya, 0.1)) - L0) * Z_SCALE; }
function zToYa(z) { return Math.pow(10, L0 - z / Z_SCALE); }
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

export function Timeline3D({ onBackHome, onBack2D }) {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);
  const [nowLabel, setNowLabel] = useState("Aujourd'hui");
  const [hiddenCats, setHiddenCats] = useState(() => new Set());
  const hiddenCatsRef = useRef(hiddenCats);
  useEffect(() => { hiddenCatsRef.current = hiddenCats; }, [hiddenCats]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let width = mount.clientWidth, height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060f);
    scene.fog = new THREE.FogExp2(0x05060f, 0.0028);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // Champ d'étoiles — décor, cohérent avec le thème "univers" du reste du site.
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 500;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 500;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 400 - 80;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.65 }));
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pLight = new THREE.PointLight(0xffffff, 1.2, 0, 0); // sans atténuation : éclaire tout le couloir également
    camera.add(pLight);
    scene.add(camera);

    // ── Nœuds événements ──────────────────────────────────────────────────
    const catIndex = Object.fromEntries(CAT_ORDER.map((c, i) => [c, i]));
    const slots = CAT_ORDER.length;
    const meshes = [];
    const group = new THREE.Group();
    scene.add(group);

    for (const ev of ALL_EVENTS) {
      const z = yaToZ(ev.yearsAgo);
      const baseAngle = ((catIndex[ev.cat] ?? 0) / slots) * Math.PI * 2;
      const jitter = ((hashStr(ev.id) % 1000) / 1000 - 0.5) * (Math.PI * 2 / slots) * 0.75;
      const angle = baseAngle + jitter + z * 0.004; // léger vrillage en spirale avec la profondeur
      const radius = 3.2 + (3 - (ev.importance || 2)) * 0.9;
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;

      const r = ev.importance === 1 ? 0.85 : ev.importance === 2 ? 0.55 : 0.36;
      const color = new THREE.Color(CAT_COL[ev.cat] || "#999999");
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.55, roughness: 0.5, metalness: 0.05 })
      );
      mesh.position.set(x, y, z);
      mesh.userData.event = ev;
      group.add(mesh);
      meshes.push(mesh);
    }

    // ── Caméra + contrôles ───────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 1.5;
    controls.maxDistance = 600;
    // Plan large au démarrage : on voit d'emblée tout le couloir se dérouler
    // en spirale dans le lointain, plutôt qu'être collé aux tout derniers
    // évènements récents.
    controls.target.set(0, 0, -55);
    camera.position.set(14, 16, 34);
    controls.update();

    // ── Survol / clic ────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();
    let hoveredMesh = null;

    function pickAt(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNdc, camera);
      const hits = raycaster.intersectObjects(meshes.filter(m => m.visible), false);
      return hits.length ? hits[0].object : null;
    }

    function onPointerMove(e) {
      const hit = pickAt(e.clientX, e.clientY);
      if (hit !== hoveredMesh) {
        if (hoveredMesh) hoveredMesh.scale.setScalar(1);
        hoveredMesh = hit;
        if (hoveredMesh) hoveredMesh.scale.setScalar(1.7);
        renderer.domElement.style.cursor = hoveredMesh ? "pointer" : "grab";
        setHovered(hit ? hit.userData.event : null);
      }
      if (hoveredMesh) {
        const rect = renderer.domElement.getBoundingClientRect();
        setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
    function onClick(e) {
      const hit = pickAt(e.clientX, e.clientY);
      if (hit) setSelected(hit.userData.event);
    }
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);

    function onControlsChange() {
      setNowLabel(fmt(Math.max(zToYa(camera.position.z), 0)));
    }
    controls.addEventListener("change", onControlsChange);
    onControlsChange();

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const hidden = hiddenCatsRef.current;
      for (const m of meshes) {
        const should = !hidden.has(m.userData.event.cat);
        if (m.visible !== should) m.visible = should;
      }
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      width = mount.clientWidth; height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      meshes.forEach(m => { m.geometry.dispose(); m.material.dispose(); });
      starGeo.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  const toggleCat = useCallback((cat) => {
    setHiddenCats(prev => { const next = new Set(prev); next.has(cat) ? next.delete(cat) : next.add(cat); return next; });
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05060f", fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif" }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />

      {/* Bandeau supérieur */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          <button onClick={onBackHome} title="Retour à l'accueil"
            style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#f2eee6", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            🏠
          </button>
          {onBack2D && (
            <button onClick={onBack2D} title="Revenir à la frise 2D"
              style={{ height: 32, padding: "0 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#f2eee6", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              ↩ Frise 2D
            </button>
          )}
          <div style={{ color: "rgba(242,238,230,.55)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" }}>Chronos · Frise 3D</div>
        </div>
        <div style={{ textAlign: "right", pointerEvents: "auto" }}>
          <div style={{ color: "#f2eee6", fontSize: 13, fontWeight: 600 }}>il y a {nowLabel}</div>
          <div style={{ color: "rgba(242,238,230,.42)", fontSize: 10, marginTop: 2 }}>Glisser = orbiter · Molette = avancer/reculer dans le temps · Clic = fiche</div>
        </div>
      </div>

      {/* Légende catégories */}
      <div style={{ position: "absolute", left: 22, bottom: 22, zIndex: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {CAT_ORDER.map(cat => {
          const off = hiddenCats.has(cat);
          return (
            <button key={cat} onClick={() => toggleCat(cat)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 8px", borderRadius: 999, cursor: "pointer",
                border: "1px solid rgba(255,255,255,.14)", background: "rgba(255,255,255,.05)", opacity: off ? .4 : 1, fontFamily: "inherit" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COL[cat] }} />
              <span style={{ fontSize: 11, color: "#f2eee6" }}>{CAT_LABELS[cat] || cat}</span>
            </button>
          );
        })}
      </div>

      {/* Info-bulle au survol */}
      {hovered && !selected && (
        <div style={{ position: "absolute", left: hoverPos.x + 16, top: hoverPos.y - 10, zIndex: 20, pointerEvents: "none",
          background: "rgba(15,13,26,.92)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8, padding: "8px 12px", maxWidth: 220,
          boxShadow: "0 10px 26px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 10.5, color: "rgba(242,238,230,.5)", marginBottom: 3 }}>{hovered.date_label}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f2eee6" }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: CAT_COL[hovered.cat], marginRight: 6 }} />
            {hovered.title}
          </div>
        </div>
      )}

      {/* Fiche complète */}
      {selected && (
        <div style={{ position: "absolute", right: 22, top: 70, bottom: 22, zIndex: 20, width: "min(360px, 88vw)",
          background: "rgba(15,13,26,.94)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "20px 22px",
          boxShadow: "0 20px 50px rgba(0,0,0,.5)", overflowY: "auto", backdropFilter: "blur(6px)" }}>
          <button onClick={() => setSelected(null)} aria-label="Fermer"
            style={{ float: "right", width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#f2eee6", cursor: "pointer" }}>✕</button>
          <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: CAT_COL[selected.cat], fontWeight: 700, marginBottom: 6 }}>
            {CAT_LABELS[selected.cat] || selected.cat}
          </div>
          <div style={{ fontSize: 13, color: "rgba(242,238,230,.55)", marginBottom: 8 }}>{selected.date_label}</div>
          <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 24, color: "#f7f4ec", lineHeight: 1.2, marginBottom: 14 }}>{selected.title}</div>
          <div style={{ fontSize: 14, color: "rgba(242,238,230,.78)", lineHeight: 1.6 }}>{selected.desc}</div>
        </div>
      )}
    </div>
  );
}
