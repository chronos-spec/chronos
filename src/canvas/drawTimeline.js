import { EPOCHS, PERIODS, ALL_EVENTS, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

// ── THÈMES CIVILISATIONS — inline pour éviter les problèmes de chemin ─────────
const THEMES = {
  civilisations:{ label:"Civilisations & Empires", color:"#f59e0b", icon:"🏛️", items:[
    { id:"sumer",    label:"Sumer",                from:5500,  to:1900,  color:"#f59e0b" },
    { id:"egypte",   label:"Égypte ancienne",      from:3100,  to:30,    color:"#eab308" },
    { id:"grece",    label:"Grèce antique",         from:800,   to:146,   color:"#3b82f6" },
    { id:"rome",     label:"Empire romain",         from:753,   to:476,   color:"#ef4444" },
    { id:"byzance",  label:"Empire byzantin",       from:330,   to:1453,  color:"#8b5cf6" },
    { id:"perse",    label:"Empire perse",          from:550,   to:330,   color:"#f97316" },
    { id:"islam",    label:"Âge d'or islamique",    from:632,   to:1258,  color:"#10b981" },
    { id:"ottoman",  label:"Empire ottoman",        from:1299,  to:1922,  color:"#059669" },
    { id:"chine_h",  label:"Chine impériale",       from:221,   to:1912,  color:"#dc2626" },
    { id:"mongol",   label:"Empire mongol",         from:1206,  to:1368,  color:"#78716c" },
    { id:"maya",     label:"Civilisation maya",     from:2000,  to:1500,  color:"#16a34a" },
    { id:"aztec",    label:"Empire aztèque",        from:1345,  to:1521,  color:"#15803d" },
    { id:"inca",     label:"Empire inca",           from:1438,  to:1533,  color:"#166534" },
    { id:"brit",     label:"Empire britannique",    from:1583,  to:1997,  color:"#1d4ed8" },
    { id:"france",   label:"France royale",         from:987,   to:1792,  color:"#2563eb" },
  ]},
  religions:{ label:"Religions & Philosophies", color:"#8b5cf6", icon:"✨", items:[
    { id:"hindou",   label:"Hindouisme",            from:3500,  to:null,  color:"#f97316" },
    { id:"judaisme", label:"Judaïsme",              from:2000,  to:null,  color:"#3b82f6" },
    { id:"boud",     label:"Bouddhisme",            from:2530,  to:null,  color:"#eab308" },
    { id:"confuc",   label:"Confucianisme",         from:2500,  to:null,  color:"#dc2626" },
    { id:"christi",  label:"Christianisme",         from:2025,  to:null,  color:"#6366f1" },
    { id:"islami",   label:"Islam",                 from:1393,  to:null,  color:"#10b981" },
    { id:"lumiere",  label:"Lumières",              from:350,   to:200,   color:"#0ea5e9" },
  ]},
  sciences:{ label:"Sciences & Inventions", color:"#06b6d4", icon:"🔬", items:[
    { id:"ecriture", label:"Écriture",              from:5200,  to:5000,  color:"#f59e0b" },
    { id:"imprim",   label:"Imprimerie",            from:571,   to:571,   color:"#7c3aed" },
    { id:"copern",   label:"Révolution copernicienne",from:480, to:430,   color:"#0ea5e9" },
    { id:"revind",   label:"Révolution industrielle",from:265,  to:125,   color:"#78716c" },
    { id:"darwin",   label:"Darwin — Évolution",    from:166,   to:163,   color:"#16a34a" },
    { id:"einstein", label:"Einstein — Relativité", from:120,   to:70,    color:"#f59e0b" },
    { id:"internet", label:"Internet",              from:55,    to:45,    color:"#06b6d4" },
    { id:"ia",       label:"IA générative",         from:3,     to:null,  color:"#8b5cf6" },
  ]},
  guerres:{ label:"Guerres & Conflits", color:"#ef4444", icon:"⚔️", items:[
    { id:"croisades",label:"Croisades",             from:1096,  to:1291,  color:"#7c3aed" },
    { id:"gua",      label:"Guerre de Cent Ans",    from:1337,  to:1453,  color:"#2563eb" },
    { id:"napo",     label:"Guerres napoléoniennes",from:221,   to:210,   color:"#1d4ed8" },
    { id:"g1",       label:"Première Guerre mondiale",from:110, to:107,   color:"#78716c" },
    { id:"g2",       label:"Seconde Guerre mondiale",from:86,   to:80,    color:"#1f2937" },
    { id:"cold",     label:"Guerre froide",         from:80,    to:34,    color:"#7c3aed" },
  ]},
  arts:{ label:"Arts & Culture", color:"#ec4899", icon:"🎨", items:[
    { id:"chauvet",  label:"Art rupestre",          from:36500, to:36000, color:"#f97316" },
    { id:"renaiss",  label:"Renaissance italienne", from:430,   to:300,   color:"#ec4899" },
    { id:"baroque",  label:"Baroque",               from:380,   to:250,   color:"#f97316" },
    { id:"impression",label:"Impressionnisme",      from:155,   to:120,   color:"#8b5cf6" },
    { id:"cinema",   label:"Cinéma",                from:130,   to:null,  color:"#7c3aed" },
  ]},
  personnages:{ label:"Personnages clés", color:"#f97316", icon:"👤", items:[
    { id:"alex",     label:"Alexandre le Grand",    from:2356,  to:2323,  color:"#6366f1" },
    { id:"cesar",    label:"Jules César",           from:2100,  to:2044,  color:"#ef4444" },
    { id:"leon",     label:"Léonard de Vinci",      from:567,   to:515,   color:"#ec4899" },
    { id:"napoleon", label:"Napoléon Bonaparte",    from:256,   to:204,   color:"#1d4ed8" },
    { id:"darwin2",  label:"Charles Darwin",        from:216,   to:143,   color:"#16a34a" },
    { id:"einstein2",label:"Albert Einstein",       from:146,   to:70,    color:"#f59e0b" },
    { id:"gandhi",   label:"Gandhi",                from:155,   to:77,    color:"#f97316" },
  ]},
};
export { THEMES };

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
  // L'arbre de la vie n'est plus dessiné dans le canvas : tout l'espace sous
  // les bandeaux supérieurs est rendu aux événements, qui respirent enfin.
  const CHRONO_H  = Math.round(H * 0.11);   // rectangles ChronoZoom
  const CIVILS_H  = activeThemes.size * 18; // couches civilisations
  const PERIOD_H  = Math.round(H * 0.05);
  const PERIOD_Y  = CHRONO_H;
  const CIVILS_Y  = PERIOD_Y + PERIOD_H;
  const TOP_STRUCT= CIVILS_Y + CIVILS_H + Math.round(H * 0.02);
  // Ligne de vie placée pour laisser respirer les événements au-dessus ET dessous.
  const LINE_Y    = linearScale
    ? TOP_STRUCT + Math.round(H * 0.06)
    : Math.max(TOP_STRUCT + Math.round(H * 0.30), Math.round(H * 0.48));
  const EVT_H     = linearScale ? Math.round(H * 0.06) : Math.round(H * 0.40);
  const EVT_BOT   = H - 24;                  // bas réservé aux labels de dates

  // ── FOND SOMBRE ───────────────────────────────────────────────────────────
  // Gradient profond, unifié sur toute la hauteur (ciel → nuit).
  const grd=ctx.createLinearGradient(0,0,0,H);
  grd.addColorStop(0,"#0c0a1a");
  grd.addColorStop(0.5,"#0f1117");
  grd.addColorStop(1,"#0a0c14");
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,W,H);

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

  const bandRects=[]; // l'arbre de vie vit désormais dans son propre bloc, sous la frise

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

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H:PERIOD_H+CIVILS_H, TREE_TOP:H, bandRects, chronoRects};
}
