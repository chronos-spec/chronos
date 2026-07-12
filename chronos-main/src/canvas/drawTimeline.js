import { EPOCHS, PERIODS, ALL_EVENTS, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

// ── THÈMES CIVILISATIONS ──────────────────────────────────────────────────────
const THEMES_DATA = {
  civilisations:{ label:"Civilisations", color:"#d97706", items:[
    { id:"egypte",  label:"Égypte",          from:3100, to:30,   color:"#d97706" },
    { id:"grece",   label:"Grèce",           from:800,  to:146,  color:"#2563eb" },
    { id:"rome",    label:"Rome",            from:753,  to:476,  color:"#dc2626" },
    { id:"byzance", label:"Byzance",         from:330,  to:1453, color:"#7c3aed" },
    { id:"islam",   label:"Âge d'or islam.", from:632,  to:1258, color:"#059669" },
    { id:"ottoman", label:"Ottoman",         from:1299, to:1922, color:"#065f46" },
    { id:"chine",   label:"Chine impériale", from:221,  to:1912, color:"#b91c1c" },
    { id:"mongol",  label:"Mongols",         from:1206, to:1368, color:"#78716c" },
    { id:"maya",    label:"Maya",            from:2000, to:1500, color:"#16a34a" },
    { id:"aztec",   label:"Aztèques",        from:1345, to:1521, color:"#15803d" },
    { id:"brit",    label:"Empire brit.",    from:1583, to:1997, color:"#1d4ed8" },
    { id:"france",  label:"France royale",   from:987,  to:1792, color:"#3b82f6" },
  ]},
  religions:{ label:"Religions", color:"#7c3aed", items:[
    { id:"hindou",  label:"Hindouisme",      from:3500, to:null, color:"#f97316" },
    { id:"boud",    label:"Bouddhisme",      from:2530, to:null, color:"#eab308" },
    { id:"christi", label:"Christianisme",   from:2025, to:null, color:"#6366f1" },
    { id:"islami",  label:"Islam",           from:1393, to:null, color:"#10b981" },
  ]},
  sciences:{ label:"Sciences", color:"#0891b2", items:[
    { id:"ecriture",label:"Écriture",        from:5200, to:5000, color:"#d97706" },
    { id:"imprim",  label:"Imprimerie",      from:571,  to:570,  color:"#7c3aed" },
    { id:"revind",  label:"Rév. industrielle",from:265, to:125,  color:"#78716c" },
    { id:"internet",label:"Internet",        from:55,   to:45,   color:"#0891b2" },
    { id:"ia",      label:"IA générative",   from:3,    to:null, color:"#6366f1" },
  ]},
  guerres:{ label:"Guerres", color:"#dc2626", items:[
    { id:"croisades",label:"Croisades",      from:1096, to:1291, color:"#7c3aed" },
    { id:"g1",      label:"1ère Guerre mond.",from:110, to:107,  color:"#78716c" },
    { id:"g2",      label:"2ème Guerre mond.",from:86,  to:80,   color:"#1f2937" },
    { id:"cold",    label:"Guerre froide",   from:80,   to:34,   color:"#7c3aed" },
  ]},
  arts:{ label:"Arts", color:"#db2777", items:[
    { id:"chauvet", label:"Art rupestre",    from:36500,to:36000,color:"#f97316" },
    { id:"renaiss", label:"Renaissance",     from:430,  to:300,  color:"#db2777" },
    { id:"cinema",  label:"Cinéma",          from:130,  to:null, color:"#7c3aed" },
  ]},
  personnages:{ label:"Personnages", color:"#ea580c", items:[
    { id:"alex",    label:"Alexandre",       from:2356, to:2323, color:"#6366f1" },
    { id:"cesar",   label:"César",           from:2100, to:2044, color:"#dc2626" },
    { id:"leon",    label:"Léonard de Vinci",from:567,  to:515,  color:"#db2777" },
    { id:"napoleon",label:"Napoléon",        from:256,  to:204,  color:"#2563eb" },
    { id:"darwin",  label:"Darwin",          from:216,  to:143,  color:"#16a34a" },
    { id:"einstein",label:"Einstein",        from:146,  to:70,   color:"#d97706" },
  ]},
};
export { THEMES_DATA as THEMES };

// ── APLATIR L'ARBRE ──────────────────────────────────────────────────────────
export function flattenTree(nodes, expandedIds, depth=0, result=[]) {
  for (const n of nodes) {
    result.push({...n, depth, row: result.length});
    if (n.children?.length && expandedIds.has(n.id))
      flattenTree(n.children, expandedIds, depth+1, result);
  }
  return result;
}

// ── DESSIN PRINCIPAL ──────────────────────────────────────────────────────────
export function drawAll(canvas, miniCanvas, params) {
  const {vs, ve, aiEvents=[], selectedId=null, hoveredId=null,
         activeThemes=new Set(), flatBands=[], linearScale=false} = params;
  const W=canvas.width, H=canvas.height;
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,W,H);

  const coord = makeCoord(vs,ve,W);
  const {toX} = coord;
  const zl = zoomLvl(vs,ve);

  // ── FOND BLANC PUR ────────────────────────────────────────────────────────
  ctx.fillStyle="#ffffff";
  ctx.fillRect(0,0,W,H);

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  // Bandes ères : fin, discrètes en haut
  const ERA_H   = 20;
  const PERIOD_H= 14;
  const PERIOD_Y= ERA_H;
  // Couches thèmes
  const THEMES_H = activeThemes.size * 14;
  const THEMES_Y = ERA_H + PERIOD_H;
  // Ligne frise
  const LINE_Y  = THEMES_Y + THEMES_H + 8;
  // Arbre de vie en bas
  const TREE_Y  = Math.round(H * 0.62);
  const TREE_H  = H - TREE_Y;
  const EVT_TOP = LINE_Y;
  const EVT_BOT = TREE_Y - 20;
  const N_ROWS  = flatBands.length || 1;
  const ROW_H   = Math.max(Math.floor((TREE_H - 18) / N_ROWS), 5);

  // Graduation
  const span=vs-ve;
  const IVS=[1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen=IVS[0];
  for(const iv of IVS){if(span/iv>=5&&span/iv<=16){chosen=iv;break;}}

  // ── BANDES D'ÈRES — très discrètes ───────────────────────────────────────
  for(const ep of EPOCHS){
    const x1=toX(ep.from),x2=toX(Math.max(ep.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
    // Fond très léger
    ctx.fillStyle=ep.stripe+"0e";
    ctx.fillRect(rx,0,rw,TREE_Y);
    // Barre couleur fine en haut
    ctx.fillStyle=ep.stripe+"cc";
    ctx.fillRect(rx,0,rw,3);
    // Séparateur vertical
    if(x1>1&&x1<W-1){
      ctx.strokeStyle=ep.stripe+"44"; ctx.lineWidth=0.5; ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(x1,3);ctx.lineTo(x1,TREE_Y);ctx.stroke();
    }
    // Label ère
    if(rw>50){
      ctx.save();ctx.beginPath();ctx.rect(rx+4,5,rw-8,ERA_H-6);ctx.clip();
      ctx.font=`500 9px -apple-system,sans-serif`;
      ctx.fillStyle=ep.stripe+"bb";ctx.textAlign="left";
      ctx.fillText(ep.label.toUpperCase(),rx+5,13);
      ctx.restore();
    }
  }

  // ── PÉRIODES GÉOLOGIQUES — bande fine ─────────────────────────────────────
  for(const per of PERIODS){
    const x1=toX(per.from),x2=toX(Math.max(per.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
    if(rw<1)continue;
    ctx.fillStyle=per.color+"aa";ctx.fillRect(rx,PERIOD_Y,rw,PERIOD_H);
    ctx.strokeStyle="rgba(0,0,0,.06)";ctx.lineWidth=0.4;ctx.setLineDash([]);
    ctx.strokeRect(rx,PERIOD_Y,rw,PERIOD_H);
    if(rw>28){
      ctx.save();ctx.beginPath();ctx.rect(rx+1,PERIOD_Y,rw-2,PERIOD_H);ctx.clip();
      const fs=rw>70?9:8;
      ctx.font=`500 ${fs}px -apple-system,sans-serif`;
      ctx.fillStyle="rgba(255,255,255,.9)";ctx.textAlign="center";
      ctx.shadowColor="rgba(0,0,0,.2)";ctx.shadowBlur=2;
      ctx.fillText(per.label,rx+rw/2,PERIOD_Y+PERIOD_H/2+fs*0.38);
      ctx.shadowBlur=0;ctx.restore();
    }
  }

  // ── COUCHES THÈMES ────────────────────────────────────────────────────────
  let themeRow=0;
  for(const key of activeThemes){
    const theme=THEMES_DATA[key];if(!theme)continue;
    const ry=THEMES_Y+themeRow*14;
    for(const item of theme.items){
      const itemTo=item.to===null?0:item.to;
      const x1=toX(item.from),x2=toX(Math.max(itemTo,0.1));
      if(Math.min(x1,x2)>W||Math.max(x1,x2)<0)continue;
      const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
      if(rw<1)continue;
      ctx.fillStyle=item.color+"33";
      ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry+1,rw,10,2);else ctx.rect(rx,ry+1,rw,10);ctx.fill();
      ctx.strokeStyle=item.color+"66";ctx.lineWidth=0.6;ctx.setLineDash([]);
      ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry+1,rw,10,2);else ctx.rect(rx,ry+1,rw,10);ctx.stroke();
      if(rw>40){
        ctx.save();ctx.beginPath();ctx.rect(rx+2,ry+1,rw-4,10);ctx.clip();
        ctx.font="500 8px -apple-system,sans-serif";
        ctx.fillStyle=item.color+"cc";ctx.textAlign="left";
        ctx.fillText(item.label,rx+3,ry+9);ctx.restore();
      }
    }
    themeRow++;
  }

  // ── GRILLE VERTICALE LÉGÈRE ───────────────────────────────────────────────
  ctx.strokeStyle="rgba(0,0,0,.04)";ctx.lineWidth=1;
  for(let ya=Math.ceil(ve/chosen)*chosen;ya<=vs;ya+=chosen){
    if(ya<0.1)continue;const x=toX(ya);if(x<0||x>W)continue;
    ctx.beginPath();ctx.moveTo(x,LINE_Y);ctx.lineTo(x,TREE_Y);ctx.stroke();
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle="#e0e0e0";ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,LINE_Y);ctx.lineTo(W,LINE_Y);ctx.stroke();

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  ctx.font="9px -apple-system,sans-serif";
  for(let ya=Math.ceil(ve/chosen)*chosen;ya<=vs;ya+=chosen){
    if(ya<0.1)continue;const x=toX(ya);if(x<0||x>W)continue;
    ctx.strokeStyle="#ddd";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x,LINE_Y-3);ctx.lineTo(x,LINE_Y+3);ctx.stroke();
    const lbl=fmt(ya);
    ctx.fillStyle="#bbb";ctx.textAlign="center";
    ctx.fillText(lbl,x,EVT_BOT+10);
  }

  // ── ÉVÉNEMENTS — points simples, labels au hover uniquement ──────────────
  const all=[...ALL_EVENTS.filter(ev=>ev.minZoom<=zl),...aiEvents];
  const vis=all.filter(ev=>{const x=toX(ev.yearsAgo);return x>=-40&&x<=W+40;});
  vis.sort((a,b)=>(a.importance||2)-(b.importance||2));
  const deduped=[];
  for(const ev of vis){
    const x=toX(ev.yearsAgo);
    if(!deduped.find(p=>Math.abs(p.x-x)<20))deduped.push({x,ev});
  }

  const placed=[];
  for(const {x,ev} of deduped){
    const imp=ev.importance||2;
    const isHov=hoveredId===ev.id, isSel=selectedId===ev.id;
    const col=cc(ev.cat);

    // Tige
    const nearby=placed.filter(p=>Math.abs(p.x-x)<70);
    const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
    const evZone=EVT_BOT-LINE_Y;
    const stemLen=(side===1
      ? imp===1?evZone*.7:imp===2?evZone*.5:evZone*.35
      : imp===1?evZone*.55:imp===2?evZone*.38:evZone*.25);
    const endY=LINE_Y-side*stemLen;
    placed.push({x,ev,side});

    // Tige fine
    ctx.strokeStyle=isHov||isSel?"#111":"#ccc";
    ctx.lineWidth=isHov||isSel?1:0.6;
    ctx.setLineDash(imp===1?[]:imp===2?[3,2]:[1,3]);
    ctx.beginPath();ctx.moveTo(x,LINE_Y);ctx.lineTo(x,endY);ctx.stroke();
    ctx.setLineDash([]);

    // Point
    const r=isSel?6:isHov?5:imp===1?3.5:imp===2?2.5:1.8;
    ctx.beginPath();ctx.arc(x,LINE_Y,r,0,Math.PI*2);
    ctx.fillStyle=isHov||isSel?col:"#444";
    ctx.fill();
    // Anneau coloré si hover/sélection
    if(isHov||isSel){
      ctx.beginPath();ctx.arc(x,LINE_Y,r+3,0,Math.PI*2);
      ctx.strokeStyle=col+"55";ctx.lineWidth=1.5;ctx.stroke();
    }

    // Label — UNIQUEMENT au hover ou sélection
    if(isHov||isSel){
      const fs=13;
      ctx.font=`500 ${fs}px -apple-system,'Helvetica Neue',sans-serif`;
      const maxW=160;
      const words=ev.title.split(" ");let line="",lines=[];
      for(const w of words){
        const t=line+w+" ";
        if(ctx.measureText(t).width>maxW&&line){lines.push(line.trim());line=w+" ";}
        else line=t;
      }
      lines.push(line.trim());
      const lh=fs+3;
      const startY=side===1?endY-6-lines.length*lh:endY+6;
      lines.forEach((l,i)=>{
        const tw=ctx.measureText(l).width;
        const lx=x-tw/2-6,ly=startY+i*lh-1;
        // Fond blanc avec ombre légère
        ctx.fillStyle="rgba(255,255,255,.97)";
        ctx.shadowColor="rgba(0,0,0,.08)";ctx.shadowBlur=8;ctx.shadowOffsetY=2;
        ctx.beginPath();
        if(ctx.roundRect)ctx.roundRect(lx,ly,tw+12,lh+2,4);else ctx.rect(lx,ly,tw+12,lh+2);
        ctx.fill();
        ctx.shadowBlur=0;ctx.shadowOffsetY=0;
        // Trait couleur en bas du label
        ctx.fillStyle=col+"aa";
        ctx.fillRect(lx,ly+lh+1,tw+12,1.5);
        // Texte
        ctx.fillStyle="#111";ctx.textAlign="center";
        ctx.fillText(l,x,startY+i*lh+fs);
      });
    }
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="#e53e3e";ctx.lineWidth=1;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(nowX,LINE_Y);ctx.lineTo(nowX,TREE_Y);ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="bold 8px -apple-system,sans-serif";
    ctx.fillStyle="#e53e3e";ctx.textAlign="center";
    ctx.fillText("auj.",nowX,LINE_Y-6);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── ARBRE DE VIE ─────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // Séparateur
  ctx.strokeStyle="#f0f0f0";ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,TREE_Y);ctx.lineTo(W,TREE_Y);ctx.stroke();
  // Label section
  ctx.font="500 9px -apple-system,sans-serif";
  ctx.fillStyle="#bbb";ctx.textAlign="left";ctx.letterSpacing="0.08em";
  ctx.fillText("ARBRE DE LA VIE",10,TREE_Y+11);
  ctx.letterSpacing="0";
  ctx.fillStyle="#ddd";ctx.textAlign="right";ctx.font="8px sans-serif";
  ctx.fillText("▶ cliquer pour déplier",W-8,TREE_Y+11);

  const bandRects=[];
  for(const band of flatBands){
    const fromX=toX(band.from),toXv=band.to?toX(band.to):toX(0.5);
    const rx=Math.max(0,Math.min(fromX,toXv)),rx2=Math.min(W,Math.max(fromX,toXv));
    const rw=rx2-rx;
    const ry=TREE_Y+16+band.row*ROW_H,rh=Math.max(ROW_H-2,4);
    const hasKids=band.children?.length>0,isExp=expandedIds=>expandedIds; // passed via closure
    bandRects.push({id:band.id,rx,ry,rw,rh,hasKids});
    if(rw<0.5)continue;

    // Couleur très douce
    ctx.fillStyle=band.color+(band.eteint?"14":"22");
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,2);else ctx.rect(rx,ry,rw,rh);ctx.fill();
    // Bordure gauche colorée — comme Notion
    ctx.fillStyle=band.color+(band.eteint?"66":"cc");
    ctx.fillRect(rx,ry,2,rh);

    // Extinction
    if(band.eteint&&band.to){
      const ex=toX(band.to);
      if(ex>2&&ex<W-2){
        ctx.fillStyle="#e53e3e88";
        ctx.beginPath();ctx.moveTo(ex-3,ry+1);ctx.lineTo(ex+1,ry+rh/2);ctx.lineTo(ex-3,ry+rh-1);ctx.closePath();ctx.fill();
      }
    }

    // Chevron
    if(hasKids){
      ctx.font=`600 ${Math.min(rh-1,9)}px -apple-system,sans-serif`;
      ctx.fillStyle=band.color+"99";ctx.textAlign="left";
      ctx.fillText(params.expandedBands?.has(band.id)?"▼":"▶",rx+4,ry+rh/2+3.5);
    }

    // Label
    if(rw>30){
      const ind=band.depth*10+(hasKids?14:4);
      ctx.save();ctx.beginPath();ctx.rect(rx+ind,ry,rw-ind-4,rh);ctx.clip();
      const fs=Math.min(rh-1,band.depth===0?10:9);
      ctx.font=`${band.depth<=1?"600":"400"} ${fs}px -apple-system,'Helvetica Neue',sans-serif`;
      ctx.fillStyle=band.eteint?"#bbb":"#333";ctx.textAlign="left";
      ctx.fillText(band.label,rx+ind+2,ry+rh/2+fs*0.38);ctx.restore();
    }
  }

  // ── MINIMAP ───────────────────────────────────────────────────────────────
  if(miniCanvas){
    const mw=miniCanvas.width,mh=miniCanvas.height,mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    mctx.fillStyle="#f8f8f8";mctx.fillRect(0,0,mw,mh);
    const tls=Math.log10(13.8e9),tle=0,tR=tls-tle;
    for(const ep of EPOCHS){
      const ex1=(tls-L(ep.from))/tR*mw,ex2=(tls-L(Math.max(ep.to,0.1)))/tR*mw;
      mctx.fillStyle=ep.stripe+"22";mctx.fillRect(Math.max(0,ex1),0,Math.abs(ex2-ex1),mh);
      mctx.fillStyle=ep.stripe+"88";mctx.fillRect(Math.max(0,ex1),0,1.5,mh);
    }
    for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
      const lv=L(ev.yearsAgo);if(lv<tle||lv>tls)continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath();mctx.arc(mx,mh/2,1.5,0,Math.PI*2);
      mctx.fillStyle="#999";mctx.fill();
    }
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(0,0,0,.06)";mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(0,0,0,.25)";mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H, TREE_TOP:TREE_Y, bandRects};
}
