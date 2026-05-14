import { EPOCHS, PERIODS, ALL_EVENTS, LIFE_TREE as _LIFE_TREE, CAT_COL, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

const LIFE_TREE = _LIFE_TREE || [];

export function drawAll(canvas, miniCanvas, params) {
  const {vs, ve, aiEvents, selectedId, hoveredId} = params;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  const coord = makeCoord(vs, ve, W), {toX} = coord;
  const zl = zoomLvl(vs, ve);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  const EPOCH_H   = Math.round(H * 0.13);
  const PERIOD_H  = Math.round(H * 0.055);
  const PERIOD_Y  = EPOCH_H;
  const LINE_Y    = PERIOD_Y + PERIOD_H + Math.round(H * 0.01);
  const TREE_TOP  = LINE_Y + Math.round(H * 0.32);
  const TREE_H    = H - TREE_TOP - 2;
  const UA = vs > 1e10 ? vs * 1.01 : 13.8e9;

  // Fond global
  ctx.fillStyle = "#0d0d10";
  ctx.fillRect(0, 0, W, H);

  // ── BANDES D'ÉPOQUES ─────────────────────────────────────────────────────
  for (const ep of EPOCHS) {
    const x1 = toX(ep.from), x2 = toX(Math.max(ep.to, 0.1));
    if (Math.min(x1,x2) > W || Math.max(x1,x2) < 0) continue;
    const rx = Math.max(0, Math.min(x1,x2));
    const rw = Math.min(W, Math.abs(x2 - x1));

    ctx.fillStyle = ep.bg;
    ctx.fillRect(rx, 0, rw, EPOCH_H);

    ctx.fillStyle = ep.stripe;
    ctx.fillRect(rx, 0, rw, 5);

    if (x1 > 1 && x1 < W - 1) {
      ctx.strokeStyle = ep.stripe + "cc";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, 5); ctx.lineTo(x1, PERIOD_Y); ctx.stroke();
    }

    if (rw > 50) {
      ctx.save();
      ctx.beginPath(); ctx.rect(rx + 6, 8, rw - 12, EPOCH_H - 10); ctx.clip();
      const fs = rw > 120 ? 13 : rw > 80 ? 11 : 9;
      ctx.font = `700 ${fs}px 'DM Mono',monospace`;
      ctx.fillStyle = ep.text;
      ctx.textAlign = "left";
      ctx.fillText(ep.label.toUpperCase(), rx + 8, 8 + fs);
      ctx.restore();
    }
  }

  // ── BANDE DES PÉRIODES ────────────────────────────────────────────────────
  for (const per of PERIODS) {
    const x1 = toX(per.from), x2 = toX(Math.max(per.to, 0.1));
    if (Math.min(x1,x2) > W || Math.max(x1,x2) < 0) continue;
    const rx = Math.max(0, Math.min(x1,x2));
    const rw = Math.min(W, Math.abs(x2 - x1));
    if (rw < 1) continue;

    ctx.fillStyle = per.color;
    ctx.fillRect(rx, PERIOD_Y, rw, PERIOD_H);
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.lineWidth = 0.8; ctx.setLineDash([]);
    ctx.strokeRect(rx + 0.4, PERIOD_Y + 0.4, rw - 0.8, PERIOD_H - 0.8);

    if (rw > 28) {
      ctx.save();
      ctx.beginPath(); ctx.rect(rx + 2, PERIOD_Y + 2, rw - 4, PERIOD_H - 4); ctx.clip();
      const fs = rw > 80 ? 11 : rw > 50 ? 10 : 9;
      ctx.font = `600 ${fs}px 'DM Mono',monospace`;
      ctx.fillStyle = per.textColor || "#fff";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 3;
      ctx.fillText(per.label, rx + rw / 2, PERIOD_Y + PERIOD_H / 2 + fs * 0.38);
      ctx.shadowBlur = 0; ctx.restore();
    }
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0, LINE_Y); ctx.lineTo(W, LINE_Y); ctx.stroke();

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  const span = vs - ve;
  const IVS = [1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen = IVS[0];
  for (const iv of IVS) { if (span / iv >= 5 && span / iv <= 16) { chosen = iv; break; } }

  ctx.font = "10px 'DM Mono',monospace";
  for (let ya = Math.ceil(ve / chosen) * chosen; ya <= vs; ya += chosen) {
    if (ya < 0.1) continue;
    const x = toX(ya);
    if (x < 0 || x > W) continue;
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, LINE_Y - 6); ctx.lineTo(x, LINE_Y + 6); ctx.stroke();
    const lbl = fmt(ya), tw = ctx.measureText(lbl).width;
    ctx.fillStyle = "rgba(14,12,10,.9)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - tw/2 - 4, LINE_Y + 8, tw + 8, 16, 3);
    else ctx.rect(x - tw/2 - 4, LINE_Y + 8, tw + 8, 16);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.textAlign = "center";
    ctx.fillText(lbl, x, LINE_Y + 20);
  }

  // ── ÉVÉNEMENTS ────────────────────────────────────────────────────────────
  const all = [...ALL_EVENTS.filter(ev => ev.minZoom <= zl), ...aiEvents];
  const vis = all.filter(ev => { const x = toX(ev.yearsAgo); return x >= -80 && x <= W + 80; });
  vis.sort((a,b) => (a.importance||2) - (b.importance||2));

  const deduped = [];
  for (const ev of vis) {
    const x = toX(ev.yearsAgo);
    if (!deduped.find(p => Math.abs(p.x - x) < 28)) deduped.push({x, ev});
  }
  deduped.sort((a,b) => a.x - b.x);

  const placed = [];

  for (const {x, ev} of deduped) {
    const col = cc(ev.cat);
    const imp = ev.importance || 2;
    const isHov = hoveredId === ev.id;
    const isSel = selectedId === ev.id;

    const nearby = placed.filter(p => Math.abs(p.x - x) < 90);
    const side = nearby.length > 0 && nearby[nearby.length-1].side === 1 ? -1 : 1;
    placed.push({x, ev, side});

    const zThresh = imp === 1 ? 0 : imp === 2 ? 1.5 : 2.5;
    const zExcess = Math.max(0, zl - zThresh);
    const sF = (isSel || isHov) ? 1 : Math.min(1, 0.35 + zExcess * 0.35);

    const baseStem = imp === 1 ? 72 : imp === 2 ? 56 : 42;
    const stemLen = (side === 1 ? baseStem : baseStem - 16) * sF;
    const endY = LINE_Y - side * stemLen;

    if (isHov || isSel) {
      ctx.beginPath(); ctx.arc(x, LINE_Y, 16, 0, Math.PI * 2);
      ctx.fillStyle = col + "20"; ctx.fill();
    }

    ctx.strokeStyle = (isHov || isSel) ? col : col + (imp===1?"dd":imp===2?"88":"50");
    ctx.lineWidth = ((isHov||isSel)?2.5:imp===1?2:imp===2?1.2:0.8) * sF;
    ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
    ctx.beginPath(); ctx.moveTo(x, LINE_Y); ctx.lineTo(x, endY); ctx.stroke();
    ctx.setLineDash([]);

    const baseR = isSel ? 9 : isHov ? 8 : imp===1 ? 7 : imp===2 ? 5 : 3.5;
    const r = Math.max(baseR * sF, (isSel||isHov) ? baseR : 1.8);
    ctx.beginPath(); ctx.arc(x, LINE_Y, r, 0, Math.PI*2);
    ctx.fillStyle = col; ctx.fill();
    if (imp===1 && !isSel && sF>0.4) {
      ctx.beginPath(); ctx.arc(x, LINE_Y, Math.max(r-3, 0.8), 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill();
    }
    if (isSel) {
      ctx.beginPath(); ctx.arc(x, LINE_Y, r+6, 0, Math.PI*2);
      ctx.strokeStyle = col+"88"; ctx.lineWidth=2; ctx.stroke();
    }

    // Label — toujours affiché si assez grand
    const minR = imp===1 ? 1.5 : imp===2 ? 2 : 2.8;
    if (r >= minR || isHov || isSel) {
      const fs = Math.max(9, (imp===1?13:imp===2?12:11) * sF);
      const maxW = imp===1 ? 130 : 110;
      ctx.font = `${imp===1?"600":"500"} ${Math.round(fs)}px 'DM Mono',monospace`;
      const words = ev.title.split(" ");
      let line = "", lines = [];
      for (const w of words) {
        const t = line + w + " ";
        if (ctx.measureText(t).width > maxW && line) { lines.push(line.trim()); line = w+" "; }
        else line = t;
      }
      lines.push(line.trim());
      const lh = Math.round(fs) + 3;
      const startY = side===1 ? endY - 10 - lines.length*lh : endY + 10;
      const bgOp = (isHov||isSel) ? ".97" : sF>0.7 ? ".92" : ".82";
      lines.forEach((l, i) => {
        const tw2 = ctx.measureText(l).width;
        const lx = x - tw2/2 - 5;
        const ly = startY + i*lh - 1;
        ctx.fillStyle = `rgba(12,10,8,${bgOp})`;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(lx, ly, tw2+10, lh+1, 3);
        else ctx.rect(lx, ly, tw2+10, lh+1);
        ctx.fill();
        if (isHov||isSel) {
          ctx.strokeStyle = col+"88"; ctx.lineWidth=1;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(lx, ly, tw2+10, lh+1, 3);
          else ctx.rect(lx, ly, tw2+10, lh+1);
          ctx.stroke();
        }
        ctx.fillStyle = (isHov||isSel) ? col : imp===1 ? "rgba(255,255,255,.95)" : imp===2 ? "rgba(255,255,255,.82)" : "rgba(255,255,255,.65)";
        ctx.textAlign = "center";
        ctx.fillText(l, x, startY + i*lh + fs);
      });
    }
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX = toX(0.5);
  if (nowX > 2 && nowX < W - 2) {
    ctx.strokeStyle = "rgba(220,60,50,.7)"; ctx.lineWidth=1.5; ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(nowX, LINE_Y-60); ctx.lineTo(nowX, TREE_TOP); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="bold 9px 'DM Mono',monospace"; ctx.fillStyle="#e03c32"; ctx.textAlign="center";
    ctx.fillText("AUJOURD'HUI", nowX, LINE_Y-64);
  }

  // ── ARBRE DE LA VIE ───────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(8,6,4,.98)";
  ctx.fillRect(0, TREE_TOP, W, TREE_H);
  ctx.strokeStyle = "rgba(200,150,60,.5)"; ctx.lineWidth=1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0, TREE_TOP); ctx.lineTo(W, TREE_TOP); ctx.stroke();

  ctx.font="700 11px 'DM Mono',monospace"; ctx.fillStyle="rgba(200,150,60,.9)";
  ctx.textAlign="left"; ctx.fillText("ARBRE DE LA VIE", 12, TREE_TOP+16);
  ctx.font="9px 'DM Mono',monospace"; ctx.fillStyle="rgba(255,255,255,.35)";
  ctx.textAlign="right"; ctx.fillText("▶ = extinction", W-10, TREE_TOP+16);

  const NROWS = 17;
  const rowH = Math.min((TREE_H - 24) / NROWS, 18);

  for (const node of LIFE_TREE) {
    const x1 = toX(node.from), x2 = toX(Math.max(node.to, 0.1));
    if (Math.min(x1,x2) > W || Math.max(x1,x2) < 0) continue;
    const rx = Math.max(0, Math.min(x1,x2));
    const rw = Math.min(W, Math.abs(x2-x1));
    if (rw < 1) continue;
    const ry = TREE_TOP + 22 + node.row * rowH;
    const rh = Math.max(rowH - 2, 6);
    const extinct = node.to > 0;

    ctx.fillStyle = extinct ? node.color+"88" : node.color+"ee";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 3); else ctx.rect(rx, ry, rw, rh);
    ctx.fill();
    ctx.strokeStyle = extinct ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.15)";
    ctx.lineWidth=0.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 3); else ctx.rect(rx, ry, rw, rh);
    ctx.stroke();

    if (extinct && node.to > 0) {
      const ex = toX(node.to);
      if (ex>0&&ex<W) {
        ctx.fillStyle="#ef4444";
        ctx.beginPath(); ctx.moveTo(ex-5,ry+1); ctx.lineTo(ex+1,ry+rh/2); ctx.lineTo(ex-5,ry+rh-1); ctx.closePath(); ctx.fill();
      }
    }

    if (rw > 35) {
      const depth = node.depth||0, indent=depth*6;
      ctx.save(); ctx.beginPath(); ctx.rect(rx+4+indent, ry, rw-8-indent, rh); ctx.clip();
      const fs = Math.min(rh-2, depth<=1?11:depth<=3?10:9);
      ctx.font=`${depth<=2?"600":"500"} ${fs}px 'DM Mono',monospace`;
      ctx.fillStyle = extinct ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.95)";
      ctx.textAlign="left";
      ctx.fillText(node.label, rx+6+indent, ry+rh/2+fs*0.38);
      ctx.restore();
    }
  }

  // ── MINIMAP ───────────────────────────────────────────────────────────────
  if (miniCanvas) {
    const mw=miniCanvas.width, mh=miniCanvas.height, mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    mctx.fillStyle="#0d0d10"; mctx.fillRect(0,0,mw,mh);
    const tls=Math.log10(13.8e9), tle=0, tR=tls-tle;
    for (const ep of EPOCHS) {
      const ex1=(tls-L(ep.from))/tR*mw, ex2=(tls-L(Math.max(ep.to,0.1)))/tR*mw;
      mctx.fillStyle=ep.stripe+"55"; mctx.fillRect(Math.max(0,ex1),2,Math.abs(ex2-ex1),mh-4);
      mctx.fillStyle=ep.stripe+"cc"; mctx.fillRect(Math.max(0,ex1),2,1.5,mh-4);
    }
    for (const ev of ALL_EVENTS.filter(e=>e.importance===1)) {
      const lv=L(ev.yearsAgo); if(lv<tle||lv>tls) continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath(); mctx.arc(mx,mh/2,2.5,0,Math.PI*2); mctx.fillStyle=cc(ev.cat)+"cc"; mctx.fill();
    }
    const vls=L(vs), vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw, vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(255,255,255,.1)"; mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(255,255,255,.6)"; mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H, TREE_TOP};
}
