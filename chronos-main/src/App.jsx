import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_EVENTS, EPOCHS, PERIODS, PERIOD_DESCRIPTIONS, STATIC_CONTENT, UA, cc } from "./data/timelineData.js";
import { buildPrompt, epochAt, fmt, L, makeCoord, zoomLvl } from "./utils/time.js";
import { drawAll, flattenTree, THEMES } from "./canvas/drawTimeline.js";
import { css } from "./styles.js";

// ── DONNÉES ARBRE DE VIE ──────────────────────────────────────────────────────
const LIFE_TREE = [
  { id:"bact", label:"Bactéries", from:3500e6, to:null, color:"#94a3b8", children:[] },
  { id:"euca", label:"Eucaryotes", from:2000e6, to:null, color:"#818cf8",
    children:[
      { id:"cham", label:"Champignons", from:1000e6, to:null, color:"#a78bfa", children:[] },
      { id:"plan", label:"Plantes", from:470e6, to:null, color:"#4ade80",
        children:[
          { id:"mous", label:"Mousses", from:470e6, to:null, color:"#86efac", children:[] },
          { id:"foug", label:"Fougères", from:360e6, to:null, color:"#4ade80", children:[] },
          { id:"gymn", label:"Gymnospermes", from:320e6, to:null, color:"#22c55e", children:[
            { id:"gink", label:"Ginkgo biloba", from:270e6, to:null, color:"#16a34a", children:[] },
          ]},
          { id:"angi", label:"Angiospermes", from:130e6, to:null, color:"#f9a8d4", children:[] },
        ]},
      { id:"inv", label:"Invertébrés", from:600e6, to:null, color:"#fb923c",
        children:[
          { id:"cnid", label:"Cnidaires", from:580e6, to:null, color:"#fdba74", children:[] },
          { id:"moll", label:"Mollusques", from:540e6, to:null, color:"#f0abfc",
            children:[
              { id:"ammo", label:"Ammonites †", from:400e6, to:66e6, color:"#d1d5db", eteint:true, children:[] },
              { id:"naut", label:"Nautile", from:500e6, to:null, color:"#c026d3", children:[] },
            ]},
          { id:"arth", label:"Arthropodes", from:540e6, to:null, color:"#f97316",
            children:[
              { id:"tril", label:"Trilobites †", from:521e6, to:252e6, color:"#d1d5db", eteint:true, children:[] },
              { id:"inse", label:"Insectes", from:385e6, to:null, color:"#fcd34d", children:[] },
              { id:"arac", label:"Arachnides", from:420e6, to:null, color:"#fed7aa", children:[] },
            ]},
        ]},
      { id:"vert", label:"Vertébrés", from:525e6, to:null, color:"#38bdf8",
        children:[
          { id:"requin", label:"Requins", from:450e6, to:null, color:"#0ea5e9", children:[
            { id:"megalo", label:"Mégalodon †", from:23e6, to:3.6e6, color:"#d1d5db", eteint:true, children:[] },
          ]},
          { id:"actino", label:"Poissons osseux", from:400e6, to:null, color:"#7dd3fc", children:[] },
          { id:"amphi", label:"Amphibiens", from:370e6, to:null, color:"#34d399",
            children:[
              { id:"greno", label:"Grenouilles", from:250e6, to:null, color:"#6ee7b7", children:[] },
              { id:"salam", label:"Salamandres", from:160e6, to:null, color:"#a7f3d0", children:[] },
            ]},
          { id:"amnio", label:"Amniotes", from:320e6, to:null, color:"#fbbf24",
            children:[
              { id:"tortu", label:"Tortues", from:230e6, to:null, color:"#a3e635", children:[] },
              { id:"squa", label:"Squamates", from:200e6, to:null, color:"#facc15",
                children:[
                  { id:"lezer", label:"Lézards", from:200e6, to:null, color:"#fde68a", children:[] },
                  { id:"serp", label:"Serpents", from:150e6, to:null, color:"#fef08a", children:[] },
                  { id:"mosa", label:"Mosasaures †", from:98e6, to:66e6, color:"#d1d5db", eteint:true, children:[] },
                ]},
              { id:"archo", label:"Archosaures", from:252e6, to:null, color:"#f87171",
                children:[
                  { id:"croco", label:"Crocodiliens", from:230e6, to:null, color:"#4ade80", children:[] },
                  { id:"ptero", label:"Ptérosaures †", from:228e6, to:66e6, color:"#d1d5db", eteint:true, children:[
                    { id:"quetz", label:"Quetzalcoatlus †", from:72e6, to:66e6, color:"#d1d5db", eteint:true, children:[] },
                  ]},
                  { id:"dino", label:"Dinosaures", from:230e6, to:null, color:"#f87171",
                    children:[
                      { id:"sauro", label:"Sauropodes †", from:200e6, to:66e6, color:"#d1d5db", eteint:true,
                        children:[
                          { id:"diplo", label:"Diplodocus †", from:154e6, to:152e6, color:"#d1d5db", eteint:true, children:[] },
                          { id:"arge", label:"Argentinosaurus †", from:96e6, to:92e6, color:"#d1d5db", eteint:true, children:[] },
                        ]},
                      { id:"ornit", label:"Ornithischiens †", from:235e6, to:66e6, color:"#d1d5db", eteint:true,
                        children:[
                          { id:"stego", label:"Stegosaurus †", from:155e6, to:150e6, color:"#d1d5db", eteint:true, children:[] },
                          { id:"trice", label:"Triceratops †", from:68e6, to:66e6, color:"#d1d5db", eteint:true, children:[] },
                        ]},
                      { id:"therop", label:"Théropodes", from:230e6, to:null, color:"#fca5a5",
                        children:[
                          { id:"spino", label:"Spinosaurus †", from:99e6, to:93e6, color:"#d1d5db", eteint:true, children:[] },
                          { id:"trex", label:"T-Rex †", from:68e6, to:66e6, color:"#fca5a5", eteint:true, children:[] },
                          { id:"velo", label:"Velociraptor †", from:75e6, to:71e6, color:"#d1d5db", eteint:true, children:[] },
                          { id:"oiseau", label:"Oiseaux", from:150e6, to:null, color:"#93c5fd",
                            children:[
                              { id:"moa", label:"Moa †", from:19e6, to:0.6e3, color:"#d1d5db", eteint:true, children:[] },
                            ]},
                        ]},
                    ]},
                ]},
              { id:"mamm", label:"Mammifères", from:225e6, to:null, color:"#f472b6",
                children:[
                  { id:"monot", label:"Monotrèmes", from:170e6, to:null, color:"#f9a8d4", children:[] },
                  { id:"marsu", label:"Marsupiaux", from:100e6, to:null, color:"#f472b6",
                    children:[
                      { id:"thyla", label:"Thylacine †", from:4e6, to:0.089, color:"#d1d5db", eteint:true, children:[] },
                    ]},
                  { id:"plac", label:"Placentaires", from:100e6, to:null, color:"#e879f9",
                    children:[
                      { id:"cetac", label:"Cétacés", from:50e6, to:null, color:"#67e8f9",
                        children:[
                          { id:"pakic", label:"Pakicetus †", from:53e6, to:48e6, color:"#d1d5db", eteint:true, children:[] },
                          { id:"blein", label:"Baleine bleue", from:5e6, to:null, color:"#22d3ee", children:[] },
                        ]},
                      { id:"probo", label:"Proboscidiens", from:55e6, to:null, color:"#a8a29e",
                        children:[
                          { id:"mammo", label:"Mammouth †", from:400e3, to:4e3, color:"#d1d5db", eteint:true, children:[] },
                          { id:"eleph", label:"Éléphant d'Afrique", from:6e6, to:null, color:"#78716c", children:[] },
                        ]},
                      { id:"carni", label:"Carnivores", from:60e6, to:null, color:"#f87171",
                        children:[
                          { id:"smilo", label:"Smilodon †", from:2.5e6, to:10e3, color:"#d1d5db", eteint:true, children:[] },
                          { id:"lion", label:"Lion", from:3e6, to:null, color:"#fbbf24", children:[] },
                        ]},
                      { id:"primat", label:"Primates", from:58e6, to:null, color:"#c084fc",
                        children:[
                          { id:"prosim", label:"Prosimiens", from:55e6, to:null, color:"#d8b4fe", children:[] },
                          { id:"grand", label:"Grands singes", from:15e6, to:null, color:"#a855f7",
                            children:[
                              { id:"goril", label:"Gorille", from:10e6, to:null, color:"#9ca3af", children:[] },
                              { id:"chimp", label:"Chimpanzé", from:7e6, to:null, color:"#b45309", children:[] },
                              { id:"lucy", label:"Australopithèque †", from:4e6, to:2e6, color:"#d1d5db", eteint:true, children:[] },
                              { id:"habit", label:"H. habilis †", from:2.4e6, to:1.4e6, color:"#d1d5db", eteint:true, children:[] },
                              { id:"erect", label:"H. erectus †", from:1.9e6, to:110e3, color:"#d1d5db", eteint:true, children:[] },
                              { id:"nean", label:"Néandertal †", from:400e3, to:40e3, color:"#c4b5fd", eteint:true, children:[] },
                              { id:"sap", label:"Homo sapiens", from:300e3, to:null, color:"#f97316", children:[] },
                            ]},
                        ]},
                    ]},
                ]},
            ]},
        ]},
    ]},
];

// ── CARTES D'ACCÈS RAPIDE ─────────────────────────────────────────────────────
const EXPLORE_CARDS = [
  { label:"Univers",      kicker:"13,8 Ga", sub:"Big Bang, étoiles",     color:"#818cf8", from:UA,    to:4.6e9  },
  { label:"Terre",        kicker:"4,6 Ga",  sub:"Océans, continents",    color:"#38bdf8", from:4.6e9, to:541e6  },
  { label:"Vie",          kicker:"3,5 Ga",  sub:"Cellules, plantes",     color:"#4ade80", from:3.8e9, to:252e6  },
  { label:"Dinosaures",   kicker:"230 Ma",  sub:"Mésozoïque",            color:"#f87171", from:252e6, to:66e6   },
  { label:"Humanité",     kicker:"300 Ka",  sub:"Homo sapiens",          color:"#fb923c", from:2.6e6, to:12e3   },
  { label:"Civilisations",kicker:"12 Ka",   sub:"Écriture, empires",     color:"#a78bfa", from:12e3,  to:0      },
];

export default function Chronos() {
  const canvasRef=useRef(null),miniRef=useRef(null),wrapRef=useRef(null);
  const S=useRef({vs:UA*1.04,ve:20,aiEvents:[],selectedId:null,hoveredId:null,
    fetchedZones:new Set(),fetching:false,fetchQueue:[],panelCache:{},
    placed:[],lineY:0,periodY:0,periodH:0,treeTop:0,bandRects:[]});
  const rafRef=useRef(null),fetchDebRef=useRef(null),animRef=useRef(null);

  const [ui,setUi]=useState({
    epochLabel:"",range:"",aiVisible:false,
    panelOpen:false,panelCat:"",panelCatColor:"#888",
    panelDate:"",panelTitle:"",panelContent:null,panelError:null,
    tooltip:null,panelEventId:null,
    searchQuery:"",searchResults:[],searchLoading:false,searchDone:false,
    searchOpen:false,
    activeCard:null,
  });
  const [bookmarks,setBookmarks]=useState({});
  const [customTags,setCustomTags]=useState(["Favori","À revoir"]);
  const [addingTag,setAddingTag]=useState(false);
  const [newTagInput,setNewTagInput]=useState("");
  const [expandedBands,setExpandedBands]=useState(new Set(["euca","vert"]));
  const [activeThemes,setActiveThemes]=useState(new Set());
  const [showThemes,setShowThemes]=useState(false);
  const [showBookmarks,setShowBookmarks]=useState(false);

  // ── STORAGE ──────────────────────────────────────────────────────────────
  useEffect(()=>{
    try{const c=JSON.parse(localStorage.getItem("ch-cache")||"null");if(c)Object.assign(S.current.panelCache,c);}catch(e){}
    try{const bm=JSON.parse(localStorage.getItem("ch-bm")||"null");if(bm)setBookmarks(bm);}catch(e){}
    try{const ai=JSON.parse(localStorage.getItem("ch-aiev")||"null");if(Array.isArray(ai))S.current.aiEvents=ai;}catch(e){}
  },[]);
  const saveCache=useCallback(()=>{try{localStorage.setItem("ch-cache",JSON.stringify(S.current.panelCache));}catch(e){}},[]);
  const saveBm=useCallback((bm)=>{try{localStorage.setItem("ch-bm",JSON.stringify(bm));}catch(e){}},[]);

  // ── BOOKMARKS ─────────────────────────────────────────────────────────────
  const toggleBm=useCallback((ev,tag)=>{setBookmarks(prev=>{const next={...prev};if(next[ev.id]?.tag===tag)delete next[ev.id];else next[ev.id]={tag,title:ev.title,date_label:ev.date_label,cat:ev.cat,yearsAgo:ev.yearsAgo};saveBm(next);return next;});},[saveBm]);
  const removeBm=useCallback((id)=>{setBookmarks(prev=>{const next={...prev};delete next[id];saveBm(next);return next;});},[saveBm]);
  const addTag=useCallback((tag)=>{if(!tag.trim())return;setCustomTags(p=>[...p,tag.trim()]);setNewTagInput("");setAddingTag(false);},[]);

  // ── DESSIN ────────────────────────────────────────────────────────────────
  const redraw=useCallback(()=>{
    const cnv=canvasRef.current,mcnv=miniRef.current,wrap=wrapRef.current;
    if(!cnv||!wrap)return;
    if(cnv.width!==wrap.offsetWidth)cnv.width=wrap.offsetWidth;
    if(cnv.height!==wrap.offsetHeight)cnv.height=wrap.offsetHeight;
    if(mcnv){if(mcnv.width!==160)mcnv.width=160;if(mcnv.height!==28)mcnv.height=28;}
    const s=S.current;
    const fb=flattenTree(LIFE_TREE,expandedBands);
    const r=drawAll(cnv,mcnv,{vs:s.vs,ve:s.ve,aiEvents:s.aiEvents,
      selectedId:s.selectedId,hoveredId:s.hoveredId,
      activeThemes,flatBands:fb,expandedBands});
    s.placed=r.placed;s.lineY=r.LINE_Y;s.periodY=r.PERIOD_Y;
    s.periodH=r.PERIOD_H;s.treeTop=r.TREE_TOP;s.bandRects=r.bandRects||[];
    const mid=makeCoord(s.vs,s.ve,cnv.width).toYa(cnv.width/2);
    const ep=epochAt(mid);
    setUi(u=>({...u,
      epochLabel:ep.label+" · "+fmt(s.vs)+" → "+fmt(Math.max(s.ve,0.1)),
      range:`×${Math.pow(10,zoomLvl(s.vs,s.ve)).toFixed(0)}`
    }));
  },[expandedBands,activeThemes]);

  const scheduleRedraw=useCallback(()=>{
    if(rafRef.current)cancelAnimationFrame(rafRef.current);
    rafRef.current=requestAnimationFrame(redraw);
  },[redraw]);

  useEffect(()=>scheduleRedraw(),[expandedBands,activeThemes,scheduleRedraw]);

  // ── FETCH IA ──────────────────────────────────────────────────────────────
  const fetchZone=useCallback(async(vs,ve)=>{
    const s=S.current;
    const key=`${L(vs).toFixed(2)}_${L(Math.max(ve,0.1)).toFixed(2)}`;
    if(s.fetchedZones.has(key))return;
    if(s.fetching){if(!s.fetchQueue.find(q=>q.key===key))s.fetchQueue.push({key,vs,ve});return;}
    s.fetching=true;s.fetchedZones.add(key);
    setUi(u=>({...u,aiVisible:true}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
          messages:[{role:"user",content:buildPrompt(vs,ve)}]})});
      const data=await res.json();
      const raw=(data.content||[]).find(b=>b.type==="text")?.text||"[]";
      const match=raw.match(/\[[\s\S]*?\]/);if(!match)throw new Error();
      const evs=JSON.parse(match[0]);let added=0;
      for(const ev of evs){
        const ya=Number(ev.yearsAgo);if(!ev.title||isNaN(ya)||ya<0)continue;
        if(s.aiEvents.find(e=>e.title===ev.title))continue;
        s.aiEvents.push({id:`ai_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
          yearsAgo:ya,title:ev.title,date_label:ev.date_label||fmt(ya),
          desc:ev.desc||"",cat:ev.cat||"histoire",importance:3,minZoom:0});
        added++;
      }
      if(added>0){scheduleRedraw();try{localStorage.setItem("ch-aiev",JSON.stringify(s.aiEvents.slice(-200)));}catch(e){}}
    }catch(e){}
    finally{s.fetching=false;setTimeout(()=>setUi(u=>({...u,aiVisible:false})),500);
      if(s.fetchQueue.length>0){const n=s.fetchQueue.shift();setTimeout(()=>fetchZone(n.vs,n.ve),300);}}
  },[scheduleRedraw]);

  const triggerFetch=useCallback(()=>{
    clearTimeout(fetchDebRef.current);
    fetchDebRef.current=setTimeout(()=>{const s=S.current;fetchZone(s.vs,Math.max(s.ve,0.1));},900);
  },[fetchZone]);

  // ── FICHE IA ──────────────────────────────────────────────────────────────
  const openPanel=useCallback((ev)=>{
    S.current._pev=ev;S.current.selectedId=ev.id;scheduleRedraw();
    setUi(u=>({...u,panelOpen:true,panelCat:ev.cat.toUpperCase(),
      panelCatColor:cc(ev.cat),panelDate:ev.date_label,
      panelTitle:ev.title,panelContent:"loading",panelError:null,panelEventId:ev.id,tooltip:null}));
    (async()=>{
      const s=S.current;
      if(STATIC_CONTENT[ev.id]){setUi(u=>({...u,panelContent:STATIC_CONTENT[ev.id]}));return;}
      if(s.panelCache[ev.id]){setUi(u=>({...u,panelContent:s.panelCache[ev.id]}));return;}
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,
            "anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,
            messages:[{role:"user",content:`Fiche encyclopédique sur "${ev.title}" (${ev.date_label}). En HTML simple (<p>,<h3>,<strong>). Sections : intro, Contexte, Ce qui s'est passé, Héritage, Le saviez-vous ?. ~280 mots.`}]})});
        const data=await res.json();
        const html=(data.content||[]).find(b=>b.type==="text")?.text||"<p>Indisponible.</p>";
        s.panelCache[ev.id]=html;setUi(u=>({...u,panelContent:html}));saveCache();
      }catch(e){setUi(u=>({...u,panelContent:"<p>Impossible de charger la fiche.</p>",panelError:"IA indisponible."}))}
    })();
  },[scheduleRedraw,saveCache]);

  const openPeriodPanel=useCallback((item)=>{
    S.current.selectedId=null;scheduleRedraw();
    const key="per_"+item.label;
    setUi(u=>({...u,panelOpen:true,panelCat:"PÉRIODE GÉOLOGIQUE",
      panelCatColor:item.stripe||item.color||"#888",
      panelDate:fmt(item.from)+" → "+(item.to>0?fmt(item.to):"aujourd'hui"),
      panelTitle:item.label,panelContent:"loading",panelError:null,panelEventId:key}));
    (async()=>{
      const s=S.current;
      if(s.panelCache[key]){setUi(u=>({...u,panelContent:s.panelCache[key]}));return;}
      const desc=PERIOD_DESCRIPTIONS[item.label]||{summary:"",highlights:[]};
      const fallback=`<p>${desc.summary}</p>`+(desc.highlights.length?`<ul>${desc.highlights.map(h=>`<li>${h}</li>`).join("")}</ul>`:"");
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,
            "anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1100,
            messages:[{role:"user",content:`Fiche encyclopédique sur la période géologique du ${item.label} (${fmt(item.from)} → ${item.to>0?fmt(item.to):"auj."}). En HTML (<p>,<h3>,<strong>,<ul>). Sections : intro, Caractéristiques, Vie et évolution, Événements majeurs, Chiffres clés. ~350 mots.`}]})});
        const data=await res.json();
        const html=(data.content||[]).find(b=>b.type==="text")?.text||fallback;
        s.panelCache[key]=html;setUi(u=>({...u,panelContent:html}));saveCache();
      }catch(e){setUi(u=>({...u,panelContent:fallback}));}
    })();
  },[scheduleRedraw,saveCache]);

  const closePanel=useCallback(()=>{
    S.current.selectedId=null;scheduleRedraw();
    setUi(u=>({...u,panelOpen:false}));
  },[scheduleRedraw]);

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  const navigateTo=useCallback((vs,ve)=>{
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const s=S.current,tVs=vs,tVe=Math.max(ve,0.1);
    const sVs=s.vs,sVe=s.ve,steps=30;let step=0;
    const run=()=>{step++;const t=step/steps,ease=t<.5?2*t*t:-1+(4-2*t)*t;
      s.vs=Math.pow(10,L(sVs)+(L(tVs)-L(sVs))*ease);
      s.ve=Math.pow(10,L(sVe)+(L(tVe)-L(sVe))*ease);
      scheduleRedraw();if(step<steps)animRef.current=requestAnimationFrame(run);else triggerFetch();};
    animRef.current=requestAnimationFrame(run);
  },[scheduleRedraw,triggerFetch]);

  const zoomAround=useCallback((pivotYa,factor)=>{
    const s=S.current,ns=pivotYa+(s.vs-pivotYa)*factor,ne=pivotYa+(s.ve-pivotYa)*factor;
    if(ns>UA*1.1||ne<0.05||L(ns)-L(Math.max(ne,0.1))<0.03)return;
    s.vs=Math.min(ns,UA*1.1);s.ve=Math.max(ne,0.05);
  },[]);

  const zoomCenter=useCallback((f)=>{
    const s=S.current,W=canvasRef.current?.width||800;
    zoomAround(makeCoord(s.vs,s.ve,W).toYa(W/2),f);scheduleRedraw();triggerFetch();
  },[scheduleRedraw,triggerFetch,zoomAround]);

  const goToResult=useCallback((ev)=>{
    const s=S.current;
    if(!ALL_EVENTS.find(e=>e.id===ev.id)&&!s.aiEvents.find(e=>e.id===ev.id))
      s.aiEvents.push({...ev,importance:ev.importance||2,minZoom:0});
    const span=Math.max(ev.yearsAgo*.15,500);
    navigateTo(ev.yearsAgo+span,Math.max(ev.yearsAgo-span,0.1));
    setTimeout(()=>openPanel(ev),400);
  },[navigateTo,openPanel]);

  // ── RECHERCHE ─────────────────────────────────────────────────────────────
  const searchDebRef=useRef(null);
  const handleSearch=useCallback((q)=>{
    setUi(u=>({...u,searchQuery:q,searchResults:[],searchDone:false}));
    clearTimeout(searchDebRef.current);
    if(!q.trim()){setUi(u=>({...u,searchLoading:false}));return;}
    const local=[...ALL_EVENTS,...S.current.aiEvents]
      .filter(ev=>ev.title.toLowerCase().includes(q.toLowerCase())).slice(0,4);
    setUi(u=>({...u,searchResults:local,searchLoading:true}));
    searchDebRef.current=setTimeout(async()=>{
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,
            "anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,
            messages:[{role:"user",content:`Recherche "${q}". JSON uniquement: [{"yearsAgo":number,"title":"max 6 mots","date_label":"string","desc":"1 phrase","cat":"cosmique|geologique|biologique|prehistoire|histoire"}]. Max 5 résultats.`}]})});
        const data=await res.json();
        const raw=(data.content||[]).find(b=>b.type==="text")?.text||"[]";
        const match=raw.match(/\[[\s\S]*?\]/);
        const aiR=match?JSON.parse(match[0]).map(r=>({...r,id:`s_${Date.now()}`,importance:2,minZoom:0})):[];
        setUi(u=>({...u,searchResults:[...local,...aiR.filter(r=>!local.find(l=>l.title===r.title))].slice(0,7),searchLoading:false,searchDone:true}));
      }catch(e){setUi(u=>({...u,searchLoading:false,searchDone:true}));}
    },500);
  },[]);

  // ── REFS STABLES ──────────────────────────────────────────────────────────
  const _op=useRef(null);_op.current=openPanel;
  const _opp=useRef(null);_opp.current=openPeriodPanel;
  const _cp=useRef(null);_cp.current=closePanel;
  const _sr=useRef(null);_sr.current=scheduleRedraw;
  const _tf=useRef(null);_tf.current=triggerFetch;
  const _za=useRef(null);_za.current=zoomAround;

  useEffect(()=>{
    const wrap=wrapRef.current,cnv=canvasRef.current;if(!wrap||!cnv)return;
    const onWheel=(e)=>{e.preventDefault();const rect=cnv.getBoundingClientRect();
      _za.current(makeCoord(S.current.vs,S.current.ve,cnv.width).toYa(e.clientX-rect.left),e.deltaY>0?1.13:.88);
      _sr.current();_tf.current();};
    let drag=false,lastX=0;
    const onMD=(e)=>{drag=true;lastX=e.clientX;wrap.style.cursor="grabbing";};
    const onMU=()=>{drag=false;wrap.style.cursor="crosshair";};
    const onMM=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
      if(drag){
        const s=S.current,lr=L(s.vs)-L(s.ve),sh=-(e.movementX/cnv.width)*lr;
        const ls=L(s.vs)+sh,le=L(s.ve)+sh;
        if(ls>Math.log10(UA*1.1)||le<0)return;
        s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);_sr.current();_tf.current();return;
      }
      const s=S.current;let found=null;
      for(const p of s.placed)if(Math.abs(p.x-mx)<18&&Math.abs(s.lineY-my)<90){found=p.ev;break;}
      if(found?.id!==s.hoveredId){
        s.hoveredId=found?.id||null;
        wrap.style.cursor=found?"pointer":"crosshair";
        _sr.current();
        if(found){
          let tx=mx+14,ty=my-60;
          if(tx+230>cnv.width)tx=mx-230;if(ty<8)ty=my+16;
          setUi(u=>({...u,tooltip:{x:tx,y:ty,date:found.date_label,title:found.title}}));
        }else setUi(u=>({...u,tooltip:null}));
      }
    };
    const onClick=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,s=S.current;
      // Arbre de vie
      if(s.bandRects){
        const b=s.bandRects.find(b=>b.hasKids&&mx>=b.rx&&mx<=b.rx+b.rw&&my>=b.ry&&my<=b.ry+b.rh);
        if(b){setExpandedBands(prev=>{const n=new Set(prev);n.has(b.id)?n.delete(b.id):n.add(b.id);return n;});return;}
      }
      // Événements
      for(const p of s.placed)if(Math.abs(p.x-mx)<22&&Math.abs(s.lineY-my)<100){_op.current(p.ev);return;}
      // Périodes
      if(s.periodY!=null&&my>=s.periodY&&my<=s.periodY+(s.periodH||18)){
        const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);
        const per=PERIODS.find(p=>ya<=p.from&&ya>=p.to);if(per){_opp.current(per);return;}
      }
      if(s.periodY!=null&&my<s.periodY&&my>0){
        const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);
        const ep=EPOCHS.find(p=>ya<=p.from&&ya>=p.to);if(ep){_opp.current(ep);return;}
      }
      _cp.current();
    };
    let lt=null,ld=null;
    const onTS=(e)=>{if(e.touches.length===1)lt=e.touches[0].clientX;else if(e.touches.length===2)ld=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);};
    const onTM=(e)=>{e.preventDefault();const rect=cnv.getBoundingClientRect(),s=S.current;
      if(e.touches.length===1&&lt!==null){const dx=e.touches[0].clientX-lt;lt=e.touches[0].clientX;
        const lr=L(s.vs)-L(s.ve),sh=-(dx/cnv.width)*lr,ls=L(s.vs)+sh,le=L(s.ve)+sh;
        if(ls>Math.log10(UA*1.1)||le<0)return;s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);_sr.current();_tf.current();}
      else if(e.touches.length===2&&ld!==null){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        const mx=(e.touches[0].clientX+e.touches[1].clientX)/2-rect.left;
        _za.current(makeCoord(s.vs,s.ve,cnv.width).toYa(mx),ld/d);ld=d;_sr.current();_tf.current();}};
    const onTE=()=>{lt=null;ld=null;};
    const onResize=()=>_sr.current();
    const onMinimapClick=(e)=>{
      const mini=miniRef.current;if(!mini)return;
      const rect=mini.getBoundingClientRect(),relX=(e.clientX-rect.left)/rect.width;
      const tls=Math.log10(UA),tle=0,tR=tls-tle;
      const cl=tls-(relX*tR);
      const s=S.current,half=(L(s.vs)-L(Math.max(s.ve,0.1)))/2;
      s.vs=Math.pow(10,cl+half);s.ve=Math.max(Math.pow(10,cl-half),0.1);
      _sr.current();_tf.current();
    };
    cnv.addEventListener("wheel",onWheel,{passive:false});
    cnv.addEventListener("mousedown",onMD);cnv.addEventListener("click",onClick);
    cnv.addEventListener("touchstart",onTS,{passive:false});
    cnv.addEventListener("touchmove",onTM,{passive:false});
    cnv.addEventListener("touchend",onTE);
    window.addEventListener("mousemove",onMM);window.addEventListener("mouseup",onMU);
    window.addEventListener("resize",onResize);
    const miniEl=miniRef.current;if(miniEl)miniEl.addEventListener("click",onMinimapClick);
    _sr.current();_tf.current();
    return()=>{cnv.removeEventListener("wheel",onWheel);cnv.removeEventListener("mousedown",onMD);
      cnv.removeEventListener("click",onClick);cnv.removeEventListener("touchstart",onTS);
      cnv.removeEventListener("touchmove",onTM);cnv.removeEventListener("touchend",onTE);
      window.removeEventListener("mousemove",onMM);window.removeEventListener("mouseup",onMU);
      window.removeEventListener("resize",onResize);
      if(miniEl)miniEl.removeEventListener("click",onMinimapClick);};
  },[]);

  const TAG_COLORS=["#d97706","#2563eb","#16a34a","#dc2626","#7c3aed"];
  const currentEv=S.current._pev;

  return (
    <div style={css.app}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes bw{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e5e5e5;border-radius:2px}
        button,input{font-family:inherit;outline:none}
        .card-btn:hover{background:#f9fafb!important}
        .theme-btn:hover{background:#f5f5f5!important}
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={css.topbar}>
        {/* Marque */}
        <div style={css.brand}>
          Chronos<span style={css.brandSub}>IA</span>
        </div>

        {/* Recherche */}
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <input
            value={ui.searchQuery}
            onChange={e=>handleSearch(e.target.value)}
            onFocus={()=>setUi(u=>({...u,searchOpen:true}))}
            onBlur={()=>setTimeout(()=>setUi(u=>({...u,searchOpen:false})),200)}
            placeholder="Rechercher un événement, une espèce…"
            style={{width:"100%",height:30,border:"1px solid #e5e5e5",borderRadius:15,
              padding:"0 30px 0 12px",fontSize:12,background:"#fafafa",color:"#111"}}
          />
          {ui.searchQuery&&(
            <button onClick={()=>handleSearch("")}
              style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#aaa"}}>✕</button>
          )}
          {/* Dropdown résultats */}
          {ui.searchOpen&&ui.searchQuery&&(
            <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,
              background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,
              boxShadow:"0 8px 24px rgba(0,0,0,.1)",zIndex:200,overflow:"hidden"}}>
              {ui.searchLoading&&(
                <div style={{padding:"10px 12px",fontSize:11,color:"#aaa"}}>Recherche…</div>
              )}
              {ui.searchResults.map((ev,i)=>(
                <div key={ev.id||i} onMouseDown={e=>{e.preventDefault();goToResult(ev);setUi(u=>({...u,searchQuery:"",searchOpen:false}));}}
                  style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 12px",
                    cursor:"pointer",borderBottom:"1px solid #f5f5f5"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:cc(ev.cat),flexShrink:0,marginTop:4}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:"#111"}}>{ev.title}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:1}}>{ev.date_label}</div>
                  </div>
                </div>
              ))}
              {ui.searchDone&&ui.searchResults.length===0&&(
                <div style={{padding:"12px",fontSize:11,color:"#aaa",textAlign:"center"}}>Aucun résultat</div>
              )}
            </div>
          )}
        </div>

        {/* Actions droite */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
          {/* Couches */}
          <div style={{position:"relative"}}>
            <button className="theme-btn" onClick={()=>setShowThemes(t=>!t)}
              style={{height:30,padding:"0 12px",borderRadius:15,border:"1px solid #e5e5e5",
                background:showThemes?"#f5f5f5":"#fff",fontSize:12,color:"#555",cursor:"pointer",
                display:"flex",alignItems:"center",gap:5}}>
              <span>Couches</span>
              {activeThemes.size>0&&<span style={{background:"#111",color:"#fff",borderRadius:99,fontSize:9,padding:"1px 5px"}}>{activeThemes.size}</span>}
            </button>
            {showThemes&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,
                boxShadow:"0 8px 24px rgba(0,0,0,.1)",zIndex:300,padding:"8px",
                display:"flex",flexDirection:"column",gap:2,minWidth:180}}>
                {Object.entries(THEMES).map(([key,theme])=>(
                  <button key={key} onClick={()=>setActiveThemes(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);return n;})}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",
                      borderRadius:6,border:"none",cursor:"pointer",textAlign:"left",
                      background:activeThemes.has(key)?"#f5f5f5":"transparent"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:theme.color,flexShrink:0}}/>
                    <span style={{fontSize:12,color:"#333"}}>{theme.label}</span>
                    {activeThemes.has(key)&&<span style={{marginLeft:"auto",fontSize:10,color:"#aaa"}}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Signets */}
          <button className="theme-btn" onClick={()=>setShowBookmarks(b=>!b)}
            style={{height:30,padding:"0 12px",borderRadius:15,border:"1px solid #e5e5e5",
              background:showBookmarks?"#f5f5f5":"#fff",fontSize:12,color:"#555",cursor:"pointer"}}>
            Signets {Object.keys(bookmarks).length>0&&`(${Object.keys(bookmarks).length})`}
          </button>
          {/* Reset */}
          <button onClick={()=>{S.current.vs=UA*1.04;S.current.ve=20;scheduleRedraw();triggerFetch();}}
            style={{height:30,padding:"0 12px",borderRadius:15,border:"1px solid #e5e5e5",
              background:"#fff",fontSize:12,color:"#555",cursor:"pointer"}}>
            Vue globale
          </button>
          {/* IA indicator */}
          {ui.aiVisible&&<div style={{fontSize:10,color:"#aaa",display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:4,height:4,borderRadius:"50%",background:"#d97706",animation:"bw .8s infinite"}}/>IA
          </div>}
        </div>
      </div>

      {/* ── CARTES ACCÈS RAPIDE ── */}
      <div style={css.cardsRow}>
        {EXPLORE_CARDS.map((c,i)=>(
          <button key={c.label} className="card-btn"
            style={css.card(ui.activeCard===i,c.color)}
            onClick={()=>{setUi(u=>({...u,activeCard:i}));navigateTo(c.from,c.to);}}>
            <div style={css.cardKicker}>{c.kicker}</div>
            <div style={css.cardTitle}>{c.label}</div>
            <div style={css.cardSub}>{c.sub}</div>
          </button>
        ))}
      </div>

      {/* ── CORPS PRINCIPAL ── */}
      <div style={css.body}>

        {/* ── FRISE 70% ── */}
        <div style={css.timelinePane}>
          {/* Barre nav */}
          <div style={css.timelineNav}>
            <span style={css.navText}>Vue</span>
            <span style={css.navValue}>{ui.epochLabel||"Universe entier"}</span>
            <span style={{...css.navText,marginLeft:"auto"}}>zoom {ui.range}</span>
            <span style={{...css.navText,marginLeft:12,display:"flex",gap:4}}>
              <kbd style={{padding:"1px 5px",border:"1px solid #e5e5e5",borderRadius:3,fontSize:9,background:"#fafafa"}}>molette</kbd>
              <kbd style={{padding:"1px 5px",border:"1px solid #e5e5e5",borderRadius:3,fontSize:9,background:"#fafafa"}}>drag</kbd>
              <kbd style={{padding:"1px 5px",border:"1px solid #e5e5e5",borderRadius:3,fontSize:9,background:"#fafafa"}}>clic</kbd>
            </span>
          </div>

          {/* Canvas */}
          <div ref={wrapRef} style={css.wrap}>
            <canvas ref={canvasRef} style={css.cnv}/>

            {/* Zoom */}
            <div style={css.zoomBtns}>
              {["+","−"].map((l,i)=>(
                <button key={l} style={css.zoomBtn}
                  onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"}
                  onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                  onClick={()=>zoomCenter(i===0?.72:1.38)}>{l}</button>
              ))}
            </div>

            {/* Minimap */}
            <div style={css.mini} title="Cliquer pour naviguer">
              <canvas ref={miniRef}/>
            </div>

            {/* Tooltip */}
            {ui.tooltip&&(
              <div style={css.tt(ui.tooltip)}>
                <div style={css.ttDate}>{ui.tooltip.date}</div>
                <div style={css.ttTitle}>{ui.tooltip.title}</div>
                <div style={css.ttHint}>Cliquer pour la fiche</div>
              </div>
            )}

            {/* Panel fiche */}
            <aside style={css.panel(ui.panelOpen)}>
              <div style={{height:3,background:ui.panelCatColor,flexShrink:0}}/>
              <div style={css.panelHdr}>
                <button style={css.panelClose} onClick={closePanel}>✕</button>
                <div style={css.panelCat}>{ui.panelCat}</div>
                <div style={css.panelDate}>{ui.panelDate}</div>
                <div style={css.panelTitle}>{ui.panelTitle}</div>
              </div>
              {ui.panelError&&<div style={css.panelError}>{ui.panelError}</div>}
              {/* Signets */}
              {ui.panelEventId&&(
                <div style={css.bmBar}>
                  {customTags.map((tag,i)=>{
                    const col=TAG_COLORS[i%5],active=currentEv&&bookmarks[currentEv.id]?.tag===tag;
                    return <button key={tag} style={css.bmBtn(active,col)} onClick={()=>{if(currentEv)toggleBm(currentEv,tag);}}>{active?"✓ ":""}{tag}</button>;
                  })}
                  {addingTag?(
                    <div style={{display:"flex",gap:4}}>
                      <input autoFocus value={newTagInput} onChange={e=>setNewTagInput(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter")addTag(newTagInput);if(e.key==="Escape"){setAddingTag(false);setNewTagInput("");}}}
                        style={{width:80,height:24,border:"1px solid #e5e5e5",borderRadius:4,padding:"0 6px",fontSize:11}} placeholder="Nom…"/>
                      <button onClick={()=>addTag(newTagInput)} style={{...css.bmBtn(false,"#333"),padding:"0 8px"}}>✓</button>
                    </div>
                  ):(
                    <button style={{...css.bmBtn(false,"#ddd"),borderStyle:"dashed"}} onClick={()=>setAddingTag(true)}>+ Tag</button>
                  )}
                </div>
              )}
              <div style={css.panelBody}>
                {ui.panelContent==="loading"?(
                  <div style={css.loading}>
                    <div style={css.bars}>{[7,14,20,14,7].map((h,i)=>(
                      <span key={i} style={{width:3,height:h,borderRadius:2,background:"#ddd",animation:`bw 1s ${i*.15}s ease-in-out infinite`,display:"inline-block"}}/>
                    ))}</div>
                    <div style={css.barsLbl}>Génération…</div>
                  </div>
                ):(
                  <div style={css.panelContent} dangerouslySetInnerHTML={{__html:ui.panelContent||""}}/>
                )}
              </div>
            </aside>

            {/* Panel signets */}
            {showBookmarks&&(
              <div style={{position:"absolute",top:0,right:0,bottom:0,width:280,
                background:"#fff",borderLeft:"1px solid #e8e8e8",zIndex:35,
                display:"flex",flexDirection:"column"}}>
                <div style={{padding:"12px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#111",flex:1}}>Signets</span>
                  <button onClick={()=>setShowBookmarks(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#aaa"}}>✕</button>
                </div>
                <div style={{flex:1,overflowY:"auto"}}>
                  {Object.keys(bookmarks).length===0?(
                    <div style={{padding:"24px 16px",textAlign:"center",fontSize:12,color:"#bbb"}}>
                      Aucun signet.<br/>Ouvrez une fiche et ajoutez un tag.
                    </div>
                  ):Object.entries(bookmarks).map(([id,bm])=>{
                    const ev=ALL_EVENTS.find(e=>e.id===id)||S.current.aiEvents.find(e=>e.id===id)||{id,...bm,importance:2,minZoom:0};
                    return(
                      <div key={id} onClick={()=>goToResult(ev)}
                        style={{display:"flex",gap:8,padding:"10px 14px",borderBottom:"1px solid #f5f5f5",cursor:"pointer"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:cc(bm.cat),flexShrink:0,marginTop:4}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:500,color:"#111",marginBottom:2}}>{bm.title}</div>
                          <div style={{fontSize:10,color:"#aaa"}}>{bm.date_label}</div>
                        </div>
                        <button onClick={e=>{e.stopPropagation();removeBm(id);}}
                          style={{background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:12}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ARBRE DE VIE 30% ── */}
        <div style={css.treePane}>
          <div style={css.treeNav}>
            <span style={css.treeTitle}>🌿 Arbre de la vie</span>
            <button onClick={()=>setExpandedBands(new Set(["euca","vert"]))}
              style={{fontSize:10,color:"#bbb",background:"none",border:"none",cursor:"pointer"}}>
              Réinitialiser
            </button>
          </div>
          <div style={css.treeBody}>
            <TreeView
              nodes={LIFE_TREE}
              expandedBands={expandedBands}
              setExpandedBands={setExpandedBands}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ── ARBRE DE VIE — composant React Notion-style ───────────────────────────────
function TreeView({nodes, expandedBands, setExpandedBands, depth=0}) {
  return (
    <div>
      {nodes.map(node=>(
        <TreeNode key={node.id} node={node} depth={depth}
          expandedBands={expandedBands} setExpandedBands={setExpandedBands}/>
      ))}
    </div>
  );
}

function TreeNode({node, depth, expandedBands, setExpandedBands}) {
  const [showDesc, setShowDesc]=useState(false);
  const isOpen=expandedBands.has(node.id);
  const hasKids=node.children?.length>0;
  const indent=depth*16;

  const toggle=()=>{
    if(hasKids){
      setExpandedBands(prev=>{const n=new Set(prev);n.has(node.id)?n.delete(node.id):n.add(node.id);return n;});
    }
    setShowDesc(d=>!d);
  };

  return (
    <div>
      <div
        onClick={toggle}
        style={{display:"flex",alignItems:"center",gap:6,
          padding:`3px 12px 3px ${12+indent}px`,
          cursor:"pointer",userSelect:"none"}}
        onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
      >
        {/* Chevron */}
        <span style={{
          fontSize:8,color:"#ccc",width:10,textAlign:"center",flexShrink:0,
          transform:isOpen?"rotate(90deg)":"none",transition:"transform .15s",
          visibility:hasKids?"visible":"hidden",
        }}>▶</span>
        {/* Point couleur */}
        <div style={{
          width:7,height:7,borderRadius:"50%",flexShrink:0,
          background:node.color,opacity:node.eteint?.4:1,
        }}/>
        {/* Label */}
        <span style={{
          fontSize:depth===0?13:depth<=2?12:11,
          fontWeight:depth===0?600:depth<=2?500:400,
          color:node.eteint?"#ccc":"#333",
          textDecoration:node.eteint?"line-through":"none",
          flex:1,
        }}>
          {node.label}
        </span>
        {/* Badge */}
        <span style={{
          fontSize:9,padding:"1px 5px",borderRadius:3,flexShrink:0,
          background:node.eteint?"#fef2f2":"#f0fdf4",
          color:node.eteint?"#fca5a5":"#86efac",
        }}>
          {node.eteint?"†":"●"}
        </span>
      </div>
      {/* Enfants */}
      {isOpen&&hasKids&&(
        <TreeView nodes={node.children} depth={depth+1}
          expandedBands={expandedBands} setExpandedBands={setExpandedBands}/>
      )}
    </div>
  );
}
