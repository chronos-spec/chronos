// src/theme.js — source unique de vérité pour l'identité visuelle de Chronos.
// Importé par styles.js (shell), drawTimeline.js (frise) et LifeTree.jsx (arbre).
export const INK        = "#37352f";           // texte courant
export const INK_STRONG = "#171412";           // titres
export const INK_RGB    = "55,53,47";          // pour composer des rgba() côté canvas
export const ink        = (a) => `rgba(${INK_RGB},${a})`;
export const MUTED      = ink(.58);
export const FAINT      = ink(.38);
export const LINE       = ink(.10);
export const PANEL        = "#ffffff";
export const SURFACE      = "#fbf9f4";          // fond papier unifié
export const PAPER_TOP    = "#fbf8f2";          // dégradé canvas (haut)
export const PAPER_BOTTOM = "#f3ecdd";          // dégradé canvas (bas)
export const GOLD       = "#b9822f";
export const ALIVE      = "#0a7848";            // vivant / aujourd'hui
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
