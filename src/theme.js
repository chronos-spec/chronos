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

// ── Phase 2 — nouvel habillage (header + barre de filtres) ─────────────────
// Jeu de tokens ajouté à côté des précédents plutôt qu'un renommage global :
// on l'applique précisément là où on nous l'a demandé (header, filtres),
// sans réécrire d'un coup toute la palette existante ailleurs dans l'app.
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
