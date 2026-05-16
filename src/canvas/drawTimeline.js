import { EPOCHS, PERIODS, ALL_EVENTS, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';
import { THEMES } from './civilisations.js';

// ── RECTANGLES CHRONOZOOM ─────────────────────────────────────────────────────
// Imbriqués : Universe → Ère → Sous-période
const CHRONO_RECTS = [
  { id:"univ",  label:"Univers",        from:13800e6, to:4600e6, color:"#312e81", textColor:"#a5b4fc", depth:0 },
  { id:"hadeen",label:"Hadéen",         from:4600e6,  to:4000e6, color:"#7f1d1d", textColor:"#fca5a5", depth:1 },
  { id:"archeen",label:"Archéen",       from:4000e6,  to:2500e6, color:"#1e3a5f", textColor:"#93c5fd", depth:1 },
  { id:"protero",label:"Protérozoïque", from:2500e6,  to:541e6,  color:"#14532d", textColor:"#86efac", depth:1 },
  { id:"paleo",  label:"Paléozoïque",   from:541e6,   to:252e6,  color:"#365314", textColor:"#bef264", depth:1 },
  { id:"meso",   label:"Mésozoïque",    from:252e6,   to:66e6,   color:"#7c2d12", textColor:"#fdba74", depth:1 },
  { id:"ceno",   label:"Cénozoïque",    from:66e6,    to:2.6e6,  color:"#4c1d95", textColor:"#c4b5fd", depth:1 },
  { id:"quatern",label:"Quaternaire",   from:2.6e6,   to:0,      color:"#1e1b4b", textColor:"#a5b4fc", depth:1 },
  // Sous-périodes Mésozoïque
  { id:"trias",  label:"Trias",         from:252e6,   to:201e6,  color:"#6b21a8", textColor:"#e9d5ff", depth:2 },
  { id:"jura",   label:"Jurassique",    from:201e6,   to:145e6,  color:"#1e40af", textColor:"#bfdbfe", depth:2 },
  { id:"creta",  label:"Crétacé",       from:145e6,   to:66e6,   color:"#065f46", textColor:"#a7f3d0", depth:2 },
  // Sous-périodes Cénozoïque
  { id:"paleo2", label:"Paléogène",     from:66e6,    to:23e6,   color:"#78350f", textColor:"#fde68a", depth:2 },
  { id:"neo",    label:"Néogène",       from:23e6,    to:2.6e6,  color:"#7f1d1d", textColor:"#fecaca", depth:2 },
  // Humains
  { id:"preh",   label:"Préhistoire",   from:300e3,   to:5200,   color:"#1c1917", textColor:"#d6d3d1", depth:2 },
  { id:"hist",   label:"Histoire",      from:5200,    to:0,      color:"#0f172a", textColor:"#e2e8f0", depth:2 },
];

export { LIFE_TREE_DATA } from './lifeTree.js';

// ── Aplatir l'arbre de vie ─────────────────────────────────────────────────────
export function flattenTree(nodes, expandedIds, depth=0, result=[]) {
  for (const n of nodes) {
    result.push({...n, depth, row: result.length});
    if (n.children?.length && expandedIds.has(n.id))
      flattenTree(n.children, expandedIds, depth+1, result);
  }
  return result;
}

function makeLinearCoord(vs, ve, W) {
  const range = vs - ve;
  return { toX:(ya)=>(1-(ya-ve)/range)*W, toYa:(x)=>vs-(x/W)*range, logRange:L(vs)-L(Math.max(ve,0.1)) };
}

export function drawAll(canvas, miniCanvas, params) {
  const {
    vs, ve, aiEvents, selectedId, hoveredId,
    filterCat="all", expandedBands=new Set(),
    linearScale=false, activeThemes=new Set(),
    flatBands=[],
  } = params;

  const W=canvas.width, H=canvas.height;
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,W,H);

  const coord = linearScale ? makeLinearCoord(vs,ve,W) : makeCoord(vs,ve,W);
  const {toX} = coord;
  const zl = linearScale ? 3 : zoomLvl(vs,ve);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  const CHRONO_H  = Math.round(H * 0.10);  // rectangles ChronoZoom
  const CIVILS_H  = activeThemes.size * 18; // couches civilisations
  const PERIOD_H  = Math.round(H * 0.045);
  const PERIOD_Y  = CHRONO_H;
  const CIVILS_Y  = PERIOD_Y + PERIOD_H;
  const LINE_Y    = CIVILS_Y + CIVILS_H + Math.round(H * 0.012);
  const EVT_FRAC  = linearScale ? 0.04 : 0.26;
  const EVT_H     = Math.round(H * EVT_FRAC);
  const TREE_Y    = Math.min(LINE_Y + EVT_H, H - 40);
  const TREE_H    = H - TREE_Y;
  const N_ROWS    = flatBands.length || 1;
  const ROW_H     = Math.max(Math.floor((TREE_H - 20) / N_ROWS), 6);
  const EVT_BOT   = TREE_Y - 20;

  // ── FOND SOMBRE ───────────────────────────────────────────────────────────
  // Gradient subtil du fond
  const grd=ctx.createLinearGradient(0,0,0,TREE_Y);
  grd.addColorStop(0,"#0c0a1a");
  grd.addColorStop(0.5,"#0f1117");
  grd.addColorStop(1,"#111827");
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,W,TREE_Y);
  ctx.fillStyle="#0a0c10";
  ctx.fillRect(0,TREE_Y,W,TREE_H);

  // ── GRILLE ────────────────────────────────────────────────────────────────
  const span=vs-ve;
  const IVS=[1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen=IVS[0];
  for(const iv of IVS){if(span/iv>=5&&span/iv<=16){chosen=iv;break;}}
  ctx.strokeStyle="rgba(255,255,255,.04)";ctx.lineWidth=1;
  for(let ya=Math.ceil(ve/chosen)*chosen;ya<=vs;ya+=chosen){
    if(ya<0.1)continue;const x=toX(ya);if(x<0||x>W)continue;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── RECTANGLES CHRONOZOOM ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  const chronoRects = []; // pour hit-test

  for(const rect of CHRONO_RECTS){
    const x1=toX(rect.from),x2=toX(Math.max(rect.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
    if(rw<2) continue;

    // Hauteur selon la profondeur
    const depth=rect.depth||0;
    const ry = depth===0 ? 0 : depth===1 ? 4 : 8;
    const rh = depth===0 ? CHRONO_H : depth===1 ? CHRONO_H-6 : CHRONO_H-12;

    // Fond arrondi avec couleur
    ctx.fillStyle = rect.color + (depth===0?"ff":depth===1?"ee":"cc");
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(rx+0.5,ry+0.5,rw-1,rh-1,depth===0?0:5);
    else ctx.rect(rx+0.5,ry+0.5,rw-1,rh-1);
    ctx.fill();

    // Bordure lumineuse
    ctx.strokeStyle=rect.textColor+"44";ctx.lineWidth=depth===0?0:1;
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(rx+0.5,ry+0.5,rw-1,rh-1,5);
    else ctx.rect(rx+0.5,ry+0.5,rw-1,rh-1);
    ctx.stroke();

    // Indicateur de clic (coin)
    if(depth<2&&rw>60){
      ctx.fillStyle=rect.textColor+"66";
      ctx.font=`700 8px -apple-system`;ctx.textAlign="right";
      ctx.fillText("⤵",rx+rw-5,ry+13);
    }

    // Label
    if(rw>30){
      ctx.save();ctx.beginPath();ctx.rect(rx+4,ry+1,rw-8,rh-2);ctx.clip();
      const fs=Math.min(rh-4, rw>200?13:rw>80?11:rw>40?9:7);
      ctx.font=`700 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle=rect.textColor;ctx.textAlign="left";
      ctx.fillText(rect.label, rx+6, ry+rh/2+fs*0.38);
      ctx.restore();
    }

    chronoRects.push({id:rect.id,from:rect.from,to:rect.to,rx,ry,rw,rh,depth:rect.depth});
  }

  // ── BANDES DE PÉRIODES (réduite, discrète) ────────────────────────────────
  if(!linearScale){
    for(const per of PERIODS){
      const x1=toX(per.from),x2=toX(Math.max(per.to,0.1));
      if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
      const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
      if(rw<1) continue;
      ctx.fillStyle=per.color+"99";ctx.fillRect(rx,PERIOD_Y,rw,PERIOD_H);
      ctx.strokeStyle="rgba(255,255,255,.08)";ctx.lineWidth=0.5;ctx.setLineDash([]);
      ctx.strokeRect(rx+0.3,PERIOD_Y+0.3,rw-0.6,PERIOD_H-0.6);
      if(rw>28){
        ctx.save();ctx.beginPath();ctx.rect(rx+2,PERIOD_Y,rw-4,PERIOD_H);ctx.clip();
        const fs=rw>80?10:rw>45?9:8;
        ctx.font=`500 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
        ctx.fillStyle="rgba(255,255,255,.85)";ctx.textAlign="center";
        ctx.shadowColor="rgba(0,0,0,.6)";ctx.shadowBlur=2;
        ctx.fillText(per.label,rx+rw/2,PERIOD_Y+PERIOD_H/2+fs*0.38);
        ctx.shadowBlur=0;ctx.restore();
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── COUCHES CIVILISATIONS / THÈMES ────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  let civRow=0;
  for(const themeKey of activeThemes){
    const theme=THEMES[themeKey];if(!theme) continue;
    const rowY=CIVILS_Y+civRow*18;

    // Label de la catégorie à gauche
    ctx.fillStyle=theme.color+"cc";
    ctx.font="600 8px -apple-system,'Segoe UI',system-ui,sans-serif";
    ctx.textAlign="left";
    ctx.fillText(theme.icon+" "+theme.label.split(" ")[0].toUpperCase(),4,rowY+12);

    for(const item of theme.items){
      if(!item.to && item.to!==null) continue;
      const itemTo = item.to===null ? 0 : item.to;
      const x1=toX(item.from),x2=toX(Math.max(itemTo,0.1));
      if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
      const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
      if(rw<1) continue;

      const rh=14,ry=rowY+2;

      // Barre arrondie élégante
      ctx.fillStyle=item.color+"cc";
      ctx.beginPath();
      if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,3);
      else ctx.rect(rx,ry,rw,rh);
      ctx.fill();

      // Bordure
      ctx.strokeStyle=item.color+"55";ctx.lineWidth=0.8;ctx.setLineDash([]);
      ctx.beginPath();
      if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,3);
      else ctx.rect(rx,ry,rw,rh);
      ctx.stroke();

      // Label si assez large
      if(rw>40){
        ctx.save();ctx.beginPath();ctx.rect(rx+3,ry,rw-6,rh);ctx.clip();
        ctx.font="500 9px -apple-system,'Segoe UI',system-ui,sans-serif";
        ctx.fillStyle="rgba(255,255,255,.92)";ctx.textAlign="left";
        ctx.shadowColor="rgba(0,0,0,.5)";ctx.shadowBlur=2;
        ctx.fillText(item.label,rx+4,ry+rh/2+3.5);
        ctx.shadowBlur=0;ctx.restore();
      }
    }
    civRow++;
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle="rgba(255,255,255,.15)";ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,LINE_Y);ctx.lineTo(W,LINE_Y);ctx.stroke();

  // Lueur sur la ligne
  const lineGrd=ctx.createLinearGradient(0,LINE_Y-2,0,LINE_Y+2);
  lineGrd.addColorStop(0,"rgba(255,255,255,.0)");
  lineGrd.addColorStop(0.5,"rgba(255,255,255,.2)");
  lineGrd.addColorStop(1,"rgba(255,255,255,.0)");
  ctx.fillStyle=lineGrd;ctx.fillRect(0,LINE_Y-2,W,4);

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  ctx.font="10px -apple-system,'Segoe UI',system-ui,sans-serif";
  for(let ya=Math.ceil(ve/chosen)*chosen;ya<=vs;ya+=chosen){
    if(ya<0.1)continue;const x=toX(ya);if(x<0||x>W)continue;
    ctx.strokeStyle="rgba(255,255,255,.12)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x,LINE_Y-5);ctx.lineTo(x,LINE_Y+5);ctx.stroke();
    const lbl=fmt(ya),tw=ctx.measureText(lbl).width;
    ctx.fillStyle="rgba(255,255,255,.07)";
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(x-tw/2-5,EVT_BOT-1,tw+10,15,8);
    else ctx.rect(x-tw/2-5,EVT_BOT-1,tw+10,15);
    ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.5)";ctx.textAlign="center";
    ctx.fillText(lbl,x,EVT_BOT+10);
  }

  // ── ÉVÉNEMENTS ────────────────────────────────────────────────────────────
  const placed=[];
  if(!linearScale){
    const evFilter=ev=>filterCat==="all"||ev.cat===filterCat;
    const all=[...ALL_EVENTS.filter(ev=>ev.minZoom<=zl&&evFilter(ev)),...aiEvents.filter(evFilter)];
    const vis=all.filter(ev=>{const x=toX(ev.yearsAgo);return x>=-80&&x<=W+80;});
    vis.sort((a,b)=>(a.importance||2)-(b.importance||2));
    const deduped=[];
    for(const ev of vis){const x=toX(ev.yearsAgo);if(!deduped.find(p=>Math.abs(p.x-x)<28))deduped.push({x,ev});}
    deduped.sort((a,b)=>a.x-b.x);

    for(const {x,ev} of deduped){
      const col=cc(ev.cat),imp=ev.importance||2;
      const isHov=hoveredId===ev.id,isSel=selectedId===ev.id;
      const nearby=placed.filter(p=>Math.abs(p.x-x)<90);
      const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
      placed.push({x,ev,side});
      const zThresh=imp===1?0:imp===2?1.5:2.5;
      const sF=(isSel||isHov)?1:Math.min(1,0.35+Math.max(0,zl-zThresh)*0.35);
      const maxStem=imp===1?EVT_H*0.75:imp===2?EVT_H*0.58:EVT_H*0.42;
      const stemLen=(side===1?maxStem:maxStem*0.72)*sF;
      const endY=LINE_Y-side*stemLen;

      if(isHov||isSel){ctx.beginPath();ctx.arc(x,LINE_Y,16,0,Math.PI*2);ctx.fillStyle=col+"18";ctx.fill();}

      // Tige avec lueur
      ctx.strokeStyle=(isHov||isSel)?col:col+(imp===1?"dd":imp===2?"88":"44");
      ctx.lineWidth=((isHov||isSel)?2.5:imp===1?2:imp===2?1.2:0.7)*sF;
      ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
      ctx.beginPath();ctx.moveTo(x,LINE_Y);ctx.lineTo(x,endY);ctx.stroke();ctx.setLineDash([]);

      // Point lumineux
      const baseR=isSel?9:isHov?8:imp===1?6:imp===2?4.5:3;
      const r=Math.max(baseR*sF,(isSel||isHov)?baseR:1.5);
      // Halo
      if(imp<=2){
        ctx.beginPath();ctx.arc(x,LINE_Y,r+4,0,Math.PI*2);
        ctx.fillStyle=col+"22";ctx.fill();
      }
      ctx.beginPath();ctx.arc(x,LINE_Y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      if(imp===1&&!isSel&&sF>0.4){
        ctx.beginPath();ctx.arc(x,LINE_Y,Math.max(r-2.5,0.8),0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,.9)";ctx.fill();
      }
      if(isSel){ctx.beginPath();ctx.arc(x,LINE_Y,r+5,0,Math.PI*2);ctx.strokeStyle=col+"88";ctx.lineWidth=2;ctx.stroke();}

      // Label — fond sombre translucide
      const minR=imp===1?1.5:imp===2?2:2.8;
      if(r>=minR||isHov||isSel){
        const fs=Math.max(9,(imp===1?13:imp===2?12:11)*sF);
        const maxLW=imp===1?130:110;
        ctx.font=`${imp===1?"600":"500"} ${Math.round(fs)}px -apple-system,'Segoe UI',system-ui,sans-serif`;
        const words=ev.title.split(" ");let line="",lines=[];
        for(const w of words){const t=line+w+" ";if(ctx.measureText(t).width>maxLW&&line){lines.push(line.trim());line=w+" ";}else line=t;}
        lines.push(line.trim());
        const lh=Math.round(fs)+3;
        const startY=side===1?endY-8-lines.length*lh:endY+8;
        lines.forEach((l,i)=>{
          const tw2=ctx.measureText(l).width,lx=x-tw2/2-5,ly=startY+i*lh-1;
          ctx.fillStyle=(isHov||isSel)?"rgba(15,12,30,.96)":"rgba(12,10,20,.88)";
          ctx.beginPath();
          if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);
          ctx.fill();
          ctx.strokeStyle=(isHov||isSel)?col:col+"55";ctx.lineWidth=0.8;
          ctx.beginPath();
          if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);
          ctx.stroke();
          ctx.fillStyle=(isHov||isSel)?col:imp===1?"rgba(255,255,255,.92)":"rgba(255,255,255,.72)";
          ctx.textAlign="center";ctx.fillText(l,x,startY+i*lh+fs);
        });
      }
    }
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    const nowGrd=ctx.createLinearGradient(nowX,LINE_Y,nowX,H);
    nowGrd.addColorStop(0,"rgba(239,68,68,.7)");
    nowGrd.addColorStop(1,"rgba(239,68,68,.1)");
    ctx.strokeStyle=nowGrd;ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(nowX,LINE_Y-40);ctx.lineTo(nowX,H);ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="bold 8px -apple-system";ctx.fillStyle="#ef4444";ctx.textAlign="center";
    ctx.fillText("AUJOURD'HUI",nowX,LINE_Y-43);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── ARBRE DE VIE DÉPLIABLE ────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  ctx.fillStyle="rgba(200,150,60,.85)";
  ctx.font="700 9px -apple-system,'Segoe UI',system-ui,sans-serif";
  ctx.textAlign="left";
  ctx.fillText("▸ ARBRE DE LA VIE — cliquer les barres pour déplier",10,TREE_Y+13);
  ctx.fillStyle="rgba(255,255,255,.22)";ctx.textAlign="right";
  ctx.font="8px -apple-system";
  ctx.fillText("💀=éteint  ●=vivant  ▶=enfants",W-8,TREE_Y+13);
  ctx.strokeStyle="rgba(200,150,60,.35)";ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,TREE_Y);ctx.lineTo(W,TREE_Y);ctx.stroke();

  const bandRects=[];
  for(const band of flatBands){
    const fromX=toX(band.from),toXv=band.to?toX(band.to):toX(0.5);
    const rx=Math.max(0,Math.min(fromX,toXv)),rx2=Math.min(W,Math.max(fromX,toXv)),rw=rx2-rx;
    const ry=TREE_Y+18+band.row*ROW_H,rh=Math.max(ROW_H-2,5);
    const hasKids=band.children?.length>0,isExpanded=expandedBands.has(band.id);
    bandRects.push({id:band.id,rx,ry,rw,rh,hasKids});
    if(rw<0.5)continue;

    // Barre avec gradient interne
    const barGrd=ctx.createLinearGradient(rx,ry,rx,ry+rh);
    barGrd.addColorStop(0,band.color+(band.eteint?"66":"cc"));
    barGrd.addColorStop(1,band.color+(band.eteint?"44":"99"));
    ctx.fillStyle=barGrd;
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,3);else ctx.rect(rx,ry,rw,rh);ctx.fill();

    // Bordure subtile
    ctx.strokeStyle=band.color+(band.eteint?"33":"66");ctx.lineWidth=0.6;
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,3);else ctx.rect(rx,ry,rw,rh);ctx.stroke();

    // Extinction
    if(band.eteint&&band.to){const ex=toX(band.to);if(ex>2&&ex<W-2){ctx.fillStyle="#ef4444";ctx.beginPath();ctx.moveTo(ex-4,ry+1);ctx.lineTo(ex+1,ry+rh/2);ctx.lineTo(ex-4,ry+rh-1);ctx.closePath();ctx.fill();}}

    // Cercle apparition
    if(fromX>2&&fromX<W-2){ctx.beginPath();ctx.arc(fromX,ry+rh/2,Math.min(rh/2-1,3.5),0,Math.PI*2);ctx.fillStyle=band.color;ctx.fill();ctx.strokeStyle="rgba(255,255,255,.4)";ctx.lineWidth=0.8;ctx.stroke();}

    // Chevron déploiement
    if(hasKids){const chevX=Math.min(rx+8,rx+rw-10);ctx.fillStyle="rgba(255,255,255,.65)";ctx.font=`700 ${Math.min(rh-2,9)}px -apple-system`;ctx.textAlign="left";ctx.fillText(isExpanded?"▼":"▶",chevX,ry+rh/2+3.5);}

    // Label
    if(rw>25){
      const indX=band.depth*6+(hasKids?13:4);
      ctx.save();ctx.beginPath();ctx.rect(rx+indX,ry,rw-indX-4,rh);ctx.clip();
      const fs=Math.min(rh-1,band.depth===0?11:band.depth<=2?10:9);
      ctx.font=`${band.depth<=1?"600":"500"} ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle=band.eteint?"rgba(255,255,255,.4)":"rgba(255,255,255,.92)";
      ctx.textAlign="left";ctx.fillText(band.label,rx+indX+2,ry+rh/2+fs*0.38);ctx.restore();
    }
  }

  // Ligne Aujourd'hui dans l'arbre
  if(nowX>2&&nowX<W-2){ctx.strokeStyle="rgba(239,68,68,.25)";ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(nowX,TREE_Y+16);ctx.lineTo(nowX,H);ctx.stroke();ctx.setLineDash([]);}

  // ── MINIMAP ───────────────────────────────────────────────────────────────
  if(miniCanvas){
    const mw=miniCanvas.width,mh=miniCanvas.height,mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    const mgrd=mctx.createLinearGradient(0,0,mw,0);
    mgrd.addColorStop(0,"#1a1040");mgrd.addColorStop(0.5,"#0f1820");mgrd.addColorStop(1,"#1a0a10");
    mctx.fillStyle=mgrd;mctx.fillRect(0,0,mw,mh);
    const tls=Math.log10(13.8e9),tle=0,tR=tls-tle;
    for(const rect of CHRONO_RECTS.filter(r=>r.depth===1)){
      const ex1=(tls-L(rect.from))/tR*mw,ex2=(tls-L(Math.max(rect.to,0.1)))/tR*mw;
      mctx.fillStyle=rect.color+"88";mctx.fillRect(Math.max(0,ex1),2,Math.abs(ex2-ex1),mh-4);
    }
    for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
      const lv=L(ev.yearsAgo);if(lv<tle||lv>tls)continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath();mctx.arc(mx,mh/2,2,0,Math.PI*2);mctx.fillStyle=cc(ev.cat)+"cc";mctx.fill();
    }
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(255,255,255,.08)";mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(255,255,255,.5)";mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H:PERIOD_H+CIVILS_H, TREE_TOP:TREE_Y, bandRects, chronoRects};
}
