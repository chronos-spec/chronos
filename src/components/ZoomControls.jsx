import { css } from "../styles.js";

export function ZoomControls({ onZoomIn, onZoomOut, zoomLabel }) {
  return (
    <div style={css.zoomBtns} aria-label="Contrôles de zoom">
      <button type="button" aria-label="Zoom avant" style={css.zoomBtn}
        onMouseEnter={e=>e.currentTarget.style.background="#f0ebe0"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        onClick={onZoomIn}>
        +
      </button>
      {zoomLabel&&<div style={css.zoomReadout}>{zoomLabel}</div>}
      <button type="button" aria-label="Zoom arrière" style={css.zoomBtn}
        onMouseEnter={e=>e.currentTarget.style.background="#f0ebe0"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        onClick={onZoomOut}>
        −
      </button>
    </div>
  );
}
