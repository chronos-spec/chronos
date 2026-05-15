import { EPOCHS, PERIODS, ALL_EVENTS, cc } from '../data/timelineData.js';
import { L, fmt, makeCoord, zoomLvl } from '../utils/time.js';

// ══════════════════════════════════════════════════════════════════════════════
// ARBRE DE VIE — structure hiérarchique dépliable
// Chaque nœud : id, label, from, to, color, children[]
// ══════════════════════════════════════════════════════════════════════════════
export const LIFE_TREE_DATA = [
  { id:"bact",  label:"🦠 Bactéries",      from:3500e6, to:null,  color:"#64748b",
    children:[]},
  { id:"euca",  label:"🔵 Eucaryotes",     from:2000e6, to:null,  color:"#6366f1",
    children:[
      { id:"cham", label:"🍄 Champignons", from:1000e6, to:null,  color:"#a78bfa", children:[] },
      { id:"plan", label:"🌿 Plantes",     from:470e6,  to:null,  color:"#16a34a",
        children:[
          { id:"mous", label:"🌱 Mousses",          from:470e6, to:null, color:"#4ade80", children:[] },
          { id:"foug", label:"🌾 Fougères",         from:360e6, to:null, color:"#22c55e", children:[] },
          { id:"gymn", label:"🌲 Gymnospermes",     from:320e6, to:null, color:"#15803d", children:[
            { id:"gink", label:"🌳 Ginkgo biloba", from:270e6, to:null, color:"#84cc16", children:[] },
          ]},
          { id:"angi", label:"🌸 Angiospermes",     from:130e6, to:null, color:"#f0abfc", children:[] },
        ]},
      { id:"inv", label:"🦑 Invertébrés",  from:600e6,  to:null,  color:"#f59e0b",
        children:[
          { id:"cnid", label:"🪸 Cnidaires",       from:580e6, to:null, color:"#fb923c", children:[] },
          { id:"moll", label:"🐙 Mollusques",       from:540e6, to:null, color:"#e879f9",
            children:[
              { id:"ammo", label:"💀 Ammonites",    from:400e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
              { id:"naut", label:"🐚 Nautile",      from:500e6, to:null, color:"#c026d3", children:[] },
            ]},
          { id:"arth", label:"🦀 Arthropodes",      from:540e6, to:null, color:"#ea580c",
            children:[
              { id:"tril", label:"💀 Trilobites",   from:521e6, to:252e6, color:"#6b7280", eteint:true, children:[] },
              { id:"inse", label:"🪲 Insectes",     from:385e6, to:null, color:"#d97706", children:[] },
              { id:"arac", label:"🕷️ Arachnides",   from:420e6, to:null, color:"#92400e", children:[] },
            ]},
          { id:"echi", label:"⭐ Échinodermes",     from:520e6, to:null, color:"#f472b6", children:[] },
        ]},
      { id:"vert", label:"🐟 Vertébrés",   from:525e6,  to:null,  color:"#0ea5e9",
        children:[
          { id:"requin",label:"🦈 Requins",         from:450e6, to:null, color:"#1e3a5f", children:[
            { id:"megalo",label:"💀 Mégalodon",     from:23e6, to:3.6e6, color:"#6b7280", eteint:true, children:[] },
          ]},
          { id:"actino",label:"🐠 Poissons osseux", from:400e6, to:null, color:"#38bdf8", children:[] },
          { id:"amphi", label:"🐸 Amphibiens",      from:370e6, to:null, color:"#0f766e",
            children:[
              { id:"greno",label:"🐸 Grenouilles",  from:250e6, to:null, color:"#10b981", children:[] },
              { id:"salam",label:"🦎 Salamandres",  from:160e6, to:null, color:"#059669", children:[] },
            ]},
          { id:"amnio", label:"🥚 Amniotes",        from:320e6, to:null, color:"#b45309",
            children:[
              // Reptiles marins
              { id:"ichth", label:"💀 Ichthyosaures",from:250e6, to:90e6, color:"#6b7280", eteint:true, children:[] },
              { id:"plesi", label:"💀 Plésiosaures", from:205e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
              { id:"tortu", label:"🐢 Tortues",      from:230e6, to:null, color:"#65a30d", children:[] },
              { id:"squa",  label:"🐍 Squamates",    from:200e6, to:null, color:"#ca8a04",
                children:[
                  { id:"lezer",label:"🦎 Lézards",  from:200e6, to:null, color:"#84cc16", children:[] },
                  { id:"serp", label:"🐍 Serpents",  from:150e6, to:null, color:"#a3e635", children:[] },
                  { id:"mosa", label:"💀 Mosasaures",from:98e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
                ]},
              { id:"archo", label:"🦖 Archosaures",  from:252e6, to:null, color:"#dc2626",
                children:[
                  { id:"croco",label:"🐊 Crocodiliens",from:230e6,to:null,color:"#166534",children:[]},
                  { id:"ptero",label:"💀 Ptérosaures 🦅",from:228e6,to:66e6,color:"#7c3aed",eteint:true,children:[
                    { id:"quetz",label:"💀 Quetzalcoatlus",from:72e6,to:66e6,color:"#6b7280",eteint:true,children:[] },
                  ]},
                  { id:"dino", label:"🦕 Dinosaures",from:230e6, to:null, color:"#b91c1c",
                    children:[
                      { id:"sauro",label:"🦕 Sauropodes",from:200e6,to:66e6,color:"#b45309",eteint:true,
                        children:[
                          { id:"diplo",label:"💀 Diplodocus",from:154e6,to:152e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"arge", label:"💀 Argentinosaurus",from:96e6,to:92e6,color:"#6b7280",eteint:true,children:[] },
                        ]},
                      { id:"ornit",label:"🦴 Ornithischiens",from:235e6,to:66e6,color:"#92400e",eteint:true,
                        children:[
                          { id:"stego",label:"💀 Stegosaurus",from:155e6,to:150e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"ankyl",label:"💀 Ankylosaurus",from:68e6,to:66e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"trice",label:"💀 Triceratops",from:68e6,to:66e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"paras",label:"💀 Parasaurolophus",from:76e6,to:73e6,color:"#6b7280",eteint:true,children:[] },
                        ]},
                      { id:"therop",label:"🦖 Théropodes",from:230e6,to:null,color:"#dc2626",
                        children:[
                          { id:"allosa",label:"💀 Allosaurus",from:155e6,to:145e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"spino",label:"💀 Spinosaurus",from:99e6,to:93e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"trex",label:"💀 T-Rex",from:68e6,to:66e6,color:"#7f1d1d",eteint:true,children:[] },
                          { id:"velo",label:"💀 Velociraptor",from:75e6,to:71e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"archeo",label:"💀 Archaeopteryx",from:152e6,to:148e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"oiseau",label:"🐦 Oiseaux",from:150e6,to:null,color:"#0369a1",
                            children:[
                              { id:"moa",label:"💀 Moa",from:19e6,to:0.6e3,color:"#6b7280",eteint:true,children:[] },
                            ]},
                        ]},
                    ]},
                ]},
              { id:"mamm",  label:"🦁 Mammifères",  from:225e6, to:null, color:"#be185d",
                children:[
                  { id:"monot",label:"🦆 Monotrèmes", from:170e6,to:null,color:"#9d174d",children:[] },
                  { id:"marsu",label:"🦘 Marsupiaux",  from:100e6,to:null,color:"#be185d",
                    children:[
                      { id:"thyla",label:"💀 Thylacine", from:4e6,to:0.089,color:"#6b7280",eteint:true,children:[] },
                    ]},
                  { id:"plac", label:"🐘 Placentaires",from:100e6,to:null,color:"#db2777",
                    children:[
                      { id:"cetac",label:"🐋 Cétacés",   from:50e6,to:null,color:"#0e7490",
                        children:[
                          { id:"pakic",label:"💀 Pakicetus",from:53e6,to:48e6,color:"#6b7280",eteint:true,children:[] },
                          { id:"blein",label:"🐋 Baleine bleue",from:5e6,to:null,color:"#0ea5e9",children:[] },
                        ]},
                      { id:"probo",label:"🐘 Proboscidiens",from:55e6,to:null,color:"#78716c",
                        children:[
                          { id:"mammo",label:"💀 Mammouth",from:400e3,to:4e3,color:"#6b7280",eteint:true,children:[] },
                          { id:"eleph",label:"🐘 Éléphant", from:6e6,to:null,color:"#57534e",children:[] },
                        ]},
                      { id:"carni",label:"🦁 Carnivores", from:60e6,to:null,color:"#dc2626",
                        children:[
                          { id:"smilo",label:"💀 Smilodon",from:2.5e6,to:10e3,color:"#6b7280",eteint:true,children:[] },
                          { id:"lion", label:"🦁 Lion",     from:3e6,to:null, color:"#ca8a04",children:[] },
                        ]},
                      { id:"primat",label:"🐒 Primates",  from:58e6,to:null,color:"#9333ea",
                        children:[
                          { id:"prosim",label:"🦥 Prosimiens",from:55e6,to:null,color:"#7c3aed",children:[] },
                          { id:"grand",label:"🦍 Grands singes",from:15e6,to:null,color:"#5b21b6",
                            children:[
                              { id:"gorille",label:"🦍 Gorille",from:10e6,to:null,color:"#374151",children:[] },
                              { id:"chimp",label:"🐒 Chimpanzé",from:7e6,to:null,color:"#713f12",children:[] },
                              { id:"sahel",label:"💀 Sahelanthropus",from:7e6,to:6e6,color:"#6b7280",eteint:true,children:[] },
                              { id:"lucy",label:"💀 Australopithèque",from:4e6,to:2e6,color:"#6b7280",eteint:true,children:[] },
                              { id:"habit",label:"💀 H. habilis",from:2.4e6,to:1.4e6,color:"#6b7280",eteint:true,children:[] },
                              { id:"erect",label:"💀 H. erectus",from:1.9e6,to:110e3,color:"#6b7280",eteint:true,children:[] },
                              { id:"nean",label:"💀 Néandertal",from:400e3,to:40e3,color:"#7c3aed",eteint:true,children:[] },
                              { id:"sap",label:"🧠 Homo sapiens",from:300e3,to:null,color:"#92400e",children:[] },
                            ]},
                        ]},
                    ]},
                ]},
            ]},
        ]},
    ]},
];

// ── Aplatir l'arbre en rangées pour le rendu ──────────────────────────────────
// expandedIds = Set des ids dépliés
function flattenTree(nodes, expandedIds, depth=0, result=[]) {
  for (const n of nodes) {
    result.push({...n, depth, row: result.length});
    if (n.children?.length && expandedIds.has(n.id)) {
      flattenTree(n.children, expandedIds, depth+1, result);
    }
  }
  return result;
}

// ── Conversion linéaire (pour mode échelle réelle) ───────────────────────────
function makeLinearCoord(vs, ve, W) {
  // vs = plus ancien (grand), ve = plus récent (petit)
  const range = vs - ve;
  return {
    toX: (ya) => (1 - (ya - ve) / range) * W,  // plus récent = droite
    toYa: (x) => vs - (x / W) * range,
    logRange: L(vs) - L(Math.max(ve, 0.1)),
  };
}

export function drawAll(canvas, miniCanvas, params) {
  const {vs, ve, aiEvents, selectedId, hoveredId, filterCat="all",
         expandedBands=new Set(), linearScale=false} = params;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  // Coordonnées : log ou linéaire
  const coord = linearScale
    ? makeLinearCoord(vs, ve, W)
    : makeCoord(vs, ve, W);
  const {toX} = coord;
  const zl = linearScale ? 3 : zoomLvl(vs, ve);

  // Aplatir l'arbre selon les nœuds dépliés
  const flatBands = flattenTree(LIFE_TREE_DATA, expandedBands);
  const N_ROWS = flatBands.length;

  // ── LAYOUT ────────────────────────────────────────────────────────────────
  const EPOCH_H  = Math.round(H * 0.11);
  const PERIOD_H = Math.round(H * 0.055);
  const PERIOD_Y = EPOCH_H;
  const LINE_Y   = PERIOD_Y + PERIOD_H + Math.round(H * 0.015);

  // En mode échelle réelle : pas d'événements, plus de place pour l'arbre
  const EVT_FRAC = linearScale ? 0.05 : 0.28;
  const EVT_H    = Math.round(H * EVT_FRAC);
  const TREE_Y   = LINE_Y + EVT_H;
  const TREE_H   = H - TREE_Y;
  const ROW_H    = N_ROWS > 0 ? Math.max(Math.floor((TREE_H - 20) / N_ROWS), 6) : 14;
  const EVT_BOT  = TREE_Y - 22;

  // ── FOND ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = linearScale ? "#0d1117" : "#faf7f2";
  ctx.fillRect(0, 0, W, TREE_Y);
  ctx.fillStyle = "#0f1117";
  ctx.fillRect(0, TREE_Y, W, TREE_H);

  // ── GRILLE VERTICALE ──────────────────────────────────────────────────────
  const span = vs - ve;
  const IVS = [1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen = IVS[0];
  if (!linearScale) {
    for (const iv of IVS) { if (span/iv >= 5 && span/iv <= 16) { chosen=iv; break; } }
  } else {
    // Échelle linéaire : graduations régulières
    const targets = [1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6];
    for (const iv of targets) { if (span/iv >= 4 && span/iv <= 20) { chosen=iv; break; } }
  }

  ctx.strokeStyle = linearScale ? "rgba(255,255,255,.06)" : "rgba(18,16,14,.04)";
  ctx.lineWidth = 1;
  for (let ya=Math.ceil(ve/chosen)*chosen; ya<=vs; ya+=chosen) {
    if (ya < 0.1) continue;
    const x=toX(ya); if (x<0||x>W) continue;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }

  // ── BANDES D'ÉPOQUES ─────────────────────────────────────────────────────
  for (const ep of EPOCHS) {
    const x1=toX(ep.from), x2=toX(Math.max(ep.to,0.1));
    if (Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));
    ctx.fillStyle = linearScale ? ep.bg : ep.stripe+"22";
    ctx.fillRect(rx,0,rw,EPOCH_H);
    ctx.fillStyle = ep.stripe; ctx.fillRect(rx,0,rw,5);
    if (x1>1&&x1<W-1&&!linearScale) {
      ctx.strokeStyle=ep.stripe+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(x1,5); ctx.lineTo(x1,PERIOD_Y); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (rw > (linearScale?20:40)) {
      ctx.save(); ctx.beginPath(); ctx.rect(rx+5,8,rw-10,EPOCH_H-9); ctx.clip();
      const fs=rw>200?14:rw>100?11:rw>50?9:7;
      ctx.font=`700 ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle = linearScale ? ep.text : ep.stripe;
      ctx.textAlign="left";
      ctx.fillText(ep.label.toUpperCase(), rx+7, 8+fs);
      if (linearScale && rw > 100) {
        ctx.font=`400 ${Math.max(fs-2,7)}px -apple-system,'Segoe UI',system-ui,sans-serif`;
        ctx.fillStyle=ep.text+"aa";
        ctx.fillText(fmt(ep.from)+" → "+(ep.to>0?fmt(ep.to):"auj."), rx+7, 8+fs+fs);
      }
      ctx.restore();
    }
  }

  // ── BANDE DES PÉRIODES ────────────────────────────────────────────────────
  if (!linearScale) {
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
  }

  // ── LIGNE DE FRISE ────────────────────────────────────────────────────────
  ctx.strokeStyle = linearScale ? "rgba(255,255,255,.15)" : "rgba(18,16,14,.2)";
  ctx.lineWidth=1.5; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(0,LINE_Y); ctx.lineTo(W,LINE_Y); ctx.stroke();

  // ── GRADUATIONS ───────────────────────────────────────────────────────────
  ctx.font="10px -apple-system,'Segoe UI',system-ui,sans-serif";
  for (let ya=Math.ceil(ve/chosen)*chosen; ya<=vs; ya+=chosen) {
    if (ya<0.1) continue;
    const x=toX(ya); if (x<0||x>W) continue;
    ctx.strokeStyle = linearScale?"rgba(255,255,255,.2)":"rgba(18,16,14,.15)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,LINE_Y-5); ctx.lineTo(x,LINE_Y+5); ctx.stroke();
    const lbl=fmt(ya), tw=ctx.measureText(lbl).width;
    ctx.fillStyle = linearScale?"rgba(255,255,255,.06)":"rgba(18,16,14,.06)";
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x-tw/2-5,EVT_BOT-1,tw+10,16,8);
    else ctx.rect(x-tw/2-5,EVT_BOT-1,tw+10,16);
    ctx.fill();
    ctx.fillStyle = linearScale?"rgba(255,255,255,.6)":"rgba(18,16,14,.5)";
    ctx.textAlign="center";
    ctx.fillText(lbl,x,EVT_BOT+11);
  }

  // ── ÉVÉNEMENTS (seulement en mode log) ────────────────────────────────────
  const placed = [];
  if (!linearScale) {
    const evFilter = ev => filterCat==="all" || ev.cat===filterCat;
    const all=[...ALL_EVENTS.filter(ev=>ev.minZoom<=zl&&evFilter(ev)),...aiEvents.filter(evFilter)];
    const vis=all.filter(ev=>{const x=toX(ev.yearsAgo);return x>=-80&&x<=W+80;});
    vis.sort((a,b)=>(a.importance||2)-(b.importance||2));
    const deduped=[];
    for(const ev of vis){
      const x=toX(ev.yearsAgo);
      if(!deduped.find(p=>Math.abs(p.x-x)<28)) deduped.push({x,ev});
    }
    deduped.sort((a,b)=>a.x-b.x);

    for(const {x,ev} of deduped){
      const col=cc(ev.cat);
      const imp=ev.importance||2;
      const isHov=hoveredId===ev.id, isSel=selectedId===ev.id;
      const nearby=placed.filter(p=>Math.abs(p.x-x)<90);
      const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
      placed.push({x,ev,side});

      const zThresh=imp===1?0:imp===2?1.5:2.5;
      const sF=(isSel||isHov)?1:Math.min(1,0.35+Math.max(0,zl-zThresh)*0.35);
      const maxStem=imp===1?EVT_H*0.75:imp===2?EVT_H*0.58:EVT_H*0.42;
      const stemLen=(side===1?maxStem:maxStem*0.72)*sF;
      const endY=LINE_Y-side*stemLen;

      if(isHov||isSel){ctx.beginPath();ctx.arc(x,LINE_Y,16,0,Math.PI*2);ctx.fillStyle=col+"18";ctx.fill();}
      ctx.strokeStyle=(isHov||isSel)?col:col+(imp===1?"cc":imp===2?"77":"44");
      ctx.lineWidth=((isHov||isSel)?2.5:imp===1?2:imp===2?1.2:0.7)*sF;
      ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
      ctx.beginPath();ctx.moveTo(x,LINE_Y);ctx.lineTo(x,endY);ctx.stroke();ctx.setLineDash([]);

      const baseR=isSel?9:isHov?8:imp===1?6:imp===2?4.5:3;
      const r=Math.max(baseR*sF,(isSel||isHov)?baseR:1.5);
      ctx.beginPath();ctx.arc(x,LINE_Y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      if(imp===1&&!isSel&&sF>0.4){ctx.beginPath();ctx.arc(x,LINE_Y,Math.max(r-2.5,0.8),0,Math.PI*2);ctx.fillStyle="rgba(250,247,242,.9)";ctx.fill();}
      if(isSel){ctx.beginPath();ctx.arc(x,LINE_Y,r+5,0,Math.PI*2);ctx.strokeStyle=col+"66";ctx.lineWidth=2;ctx.stroke();}

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
          ctx.fillStyle=(isHov||isSel)?"rgba(255,255,255,.98)":"rgba(250,247,242,.95)";
          ctx.beginPath();if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);ctx.fill();
          ctx.strokeStyle=(isHov||isSel)?col:col+"55";ctx.lineWidth=0.8;
          ctx.beginPath();if(ctx.roundRect)ctx.roundRect(lx,ly,tw2+10,lh+2,4);else ctx.rect(lx,ly,tw2+10,lh+2);ctx.stroke();
          ctx.fillStyle=(isHov||isSel)?col:imp===1?"rgba(18,16,14,.85)":"rgba(18,16,14,.7)";
          ctx.textAlign="center";ctx.fillText(l,x,startY+i*lh+fs);
        });
      }
    }
  } else {
    // En mode linéaire : juste les 5 grandes ères avec labels bien visibles
    // (Déjà dessiné dans les bandes d'époques ci-dessus)
    ctx.font="600 13px -apple-system,'Segoe UI',system-ui,sans-serif";
    ctx.fillStyle="rgba(255,255,255,.4)";ctx.textAlign="center";
    ctx.fillText("Mode Échelle Réelle — les événements sont masqués pour la lisibilité", W/2, LINE_Y-20);
  }

  // ── AUJOURD'HUI ───────────────────────────────────────────────────────────
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle = linearScale?"rgba(200,40,30,.8)":"rgba(200,40,30,.6)";
    ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(nowX,LINE_Y-(linearScale?8:50));ctx.lineTo(nowX,H);ctx.stroke();
    ctx.setLineDash([]);
    ctx.font=`bold ${linearScale?10:8}px -apple-system,'Segoe UI',system-ui,sans-serif`;
    ctx.fillStyle="#e03c32";ctx.textAlign="center";
    if(!linearScale)ctx.fillText("AUJOURD'HUI",nowX,LINE_Y-53);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── ARBRE DE VIE DÉPLIABLE ────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // En-tête
  ctx.fillStyle="rgba(200,150,60,.9)";
  ctx.font="700 10px -apple-system,'Segoe UI',system-ui,sans-serif";
  ctx.textAlign="left";
  ctx.fillText("▸ ARBRE DE LA VIE — cliquer les barres pour déplier", 10, TREE_Y+13);
  ctx.fillStyle="rgba(255,255,255,.25)";
  ctx.font="9px -apple-system,'Segoe UI',system-ui,sans-serif";
  ctx.textAlign="right";
  ctx.fillText("💀 = éteint  ● = vivant  ▶ = a des enfants", W-8, TREE_Y+13);

  ctx.strokeStyle="rgba(200,150,60,.4)";ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(0,TREE_Y);ctx.lineTo(W,TREE_Y);ctx.stroke();

  // Dessin de chaque bande aplatie
  const bandRects = []; // pour le hit-test au clic

  for (const band of flatBands) {
    const fromX = toX(band.from);
    const toXv  = band.to ? toX(band.to) : toX(0.5);
    const rx  = Math.max(0, Math.min(fromX, toXv));
    const rx2 = Math.min(W, Math.max(fromX, toXv));
    const rw  = rx2 - rx;
    const ry  = TREE_Y + 18 + band.row * ROW_H;
    const rh  = Math.max(ROW_H - 2, 5);
    const hasKids = band.children?.length > 0;
    const isExpanded = expandedBands.has(band.id);

    if (rw < 0.5) {
      // Barre non visible mais on stocke quand même pour le clic si hasKids
      if (hasKids) bandRects.push({id:band.id, rx:0, ry, rw:0, rh, hasKids});
      continue;
    }

    // Enregistrer zone de clic
    bandRects.push({id:band.id, rx, ry, rw, rh, hasKids});

    // Fond de la barre
    const opacity = band.eteint ? "88" : "dd";
    ctx.fillStyle = band.color + opacity;
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 2);
    else ctx.rect(rx, ry, rw, rh);
    ctx.fill();

    // Bordure
    ctx.strokeStyle = band.eteint?"rgba(255,255,255,.06)":"rgba(255,255,255,.18)";
    ctx.lineWidth=0.5;ctx.setLineDash([]);
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(rx,ry,rw,rh,2);else ctx.rect(rx,ry,rw,rh);
    ctx.stroke();

    // Ligne de connexion verticale au parent (profondeur)
    if (band.depth > 0 && rx > 4) {
      ctx.strokeStyle = band.color+"44";
      ctx.lineWidth=1; ctx.setLineDash([2,3]);
      ctx.beginPath();ctx.moveTo(rx,ry+rh/2);ctx.lineTo(Math.max(rx-8,0),ry+rh/2);ctx.stroke();
      ctx.setLineDash([]);
    }

    // Triangle d'extinction
    if (band.eteint && band.to) {
      const ex=toX(band.to);
      if(ex>2&&ex<W-2){
        ctx.fillStyle="#ef4444";
        ctx.beginPath();ctx.moveTo(ex-4,ry+1);ctx.lineTo(ex+1,ry+rh/2);ctx.lineTo(ex-4,ry+rh-1);ctx.closePath();ctx.fill();
      }
    }

    // Cercle d'apparition
    if(fromX>2&&fromX<W-2){
      ctx.beginPath();ctx.arc(fromX,ry+rh/2,Math.min(rh/2-1,4),0,Math.PI*2);
      ctx.fillStyle=band.color;ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=1;ctx.stroke();
    }

    // ── INDICATEUR DE DÉPLOIEMENT ──
    if (hasKids) {
      const chevX = Math.min(rx + 8, rx + rw - 10);
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.font = `700 ${Math.min(rh-2, 9)}px -apple-system`;
      ctx.textAlign = "left";
      ctx.fillText(isExpanded ? "▼" : "▶", chevX, ry + rh/2 + 3.5);
    }

    // Label
    if (rw > 25) {
      const indentX = band.depth * 6 + (hasKids ? 14 : 6);
      ctx.save();ctx.beginPath();ctx.rect(rx+indentX,ry,rw-indentX-4,rh);ctx.clip();
      const fs=Math.min(rh-1,band.depth===0?11:band.depth<=2?10:9);
      ctx.font=`${band.depth<=1?"600":"500"} ${fs}px -apple-system,'Segoe UI',system-ui,sans-serif`;
      ctx.fillStyle=band.eteint?"rgba(255,255,255,.45)":"rgba(255,255,255,.92)";
      ctx.textAlign="left";
      ctx.fillText(band.label,rx+indentX+2,ry+rh/2+fs*0.38);
      ctx.restore();
    }
  }

  // Ligne "Aujourd'hui" dans l'arbre
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="rgba(200,40,30,.35)";ctx.lineWidth=1;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(nowX,TREE_Y+16);ctx.lineTo(nowX,H);ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── MINIMAP ───────────────────────────────────────────────────────────────
  if(miniCanvas){
    const mw=miniCanvas.width,mh=miniCanvas.height,mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    mctx.fillStyle=linearScale?"#0d1117":"#f5f0e8";mctx.fillRect(0,0,mw,mh);
    const tls=Math.log10(13.8e9),tle=0,tR=tls-tle;
    for(const ep of EPOCHS){
      const ex1=(tls-L(ep.from))/tR*mw,ex2=(tls-L(Math.max(ep.to,0.1)))/tR*mw;
      mctx.fillStyle=ep.stripe+( linearScale?"88":"44");mctx.fillRect(Math.max(0,ex1),2,Math.abs(ex2-ex1),mh-4);
      mctx.fillStyle=ep.stripe+"cc";mctx.fillRect(Math.max(0,ex1),2,1.5,mh-4);
    }
    if(!linearScale){
      for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
        const lv=L(ev.yearsAgo);if(lv<tle||lv>tls)continue;
        const mx=(tls-lv)/tR*mw;
        mctx.beginPath();mctx.arc(mx,mh/2,2,0,Math.PI*2);mctx.fillStyle=cc(ev.cat)+"bb";mctx.fill();
      }
    }
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(18,16,14,.12)";mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle=linearScale?"rgba(255,255,255,.6)":"rgba(18,16,14,.5)";mctx.lineWidth=1.5;
    mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }

  return {placed, LINE_Y, PERIOD_Y, PERIOD_H, TREE_TOP:TREE_Y, bandRects};
}
