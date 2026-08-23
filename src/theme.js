// src/theme.js — source unique de vérité pour l'identité visuelle de Chronos.
// Importé par styles.js (shell), drawTimeline.js (frise) et LifeTree.jsx (arbre).
// Palette douce et désaturée (direction Notion/Linear) : une couleur = un
// repère de catégorie, jamais un aplat criard. Voir CAT_COL dans
// data/timelineData.js pour les teintes par catégorie.
export const INK        = "#26241f";           // texte courant
export const INK_STRONG = "#171412";           // titres
export const INK_RGB    = "38,36,31";          // pour composer des rgba() côté canvas
export const ink        = (a) => `rgba(${INK_RGB},${a})`;
export const MUTED      = ink(.55);
export const FAINT      = ink(.36);
export const LINE       = ink(.09);
export const PANEL        = "#ffffff";
export const SURFACE      = "#f8f7f4";          // fond papier unifié
export const PAPER_TOP    = "#f9f8f5";          // dégradé canvas (haut) — quasi plat
export const PAPER_BOTTOM = "#f2f0ea";          // dégradé canvas (bas)
export const GOLD       = "#a58a58";            // accent — aligné sur la teinte "histoire"
export const ALIVE      = "#4f8a68";            // vivant / aujourd'hui
export const ALIVE_RGB  = "79,138,104";
export const alive      = (a) => `rgba(${ALIVE_RGB},${a})`;
export const EXTINCT    = "#6b7280";
export const DANGER     = "#c0392b";
export const FONT_SANS  = "-apple-system,'Segoe UI',system-ui,sans-serif";
export const FONT_SERIF = "'Fraunces',Georgia,serif";
export const FONT_MONO  = "'DM Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
export const DOT     = 9;
export const BAR_H   = 5;
export const RADIUS  = 5;
export const MAX_AGE = 540e6;
