// ── CHRONOS — Design épuré, blanc pur, style OneZoom ─────────────────────────

export const css = {
  // ── APP ───────────────────────────────────────────────────────────────────
  app:{
    height:"100vh",
    background:"#ffffff",
    color:"#111",
    fontFamily:"-apple-system,'Helvetica Neue',Arial,sans-serif",
    display:"flex",
    flexDirection:"column",
    overflow:"hidden",
  },

  // ── TOPBAR MINIMALISTE ────────────────────────────────────────────────────
  topbar:{
    height:48,
    borderBottom:"1px solid #e8e8e8",
    display:"flex",
    alignItems:"center",
    padding:"0 20px",
    gap:20,
    background:"#fff",
    flexShrink:0,
    zIndex:100,
  },
  brand:{
    fontFamily:"Georgia,serif",
    fontSize:18,
    fontWeight:700,
    color:"#111",
    letterSpacing:"-0.02em",
    flexShrink:0,
  },
  brandSub:{
    fontSize:9,
    color:"#999",
    letterSpacing:".12em",
    marginLeft:4,
    fontFamily:"-apple-system,sans-serif",
  },

  // ── CARTES ACCÈS RAPIDE ───────────────────────────────────────────────────
  cardsRow:{
    display:"grid",
    gridTemplateColumns:"repeat(6,1fr)",
    gap:0,
    borderBottom:"1px solid #e8e8e8",
    flexShrink:0,
  },
  card:(active,color)=>({
    padding:"10px 14px",
    cursor:"pointer",
    borderRight:"1px solid #e8e8e8",
    background: active ? "#fafafa" : "#fff",
    transition:"background .15s",
    borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
  }),
  cardKicker:{
    fontSize:9,
    color:"#aaa",
    letterSpacing:".1em",
    textTransform:"uppercase",
    marginBottom:2,
  },
  cardTitle:{
    fontSize:14,
    fontWeight:600,
    color:"#111",
    marginBottom:1,
  },
  cardSub:{
    fontSize:10,
    color:"#999",
    lineHeight:1.3,
  },

  // ── CORPS PRINCIPAL — côte à côte ─────────────────────────────────────────
  body:{
    display:"flex",
    flex:1,
    overflow:"hidden",
    minHeight:0,
  },

  // ── FRISE — 70% ──────────────────────────────────────────────────────────
  timelinePane:{
    width:"70%",
    display:"flex",
    flexDirection:"column",
    borderRight:"1px solid #e8e8e8",
    minWidth:0,
    position:"relative",
  },
  timelineNav:{
    height:34,
    borderBottom:"1px solid #f0f0f0",
    display:"flex",
    alignItems:"center",
    padding:"0 14px",
    gap:16,
    flexShrink:0,
    background:"#fafafa",
  },
  navText:{
    fontSize:11,
    color:"#999",
    letterSpacing:".04em",
  },
  navValue:{
    fontSize:11,
    fontWeight:600,
    color:"#555",
  },
  wrap:{
    flex:1,
    position:"relative",
    overflow:"hidden",
    cursor:"crosshair",
    background:"#fff",
  },
  cnv:{position:"absolute",top:0,left:0},

  // Boutons zoom
  zoomBtns:{
    position:"absolute",
    right:12,
    bottom:12,
    display:"flex",
    gap:4,
    zIndex:20,
  },
  zoomBtn:{
    width:28,
    height:28,
    borderRadius:6,
    border:"1px solid #e0e0e0",
    background:"#fff",
    cursor:"pointer",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:16,
    color:"#555",
    boxShadow:"0 1px 4px rgba(0,0,0,.06)",
  },

  // Minimap
  mini:{
    position:"absolute",
    bottom:12,
    left:12,
    width:160,
    height:28,
    background:"#f8f8f8",
    border:"1px solid #e8e8e8",
    borderRadius:4,
    overflow:"hidden",
    zIndex:20,
    cursor:"pointer",
  },

  // Tooltip
  tt:(t)=>({
    position:"absolute",
    left:t.x,
    top:t.y,
    pointerEvents:"none",
    zIndex:50,
    background:"#111",
    color:"#fff",
    borderRadius:6,
    padding:"7px 11px",
    maxWidth:220,
    boxShadow:"0 4px 16px rgba(0,0,0,.15)",
    fontSize:12,
    lineHeight:1.5,
  }),
  ttDate:{fontSize:9,color:"#aaa",marginBottom:2,letterSpacing:".06em"},
  ttTitle:{fontSize:13,fontWeight:500},
  ttHint:{fontSize:9,color:"rgba(255,255,255,.4)",marginTop:4},

  // ── PANNEAU DROITE (fiche) ─────────────────────────────────────────────────
  panel:(open)=>({
    position:"absolute",
    right:0,top:0,bottom:0,
    width:"min(460px,90%)",
    background:"#fff",
    borderLeft:"1px solid #e8e8e8",
    transform:open?"translateX(0)":"translateX(100%)",
    transition:"transform .28s cubic-bezier(.16,1,.3,1)",
    display:"flex",flexDirection:"column",
    zIndex:40,
    boxShadow:open?"-4px 0 24px rgba(0,0,0,.08)":"none",
  }),
  panelHdr:{
    padding:"18px 20px 14px",
    borderBottom:"1px solid #f0f0f0",
    flexShrink:0,
    position:"relative",
  },
  panelClose:{
    position:"absolute",top:14,right:14,
    width:26,height:26,borderRadius:"50%",
    background:"#f5f5f5",border:"1px solid #e8e8e8",
    cursor:"pointer",fontSize:11,
    display:"flex",alignItems:"center",justifyContent:"center",
    color:"#666",
  },
  panelCat:{fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"#bbb",fontWeight:600,marginBottom:4},
  panelDate:{fontSize:11,color:"#888",marginBottom:6},
  panelTitle:{fontFamily:"Georgia,serif",fontSize:22,lineHeight:1.2,color:"#111",paddingRight:32},
  panelBody:{flex:1,overflowY:"auto",padding:"20px",scrollbarWidth:"thin",scrollbarColor:"#ddd transparent"},
  panelContent:{fontFamily:"Georgia,serif",fontSize:16,lineHeight:1.8,color:"#222"},
  panelError:{padding:"8px 20px",fontSize:11,color:"#c0392b",background:"#fef5f5",borderBottom:"1px solid #fce4e4"},
  loading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:140,gap:10},
  bars:{display:"flex",gap:3,alignItems:"flex-end",height:20},
  barsLbl:{fontSize:9,letterSpacing:".12em",color:"#bbb",textTransform:"uppercase"},

  // ── ARBRE DE VIE — 30% ────────────────────────────────────────────────────
  treePane:{
    width:"30%",
    display:"flex",
    flexDirection:"column",
    background:"#fff",
    minWidth:0,
    overflow:"hidden",
  },
  treeNav:{
    height:34,
    borderBottom:"1px solid #f0f0f0",
    display:"flex",
    alignItems:"center",
    padding:"0 14px",
    gap:8,
    flexShrink:0,
    background:"#fafafa",
  },
  treeTitle:{
    fontSize:11,
    fontWeight:600,
    color:"#555",
    letterSpacing:".04em",
    flex:1,
  },
  treeBody:{
    flex:1,
    overflowY:"auto",
    scrollbarWidth:"thin",
    scrollbarColor:"#ddd transparent",
  },

  // ── SIGNETS / LÉGENDE ─────────────────────────────────────────────────────
  bmBtn:(active,col)=>({
    display:"inline-flex",alignItems:"center",gap:4,
    padding:"3px 8px",borderRadius:10,fontSize:10,
    cursor:"pointer",fontFamily:"inherit",
    border:`1px solid ${col||"#ddd"}`,
    background:active?`${col}14`:"transparent",
    color:active?(col||"#333"):"#888",
    fontWeight:active?600:400,
  }),
  bmBar:{
    display:"flex",alignItems:"center",gap:6,
    padding:"8px 20px 6px",
    borderBottom:"1px solid #f5f5f5",
    flexShrink:0,flexWrap:"wrap",
  },
};
