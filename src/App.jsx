import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_EVENTS, EPOCHS, PERIODS, PERIOD_DESCRIPTIONS, STATIC_CONTENT, UA, cc } from "./data/timelineData.js";
import { buildPrompt, epochAt, fmt, L, makeCoord, zoomLvl } from "./utils/time.js";
import { drawAll } from "./canvas/drawTimeline.js";
import { css } from "./styles.js";
import { Topbar } from "./components/Topbar.jsx";
import { Legend } from "./components/Legend.jsx";
import { ZoomControls } from "./components/ZoomControls.jsx";
import { TimelineTooltip } from "./components/TimelineTooltip.jsx";
import { BookmarksPanel } from "./components/BookmarksPanel.jsx";
import { EventPanel } from "./components/EventPanel.jsx";
import { ExploreCards } from "./components/ExploreCards.jsx";
import { LifeTree } from "./components/LifeTree.jsx";
import { THEMES, flattenTree } from "./canvas/drawTimeline.js";
import { Landing } from "./components/Landing.jsx";
import { EpochBubbles } from "./components/EpochBubbles.jsx";
import { NarrativeBar } from "./components/NarrativeBar.jsx";
import { STORIES, randomStory } from "./data/stories.js";

// Données arbre de vie — inline pour éviter les problèmes d'import
const LIFE_TREE_DATA = [
  { id:"bact", label:"🦠 Bactéries", from:3500e6, to:null, color:"#64748b", children:[] },
  { id:"euca", label:"🔵 Eucaryotes", from:2000e6, to:null, color:"#6366f1",
    children:[
      { id:"cham", label:"🍄 Champignons", from:1000e6, to:null, color:"#a78bfa", children:[] },
      { id:"plan", label:"🌿 Plantes", from:470e6, to:null, color:"#16a34a",
        children:[
          { id:"mous", label:"🌱 Mousses", from:470e6, to:null, color:"#4ade80", children:[] },
          { id:"foug", label:"🌾 Fougères", from:360e6, to:null, color:"#22c55e", children:[] },
          { id:"gymn", label:"🌲 Gymnospermes", from:320e6, to:null, color:"#15803d", children:[
            { id:"gink", label:"🌳 Ginkgo", from:270e6, to:null, color:"#84cc16", children:[] },
          ]},
          { id:"angi", label:"🌸 Angiospermes", from:130e6, to:null, color:"#f0abfc", children:[] },
        ]},
      { id:"inv", label:"🦑 Invertébrés", from:600e6, to:null, color:"#f59e0b",
        children:[
          { id:"cnid", label:"🪸 Cnidaires", from:580e6, to:null, color:"#fb923c", children:[] },
          { id:"moll", label:"🐙 Mollusques", from:540e6, to:null, color:"#e879f9",
            children:[
              { id:"ammo", label:"💀 Ammonites", from:400e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
              { id:"naut", label:"🐚 Nautile", from:500e6, to:null, color:"#c026d3", children:[] },
            ]},
          { id:"arth", label:"🦀 Arthropodes", from:540e6, to:null, color:"#ea580c",
            children:[
              { id:"tril", label:"💀 Trilobites", from:521e6, to:252e6, color:"#6b7280", eteint:true, children:[] },
              { id:"inse", label:"🪲 Insectes", from:385e6, to:null, color:"#d97706", children:[] },
              { id:"arac", label:"🕷️ Arachnides", from:420e6, to:null, color:"#92400e", children:[] },
            ]},
          { id:"echi", label:"⭐ Échinodermes", from:520e6, to:null, color:"#f472b6", children:[] },
        ]},
      { id:"vert", label:"🐟 Vertébrés", from:525e6, to:null, color:"#0ea5e9",
        children:[
          { id:"requin", label:"🦈 Requins", from:450e6, to:null, color:"#1e3a5f", children:[
            { id:"megalo", label:"💀 Mégalodon", from:23e6, to:3.6e6, color:"#6b7280", eteint:true, children:[] },
          ]},
          { id:"actino", label:"🐠 Poissons osseux", from:400e6, to:null, color:"#38bdf8", children:[] },
          { id:"amphi", label:"🐸 Amphibiens", from:370e6, to:null, color:"#0f766e",
            children:[
              { id:"greno", label:"🐸 Grenouilles", from:250e6, to:null, color:"#10b981", children:[] },
              { id:"salam", label:"🦎 Salamandres", from:160e6, to:null, color:"#059669", children:[] },
            ]},
          { id:"amnio", label:"🥚 Amniotes", from:320e6, to:null, color:"#b45309",
            children:[
              { id:"tortu", label:"🐢 Tortues", from:230e6, to:null, color:"#65a30d", children:[] },
              { id:"squa", label:"🐍 Squamates", from:200e6, to:null, color:"#ca8a04",
                children:[
                  { id:"lezer", label:"🦎 Lézards", from:200e6, to:null, color:"#84cc16", children:[] },
                  { id:"serp", label:"🐍 Serpents", from:150e6, to:null, color:"#a3e635", children:[] },
                  { id:"mosa", label:"💀 Mosasaures", from:98e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
                ]},
              { id:"archo", label:"🦖 Archosaures", from:252e6, to:null, color:"#dc2626",
                children:[
                  { id:"croco", label:"🐊 Crocodiliens", from:230e6, to:null, color:"#166534", children:[] },
                  { id:"ptero", label:"💀 Ptérosaures 🦅", from:228e6, to:66e6, color:"#7c3aed", eteint:true, children:[
                    { id:"quetz", label:"💀 Quetzalcoatlus", from:72e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
                  ]},
                  { id:"dino", label:"🦕 Dinosaures", from:230e6, to:null, color:"#b91c1c",
                    children:[
                      { id:"sauro", label:"🦕 Sauropodes", from:200e6, to:66e6, color:"#b45309", eteint:true,
                        children:[
                          { id:"diplo", label:"💀 Diplodocus", from:154e6, to:152e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"arge", label:"💀 Argentinosaurus", from:96e6, to:92e6, color:"#6b7280", eteint:true, children:[] },
                        ]},
                      { id:"ornit", label:"🦴 Ornithischiens", from:235e6, to:66e6, color:"#92400e", eteint:true,
                        children:[
                          { id:"stego", label:"💀 Stegosaurus", from:155e6, to:150e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"trice", label:"💀 Triceratops", from:68e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"trex2", label:"💀 Ankylosaurus", from:68e6, to:66e6, color:"#6b7280", eteint:true, children:[] },
                        ]},
                      { id:"therop", label:"🦖 Théropodes", from:230e6, to:null, color:"#dc2626",
                        children:[
                          { id:"spino", label:"💀 Spinosaurus", from:99e6, to:93e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"trex", label:"💀 T-Rex", from:68e6, to:66e6, color:"#7f1d1d", eteint:true, children:[] },
                          { id:"velo", label:"💀 Velociraptor", from:75e6, to:71e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"oiseau", label:"🐦 Oiseaux", from:150e6, to:null, color:"#0369a1",
                            children:[
                              { id:"moa", label:"💀 Moa", from:19e6, to:0.6e3, color:"#6b7280", eteint:true, children:[] },
                            ]},
                        ]},
                    ]},
                ]},
              { id:"mamm", label:"🦁 Mammifères", from:225e6, to:null, color:"#be185d",
                children:[
                  { id:"monot", label:"🦆 Monotrèmes", from:170e6, to:null, color:"#9d174d", children:[] },
                  { id:"marsu", label:"🦘 Marsupiaux", from:100e6, to:null, color:"#be185d",
                    children:[
                      { id:"thyla", label:"💀 Thylacine", from:4e6, to:0.089, color:"#6b7280", eteint:true, children:[] },
                    ]},
                  { id:"plac", label:"🐘 Placentaires", from:100e6, to:null, color:"#db2777",
                    children:[
                      { id:"cetac", label:"🐋 Cétacés", from:50e6, to:null, color:"#0e7490",
                        children:[
                          { id:"pakic", label:"💀 Pakicetus", from:53e6, to:48e6, color:"#6b7280", eteint:true, children:[] },
                          { id:"blein", label:"🐋 Baleine bleue", from:5e6, to:null, color:"#0ea5e9", children:[] },
                        ]},
                      { id:"probo", label:"🐘 Proboscidiens", from:55e6, to:null, color:"#78716c",
                        children:[
                          { id:"mammo", label:"💀 Mammouth", from:400e3, to:4e3, color:"#6b7280", eteint:true, children:[] },
                          { id:"eleph", label:"🐘 Éléphant", from:6e6, to:null, color:"#57534e", children:[] },
                        ]},
                      { id:"carni", label:"🦁 Carnivores", from:60e6, to:null, color:"#dc2626",
                        children:[
                          { id:"smilo", label:"💀 Smilodon", from:2.5e6, to:10e3, color:"#6b7280", eteint:true, children:[] },
                          { id:"lion", label:"🦁 Lion", from:3e6, to:null, color:"#ca8a04", children:[] },
                        ]},
                      { id:"primat", label:"🐒 Primates", from:58e6, to:null, color:"#9333ea",
                        children:[
                          { id:"prosim", label:"🦥 Prosimiens", from:55e6, to:null, color:"#7c3aed", children:[] },
                          { id:"grand", label:"🦍 Grands singes", from:15e6, to:null, color:"#5b21b6",
                            children:[
                              { id:"goril", label:"🦍 Gorille", from:10e6, to:null, color:"#374151", children:[] },
                              { id:"chimp", label:"🐒 Chimpanzé", from:7e6, to:null, color:"#713f12", children:[] },
                              { id:"lucy", label:"💀 Australopithèque", from:4e6, to:2e6, color:"#6b7280", eteint:true, children:[] },
                              { id:"habit", label:"💀 H. habilis", from:2.4e6, to:1.4e6, color:"#6b7280", eteint:true, children:[] },
                              { id:"erect", label:"💀 H. erectus", from:1.9e6, to:110e3, color:"#6b7280", eteint:true, children:[] },
                              { id:"nean", label:"💀 Néandertal", from:400e3, to:40e3, color:"#7c3aed", eteint:true, children:[] },
                              { id:"sap", label:"🧠 Homo sapiens", from:300e3, to:null, color:"#92400e", children:[] },
                            ]},
                        ]},
                    ]},
                ]},
            ]},
        ]},
    ]},
];

// ── ÉTAPES DE LA VISITE GUIDÉE ────────────────────────────────────────────────
const TOUR_STEPS = [
  { label:"🌌 Big Bang", vs:UA*1.04, ve:10e9, desc:"Tout commence ici — 13,8 milliards d'années. L'univers naît en un instant." },
  { label:"🌍 Naissance de la Terre", vs:5e9, ve:3.5e9, desc:"Il y a 4,5 milliards d'années, la Terre se forme par accrétion de poussières." },
  { label:"🦠 Premières formes de vie", vs:4e9, ve:2.5e9, desc:"Les premières bactéries apparaissent il y a 3,5 milliards d'années." },
  { label:"🦕 Ère des dinosaures", vs:260e6, ve:60e6, desc:"Le Mésozoïque — 165 millions d'années de règne des dinosaures." },
  { label:"🧠 Homo sapiens", vs:500e3, ve:10e3, desc:"Notre espèce apparaît il y a ~300 000 ans. Art, langage, outils." },
  { label:"📜 Civilisations", vs:8000, ve:0.1, desc:"De l'écriture sumérienne à l'intelligence artificielle — 5 000 ans d'histoire." },
];

// ── CATÉGORIES POUR LES FILTRES ───────────────────────────────────────────────
const CATS = [
  { id:"all",    label:"Tout",        color:"#555" },
  { id:"cosmique",label:"Cosmique",   color:"#5a3db8" },
  { id:"geologique",label:"Géologie", color:"#0868a8" },
  { id:"biologique",label:"Biologie", color:"#0a7848" },
  { id:"prehistoire",label:"Préhistoire",color:"#b03010" },
  { id:"histoire",label:"Histoire",   color:"#8a6000" },
];

// ── RACINE : page d'accueil → expérience ─────────────────────────────────────
export default function Root() {
  const [started, setStarted] = useState(() => {
    try { return sessionStorage.getItem("chronos-started") === "1"; } catch (e) { return false; }
  });
  if (!started) {
    return <Landing onStart={() => {
      try { sessionStorage.setItem("chronos-started", "1"); } catch (e) {}
      setStarted(true);
    }} />;
  }
  return <Chronos />;
}

function Chronos() {
  const canvasRef=useRef(null),miniRef=useRef(null),wrapRef=useRef(null);
  const S=useRef({vs:UA*1.04,ve:20,aiEvents:[],selectedId:null,hoveredId:null,fetchedZones:new Set(),fetching:false,fetchQueue:[],panelCache:{},placed:[],lineY:0,periodY:0,periodH:0,treeTop:0});
  const rafRef=useRef(null),fetchDebRef=useRef(null),animRef=useRef(null);

  // ── ÉTAT ──────────────────────────────────────────────────────────────────
  const [ui,setUi]=useState({
    epochLabel:"Vue globale",range:"",aiVisible:false,aiLabel:"",
    legendOpen:false,panelOpen:false,panelCat:"",panelCatColor:"#555",
    panelDate:"",panelTitle:"",panelContent:null,panelError:null,
    tooltip:null,searchOpen:false,searchQuery:"",searchResults:[],
    searchLoading:false,searchDone:false,searchError:null,
    panelEventId:null,showBookmarkMenu:false,showBookmarksView:false,
  });
  const [bookmarks,setBookmarks]=useState({});
  const [customTags,setCustomTags]=useState(["Favori","À revoir","Intéressant"]);
  const [addingTag,setAddingTag]=useState(false);
  const [newTagInput,setNewTagInput]=useState("");
  const [isMobile,setIsMobile]=useState(()=>typeof window!=="undefined"&&window.innerWidth<760);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [linearScale,setLinearScale]=useState(false);
  const [expandedBands,setExpandedBands]=useState(new Set(["euca","vert"]));
  const [activeThemes,setActiveThemes]=useState(new Set()); // couches civ/sciences/etc

  // Nouvelles fonctionnalités
  const [fullscreen,setFullscreen]=useState(false);       // mode plein écran frise
  const [filterCat,setFilterCat]=useState("all");         // filtre catégorie
  const [tourStep,setTourStep]=useState(null);            // visite guidée (null = inactif)
  // Parcours narratifs + synchronisation frise ↔ arbre du vivant
  const [story,setStory]=useState(null);                  // parcours en cours (objet) ou null
  const [storyStep,setStoryStep]=useState(0);             // étape courante du parcours
  const [storyMenu,setStoryMenu]=useState(false);         // menu de choix de parcours
  const [focusYa,setFocusYa]=useState(null);              // instant temporel partagé avec l'arbre
  const [annotations,setAnnotations]=useState({});        // {evId: texte}
  const [annotInput,setAnnotInput]=useState("");
  const [annotTarget,setAnnotTarget]=useState(null);
  const [showLegendBar,setShowLegendBar]=useState(true);  // légende permanente

  // ── STORAGE ───────────────────────────────────────────────────────────────
  useEffect(()=>{
    (async()=>{
      try{const c=JSON.parse(localStorage.getItem("chronos-cache")||"null");if(c&&typeof c==="object")Object.assign(S.current.panelCache,c);}catch(e){}
      try{const bm=JSON.parse(localStorage.getItem("chronos-bookmarks")||"null");if(bm&&typeof bm==="object")setBookmarks(bm);}catch(e){}
      try{const tags=JSON.parse(localStorage.getItem("chronos-tags")||"null");if(Array.isArray(tags))setCustomTags(tags);}catch(e){}
      // Charger les événements IA persistants
      try{const aiev=JSON.parse(localStorage.getItem("chronos-aievents")||"null");if(Array.isArray(aiev)&&aiev.length){S.current.aiEvents=aiev;S.current.fetchedZones=new Set(aiev.map(e=>e._zone||""));}}catch(e){}
      // Charger les annotations
      try{const ann=JSON.parse(localStorage.getItem("chronos-annotations")||"null");if(ann&&typeof ann==="object")setAnnotations(ann);}catch(e){}
    })();
  },[]);

  const saveCache=useCallback(()=>{try{localStorage.setItem("chronos-cache",JSON.stringify(S.current.panelCache));}catch(e){}},[]);
  const saveBookmarks=useCallback((bm)=>{try{localStorage.setItem("chronos-bookmarks",JSON.stringify(bm));}catch(e){}},[]);
  const saveTags=useCallback((tags)=>{try{localStorage.setItem("chronos-tags",JSON.stringify(tags));}catch(e){}},[]);
  const saveAiEvents=useCallback(()=>{try{localStorage.setItem("chronos-aievents",JSON.stringify(S.current.aiEvents.slice(-200)));}catch(e){}},[]);
  const saveAnnotations=useCallback((ann)=>{try{localStorage.setItem("chronos-annotations",JSON.stringify(ann));}catch(e){}},[]);

  useEffect(()=>{const onResize=()=>setIsMobile(window.innerWidth<760);window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);},[]);

  // ── BOOKMARKS ─────────────────────────────────────────────────────────────
  const toggleBookmark=useCallback((ev,tag)=>{setBookmarks(prev=>{const next={...prev};if(next[ev.id]?.tag===tag){delete next[ev.id];}else{next[ev.id]={tag,title:ev.title,date_label:ev.date_label,cat:ev.cat,yearsAgo:ev.yearsAgo,desc:ev.desc||""};}saveBookmarks(next);return next;});setUi(u=>({...u,showBookmarkMenu:false}));},[saveBookmarks]);
  const removeBookmark=useCallback((evId)=>{setBookmarks(prev=>{const next={...prev};delete next[evId];saveBookmarks(next);return next;});},[saveBookmarks]);
  const addCustomTag=useCallback((tag)=>{if(!tag.trim())return;setCustomTags(prev=>{const next=[...prev,tag.trim()];saveTags(next);return next;});setNewTagInput("");setAddingTag(false);},[saveTags]);
  const removeCustomTag=useCallback((tag)=>{setCustomTags(prev=>{const next=prev.filter(t=>t!==tag);saveTags(next);return next;});setBookmarks(prev=>{const next=Object.fromEntries(Object.entries(prev).filter(([,v])=>v.tag!==tag));saveBookmarks(next);return next;});},[saveTags,saveBookmarks]);

  // ── ANNOTATIONS ───────────────────────────────────────────────────────────
  const saveAnnotation=useCallback((evId,text)=>{setAnnotations(prev=>{const next={...prev};if(text.trim()){next[evId]=text;}else{delete next[evId];}saveAnnotations(next);return next;});},[saveAnnotations]);

  // ── DESSIN ────────────────────────────────────────────────────────────────
  const redraw=useCallback(()=>{
    const cnv=canvasRef.current,mcnv=miniRef.current,wrap=wrapRef.current;
    if(!cnv||!wrap)return;
    const nextW=wrap.offsetWidth,nextH=wrap.offsetHeight;
    if(cnv.width!==nextW)cnv.width=nextW;
    if(cnv.height!==nextH)cnv.height=nextH;
    if(mcnv){if(mcnv.width!==200)mcnv.width=200;if(mcnv.height!==40)mcnv.height=40;}
    const s=S.current;
    // Appliquer filtre catégorie
    const filteredEvents=filterCat==="all"?s.aiEvents:s.aiEvents.filter(e=>e.cat===filterCat);
    // L'arbre de la vie a quitté le canvas : il vit dans son propre bloc sous la frise.
    const r=drawAll(cnv,mcnv,{vs:s.vs,ve:s.ve,aiEvents:filteredEvents,selectedId:s.selectedId,hoveredId:s.hoveredId,filterCat,expandedBands,linearScale,activeThemes,flatBands:[]});
    s.placed=r.placed;s.lineY=r.LINE_Y;s.periodY=r.PERIOD_Y;s.periodH=r.PERIOD_H;s.treeTop=r.TREE_TOP;s.bandRects=r.bandRects||[];s.chronoRects=r.chronoRects||[];
    const mid=makeCoord(s.vs,s.ve,cnv.width).toYa(cnv.width/2);
    const ep=epochAt(mid);
    setUi(u=>({...u,epochLabel:ep.label+"  ·  "+fmt(s.vs)+" → "+fmt(Math.max(s.ve,0.1)),range:`zoom ×${Math.pow(10,zoomLvl(s.vs,s.ve)).toFixed(0)}`}));
  },[filterCat]);

  const scheduleRedraw=useCallback(()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);rafRef.current=requestAnimationFrame(redraw);},[redraw]);

  // Re-dessiner quand les paramètres de dessin changent
  useEffect(()=>scheduleRedraw(),[filterCat,expandedBands,linearScale,activeThemes,scheduleRedraw]);

  const navigateToEpoch=useCallback((ep)=>{
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const s=S.current,targetVs=ep.from*1.05,targetVe=Math.max(ep.to*0.8,0.1);
    const startVs=s.vs,startVe=s.ve,steps=28;let step=0;
    // Synchroniser l'arbre du vivant sur le centre (ou le point focal) de la fenêtre visée.
    const centerYa=ep.focus??Math.pow(10,(L(ep.from)+L(Math.max(ep.to,0.1)))/2);
    setFocusYa(centerYa);
    const animate=()=>{step++;const t=step/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      const ls=L(startVs)+(L(targetVs)-L(startVs))*ease,le=L(startVe)+(L(targetVe)-L(startVe))*ease;
      s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);scheduleRedraw();
      if(step<steps)animRef.current=requestAnimationFrame(animate);};
    animRef.current=requestAnimationFrame(animate);
  },[scheduleRedraw]);

  // ── PARCOURS NARRATIFS ────────────────────────────────────────────────────
  const goStoryStep=useCallback((st,idx)=>{
    if(!st)return;
    const clamped=Math.max(0,Math.min(idx,st.steps.length-1));
    setStoryStep(clamped);
    const s=st.steps[clamped];
    navigateToEpoch({from:s.from,to:s.to,focus:s.focus});
  },[navigateToEpoch]);
  const startStory=useCallback((st)=>{setStoryMenu(false);setStory(st);setUi(u=>({...u,panelOpen:false}));setTimeout(()=>goStoryStep(st,0),60);},[goStoryStep]);
  const nextStory=useCallback(()=>{if(!story)return;if(storyStep>=story.steps.length-1){setStory(null);return;}goStoryStep(story,storyStep+1);},[story,storyStep,goStoryStep]);
  const prevStory=useCallback(()=>{if(story)goStoryStep(story,storyStep-1);},[story,storyStep,goStoryStep]);
  const shuffleStory=useCallback(()=>{startStory(randomStory(story?.id));},[startStory,story]);

  // ── FETCH ÉVÉNEMENTS IA ───────────────────────────────────────────────────
  const fetchZone=useCallback(async(startYa,endYa)=>{
    const s=S.current,key=`${L(startYa).toFixed(2)}_${L(Math.max(endYa,0.1)).toFixed(2)}`;
    if(s.fetchedZones.has(key))return;
    if(s.fetching){if(!s.fetchQueue.find(q=>q.key===key))s.fetchQueue.push({key,startYa,endYa});return;}
    s.fetching=true;s.fetchedZones.add(key);
    setUi(u=>({...u,aiVisible:true,aiLabel:`${fmt(startYa)} → ${fmt(Math.max(endYa,0.1))}`}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:900,messages:[{role:"user",content:buildPrompt(startYa,endYa)}]})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      const raw=(data.content||[]).find(b=>b.type==="text")?.text||"[]";
      const match=raw.match(/\[[\s\S]*?\]/);if(!match)throw new Error("no array");
      const evs=JSON.parse(match[0]);let added=0;
      for(const ev of evs){
        const ya=Number(ev.yearsAgo);if(!ev.title||isNaN(ya)||ya<0)continue;
        if(s.aiEvents.find(e=>Math.abs(L(e.yearsAgo)-L(ya))<0.02&&e.title===ev.title))continue;
        s.aiEvents.push({id:`ai_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,yearsAgo:ya,title:ev.title,date_label:ev.date_label||fmt(ya),desc:ev.desc||"",cat:ev.cat||"histoire",importance:3,minZoom:0,_zone:key});
        added++;
      }
      if(added>0){scheduleRedraw();saveAiEvents();}// Persistance immédiate
    }catch(e){console.warn("AI:",e);}
    finally{
      s.fetching=false;setTimeout(()=>setUi(u=>({...u,aiVisible:false})),700);
      if(s.fetchQueue.length>0){const n=s.fetchQueue.shift();if(!s.fetchedZones.has(n.key))setTimeout(()=>fetchZone(n.startYa,n.endYa),350);}
    }
  },[scheduleRedraw,saveAiEvents]);

  const triggerFetch=useCallback(()=>{
    clearTimeout(fetchDebRef.current);
    fetchDebRef.current=setTimeout(()=>{
      const s=S.current,ls=L(s.vs),le=L(Math.max(s.ve,0.1));
      // L'arbre suit le centre de la fenêtre une fois le déplacement stabilisé.
      setFocusYa(Math.pow(10,(ls+le)/2));
      fetchZone(s.vs,Math.max(s.ve,0.1));
      if(ls-le>0.7){const mid=Math.pow(10,(ls+le)/2);fetchZone(s.vs,mid);fetchZone(mid,Math.max(s.ve,0.1));}
    },800);
  },[fetchZone]);

  // ── FETCH FICHE RICHE ─────────────────────────────────────────────────────
  const fetchRich=useCallback(async(ev)=>{
    const s=S.current;
    if(STATIC_CONTENT[ev.id]){setUi(u=>({...u,panelContent:STATIC_CONTENT[ev.id],panelEventId:ev.id}));return;}
    if(s.panelCache[ev.id]){setUi(u=>({...u,panelContent:s.panelCache[ev.id],panelEventId:ev.id}));return;}
    setUi(u=>({...u,panelContent:"loading",panelError:null,panelEventId:ev.id}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:900,messages:[{role:"user",content:`Rédige une fiche encyclopédique engageante sur :
Événement : ${ev.title}
Date : ${ev.date_label}
Contexte : ${ev.desc}
En HTML simple (<p>,<h3>,<strong> uniquement). Sections : intro immersive (1§), <h3>Contexte</h3>(1§), <h3>Ce qui s'est passé</h3>(1§), <h3>Héritage</h3>(1§), <h3>Le saviez-vous ?</h3>(1§). ~280 mots. HTML direct, sans balises html/body.`}]})});
      if(!res.ok)throw new Error(`Erreur API ${res.status}`);
      const data=await res.json();
      const html=(data.content||[]).find(b=>b.type==="text")?.text||"<p>Indisponible.</p>";
      s.panelCache[ev.id]=html;
      setUi(u=>({...u,panelContent:html,panelError:null,panelEventId:ev.id}));
      saveCache();
    }catch(e){setUi(u=>({...u,panelContent:"<p>La fiche n'a pas pu être chargée.</p>",panelError:"IA indisponible. Réessayez en rouvrant la fiche.",panelEventId:ev.id}));}
  },[saveCache]);

  // ── FICHE PÉRIODE — génération IA ─────────────────────────────────────────
  const fetchPeriodRich=useCallback(async(item)=>{
    const cacheKey="period_"+item.label;
    const s=S.current;
    // Cache hit
    if(s.panelCache[cacheKey]){
      setUi(u=>({...u,panelContent:s.panelCache[cacheKey],panelEventId:cacheKey}));return;
    }
    // Données statiques en attendant l'IA
    const desc=PERIOD_DESCRIPTIONS[item.label]||{summary:"",highlights:[]};
    const staticHtml=`<p>${desc.summary}</p>`+(desc.highlights.length?`<h3>Points clés</h3><ul>${desc.highlights.map(h=>`<li>◆ ${h}</li>`).join("")}</ul>`:"");
    setUi(u=>({...u,panelContent:"loading",panelError:null,panelEventId:cacheKey}));
    try{
      const isEre=item.from>1e9;
      const prompt=`Tu es un expert en histoire naturelle et géologie. Rédige une fiche encyclopédique immersive sur ${isEre?"l'ère":"la période"} géologique du ${item.label} (${fmt(item.from)} → ${item.to>0?fmt(item.to):"aujourd'hui"}).
En HTML simple (<p>,<h3>,<strong>,<em> uniquement). Structure :
- Intro accrocheuse (1§)
- <h3>Caractéristiques</h3> : climat, géographie, océans (1§)
- <h3>Vie et évolution</h3> : espèces dominantes, grandes innovations biologiques (1§)
- <h3>Événements majeurs</h3> : extinctions, apparitions, bouleversements (liste à puces HTML)
- <h3>Héritage</h3> : ce que cette période a légué (1§)
- <h3>Chiffres clés</h3> : durée, températures, CO₂, niveau mers (liste)
~350 mots. HTML direct uniquement.`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:1100,messages:[{role:"user",content:prompt}]})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      const html=(data.content||[]).find(b=>b.type==="text")?.text||staticHtml;
      s.panelCache[cacheKey]=html;
      setUi(u=>({...u,panelContent:html,panelError:null,panelEventId:cacheKey}));
      saveCache();
    }catch(e){
      setUi(u=>({...u,panelContent:staticHtml,panelError:"Fiche IA indisponible — contenu de base affiché.",panelEventId:cacheKey}));
    }
  },[saveCache]);

  const openPeriodPanel=useCallback((item)=>{
    S.current.selectedId=null;scheduleRedraw();
    const isEre=item.from>1e9;
    setUi(u=>({...u,panelOpen:true,
      panelCat:isEre?"ÈRE GÉOLOGIQUE":"PÉRIODE GÉOLOGIQUE",
      panelCatColor:item.stripe||item.color||"#c8963c",
      panelDate:fmt(item.from)+" → "+(item.to>0?fmt(item.to):"aujourd'hui"),
      panelTitle:item.label,panelContent:"loading",panelError:null,
      tooltip:null,panelEventId:"period_"+item.label,showBookmarkMenu:false}));
    S.current._currentPanelEv={id:"period_"+item.label,title:item.label,date_label:fmt(item.from),yearsAgo:item.from,cat:"geologique"};
    fetchPeriodRich(item);
  },[scheduleRedraw,fetchPeriodRich]);

  const openPanel=useCallback((ev)=>{
    S.current._currentPanelEv=ev;scheduleRedraw();
    setFocusYa(ev.yearsAgo); // l'arbre se cale sur l'instant de l'événement
    setUi(u=>({...u,panelOpen:true,panelCat:ev.cat.toUpperCase(),panelCatColor:cc(ev.cat),panelDate:ev.date_label,panelTitle:ev.title,panelContent:"loading",panelError:null,tooltip:null,panelEventId:ev.id,showBookmarkMenu:false}));
    fetchRich(ev);
  },[scheduleRedraw,fetchRich]);

  const closePanel=useCallback(()=>{S.current.selectedId=null;scheduleRedraw();setUi(u=>({...u,panelOpen:false}));},[scheduleRedraw]);

  // ── RECHERCHE ─────────────────────────────────────────────────────────────
  const searchDebRef=useRef(null);
  const searchWithAI=useCallback(async(query)=>{
    if(!query.trim()){setUi(u=>({...u,searchResults:[],searchDone:false,searchLoading:false,searchError:null}));return;}
    const q=query.toLowerCase(),s=S.current;
    const local=[...ALL_EVENTS,...s.aiEvents].filter(ev=>ev.title.toLowerCase().includes(q)||ev.desc.toLowerCase().includes(q)||ev.date_label.toLowerCase().includes(q)||ev.cat.toLowerCase().includes(q)).slice(0,4);
    setUi(u=>({...u,searchResults:local,searchLoading:true,searchDone:false,searchError:null}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:1000,messages:[{role:"user",content:`Historien expert. Recherche: "${query}". Retourne UNIQUEMENT un JSON valide.\nMax 6 résultats: [{"yearsAgo":number,"title":"max 6 mots","date_label":"date lisible","desc":"1-2 phrases","cat":"cosmique|geologique|biologique|prehistoire|histoire","relevance":"4 mots"}]\nyearsAgo = années avant 2025 (ex: 1804 → 221). Si aucun événement, retourne [].`}]})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      const raw=(data.content||[]).find(b=>b.type==="text")?.text||"[]";
      const match=raw.match(/\[[\s\S]*?\]/);if(!match)throw new Error("no array");
      const aiResults=JSON.parse(match[0]);
      const merged=[...local];
      for(const r of aiResults){
        const ya=Number(r.yearsAgo);if(isNaN(ya)||ya<0)continue;
        if(!merged.find(e=>e.title.toLowerCase()===r.title.toLowerCase()))
          merged.push({id:`srch_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,yearsAgo:ya,title:r.title,date_label:r.date_label||"",desc:r.desc||"",cat:r.cat||"histoire",relevance:r.relevance,importance:2,minZoom:0,fromSearch:true});
      }
      setUi(u=>({...u,searchResults:merged.slice(0,8),searchLoading:false,searchDone:true,searchError:null}));
    }catch(e){setUi(u=>({...u,searchLoading:false,searchDone:true,searchError:"Recherche IA indisponible."}));}
  },[]);

  const handleSearch=useCallback((query)=>{
    setUi(u=>({...u,searchQuery:query,searchResults:[],searchDone:false,searchError:null}));
    clearTimeout(searchDebRef.current);
    if(!query.trim()){setUi(u=>({...u,searchLoading:false}));return;}
    searchDebRef.current=setTimeout(()=>searchWithAI(query),500);
  },[searchWithAI]);

  const goToResult=useCallback((ev)=>{
    const s=S.current;
    if(!ALL_EVENTS.find(e=>e.id===ev.id)&&!s.aiEvents.find(e=>e.id===ev.id)){s.aiEvents.push({...ev,importance:ev.importance||2,minZoom:0});}
    const targetYa=ev.yearsAgo,span=Math.max(targetYa*0.15,500);
    const targetVs=targetYa+span,targetVe=Math.max(targetYa-span,0.1);
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const startVs=s.vs,startVe=s.ve,steps=30;let step=0;
    const animate=()=>{step++;const t=step/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      const ls=L(startVs)+(L(targetVs)-L(startVs))*ease,le=L(startVe)+(L(targetVe)-L(startVe))*ease;
      s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);scheduleRedraw();
      if(step<steps)animRef.current=requestAnimationFrame(animate);
      else{setUi(u=>({...u,searchOpen:false,searchQuery:"",searchResults:[],searchDone:false}));openPanel(ev);triggerFetch();}};
    animRef.current=requestAnimationFrame(animate);
  },[scheduleRedraw,openPanel,triggerFetch]);

  const zoomAround=useCallback((pivotYa,factor)=>{
    const s=S.current,ns=pivotYa+(s.vs-pivotYa)*factor,ne=pivotYa+(s.ve-pivotYa)*factor;
    if(ns>UA*1.1||ne<0.05)return;if(L(ns)-L(Math.max(ne,0.1))<0.03)return;
    s.vs=Math.min(ns,UA*1.1);s.ve=Math.max(ne,0.05);
  },[]);

  const resetView=useCallback(()=>{S.current.vs=UA*1.04;S.current.ve=20;scheduleRedraw();triggerFetch();},[scheduleRedraw,triggerFetch]);

  const zoomFromCenter=useCallback((factor)=>{
    const s=S.current,W=canvasRef.current?.width||800;
    zoomAround(makeCoord(s.vs,s.ve,W).toYa(W/2),factor);scheduleRedraw();triggerFetch();
  },[scheduleRedraw,triggerFetch,zoomAround]);

  // ── VISITE GUIDÉE ─────────────────────────────────────────────────────────
  const goTourStep=useCallback((idx)=>{
    if(idx===null){setTourStep(null);return;}
    const step=TOUR_STEPS[idx];
    setTourStep(idx);
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const s=S.current,startVs=s.vs,startVe=s.ve,steps=30;let i=0;
    const animate=()=>{i++;const t=i/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      const ls=L(startVs)+(L(step.vs)-L(startVs))*ease,le=L(startVe)+(L(step.ve)-L(startVe))*ease;
      s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);scheduleRedraw();
      if(i<steps)animRef.current=requestAnimationFrame(animate);else triggerFetch();};
    animRef.current=requestAnimationFrame(animate);
  },[scheduleRedraw,triggerFetch]);

  // ── EXPORT IMAGE ──────────────────────────────────────────────────────────
  const exportImage=useCallback(()=>{
    const cnv=canvasRef.current;if(!cnv)return;
    const link=document.createElement("a");
    link.download=`chronos-${new Date().toISOString().slice(0,10)}.png`;
    link.href=cnv.toDataURL("image/png");
    link.click();
  },[]);

  // ── MINIMAP CLICK ─────────────────────────────────────────────────────────
  const onMinimapClick=useCallback((e)=>{
    const mini=miniRef.current;if(!mini)return;
    const rect=mini.getBoundingClientRect();
    const relX=(e.clientX-rect.left)/rect.width;
    const tls=Math.log10(UA),tle=0,tR=tls-tle;
    const clickLog=tls-(relX*tR);
    const clickYa=Math.pow(10,clickLog);
    // Centrer sur ce point
    const s=S.current;
    const halfSpan=(L(s.vs)-L(Math.max(s.ve,0.1)))/2;
    const newLs=clickLog+halfSpan,newLe=clickLog-halfSpan;
    s.vs=Math.pow(10,newLs);s.ve=Math.max(Math.pow(10,newLe),0.1);
    scheduleRedraw();triggerFetch();
  },[scheduleRedraw,triggerFetch]);

  // ── REFS STABLES ──────────────────────────────────────────────────────────
  const _op=useRef(null);_op.current=openPanel;
  const _opp=useRef(null);_opp.current=openPeriodPanel;
  const _cp=useRef(null);_cp.current=closePanel;
  const _sr=useRef(null);_sr.current=scheduleRedraw;
  const _tf=useRef(null);_tf.current=triggerFetch;
  const _za=useRef(null);_za.current=zoomAround;

  useEffect(()=>{
    const wrap=wrapRef.current,cnv=canvasRef.current;if(!wrap||!cnv)return;
    const onWheel=(e)=>{e.preventDefault();const rect=cnv.getBoundingClientRect();_za.current(makeCoord(S.current.vs,S.current.ve,cnv.width).toYa(e.clientX-rect.left),e.deltaY>0?1.13:.88);_sr.current();_tf.current();};
    let dragging=false;
    const onMD=()=>{dragging=true;wrap.style.cursor="grabbing";};
    const onMU=()=>{dragging=false;wrap.style.cursor="grab";};
    const onMM=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
      if(dragging){const s=S.current,lr=L(s.vs)-L(s.ve),sh=-(e.movementX/cnv.width)*lr,ls=L(s.vs)+sh,le=L(s.ve)+sh;if(ls>Math.log10(UA*1.1)||le<0)return;s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);_sr.current();_tf.current();return;}
      const s=S.current;let found=null;
      for(const p of s.placed)if(Math.abs(p.x-mx)<22&&Math.abs(s.lineY-my)<110){found=p.ev;break;}
      const nid=found?found.id:null;
      if(nid!==s.hoveredId){s.hoveredId=nid;wrap.style.cursor=found?"pointer":"grab";_sr.current();
        if(found){let tx=mx+16,ty=my-68;if(tx+220>cnv.width)tx=mx-226;if(ty<10)ty=my+20;setUi(u=>({...u,tooltip:{x:tx,y:ty,date:found.date_label,title:found.title}}));}
        else setUi(u=>({...u,tooltip:null}));}
    };
    const onClick=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,s=S.current;
      // Clic sur rectangle ChronoZoom — zoom animé à l'intérieur
      if (s.chronoRects) {
        const cRect=s.chronoRects.find(r=>mx>=r.rx&&mx<=r.rx+r.rw&&my>=r.ry&&my<=r.ry+r.rh);
        if(cRect){
          _cp.current();
          if(animRef.current)cancelAnimationFrame(animRef.current);
          const s2=S.current,targetVs=cRect.from*1.02,targetVe=Math.max(cRect.to*0.98,0.1);
          const startVs=s2.vs,startVe=s2.ve,steps=32;let step=0;
          const animate=()=>{step++;const t=step/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
            const ls=L(startVs)+(L(targetVs)-L(startVs))*ease,le=L(startVe)+(L(targetVe)-L(startVe))*ease;
            s2.vs=Math.pow(10,ls);s2.ve=Math.pow(10,le);_sr.current();
            if(step<steps)animRef.current=requestAnimationFrame(animate);else _tf.current();};
          animRef.current=requestAnimationFrame(animate);
          return;
        }
      }
      // Clic sur barre de l'arbre de vie — déplier/replier
      if (s.bandRects) {
        const band=s.bandRects.find(b=>b.hasKids&&mx>=b.rx&&mx<=b.rx+b.rw&&my>=b.ry&&my<=b.ry+b.rh);
        if(band){
          setExpandedBands(prev=>{const next=new Set(prev);next.has(band.id)?next.delete(band.id):next.add(band.id);return next;});
          return;
        }
      }
      for(const p of s.placed)if(Math.abs(p.x-mx)<22&&Math.abs(s.lineY-my)<110){_op.current(p.ev);return;}
      if(s.periodY!=null&&my>=s.periodY&&my<=s.periodY+(s.periodH||20)){const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);const per=PERIODS.find(p=>ya<=p.from&&ya>=p.to);if(per){_opp.current(per);return;}}
      if(s.periodY!=null&&my<s.periodY&&my>44){const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);const ep=EPOCHS.find(p=>ya<=p.from&&ya>=p.to);if(ep){_opp.current(ep);return;}}
      _cp.current();
    };
    let lt=null,ld=null;
    const onTS=(e)=>{if(e.touches.length===1)lt=e.touches[0].clientX;else if(e.touches.length===2)ld=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);};
    const onTM=(e)=>{e.preventDefault();const rect=cnv.getBoundingClientRect(),s=S.current;
      if(e.touches.length===1&&lt!==null){const dx=e.touches[0].clientX-lt;lt=e.touches[0].clientX;const lr=L(s.vs)-L(s.ve),sh=-(dx/cnv.width)*lr,ls=L(s.vs)+sh,le=L(s.ve)+sh;if(ls>Math.log10(UA*1.1)||le<0)return;s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);_sr.current();_tf.current();}
      else if(e.touches.length===2&&ld!==null){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const mx=(e.touches[0].clientX+e.touches[1].clientX)/2-rect.left;_za.current(makeCoord(s.vs,s.ve,cnv.width).toYa(mx),ld/d);ld=d;_sr.current();_tf.current();}};
    const onTE=()=>{lt=null;ld=null;};
    const onResize=()=>_sr.current();
    cnv.addEventListener("wheel",onWheel,{passive:false});cnv.addEventListener("mousedown",onMD);cnv.addEventListener("click",onClick);
    cnv.addEventListener("touchstart",onTS,{passive:false});cnv.addEventListener("touchmove",onTM,{passive:false});cnv.addEventListener("touchend",onTE);
    window.addEventListener("mousemove",onMM);window.addEventListener("mouseup",onMU);window.addEventListener("resize",onResize);
    _sr.current();_tf.current();
    return()=>{cnv.removeEventListener("wheel",onWheel);cnv.removeEventListener("mousedown",onMD);cnv.removeEventListener("click",onClick);cnv.removeEventListener("touchstart",onTS);cnv.removeEventListener("touchmove",onTM);cnv.removeEventListener("touchend",onTE);window.removeEventListener("mousemove",onMM);window.removeEventListener("mouseup",onMU);window.removeEventListener("resize",onResize);};
  },[]);

  // ── JSX ───────────────────────────────────────────────────────────────────
  const currentEv=S.current._currentPanelEv;

  return (
    <div style={css.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');
        .chronos-epochs button:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(28,25,23,.12)!important;border-color:rgba(28,25,23,.2)!important}
        @media (max-width:1024px){.chronos-epochs{grid-template-columns:repeat(3,1fr)!important}}
        @media (max-width:720px){.chronos-epochs{grid-template-columns:repeat(2,1fr)!important}}
        @keyframes dp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.5)}}
        @keyframes bw{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes floaty{0%,100%{transform:translateY(0);opacity:.7}50%{transform:translateY(4px);opacity:1}}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#d8d0c3;border-radius:999px}
        .srch-item:hover{background:#f5f0e8!important}
        button:active{opacity:.85}
        html{scroll-behavior:smooth}
        .chronos-explore button:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(23,20,18,.13)!important}
        @media (max-width:900px){
          .chronos-explore{grid-template-columns:repeat(3,1fr)!important}
        }
        @media (max-width:560px){
          .chronos-explore{grid-template-columns:repeat(2,1fr)!important}
        }`}
      </style>

      {/* ── BOUTON SIDEBAR ── */}
      <button onClick={()=>setSidebarOpen(o=>!o)} title={sidebarOpen?"Fermer":"Menu"}
        style={{position:"fixed",left:sidebarOpen?284:12,top:14,zIndex:400,width:30,height:30,borderRadius:7,background:"#fbfaf7",border:"1px solid rgba(23,20,18,.14)",boxShadow:"0 2px 8px rgba(23,20,18,.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"rgba(23,20,18,.6)",transition:"left .3s cubic-bezier(.16,1,.3,1)"}}>
        {sidebarOpen?"←":"☰"}
      </button>

      <div style={css.shell}>
        {/* Sidebar */}
        <div style={{position:"fixed",left:0,top:0,bottom:0,width:280,transform:sidebarOpen?"translateX(0)":"translateX(-280px)",transition:"transform .3s cubic-bezier(.16,1,.3,1)",zIndex:300,flexShrink:0}}>
          <Topbar ui={ui} setUi={setUi} handleSearch={handleSearch} goToResult={goToResult} navigateToEpoch={navigateToEpoch} resetView={resetView} isMobile={isMobile}/>
        </div>

        {/* Main */}
        <main style={{...css.main,marginLeft:sidebarOpen?280:0,transition:"margin-left .3s cubic-bezier(.16,1,.3,1)",width:sidebarOpen?"calc(100% - 280px)":"100%",flex:1}}>

          {/* ── HEADER — masqué en plein écran ── */}
          {!fullscreen&&(
            <header style={css.mainHeader}>
              <div>
                <div style={css.eyebrow}>Chronos · frise du vivant &amp; de l'univers</div>
                <h1 style={css.pageTitle}>Explorez librement le temps.</h1>
                <p style={css.pageSubtitle}>{ui.epochLabel}</p>
              </div>
              <div style={css.headerActions}>
                <button type="button" style={css.primaryAction} onClick={()=>setStoryMenu(m=>!m)}>✦ Parcours guidé</button>
                <button type="button" style={css.secondaryAction} onClick={resetView}>Vue globale</button>
                <button type="button" style={css.secondaryAction} onClick={()=>setUi(u=>({...u,legendOpen:!u.legendOpen,showBookmarksView:false}))}>Légende</button>
                <button type="button" style={css.secondaryAction} onClick={()=>setUi(u=>({...u,showBookmarksView:!u.showBookmarksView,legendOpen:false}))}>Signets</button>
              </div>
            </header>
          )}

          {/* ── MENU DES PARCOURS NARRATIFS ── */}
          {storyMenu&&!fullscreen&&(
            <div style={{margin:"4px 18px 0",padding:"14px 16px",borderRadius:16,border:"1px solid rgba(28,25,23,.12)",background:"#fffdf8",boxShadow:"0 12px 30px rgba(28,25,23,.08)"}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#1c1917"}}>Suivez un fil à travers le temps</div>
                  <div style={{fontSize:12,color:"rgba(28,25,23,.55)",marginTop:2}}>Une histoire vous emmène d'un événement à l'autre. L'exploration reste libre à tout moment.</div>
                </div>
                <button onClick={shuffleStory} style={{...css.primaryAction,whiteSpace:"nowrap"}}>🎲 Au hasard</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                {STORIES.map(st=>(
                  <button key={st.id} onClick={()=>startStory(st)}
                    style={{textAlign:"left",padding:"12px 14px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",
                      border:"1px solid rgba(28,25,23,.12)",background:"#fff",transition:"transform .15s, box-shadow .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 22px rgba(28,25,23,.1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#1c1917",marginBottom:3}}>{st.emoji} {st.title}</div>
                    <div style={{fontSize:11.5,lineHeight:1.5,color:"rgba(28,25,23,.55)"}}>{st.blurb}</div>
                    <div style={{fontSize:10,color:"#9a7b34",marginTop:6,fontWeight:600}}>{st.steps.length} étapes →</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── BULLES DES GRANDES ÉPOQUES — masquées en plein écran ── */}
          {!fullscreen&&(
            <>
              <div style={{padding:"10px 18px 0",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(28,25,23,.4)"}}>Naviguer par grande époque</div>
              <EpochBubbles navigateToEpoch={navigateToEpoch}/>
            </>
          )}

          {/* ── BARRE OUTILS FRISE ── */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 18px",background:"#f5f0e6",borderTop:"1px solid rgba(28,25,23,.08)",borderBottom:"1px solid rgba(28,25,23,.08)",flexWrap:"wrap",flexShrink:0}}>
            {/* Thèmes civilisations */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:9,color:"rgba(28,25,23,.45)",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600,flexShrink:0}}>Couches :</span>
              {Object.entries(THEMES).map(([key,theme])=>(
                <button key={key} onClick={()=>setActiveThemes(prev=>{const next=new Set(prev);next.has(key)?next.delete(key):next.add(key);return next;})}
                  style={{padding:"3px 9px",borderRadius:10,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                    border:`1px solid ${theme.color}${activeThemes.has(key)?"":"44"}`,
                    background:activeThemes.has(key)?`${theme.color}22`:"transparent",
                    color:activeThemes.has(key)?theme.color:"rgba(28,25,23,.5)",
                    transition:"all .15s",whiteSpace:"nowrap"}}>
                  {theme.icon} {theme.label.split(" ")[0]}
                </button>
              ))}
            </div>
            <div style={{width:1,background:"rgba(28,25,23,.1)",alignSelf:"stretch",flexShrink:0}}/>
            {/* Filtres catégories événements */}
            <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap"}}>
              {CATS.map(c=>(
                <button key={c.id} onClick={()=>setFilterCat(c.id)}
                  style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                    border:`1px solid ${c.id==="all"?"rgba(28,25,23,.22)":c.color+"66"}`,
                    background:filterCat===c.id?(c.id==="all"?"#1f1c17":c.color):"transparent",
                    color:filterCat===c.id?"#fff":(c.id==="all"?"rgba(28,25,23,.55)":c.color),
                    transition:"all .15s"}}>
                  {c.label}
                </button>
              ))}
            </div>
            {/* Actions droite */}
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {/* Visite guidée */}
              <button onClick={()=>goTourStep(tourStep===null?0:null)}
                style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"1px solid rgba(185,130,47,.4)",background:tourStep!==null?"rgba(185,130,47,.15)":"transparent",color:"#7a4b12"}}>
                {tourStep!==null?`🎯 Étape ${tourStep+1}/${TOUR_STEPS.length}`:"🎯 Visite guidée"}
              </button>
              {/* Échelle réelle */}
              <button onClick={()=>{setLinearScale(l=>!l);}}
                style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${linearScale?"#0369a1":"rgba(23,20,18,.15)"}`,background:linearScale?"rgba(3,105,161,.12)":"transparent",color:linearScale?"#0369a1":"rgba(23,20,18,.6)"}}>
                {linearScale?"📏 Échelle réelle ✓":"📏 Échelle réelle"}
              </button>
              {/* Plein écran */}
              <button onClick={()=>setFullscreen(f=>!f)}
                style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"1px solid rgba(23,20,18,.15)",background:fullscreen?"#12100e":"transparent",color:fullscreen?"#fff":"rgba(23,20,18,.6)"}}>
                {fullscreen?"⊡ Normal":"⊞ Plein écran"}
              </button>
              {/* Export */}
              <button onClick={exportImage}
                style={{padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"1px solid rgba(23,20,18,.15)",background:"transparent",color:"rgba(23,20,18,.6)"}}>
                ↓ Image
              </button>
            </div>
          </div>

          {/* ── VISITE GUIDÉE — bandeau ── */}
          {tourStep!==null&&(
            <div style={{background:"#fff7e8",borderBottom:"1px solid rgba(185,130,47,.2)",padding:"8px 18px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <div style={{flex:1}}>
                <strong style={{fontFamily:"Georgia,serif",fontSize:14,color:"#7a4b12"}}>{TOUR_STEPS[tourStep].label}</strong>
                <span style={{fontSize:12,color:"rgba(122,75,18,.7)",marginLeft:10}}>{TOUR_STEPS[tourStep].desc}</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>goTourStep(tourStep>0?tourStep-1:null)} disabled={tourStep===0}
                  style={{padding:"4px 12px",borderRadius:7,border:"1px solid rgba(185,130,47,.3)",background:"transparent",color:"#7a4b12",cursor:"pointer",fontFamily:"inherit",fontSize:11,opacity:tourStep===0?.4:1}}>← Préc.</button>
                <button onClick={()=>goTourStep(tourStep<TOUR_STEPS.length-1?tourStep+1:null)}
                  style={{padding:"4px 12px",borderRadius:7,border:"none",background:"#b9822f",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11}}>
                  {tourStep<TOUR_STEPS.length-1?"Suiv. →":"✓ Fin"}
                </button>
              </div>
            </div>
          )}

          {/* ── LÉGENDE PERMANENTE ── */}
          {showLegendBar&&!fullscreen&&(
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"5px 18px",background:"#faf7f2",borderBottom:"1px solid rgba(23,20,18,.06)",flexShrink:0,flexWrap:"wrap"}}>
              <span style={{fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(23,20,18,.35)",fontWeight:600}}>Légende :</span>
              {Object.entries({cosmique:"#5a3db8",geologique:"#0868a8",biologique:"#0a7848",prehistoire:"#b03010",histoire:"#8a6000"}).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:v}}/>
                  <span style={{fontSize:10,color:"rgba(23,20,18,.55)",textTransform:"capitalize"}}>{k}</span>
                </div>
              ))}
              <span style={{marginLeft:"auto",fontSize:9,color:"rgba(23,20,18,.3)"}}>● Majeur &nbsp; ◦ Notable &nbsp; · Contextuel</span>
              <button onClick={()=>setShowLegendBar(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"rgba(23,20,18,.3)"}}>✕</button>
            </div>
          )}

          {/* ── FRISE ── */}
          <section id="frise-chronologique" style={{...css.timelineCard,height:fullscreen?"calc(100vh - 88px)":"76vh",minHeight:fullscreen?400:520,margin:fullscreen?"0":"0 18px 18px",borderRadius:fullscreen?0:12,border:fullscreen?"none":"1px solid rgba(23,20,18,.10)",boxShadow:fullscreen?"none":"0 18px 50px rgba(12,10,26,.16)",flexShrink:0}}>
            {/* Toolbar frise */}
            <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 12px",background:"rgba(250,247,242,.95)",borderBottom:"1px solid rgba(23,20,18,.07)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={css.metaLabel}>Navigation</span>
                <span style={css.metaValue}>{ui.range||"zoom ×1"}</span>
                <span style={{fontSize:11,color:"rgba(23,20,18,.35)",fontStyle:"italic"}}>{ui.epochLabel}</span>
              </div>
              <span style={{fontSize:10,color:"rgba(23,20,18,.32)",display:isMobile?"none":"block"}}>
                Molette = zoom · Drag = déplacer · Clic = fiche
              </span>
            </div>

            <div ref={wrapRef} style={css.wrap}>
              <canvas ref={canvasRef} style={css.cnv} aria-label="Frise chronologique interactive"/>
              <Legend open={ui.legendOpen}/>
              <ZoomControls onZoomIn={()=>zoomFromCenter(.72)} onZoomOut={()=>zoomFromCenter(1.38)}/>

              {/* Minimap cliquable — plus grande */}
              <div style={{position:"absolute",bottom:10,right:10,width:200,height:40,background:"#eee8dc",border:"1px solid rgba(23,20,18,.12)",borderRadius:6,overflow:"hidden",zIndex:20,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}
                onClick={onMinimapClick} title="Cliquer pour naviguer">
                <canvas ref={miniRef} aria-hidden="true"/>
                <div style={{position:"absolute",bottom:2,left:4,fontSize:7,color:"rgba(23,20,18,.4)",letterSpacing:".06em"}}>MINIMAP — cliquer pour naviguer</div>
              </div>

              <TimelineTooltip tooltip={ui.tooltip}/>

              {/* Lecteur de parcours narratif */}
              {story&&(
                <NarrativeBar story={story} index={storyStep}
                  onPrev={prevStory} onNext={nextStory}
                  onExit={()=>setStory(null)} onShuffle={shuffleStory}/>
              )}

              <BookmarksPanel open={ui.showBookmarksView} bookmarks={bookmarks} customTags={customTags} addingTag={addingTag} newTagInput={newTagInput} setUi={setUi} setAddingTag={setAddingTag} setNewTagInput={setNewTagInput} addCustomTag={addCustomTag} removeCustomTag={removeCustomTag} removeBookmark={removeBookmark} goToResult={goToResult} stateRef={S}/>

              {/* EventPanel avec annotations */}
              <aside style={css.panel(ui.panelOpen)}>
                <div style={css.panelStripe(ui.panelCatColor)}/>
                <div style={css.panelHdr}>
                  <button style={css.panelClose} onClick={closePanel}>✕</button>
                  <div style={{...css.panelCat,color:ui.panelCatColor}}>{ui.panelCat}</div>
                  <div style={css.panelDate}>{ui.panelDate}</div>
                  <div style={css.panelTitle}>{ui.panelTitle}</div>
                </div>
                {ui.panelError&&<div style={css.panelError}>{ui.panelError}</div>}
                {/* Signets */}
                {ui.panelEventId&&(
                  <div style={css.bmBar}>
                    <span style={{fontSize:11,color:"rgba(23,20,18,.45)",marginRight:2}}>Signet :</span>
                    {customTags.map((tag,i)=>{
                      const tagColors=["#c8963c","#0868a8","#0a7848","#b03010","#7a5fa5"];
                      const col=tagColors[i%5];
                      const active=currentEv&&bookmarks[currentEv.id]?.tag===tag;
                      return <button key={tag} style={css.bmBtn(active,col)} onClick={()=>{if(currentEv)toggleBookmark(currentEv,tag);}}>{active?"✓ ":""}{tag}</button>;
                    })}
                    {addingTag?(
                      <div style={{display:"flex",gap:3,alignItems:"center"}}>
                        <input autoFocus value={newTagInput} onChange={e=>setNewTagInput(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")addCustomTag(newTagInput);if(e.key==="Escape"){setAddingTag(false);setNewTagInput("");}}}
                          style={{width:80,height:24,border:"1px solid rgba(23,20,18,.2)",borderRadius:5,padding:"0 6px",fontSize:11,outline:"none"}} placeholder="Nom..."/>
                        <button style={{...css.panelClose,position:"static"}} onClick={()=>addCustomTag(newTagInput)}>✓</button>
                      </div>
                    ):(
                      <button style={{...css.bmBtn(false,"rgba(23,20,18,.3)"),borderStyle:"dashed"}} onClick={()=>setAddingTag(true)}>+ Tag</button>
                    )}
                  </div>
                )}
                <div style={css.panelBody}>
                  {ui.panelContent==="loading"?(
                    <div style={css.loading}>
                      <div style={css.bars}>{[7,14,20,14,7].map((h,i)=><span key={i} style={{width:3,height:h,borderRadius:2,background:"#c8963c",animation:`bw 1s ${i*.15}s ease-in-out infinite`,display:"inline-block"}}/>)}</div>
                      <div style={css.barsLbl}>Génération de la fiche IA…</div>
                    </div>
                  ):(
                    <>
                      <div style={css.panelContent} dangerouslySetInnerHTML={{__html:ui.panelContent||""}}/>
                      {/* ── ANNOTATION PERSONNELLE ── */}
                      {ui.panelEventId&&(
                        <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid rgba(23,20,18,.08)"}}>
                          <div style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(23,20,18,.38)",marginBottom:8,fontWeight:600}}>
                            ✏️ Ma note personnelle
                          </div>
                          {annotTarget===ui.panelEventId?(
                            <div>
                              <textarea value={annotInput} onChange={e=>setAnnotInput(e.target.value)}
                                placeholder="Ajoute ta propre note, réflexion, lien..."
                                style={{width:"100%",minHeight:80,border:"1px solid rgba(23,20,18,.18)",borderRadius:8,padding:"8px 10px",fontSize:13,fontFamily:"inherit",color:"#12100e",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
                              <div style={{display:"flex",gap:8,marginTop:6}}>
                                <button onClick={()=>{saveAnnotation(ui.panelEventId,annotInput);setAnnotTarget(null);}}
                                  style={{padding:"5px 14px",borderRadius:7,border:"none",background:"#0a7848",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Sauvegarder</button>
                                <button onClick={()=>setAnnotTarget(null)}
                                  style={{padding:"5px 14px",borderRadius:7,border:"1px solid rgba(23,20,18,.15)",background:"transparent",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
                              </div>
                            </div>
                          ):(
                            <div onClick={()=>{setAnnotTarget(ui.panelEventId);setAnnotInput(annotations[ui.panelEventId]||"");}}
                              style={{padding:"8px 12px",borderRadius:8,border:"1px dashed rgba(23,20,18,.15)",cursor:"pointer",minHeight:40,fontSize:13,color:annotations[ui.panelEventId]?"#12100e":"rgba(23,20,18,.35)",background:"rgba(23,20,18,.02)",lineHeight:1.6}}>
                              {annotations[ui.panelEventId]||"Cliquer pour ajouter une note…"}
                            </div>
                          )}
                        </div>
                      )}
                      {/* ── LIEN VERS L'ARBRE ── */}
                      {ui.panelEventId&&currentEv?.cat==="biologique"&&(
                        <div style={{marginTop:16,padding:"10px 14px",borderRadius:8,background:"rgba(10,120,72,.06)",border:"1px solid rgba(10,120,72,.15)"}}>
                          <div style={{fontSize:11,color:"#0a7848",fontWeight:600,marginBottom:4}}>🌿 Voir dans l'Arbre de la vie</div>
                          <div style={{fontSize:12,color:"rgba(23,20,18,.55)"}}>Cet événement est lié à l'évolution du vivant.</div>
                          <button onClick={()=>{closePanel();setTimeout(()=>{const tree=document.getElementById("arbre-de-vie");if(tree)tree.scrollIntoView({behavior:"smooth",block:"start"});},200);}}
                            style={{marginTop:8,padding:"4px 12px",borderRadius:7,border:"1px solid rgba(10,120,72,.3)",background:"transparent",color:"#0a7848",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                            ↓ Aller à l'arbre de vie
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </aside>
            </div>
          </section>

          {/* ── PONT FRISE → ARBRE DE LA VIE ── */}
          {!fullscreen&&(
            <button
              onClick={()=>{const t=document.getElementById("arbre-de-vie");if(t)t.scrollIntoView({behavior:"smooth",block:"start"});}}
              style={{
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,
                width:"100%",border:"none",cursor:"pointer",fontFamily:"inherit",
                padding:"22px 18px 24px",
                background:"linear-gradient(180deg, #f3ecdd 0%, #f7f2e8 45%, #ffffff 100%)",
                color:"#1c1917",
              }}>
              <span style={{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(28,25,23,.45)"}}>
                La même échelle du temps, déployée
              </span>
              <span style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:23,color:"#1c1917"}}>
                🌿 L'arbre de la vie
              </span>
              <span style={{fontSize:12,color:"rgba(28,25,23,.6)"}}>
                Chaque espèce renvoie à son époque sur la frise ↑&nbsp;&nbsp;·&nbsp;&nbsp;cliquer pour explorer ↓
              </span>
              <span style={{fontSize:18,color:"#9a7b34",marginTop:2,animation:"floaty 1.8s ease-in-out infinite"}}>⌄</span>
            </button>
          )}

          {/* ── ARBRE DE LA VIE ── */}
          {!fullscreen&&(
            <div id="arbre-de-vie">
              <LifeTree onFocusTimeline={navigateToEpoch} focusYa={focusYa} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
