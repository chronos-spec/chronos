import { EPOCHS, PERIODS, ALL_EVENTS, CAT_COL, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

// ── ARBRE DE VIE INTÉGRÉ — données synchronisées avec la frise ───────────────
// Groupes principaux avec from/to en années
const LIFE_BANDS = [
  // Niveau 0 — Domaines
  { id:"bact",  label:"Bactéries",        from:3500e6, to:null,   color:"#64748b", row:0, depth:0 },
  { id:"plant", label:"Plantes",          from:470e6,  to:null,   color:"#16a34a", row:1, depth:0 },
  { id:"invert",label:"Invertébrés",      from:541e6,  to:null,   color:"#f59e0b", row:2, depth:0 },
  // Vertébrés
  { id:"poiss", label:"Poissons",         from:520e6,  to:null,   color:"#0ea5e9", row:3, depth:1 },
  { id:"amphi", label:"Amphibiens",       from:370e6,  to:null,   color:"#0f766e", row:4, depth:1 },
  // Reptiles
  { id:"reptil",label:"Reptiles marins",  from:250e6,  to:66e6,   color:"#0c4a6e", row:5, depth:1, eteint:true },
  { id:"tortu", label:"Tortues",          from:230e6,  to:null,   color:"#65a30d", row:5, depth:1 },
  { id:"croco", label:"Crocodiliens",     from:230e6,  to:null,   color:"#166534", row:6, depth:2 },
  // Ptérosaures
  { id:"ptero", label:"Ptérosaures 🦅",   from:228e6,  to:66e6,   color:"#7c3aed", row:7, depth:2, eteint:true },
  // Dinosaures
  { id:"sauro", label:"Sauropodes 🦕",    from:210e6,  to:66e6,   color:"#b45309", row:8, depth:2, eteint:true },
  { id:"ornith",label:"Ornithischiens",   from:235e6,  to:66e6,   color:"#92400e", row:9, depth:2, eteint:true },
  { id:"therop",label:"Théropodes 🦖",    from:230e6,  to:null,   color:"#dc2626", row:10, depth:2 },
  { id:"oiseau",label:"Oiseaux 🐦",       from:150e6,  to:null,   color:"#0369a1", row:11, depth:3 },
  // Mammifères
  { id:"mamm",  label:"Mammifères",       from:225e6,  to:null,   color:"#be185d", row:12, depth:1 },
  { id:"marsu", label:"Marsupiaux",       from:100e6,  to:null,   color:"#9d174d", row:13, depth:2 },
  { id:"cetace",label:"Cétacés 🐋",       from:50e6,   to:null,   color:"#0e7490", row:14, depth:2 },
  { id:"probo", label:"Proboscidiens 🐘", from:55e6,   to:null,   color:"#78716c", row:14, depth:2 },
  { id:"carni", label:"Carnivores 🦁",    from:60e6,   to:null,   color:"#dc2626", row:15, depth:2 },
  { id:"primat",label:"Primates 🐒",      from:58e6,   to:null,   color:"#9333ea", row:16, depth:2 },
  // Hominidés
  { id:"homini",label:"Hominidés",        from:7e6,    to:null,   color:"#c2410c", row:17, depth:3 },
  { id:"nean",  label:"Néandertal 💀",    from:400e3,  to:40e3,   color:"#7c3aed", row:18, depth:4, eteint:true },
  { id:"sapien",label:"Homo sapiens 🧠",  from:300e3,  to:null,   color:"#92400e", row:18, depth:4 },
];

const N_ROWS = 19;

export function drawAll(canvas, miniCanvas, params) {
  const {vs, ve, aiEvents, selectedId, hoveredId} = params;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  const coord = makeCoord(vs, ve, W), {toX} = coord;
  const zl = zoomLvl(vs, ve);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  const EPOCH_H   = Math.round(H * 0.11);   // bandes ères
  const PERIOD_H  = Math.round(H * 0.055);  // bandes périodes
  const PERIOD_Y  = EPOCH_H;
  const LINE_Y    = PERIOD_Y + PERIOD_H + Math.round(H * 0.015);
  const EVT_H     = Math.round(H * 0.28);   // zone événements
  const TREE_Y    = LINE_Y + EVT_H;         // début arbre de vie
  const TREE_H    = H - TREE_Y;             // hauteur arbre
  const ROW_H     = Math.max(Math.floor((TREE_H - 20) / N_ROWS), 8);
  const EVT_BOT   = TREE_Y - 22;            // limite basse des labels

  // ── FOND ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = "#faf7f2";
  ctx.fillRect(0, 0, W, TREE_Y);
  ctx.fillStyle = "#0f1117";  // fond sombre pour l'arbre
  ctx.fillRect(0, TREE_Y, W, TREE_H);

  // Grille verticale douce
  const span = vs - ve;
  const IVS = [1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen = IVS[0];
  for (const iv of IVS) { if (span/iv >= 5 && span/iv <= 16) { chosen=iv; break; } }
  ctx.strokeStyle = "rgba(18,16,14,.04)";
  ctx.lineWidth = 1;
  for (let ya = Math.ceil(ve/chosen)*chosen; ya <= vs; ya += chosen) {
    if (ya < 0.1) continue;
    const x = toX(ya); if (x<0||x>W) continue;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,TREE_Y); ctx.stroke();
    // Grille dans l'arbre
    ctx.strokeStyle = "rgba(255,255,255,.03)";
    ctx.beginPath(); ctx.moveTo(x,TREE_Y); ctx.lineTo(x,H); ctx.stroke();
    ctx.strokeStyle = "rgba(18,16,14,.04)";
  }

  // ── BANDES D'ÉPOQUES ─────────────────────────────────────────────────────
  for (const ep of EPOCHS) {
    const x1=toX(ep.from), x2=toX(Math.max(ep.to,0.1));
    if (Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));
    ctx.fillStyle = ep.stripe+"22"; ctx.fillRect(rx, 0, rw, EPOCH_H);
    ctx.fillStyle = ep.stripe;      ctx.fillRect(rx, 0, rw, 5);
    if (x1>1&&x1<W-1) {
      ctx.strokeStyle=ep.stripe+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(x1,5); ctx.lineTo(x1,PERIOD_Y); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (rw>40) {
      ctx.save(); ctx.beginPath(); ctx.rect(rx+5,8,rw-10,EPOCH_H-9); ctx.clip();
      const fs=rw>120?12:rw>70?10:8;
      ctx.font=`700 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle=ep.stripe; ctx.textAlign="left";
      ctx.fillText(ep.label.toUpperCase(), rx+7, 8+fs);
      ctx.restore();
    }
  }

  // ── BANDE DES PÉRIODES ────────────────────────────────────────────────────
  for (const per of PERIODS) {
    const x1=toX(per.from), x2=toX(Math.max(per.to,0.1));
    if (Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));
    if (rw<1) continue;
    ctx.fillStyle=per.color+"cc"; ctx.fillRect(rx,PERIOD_Y,rw,PERIOD_H);
    ctx.strokeStyle="rgba(0,0,0,.12)"; ctx.lineWidth=0.6; ctx.setLineDash([]);
    ctx.strokeRect(rx+0.3,PERIOD_Y+0.3,rw-0.6,PERIOD_H-0.6);
    if (rw>24) {
      ctx.save(); ctx.beginPath(); ctx.rect(rx+2,PERIOD_Y+1,rw-4,PERIOD_H-2); ctx.clip();
      const fs=rw>80?11:rw>45?10:9;
      ctx.font=`600 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      const isDark=per.textColor==="#fff";
      ctx.fillStyle=isDark?"rgba(255,255,255,.95)":"rgba(30,20,10,.85)";
      ctx.textAlign="center"; ctx.shadowColor=isDark?"rgba(0,0,0,.3)":"rgba(255,255,255,.5)"; ctx.shadowBlur=2;
      ctx.fillText(per.label,rx+rw/2,PERIOD_Y+PERIOD_H/2+fs*0.38);
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle="rgba(18,16,14,.2)"; ctx.lineWidth=1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0,LINE_Y); ctx.lineTo(W,LINE_Y); ctx.stroke();

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  ctx.font="10px -apple-system,'Segoe UI',system-ui,sans-serif";
  for (let ya=Math.ceil(ve/chosen)*chosen; ya<=vs; ya+=chosen) {
    if (ya<0.1) continue;
    const x=toX(ya); if (x<0||x>W) continue;
    ctx.strokeStyle="rgba(18,16,14,.15)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,LINE_Y-5); ctx.lineTo(x,LINE_Y+5); ctx.stroke();
    const lbl=fmt(ya), tw=ctx.measureText(lbl).width;
    ctx.fillStyle="rgba(18,16,14,.06)";
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x-tw/2-5,EVT_BOT-1,tw+10,16,8);
    else ctx.rect(x-tw/2-5,EVT_BOT-1,tw+10,16);
    ctx.fill();
    ctx.fillStyle="rgba(18,16,14,.5)"; ctx.textAlign="center";
    ctx.fillText(lbl,x,EVT_BOT+11);
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

  for(const {x,ev} of deduped){
    const col=cc(ev.cat);
    const imp=ev.importance||2;
    const isHov=hoveredId===ev.id, isSel=selectedId===ev.id;

    // Alternance haut/bas intelligente — évite chevauchements
    const nearby=placed.filter(p=>Math.abs(p.x-x)<90);
    const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
    placed.push({x,ev,side});

    const zThresh=imp===1?0:imp===2?1.5:2.5;
    const sF=(isSel||isHov)?1:Math.min(1,0.35+Math.max(0,zl-zThresh)*0.35);

    // Tige proportionnelle à la zone disponible
    const maxStem=imp===1?EVT_H*0.75:imp===2?EVT_H*0.58:EVT_H*0.42;
    const stemLen=(side===1?maxStem:maxStem*0.72)*sF;
    const endY=LINE_Y-side*stemLen;

    if(isHov||isSel){
      ctx.beginPath(); ctx.arc(x,LINE_Y,16,0,Math.PI*2);
      ctx.fillStyle=col+"18"; ctx.fill();
    }
    ctx.strokeStyle=(isHov||isSel)?col:col+(imp===1?"cc":imp===2?"77":"44");
    ctx.lineWidth=((isHov||isSel)?2.5:imp===1?2:imp===2?1.2:0.7)*sF;
    ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
    ctx.beginPath(); ctx.moveTo(x,LINE_Y); ctx.lineTo(x,endY); ctx.stroke();
    ctx.setLineDash([]);

    const baseR=isSel?9:isHov?8:imp===1?6:imp===2?4.5:3;
    const r=Math.max(baseR*sF,(isSel||isHov)?baseR:1.5);
    ctx.beginPath(); ctx.arc(x,LINE_Y,r,0,Math.PI*2);
    ctx.fillStyle=col; ctx.fill();
    if(imp===1&&!isSel&&sF>0.4){
      ctx.beginPath(); ctx.arc(x,LINE_Y,Math.max(r-2.5,0.8),0,Math.PI*2);
      ctx.fillStyle="rgba(250,247,242,.9)"; ctx.fill();
    }
    if(isSel){
      ctx.beginPath(); ctx.arc(x,LINE_Y,r+5,0,Math.PI*2);
      ctx.strokeStyle=col+"66"; ctx.lineWidth=2; ctx.stroke();
    }

    // Label avec fond blanc arrondi
    const minR=imp===1?1.5:imp===2?2:2.8;
    if(r>=minR||isHov||isSel){
      const fs=Math.max(9,(imp===1?13:imp===2?12:11)*sF);
      const maxLW=imp===1?130:110;
      ctx.font=`${imp===1?"600":"500"} ${Math.round(fs)}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      const words=ev.title.split(" "); let line="",lines=[];
      for(const w of words){
        const t=line+w+" ";
        if(ctx.measureText(t).width>maxLW&&line){lines.push(line.trim());line=w+" ";}
        else line=t;
      }
      lines.push(line.trim());
      const lh=Math.round(fs)+3;
      const startY=side===1?endY-8-lines.length*lh:endY+8;
      lines.forEach((l,i)=>{
        const tw2=ctx.measureText(l).width,lx=x-tw2/2-5,ly=startY+i*lh-1;
        ctx.fillStyle=(isHov||isSel)?"rgba(255,255,255,.98)":"rgba(250,247,242,.95)";
        ctx.beginPath();
        if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);
        ctx.fill();
        ctx.strokeStyle=(isHov||isSel)?col:col+"55"; ctx.lineWidth=0.8;
        ctx.beginPath();
        if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);
        ctx.stroke();
        ctx.fillStyle=(isHov||isSel)?col:imp===1?"rgba(18,16,14,.85)":"rgba(18,16,14,.7)";
        ctx.textAlign="center"; ctx.fillText(l,x,startY+i*lh+fs);
      });
    }
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="rgba(200,40,30,.6)"; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(nowX,LINE_Y-50); ctx.lineTo(nowX,H); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="bold 8px -apple-system,'Segoe UI',system-ui,sans-serif";
    ctx.fillStyle="#c02820"; ctx.textAlign="center";
    ctx.fillText("AUJOURD'HUI",nowX,LINE_Y-53);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── ARBRE DE VIE SYNCHRONISÉ ──────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // Titre section
  ctx.font="700 10px -apple-system,'Segoe UI',system-ui,sans-serif";
  ctx.fillStyle="rgba(200,150,60,.85)";
  ctx.textAlign="left";
  ctx.fillText("▸ ARBRE DE LA VIE — synchronisé avec la frise", 10, TREE_Y+13);

  // Ligne de séparation
  ctx.strokeStyle="rgba(200,150,60,.4)"; ctx.lineWidth=1; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0,TREE_Y); ctx.lineTo(W,TREE_Y); ctx.stroke();

  // Légende droite
  ctx.font="9px -apple-system,'Segoe UI',system-ui,sans-serif";
  ctx.fillStyle="rgba(255,255,255,.3)"; ctx.textAlign="right";
  ctx.fillText("■ = éteint   ● = vivant", W-8, TREE_Y+13);

  // Dessiner chaque bande d'espèce
  for (const band of LIFE_BANDS) {
    const fromX = toX(band.from);
    const toXv  = band.to ? toX(band.to) : toX(0.5);

    // Calcul position et taille
    const rx  = Math.max(0, Math.min(fromX, toXv));
    const rx2 = Math.min(W, Math.max(fromX, toXv));
    const rw  = rx2 - rx;

    const ry  = TREE_Y + 18 + band.row * ROW_H;
    const rh  = Math.max(ROW_H - 2, 5);

    if (rw < 0.5) continue; // pas visible

    // Barre principale
    const opacity = band.eteint ? "99" : "dd";
    ctx.fillStyle = band.color + opacity;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 2);
    else ctx.rect(rx, ry, rw, rh);
    ctx.fill();

    // Bordure subtile
    ctx.strokeStyle = band.eteint ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.18)";
    ctx.lineWidth = 0.5; ctx.setLineDash([]);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 2);
    else ctx.rect(rx, ry, rw, rh);
    ctx.stroke();

    // Marqueur d'extinction (triangle rouge à droite)
    if (band.eteint && band.to) {
      const ex = toX(band.to);
      if (ex > 2 && ex < W-2) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(ex-4, ry+1);
        ctx.lineTo(ex+1, ry+rh/2);
        ctx.lineTo(ex-4, ry+rh-1);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Marqueur d'apparition (cercle gauche)
    if (fromX > 2 && fromX < W-2) {
      ctx.beginPath();
      ctx.arc(fromX, ry+rh/2, Math.min(rh/2-1, 4), 0, Math.PI*2);
      ctx.fillStyle = band.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth=1;
      ctx.stroke();
    }

    // Label — visible si assez de place
    if (rw > 30) {
      const indent = band.depth * 5;
      ctx.save();
      ctx.beginPath(); ctx.rect(rx+4+indent, ry, rw-8-indent, rh); ctx.clip();
      const fs = Math.min(rh-1, band.depth<=1 ? 10 : band.depth<=2 ? 9 : 8);
      ctx.font = `${band.depth<=1?"600":"500"} ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle = band.eteint ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.92)";
      ctx.textAlign = "left";
      ctx.fillText(band.label, rx+6+indent, ry+rh/2+fs*0.38);
      ctx.restore();
    }

    // Indication "visible maintenant" — highlight si dans la vue
    const inView = band.from >= ve && (band.to === null || band.to <= vs);
    if (inView && rw > 5) {
      ctx.strokeStyle = band.color + "66";
      ctx.lineWidth = 1.5; ctx.setLineDash([2,3]);
      ctx.beginPath(); ctx.rect(rx+0.75, ry+0.75, rw-1.5, rh-1.5); ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // ── LIGNE "MAINTENANT" dans l'arbre ───────────────────────────────────────
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="rgba(200,40,30,.4)"; ctx.lineWidth=1; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(nowX,TREE_Y+16); ctx.lineTo(nowX,H); ctx.stroke();
    ctx.setLineDash([]);
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
      mctx.fillStyle=ep.stripe+"cc"; mctx.fillRect(Math.max(0,ex1),2,1.5,mh-4);
    }
    // Événements majeurs sur la minimap
    for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
      const lv=L(ev.yearsAgo); if(lv<tle||lv>tls) continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath(); mctx.arc(mx,mh/2,2,0,Math.PI*2);
      mctx.fillStyle=cc(ev.cat)+"bb"; mctx.fill();
    }
    // Vue courante
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(18,16,14,.1)"; mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(18,16,14,.5)"; mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H, TREE_TOP:TREE_Y};
}
