import { EPOCHS, PERIODS, ALL_EVENTS, CAT_COL, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

export function drawAll(canvas, miniCanvas, params) {
  const {vs, ve, aiEvents, selectedId, hoveredId} = params;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  const coord = makeCoord(vs, ve, W), {toX} = coord;
  const zl = zoomLvl(vs, ve);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  const EPOCH_H  = Math.round(H * 0.13);
  const PERIOD_H = Math.round(H * 0.06);
  const PERIOD_Y = EPOCH_H;
  const LINE_Y   = PERIOD_Y + PERIOD_H + Math.round(H * 0.02);
  const EVT_BOTTOM = H - 32;

  // ── FOND CLAIR ────────────────────────────────────────────────────────────
  ctx.fillStyle = "#faf7f2";
  ctx.fillRect(0, 0, W, H);

  // Légère grille verticale de fond
  ctx.strokeStyle = "rgba(18,16,14,.04)";
  ctx.lineWidth = 1;
  const span = vs - ve;
  const IVS = [1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen = IVS[0];
  for (const iv of IVS) { if (span/iv >= 5 && span/iv <= 16) { chosen=iv; break; } }
  for (let ya = Math.ceil(ve/chosen)*chosen; ya <= vs; ya += chosen) {
    if (ya < 0.1) continue;
    const x = toX(ya); if (x<0||x>W) continue;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }

  // ── BANDES D'ÉPOQUES ─────────────────────────────────────────────────────
  for (const ep of EPOCHS) {
    const x1=toX(ep.from), x2=toX(Math.max(ep.to,0.1));
    if (Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));

    // Fond teinté — doux, clair
    ctx.fillStyle = ep.stripe+"18";
    ctx.fillRect(rx, 0, rw, EPOCH_H);

    // Barre couleur haut — plus épaisse
    ctx.fillStyle = ep.stripe;
    ctx.fillRect(rx, 0, rw, 6);

    // Séparateur vertical
    if (x1>1&&x1<W-1) {
      ctx.strokeStyle = ep.stripe+"66";
      ctx.lineWidth = 1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(x1,6); ctx.lineTo(x1,PERIOD_Y); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Label époque — sombre sur fond clair
    if (rw > 40) {
      ctx.save();
      ctx.beginPath(); ctx.rect(rx+6, 9, rw-12, EPOCH_H-10); ctx.clip();
      const fs = rw>120?13:rw>70?11:9;
      ctx.font = `700 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle = ep.stripe;
      ctx.textAlign = "left";
      ctx.fillText(ep.label.toUpperCase(), rx+8, 9+fs);
      ctx.restore();
    }
  }

  // ── BANDE DES PÉRIODES ────────────────────────────────────────────────────
  for (const per of PERIODS) {
    const x1=toX(per.from), x2=toX(Math.max(per.to,0.1));
    if (Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));
    if (rw<1) continue;

    // Fond coloré plus doux (transparence)
    ctx.fillStyle = per.color+"cc";
    ctx.fillRect(rx, PERIOD_Y, rw, PERIOD_H);
    ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.lineWidth=0.6; ctx.setLineDash([]);
    ctx.strokeRect(rx+0.3, PERIOD_Y+0.3, rw-0.6, PERIOD_H-0.6);

    if (rw>24) {
      ctx.save();
      ctx.beginPath(); ctx.rect(rx+2, PERIOD_Y+1, rw-4, PERIOD_H-2); ctx.clip();
      const fs = rw>80?11:rw>45?10:9;
      ctx.font = `600 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      // Texte sombre si fond clair, blanc si fond foncé
      const isDark = per.textColor==="#fff";
      ctx.fillStyle = isDark ? "rgba(255,255,255,.95)" : "rgba(30,20,10,.85)";
      ctx.textAlign = "center";
      ctx.shadowColor = isDark?"rgba(0,0,0,.3)":"rgba(255,255,255,.5)";
      ctx.shadowBlur = 2;
      ctx.fillText(per.label, rx+rw/2, PERIOD_Y+PERIOD_H/2+fs*0.38);
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(18,16,14,.18)";
  ctx.lineWidth = 1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0,LINE_Y); ctx.lineTo(W,LINE_Y); ctx.stroke();

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  ctx.font = "10px -apple-system,'Segoe UI',system-ui,sans-serif";
  for (let ya=Math.ceil(ve/chosen)*chosen; ya<=vs; ya+=chosen) {
    if (ya<0.1) continue;
    const x=toX(ya); if (x<0||x>W) continue;
    ctx.strokeStyle="rgba(18,16,14,.15)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,LINE_Y-5); ctx.lineTo(x,LINE_Y+5); ctx.stroke();
    const lbl=fmt(ya), tw=ctx.measureText(lbl).width;
    // Fond pill beige
    ctx.fillStyle="rgba(18,16,14,.06)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x-tw/2-5,EVT_BOTTOM-1,tw+10,17,8);
    else ctx.rect(x-tw/2-5,EVT_BOTTOM-1,tw+10,17);
    ctx.fill();
    ctx.fillStyle="rgba(18,16,14,.5)";
    ctx.textAlign="center";
    ctx.fillText(lbl, x, EVT_BOTTOM+12);
  }

  // ── ÉVÉNEMENTS ────────────────────────────────────────────────────────────
  const all=[...ALL_EVENTS.filter(ev=>ev.minZoom<=zl),...aiEvents];
  const vis=all.filter(ev=>{const x=toX(ev.yearsAgo);return x>=-80&&x<=W+80;});
  vis.sort((a,b)=>(a.importance||2)-(b.importance||2));
  const deduped=[];
  for(const ev of vis){
    const x=toX(ev.yearsAgo);
    if(!deduped.find(p=>Math.abs(p.x-x)<28)) deduped.push({x,ev});
  }
  deduped.sort((a,b)=>a.x-b.x);

  const placed=[];
  const EVT_H = EVT_BOTTOM-32-LINE_Y;

  for(const {x,ev} of deduped){
    const col=cc(ev.cat);
    const imp=ev.importance||2;
    const isHov=hoveredId===ev.id, isSel=selectedId===ev.id;
    const nearby=placed.filter(p=>Math.abs(p.x-x)<90);
    const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
    placed.push({x,ev,side});

    const zThresh=imp===1?0:imp===2?1.5:2.5;
    const sF=(isSel||isHov)?1:Math.min(1,0.35+Math.max(0,zl-zThresh)*0.35);
    const maxStem=imp===1?EVT_H*0.72:imp===2?EVT_H*0.56:EVT_H*0.4;
    const stemLen=(side===1?maxStem:maxStem*0.7)*sF;
    const endY=LINE_Y-side*stemLen;

    // Halo
    if(isHov||isSel){
      ctx.beginPath(); ctx.arc(x,LINE_Y,16,0,Math.PI*2);
      ctx.fillStyle=col+"18"; ctx.fill();
    }

    // Tige — style discret sur fond clair
    ctx.strokeStyle=(isHov||isSel)?col:col+(imp===1?"cc":imp===2?"77":"44");
    ctx.lineWidth=((isHov||isSel)?2.5:imp===1?2:imp===2?1.2:0.7)*sF;
    ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
    ctx.beginPath(); ctx.moveTo(x,LINE_Y); ctx.lineTo(x,endY); ctx.stroke();
    ctx.setLineDash([]);

    // Point
    const baseR=isSel?9:isHov?8:imp===1?6:imp===2?4.5:3;
    const r=Math.max(baseR*sF,(isSel||isHov)?baseR:1.5);
    ctx.beginPath(); ctx.arc(x,LINE_Y,r,0,Math.PI*2);
    ctx.fillStyle=col; ctx.fill();

    // Anneau blanc intérieur (majeurs)
    if(imp===1&&!isSel&&sF>0.4){
      ctx.beginPath(); ctx.arc(x,LINE_Y,Math.max(r-2.5,0.8),0,Math.PI*2);
      ctx.fillStyle="rgba(250,247,242,.9)"; ctx.fill();
    }
    // Anneau sélection
    if(isSel){
      ctx.beginPath(); ctx.arc(x,LINE_Y,r+5,0,Math.PI*2);
      ctx.strokeStyle=col+"66"; ctx.lineWidth=2; ctx.stroke();
    }

    // Label — fond blanc arrondi, texte sombre
    const minR=imp===1?1.5:imp===2?2:2.8;
    if(r>=minR||isHov||isSel){
      const fs=Math.max(9,(imp===1?13:imp===2?12:11)*sF);
      const maxW=imp===1?130:110;
      ctx.font=`${imp===1?"600":"500"} ${Math.round(fs)}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      const words=ev.title.split(" "); let line="",lines=[];
      for(const w of words){
        const t=line+w+" ";
        if(ctx.measureText(t).width>maxW&&line){lines.push(line.trim());line=w+" ";}
        else line=t;
      }
      lines.push(line.trim());
      const lh=Math.round(fs)+3;
      const startY=side===1?endY-8-lines.length*lh:endY+8;
      lines.forEach((l,i)=>{
        const tw2=ctx.measureText(l).width, lx=x-tw2/2-5, ly=startY+i*lh-1;
        // Fond blanc avec légère ombre
        ctx.fillStyle=(isHov||isSel)?"rgba(255,255,255,.98)":"rgba(250,247,242,.95)";
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(lx,ly,tw2+10,lh+2,4);
        else ctx.rect(lx,ly,tw2+10,lh+2);
        ctx.fill();
        // Bordure fine colorée
        ctx.strokeStyle=(isHov||isSel)?col:col+"55";
        ctx.lineWidth=0.8;
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(lx,ly,tw2+10,lh+2,4);
        else ctx.rect(lx,ly,tw2+10,lh+2);
        ctx.stroke();
        // Texte sombre
        ctx.fillStyle=(isHov||isSel)?col:imp===1?"rgba(18,16,14,.85)":"rgba(18,16,14,.7)";
        ctx.textAlign="center";
        ctx.fillText(l, x, startY+i*lh+fs);
      });
    }
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="rgba(200,40,30,.5)"; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(nowX,LINE_Y-55); ctx.lineTo(nowX,EVT_BOTTOM-30); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="bold 9px -apple-system,'Segoe UI',system-ui,sans-serif";
    ctx.fillStyle="#c02820"; ctx.textAlign="center";
    ctx.fillText("AUJOURD'HUI", nowX, LINE_Y-58);
  }

  // ── MINIMAP ───────────────────────────────────────────────────────────────
  if(miniCanvas){
    const mw=miniCanvas.width,mh=miniCanvas.height,mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    mctx.fillStyle="#f5f0e8"; mctx.fillRect(0,0,mw,mh);
    const tls=Math.log10(13.8e9),tle=0,tR=tls-tle;
    for(const ep of EPOCHS){
      const ex1=(tls-L(ep.from))/tR*mw,ex2=(tls-L(Math.max(ep.to,0.1)))/tR*mw;
      mctx.fillStyle=ep.stripe+"44"; mctx.fillRect(Math.max(0,ex1),2,Math.abs(ex2-ex1),mh-4);
      mctx.fillStyle=ep.stripe+"bb"; mctx.fillRect(Math.max(0,ex1),2,1.5,mh-4);
    }
    for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
      const lv=L(ev.yearsAgo); if(lv<tle||lv>tls) continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath(); mctx.arc(mx,mh/2,2,0,Math.PI*2);
      mctx.fillStyle=cc(ev.cat)+"bb"; mctx.fill();
    }
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(18,16,14,.08)"; mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(18,16,14,.4)"; mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H, TREE_TOP:H};
}
