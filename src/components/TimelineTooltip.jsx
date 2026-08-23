import { css } from "../styles.js";

export function TimelineTooltip({ tooltip }) {
  if (!tooltip) return null;
  return (
    <div style={css.tt(tooltip)} role="tooltip">
      <div style={css.ttDate}>{tooltip.date}</div>
      <div style={css.ttTitle}><span style={css.ttDot(tooltip.color)}/>{tooltip.title}</div>
      <div style={css.ttHint}>{tooltip.hint||"Cliquer pour la fiche complète"}</div>
    </div>
  );
}
