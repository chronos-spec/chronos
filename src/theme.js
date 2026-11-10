// src/theme.js — source unique de vérité pour l'identité visuelle de Chronos
// (identité v2). Un seul export nommé `theme` : tout le reste du code lit
// ses valeurs ici plutôt que de redéfinir des couleurs/tailles en dur.
//
// Principe directeur : la profondeur, c'est le temps. Plus une époque est
// ancienne, plus elle est sombre et froide ; le présent est clair et net.
// `surfaces` porte ce dégradé pour le fond du canvas ; `eras` porte l'accent
// de chaque grande ère (mappé sur les labels réels de data/timelineData.js
// via `eras.byEpoch`), du plus froid (cosmos, violet) au plus chaud
// (histoire humaine, crème claire).

// rgba() à partir d'un hex — module-scope pour pouvoir précalculer les
// variantes de texte/bordure ci-dessous ET rester accessible comme méthode
// publique (`theme.alpha`) pour composer des alphas depuis l'extérieur.
function rgbaFromHex(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.length===3?h[0]+h[0]:h.substring(0,2), 16);
  const g = parseInt(h.length===3?h[1]+h[1]:h.substring(2,4), 16);
  const b = parseInt(h.length===3?h[2]+h[2]:h.substring(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
const TEXT_DARK = "#0E1116", TEXT_LIGHT = "#F4EFE6";

export const theme = {
  // Fond du canvas, du plus ancien au plus récent, + panneau (arbre du vivant).
  surfaces: {
    canvasDeep:   "#05060F", // cosmos, Terre primitive
    canvasMid:    "#0B1024", // vie ancienne, Mésozoïque
    canvasRecent: "#121A33", // Cénozoïque, histoire humaine
    panel:        "#FFFFFF",
    panelSoft:    "#FAFAFA", // fond très légèrement teinté du panneau (zébrures, survol) — neutre, pas chaud
  },

  // Texte : foncé sur fond clair (panneau), clair sur fond sombre (canvas).
  // `muted`/`faint` sont les mêmes teintes atténuées (remplace les bases RGB
  // multiples "23,20,18 / 28,25,23 / 18,16,14" relevées à l'audit par UNE
  // seule base par rôle, à l'alpha près).
  text: {
    dark:  TEXT_DARK,
    light: TEXT_LIGHT, // aussi la teinte de l'ère "histoire humaine" (voir eras)
    muted: rgbaFromHex(TEXT_DARK, .58),
    faint: rgbaFromHex(TEXT_DARK, .38),
    mutedOnDark: rgbaFromHex(TEXT_LIGHT, .6),
    faintOnDark: rgbaFromHex(TEXT_LIGHT, .4),
  },

  // Teinte d'accent par grande ère. Désaturée, jamais un aplat criard.
  // `byEpoch` mappe ces six teintes sur les 9 labels réels de EPOCHS
  // (data/timelineData.js) : Hadéen+Archéen partagent "terrePrimitive",
  // Protérozoïque+Paléozoïque partagent "vieAncienne", Préhistoire+Histoire
  // partagent "histoireHumaine" — le regroupement suit le principe directeur
  // (froid→chaud), pas une correspondance 1-pour-1 avec chaque ère géologique.
  eras: {
    cosmos:          "#6C63FF",
    terrePrimitive:  "#3487A8", // ajusté depuis #2F7F9E — voir notes de contraste
    vieAncienne:     "#2FA98C",
    mesozoique:      "#7DB55A",
    cenozoique:      "#E8705F",
    histoireHumaine: "#F4EFE6",
    byEpoch: {
      "Cosmique":      "cosmos",
      "Hadéen":        "terrePrimitive",
      "Archéen":       "terrePrimitive",
      "Protérozoïque": "vieAncienne",
      "Paléozoïque":   "vieAncienne",
      "Mésozoïque":    "mesozoique",
      "Cénozoïque":    "cenozoique",
      "Préhistoire":   "histoireHumaine",
      "Histoire":      "histoireHumaine",
      "Quaternaire":   "histoireHumaine", // alias : Préhistoire+Histoire réunies (bandes imbriquées)
    },
  },

  // Ambre réservé EXCLUSIVEMENT aux évènements d'extinction — aucune teinte
  // d'`eras` ci-dessus ne tombe entre 30° et 50° de teinte (la seule
  // exception volontaire est histoireHumaine, ~38°, mais sa saturation est
  // si faible — ~6% contre ~60% pour l'ambre — qu'elle ne peut pas être
  // confondue avec un marqueur d'extinction).
  extinction: "#B9822F",

  // Accent de marque générique (spinner de recherche, badge IA, signet actif
  // par défaut…) — distinct de l'ambre d'extinction. Reprend `eras.cosmos`
  // (Chronos commence au cosmos) plutôt que d'introduire une 7e couleur.
  accent: "#6C63FF",

  // Marqueur "aujourd'hui" sur la frise — vert distinct des teintes d'ère,
  // éclairci par rapport à l'ancien #0A7848 pour rester lisible (8,6:1) sur
  // le nouveau fond de canvas sombre (l'ancien ne passait qu'à 3,65:1).
  today: "#3FBE8E",

  border: {
    onLight: rgbaFromHex(TEXT_DARK, .12),
    onLightHairline: rgbaFromHex(TEXT_DARK, .10),
    onLightStrong: rgbaFromHex(TEXT_DARK, .22),
    onDark: rgbaFromHex(TEXT_LIGHT, .16),
    onDarkStrong: rgbaFromHex(TEXT_LIGHT, .28),
  },

  font: {
    serif: "'Fraunces',Georgia,serif",        // noms scientifiques, titres
    ui:    "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    mono:  "'DM Mono',ui-monospace,SFMono-Regular,Menlo,monospace", // dates, échelle
  },

  // Échelle de tailles (px).
  size: { xs:10, sm:11, base:13, md:15, lg:18, xl:23, xxl:31 },

  radius: { sm:6, md:10, lg:16, pill:999 },

  space: { xs:4, sm:8, md:12, lg:18, xl:24, xxl:32 },

  // Durées/courbes d'animation — prêtes pour la suite (hover, panneau, zoom).
  duration: { hover:180, panel:260, filter:150, zoom:260 },
  ease: {
    standard: "cubic-bezier(.16,1,.3,1)",
    out: "cubic-bezier(.2,.8,.2,1)",
  },

  // rgba() à partir d'un hex du thème — pour composer des alphas côté canvas
  // sans dupliquer de triplet RGB en dur (c'était la source du doublon
  // "23,20,18 / 28,25,23 / 18,16,14" relevé à l'audit).
  alpha(hex, a) { return rgbaFromHex(hex, a); },

  // Teinte d'ère pour un label EPOCHS donné (ex. "Mésozoïque" → "#7DB55A").
  eraColorFor(epochLabel) {
    const key = this.eras.byEpoch[epochLabel];
    return key ? this.eras[key] : this.text.light;
  },
};

// ════════════════════════════════════════════════════════════════════════
// COMPAT TEMPORAIRE — supprimée à l'Étape 2 de la migration identité-v2.
// Reprend telles quelles (aucune valeur changée) les anciennes constantes
// nommées que styles.js / drawTimeline.js / LifeTree.jsx / App.jsx importent
// encore, pour que `npm run build` continue de passer et que rien ne change
// visuellement tant que ces fichiers n'ont pas été migrés vers `theme`.
// Ne pas ajouter de nouvel usage de ces constantes : importer `theme`.
// ════════════════════════════════════════════════════════════════════════
export const INK        = "#37352f";
export const INK_STRONG = "#171412";
export const INK_RGB    = "55,53,47";
export const ink        = (a) => `rgba(${INK_RGB},${a})`;
export const MUTED      = ink(.58);
export const FAINT      = ink(.38);
export const LINE       = ink(.10);
export const PANEL        = "#ffffff";
export const SURFACE      = "#fbf9f4";
export const PAPER_TOP    = "#fbf8f2";
export const PAPER_BOTTOM = "#f3ecdd";
export const GOLD       = "#b9822f";
export const ALIVE      = "#0a7848";
export const ALIVE_RGB  = "10,120,72";
export const alive      = (a) => `rgba(${ALIVE_RGB},${a})`;
export const EXTINCT    = "#6b7280";
export const DANGER     = "#dc2626";
export const FONT_SANS  = "-apple-system,'Segoe UI',system-ui,sans-serif";
export const FONT_SERIF = "'Fraunces',Georgia,serif";
export const FONT_MONO  = "'DM Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
export const DOT     = 9;
export const BAR_H   = 5;
export const RADIUS  = 5;
export const MAX_AGE = 540e6;
export const BG             = "#f7f6f2";
export const SURFACE2       = "#ffffff";
export const SURFACE_SOFT   = "#faf9f6";
export const TEXT           = "#262522";
export const TEXT_SECONDARY = "#716e67";
export const TEXT_MUTED     = "#a19e97";
export const BORDER         = "#e5e2dc";
export const BORDER_STRONG  = "#d8d4cc";
export const CAT_COSMIC       = "#8878a8";
export const CAT_GEOLOGY      = "#7294a0";
export const CAT_BIOLOGY      = "#6f9478";
export const CAT_PREHISTORIC  = "#b17763";
export const CAT_HISTORY      = "#9c8356";
export const RADIUS_SM = 8, RADIUS_MD = 12, RADIUS_LG = 18;
export const SHADOW_SOFT = "0 8px 30px rgba(30,28,24,.06)";
export const FONT_UI = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
