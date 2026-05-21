// styles.js — all CSS-in-JS styles for Chronos Atlas

export const css = {
  // ── LAYOUT ──────────────────────────────────────────────────────────────────
  app:{display:"flex",flexDirection:"column",height:"100vh",background:"#faf7f2",fontFamily:"'DM Mono',monospace",overflow:"hidden"},
  shell:{display:"grid",gridTemplateColumns:"320px minmax(0,1fr)",height:"100vh",overflow:"hidden"},
  sidebar:{display:"flex",flexDirection:"column",background:"#faf7f2",borderRight:"1px solid rgba(18,16,14,.10)",overflowY:"auto",height:"100vh"},
  sidebarMobile:{position:"relative",height:"auto"},
  sidebarHeader:{padding:"22px 22px 14px",borderBottom:"1px solid rgba(18,16,14,.07)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10},
  sidebarSection:{padding:"16px 22px 10px",borderBottom:"1px solid rgba(18,16,14,.06)"},
  sidebarFooter:{padding:"14px 22px",display:"flex",gap:8,marginTop:"auto"},
  main:{display:"flex",flexDirection:"column",overflowY:"auto",background:"#f5f0e7",padding:"22px 28px 0"},
  mainHeader:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:20,flexWrap:"wrap"},
  headerActions:{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap"},
  timelineCard:{background:"#faf7f2",borderRadius:12,border:"1px solid rgba(18,16,14,.10)",overflow:"hidden",marginBottom:0,flex:1,display:"flex",flexDirection:"column"},
  timelineToolbar:{padding:"10px 16px",borderBottom:"1px solid rgba(18,16,14,.07)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12},
  wrap:{flex:1,position:"relative",overflow:"hidden",cursor:"grab",minHeight:320},
  cnv:{position:"absolute",top:0,left:0},
  mini:{position:"absolute",bottom:42,right:10,width:160,height:28,background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",borderRadius:4,overflow:"hidden",zIndex:20},

  // ── BRAND ───────────────────────────────────────────────────────────────────
  brandBlock:{display:"flex",flexDirection:"column",gap:3},
  brand:{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#12100e"},
  brandSub:{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#c8963c",letterSpacing:".1em",marginLeft:4},
  brandLine:{fontSize:11,color:"rgba(18,16,14,.45)",lineHeight:1.4},
  sectionTitle:{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(18,16,14,.38)",fontWeight:500,marginBottom:10},

  // ── PAGE HEADER ─────────────────────────────────────────────────────────────
  eyebrow:{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#c8963c",marginBottom:6,fontWeight:500},
  pageTitle:{fontFamily:"Georgia,serif",fontSize:40,fontWeight:400,color:"#12100e",lineHeight:1.1,margin:"0 0 10px"},
  pageSubtitle:{fontSize:13,color:"rgba(18,16,14,.55)",fontStyle:"italic",margin:0},
  metaLabel:{fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(18,16,14,.35)"},
  metaValue:{fontSize:11,color:"#12100e",fontWeight:500},
  timelineMeta:{display:"flex",flexDirection:"column",gap:2},
  toolbarHint:{fontSize:11,color:"rgba(18,16,14,.42)",fontStyle:"italic"},

  // ── BUTTONS ─────────────────────────────────────────────────────────────────
  primaryAction:{padding:"9px 18px",borderRadius:8,background:"#12100e",color:"#faf7f2",border:"none",fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:".06em",cursor:"pointer",transition:"all .2s"},
  secondaryAction:{padding:"9px 16px",borderRadius:8,background:"transparent",color:"#12100e",border:"1px solid rgba(18,16,14,.18)",fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:".06em",cursor:"pointer",transition:"all .2s"},
  compactButton:{padding:"6px 12px",borderRadius:6,background:"transparent",color:"rgba(18,16,14,.5)",border:"1px solid rgba(18,16,14,.14)",fontFamily:"'DM Mono',monospace",fontSize:10,cursor:"pointer"},
  sidebarAction:{flex:1,padding:"9px 0",borderRadius:8,background:"#f0ebe0",color:"#12100e",border:"1px solid rgba(18,16,14,.12)",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer",transition:"all .2s"},
  inlineConfirmButton:{width:26,height:26,borderRadius:"50%",background:"#0a7848",color:"#fff",border:"none",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"},
  inlineIconButton:{width:18,height:18,borderRadius:"50%",background:"none",color:"rgba(18,16,14,.4)",border:"none",cursor:"pointer",fontSize:13,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center"},
  addTagButton:{padding:"2px 10px",borderRadius:10,border:"1px dashed rgba(18,16,14,.22)",fontSize:11,color:"rgba(18,16,14,.5)",cursor:"pointer",background:"transparent",fontFamily:"'DM Mono',monospace"},

  // ── EPOCHS + PERIODS ────────────────────────────────────────────────────────
  epochGrid:{display:"flex",flexDirection:"column",gap:4},
  epochButton:(ep)=>({display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:`1px solid ${ep.stripe}33`,background:ep.pillBg,color:ep.pillText,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer",transition:"all .15s",textAlign:"left",width:"100%"}),
  epochDot:(c)=>({width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}),
  periodGrid:{display:"flex",flexWrap:"wrap",gap:5},
  periodPill:(per)=>({padding:"4px 10px",borderRadius:12,fontSize:10,fontWeight:500,cursor:"pointer",border:`1px solid ${per.color}88`,background:per.color+"22",color:per.textColor==="#fff"?"#333":per.textColor||"#333",whiteSpace:"nowrap",transition:"all .15s",fontFamily:"'DM Mono',monospace"}),
  pills:{display:"flex",gap:4,overflowX:"auto",flex:1,scrollbarWidth:"none"},
  pill:(ep)=>({flexShrink:0,padding:"3px 9px",borderRadius:14,fontSize:9,letterSpacing:".07em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",border:`1.5px solid ${ep.stripe}55`,background:ep.pillBg,color:ep.pillText,whiteSpace:"nowrap",transition:"all .15s"}),

  // ── EXPLORE CARDS ───────────────────────────────────────────────────────────
  exploreGrid:{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10,marginBottom:16},
  exploreCard:(card)=>({display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,background:card.bg,border:`1px solid ${card.color}22`,cursor:"pointer",textAlign:"left",transition:"all .18s",width:"100%",fontFamily:"'DM Mono',monospace"}),
  exploreIcon:(color)=>({width:32,height:32,borderRadius:8,background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,flexShrink:0}),
  exploreContent:{display:"flex",flexDirection:"column",gap:1,minWidth:0},
  exploreKicker:{fontSize:9,color:"rgba(18,16,14,.45)",letterSpacing:".06em"},
  exploreTitle:{fontSize:13,fontWeight:600,color:"#12100e",fontFamily:"Georgia,serif"},
  exploreText:{fontSize:10,color:"rgba(18,16,14,.55)",lineHeight:1.4},

  // ── ZOOM ────────────────────────────────────────────────────────────────────
  zoomBtns:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:5,zIndex:20},
  zoomBtn:{width:30,height:30,borderRadius:7,background:"#faf7f2",border:"1px solid rgba(18,16,14,.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300,color:"#12100e",boxShadow:"0 1px 5px rgba(18,16,14,.08)"},

  // ── STATUS BAR ──────────────────────────────────────────────────────────────
  statusbar:{padding:"8px 16px",background:"#faf7f2",borderTop:"1px solid rgba(18,16,14,.09)",display:"flex",alignItems:"center",gap:14,flexShrink:0},
  statusEpoch:{fontFamily:"Georgia,serif",fontSize:12,fontStyle:"italic",color:"#12100e",flex:1},
  aiBadge:(v)=>({display:"flex",alignItems:"center",gap:5,padding:"2px 8px",borderRadius:10,background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",fontSize:9,letterSpacing:".1em",opacity:v?1:0,transition:"opacity .3s"}),
  aiDot:{width:5,height:5,borderRadius:"50%",background:"#c8963c",animation:"dp 1.2s ease-in-out infinite"},
  statusR:{fontSize:9,color:"rgba(18,16,14,.3)"},

  // ── TOOLTIP ─────────────────────────────────────────────────────────────────
  tt:(t)=>({position:"absolute",left:t.x,top:t.y,pointerEvents:"none",zIndex:50,background:"#12100e",color:"#faf7f2",borderRadius:7,padding:"8px 12px",maxWidth:210,boxShadow:"0 4px 18px rgba(0,0,0,.25)"}),
  ttDate:{fontSize:8,color:"#c8963c",letterSpacing:".1em",marginBottom:3},
  ttTitle:{fontFamily:"Georgia,serif",fontSize:13,lineHeight:1.3},
  ttHint:{fontSize:8,color:"rgba(250,247,242,.3)",marginTop:4},

  // ── EVENT PANEL ─────────────────────────────────────────────────────────────
  panel:(o)=>({position:"absolute",right:0,top:0,bottom:0,width:"min(460px, 92vw)",background:"#faf7f2",borderLeft:"1px solid rgba(18,16,14,.1)",transform:o?"translateX(0)":"translateX(100%)",transition:"transform .34s cubic-bezier(.16,1,.3,1)",display:"flex",flexDirection:"column",zIndex:40,boxShadow:"-4px 0 18px rgba(18,16,14,.07)"}),
  panelStripe:(c)=>({height:4,flexShrink:0,background:c}),
  panelHdr:{padding:"20px 24px 16px",borderBottom:"1px solid rgba(18,16,14,.07)",flexShrink:0,position:"relative"},
  panelClose:{position:"absolute",top:10,right:12,width:24,height:24,borderRadius:"50%",background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",color:"#12100e"},
  panelCat:{fontSize:8,letterSpacing:".18em",textTransform:"uppercase",fontWeight:500,marginBottom:3,opacity:.7},
  panelDate:{fontSize:9,color:"#c8963c",marginBottom:6},
  panelTitle:{fontFamily:"Georgia,serif",fontSize:26,lineHeight:1.2,color:"#12100e"},
  panelBody:{flex:1,overflowY:"auto",padding:"22px 26px",scrollbarWidth:"thin",scrollbarColor:"#e0d9cc transparent"},
  panelContent:{fontFamily:"Georgia,serif",fontSize:17,lineHeight:1.75,color:"#12100e"},
  panelError:{padding:"10px 18px",background:"#fff0f0",color:"#c02828",fontSize:12,borderBottom:"1px solid #fcc"},
  loading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:160,gap:12},
  bars:{display:"flex",gap:4,alignItems:"flex-end",height:20},
  barsLbl:{fontSize:9,letterSpacing:".14em",color:"rgba(18,16,14,.35)",textTransform:"uppercase"},

  // ── LEGEND ──────────────────────────────────────────────────────────────────
  legend:(o)=>({position:"absolute",left:0,top:0,bottom:0,width:240,background:"#faf7f2",borderRight:"1px solid rgba(18,16,14,.09)",transform:o?"translateX(0)":"translateX(-100%)",transition:"transform .3s cubic-bezier(.16,1,.3,1)",overflowY:"auto",padding:18,zIndex:35,boxShadow:"4px 0 14px rgba(18,16,14,.05)"}),
  legHead:{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(18,16,14,.38)",fontWeight:500,marginBottom:9},
  legItem:{display:"flex",alignItems:"center",gap:7,marginBottom:5},
  legDot:(c)=>({width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}),
  legBar:(c)=>({width:12,height:5,borderRadius:2,background:c,flexShrink:0}),
  legLbl:{fontSize:12,color:"#12100e"},

  // ── SEARCH ──────────────────────────────────────────────────────────────────
  searchWrap:{position:"relative"},
  searchInput:{height:36,width:"100%",borderRadius:8,border:"1px solid rgba(18,16,14,.18)",background:"#fffaf3",padding:"0 34px 0 32px",fontSize:13,fontFamily:"'DM Mono',monospace",color:"#12100e",outline:"none",transition:"all .2s",boxSizing:"border-box"},
  searchIcon:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"rgba(18,16,14,.35)",pointerEvents:"none"},
  searchClear:{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"rgba(18,16,14,.4)",cursor:"pointer",background:"none",border:"none",padding:0,lineHeight:1},
  searchDropdown:{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#faf7f2",border:"1px solid rgba(18,16,14,.14)",borderRadius:8,boxShadow:"0 8px 32px rgba(18,16,14,.12)",zIndex:100,overflow:"hidden"},
  searchHeader:{padding:"8px 12px 6px",borderBottom:"1px solid rgba(18,16,14,.07)",display:"flex",alignItems:"center",gap:6},
  searchHeaderTxt:{fontSize:9,color:"rgba(18,16,14,.35)",letterSpacing:".1em",textTransform:"uppercase",flex:1},
  searchSpinner:{width:10,height:10,borderRadius:"50%",border:"1.5px solid rgba(18,16,14,.15)",borderTop:"1.5px solid #c8963c",animation:"spin .7s linear infinite"},
  searchItem:{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid rgba(18,16,14,.05)",transition:"background .12s",width:"100%",border:0,background:"transparent",fontFamily:"'DM Mono',monospace",textAlign:"left"},
  searchDot:(c)=>({width:9,height:9,borderRadius:"50%",background:c,flexShrink:0,marginTop:4}),
  searchItemInfo:{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:2},
  searchItemTitle:{fontSize:14,fontWeight:500,color:"#12100e",fontFamily:"Georgia,serif"},
  searchItemDate:{fontSize:11,color:"#b17a25"},
  searchItemDesc:{fontSize:12,color:"rgba(18,16,14,.62)",lineHeight:1.45,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},
  searchItemRel:{fontSize:10,color:"rgba(18,16,14,.38)",fontStyle:"italic"},
  searchItemNav:{fontSize:12,color:"rgba(18,16,14,.3)",flexShrink:0,marginTop:2},
  searchEmpty:{padding:"22px 14px",textAlign:"center",fontSize:12,color:"rgba(18,16,14,.42)"},
  searchAiBadge:{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:10,background:"rgba(200,150,60,.1)",border:"1px solid rgba(200,150,60,.2)",fontSize:9,color:"#c8963c",letterSpacing:".08em"},
  searchError:{padding:"8px 14px",background:"#fff0f0",color:"#c02828",fontSize:11},

  // ── BOOKMARKS ───────────────────────────────────────────────────────────────
  bmBar:{display:"flex",alignItems:"center",gap:6,padding:"10px 20px 8px",borderBottom:"1px solid rgba(18,16,14,.06)",flexShrink:0,flexWrap:"wrap"},
  bmBtn:(active,col)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:12,fontSize:10,letterSpacing:".08em",fontWeight:500,cursor:"pointer",border:`1.5px solid ${col||"rgba(18,16,14,.2)"}`,background:active?`${col||"#c8963c"}18`:"transparent",color:active?(col||"#c8963c"):"rgba(18,16,14,.5)",transition:"all .15s",whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace"}),
  bmViewPanel:{position:"absolute",left:0,top:0,bottom:0,width:310,background:"#faf7f2",borderRight:"1px solid rgba(18,16,14,.1)",display:"flex",flexDirection:"column",zIndex:38,boxShadow:"4px 0 16px rgba(18,16,14,.06)"},
  bmViewItem:{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 16px",borderBottom:"1px solid rgba(18,16,14,.05)",cursor:"pointer",transition:"background .12s",width:"100%",border:0,background:"transparent",textAlign:"left"},
  bmTag:(col)=>({display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:8,fontSize:9,letterSpacing:".08em",border:`1px solid ${col}44`,background:`${col}12`,color:col,flexShrink:0,marginTop:1}),
};
