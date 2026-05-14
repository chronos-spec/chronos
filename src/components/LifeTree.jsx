import { useState } from "react";

// ── DONNÉES ──────────────────────────────────────────────────────────────────
const TREE = [
  {
    id:"vert", label:"🐟 Vertébrés", period:"~525 Ma",
    desc:"Ancêtres communs de tous les animaux à colonne vertébrale.",
    color:"#0ea5e9", vivant:true,
    children:[
      {
        id:"amphi", label:"🐸 Amphibiens", period:"~375 Ma",
        desc:"Premiers vertébrés à coloniser la terre, mais dépendants de l'eau pour se reproduire.",
        color:"#0f766e", vivant:true,
      },
      {
        id:"amnio", label:"🥚 Amniotes", period:"~320 Ma",
        desc:"L'œuf amniotique libère les vertébrés de l'eau. Donnent mammifères + reptiles.",
        color:"#b45309", vivant:true,
        children:[
          {
            id:"mamm", label:"🦁 Mammifères", period:"~225 Ma",
            desc:"Poils, lait, sang chaud. Discrets sous les dinosaures, explosifs après −66 Ma.",
            color:"#be185d", vivant:true,
            children:[
              {
                id:"primate", label:"🐒 Primates", period:"~55 Ma",
                desc:"Vision en relief, mains préhensiles, cerveau développé.",
                color:"#9333ea", vivant:true,
                children:[
                  {
                    id:"homini", label:"🦍 Hominidés", period:"~7 Ma",
                    desc:"Séparation avec les chimpanzés. Bipédie progressive, fabrication d'outils.",
                    color:"#c2410c", vivant:true,
                    children:[
                      {
                        id:"sapiens", label:"🧠 Homo sapiens", period:"~300 Ka",
                        desc:"Notre espèce. Langage articulé, art, écriture, civilisations, IA.",
                        color:"#92400e", vivant:true,
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id:"repti", label:"🦎 Reptiles (sens évolutif)", period:"~315 Ma",
            desc:"Inclut tortues, squamates, archosaures et oiseaux. Pas un groupe naturel sans les oiseaux.",
            color:"#0f6e56", vivant:true,
            children:[
              {
                id:"synap", label:"💀 Synapsida", period:"~310 Ma",
                desc:"Les «reptiles mammaliens». Dominaient avant les dinosaures. Ancêtres directs des mammifères.",
                color:"#6b7280", vivant:false, eteint:true,
              },
              {
                id:"tortu", label:"🐢 Tortues", period:"~230 Ma",
                desc:"Carapace formée de côtes et vertèbres soudées. Quasi inchangées depuis 220 Ma. ~360 espèces.",
                color:"#65a30d", vivant:true,
              },
              {
                id:"squa", label:"🐍 Squamates", period:"~200 Ma",
                desc:"Le groupe le plus diversifié : ~10 000 espèces. Lézards, serpents, et mosasaures (éteints).",
                color:"#ca8a04", vivant:true,
                children:[
                  {
                    id:"lezer", label:"🦎 Lézards", period:"~200 Ma",
                    desc:"Iguanes, geckos, caméléons, varans… ~6 000 espèces.",
                    color:"#84cc16", vivant:true,
                  },
                  {
                    id:"serp", label:"🐍 Serpents", period:"~150 Ma",
                    desc:"Dérivés de lézards fouisseurs ayant perdu les membres. ~3 700 espèces.",
                    color:"#a3e635", vivant:true,
                  },
                  {
                    id:"mosa", label:"🌊 Mosasaures", period:"~98–66 Ma",
                    desc:"Géants marins du Crétacé, apparentés aux varans. Jusqu'à 17 m. Éteints −66 Ma.",
                    color:"#6b7280", vivant:false, eteint:true,
                  }
                ]
              },
              {
                id:"archo", label:"🦖 Archosaures", period:"~250 Ma",
                desc:"Le groupe le plus dominant : crocodiliens, ptérosaures, dinosaures (dont oiseaux).",
                color:"#dc2626", vivant:true,
                children:[
                  {
                    id:"croco", label:"🐊 Crocodyliens", period:"~230 Ma",
                    desc:"Plus proches parents vivants des oiseaux. Quasi inchangés depuis 80 Ma. 25 espèces.",
                    color:"#166534", vivant:true,
                  },
                  {
                    id:"ptero", label:"🦴 Ptérosaures", period:"~228–66 Ma",
                    desc:"Premiers vertébrés volants. 30 cm à 11 m d'envergure (Quetzalcoatlus). Pas des dinosaures.",
                    color:"#7c3aed", vivant:false, eteint:true,
                  },
                  {
                    id:"dino", label:"🦕 Dinosaures", period:"~230 Ma",
                    desc:"165 Ma de règne. PAS éteints : leurs descendants, les oiseaux, comptent ~10 000 espèces.",
                    color:"#b91c1c", vivant:true,
                    children:[
                      {
                        id:"sauris", label:"🦴 Saurischiens", period:"~230 Ma",
                        desc:"Bassin orienté comme les lézards. Paradoxalement, les oiseaux en descendent.",
                        color:"#991b1b", vivant:true,
                        children:[
                          {
                            id:"therop", label:"🦖 Théropodes", period:"~230 Ma",
                            desc:"Bipèdes, souvent carnivores. Donnent les oiseaux. T-Rex, Velociraptor, Spinosaurus.",
                            color:"#a32d2d", vivant:true,
                            children:[
                              {
                                id:"trex", label:"💀 Tyrannosaurus rex", period:"~68–66 Ma",
                                desc:"12 m, 8 tonnes. Prédateur apex. Probablement emplumé. Disparu −66 Ma.",
                                color:"#6b7280", vivant:false, eteint:true,
                              },
                              {
                                id:"velo", label:"💀 Velociraptor", period:"~75–71 Ma",
                                desc:"Taille d'une dinde, couvert de plumes. Mongolie, Crétacé supérieur.",
                                color:"#6b7280", vivant:false, eteint:true,
                              },
                              {
                                id:"oiseau", label:"🐦 Oiseaux", period:"~150 Ma",
                                desc:"SONT des dinosaures théropodes. Archaeopteryx −150 Ma. ~10 000 espèces vivantes.",
                                color:"#0369a1", vivant:true,
                              }
                            ]
                          },
                          {
                            id:"sauro", label:"🦕 Sauropodes", period:"~200–66 Ma",
                            desc:"Plus grands animaux terrestres de l'histoire. Diplodocus (27 m), Brachiosaurus (18 m de haut).",
                            color:"#6b7280", vivant:false, eteint:true,
                            children:[
                              {
                                id:"diplo", label:"💀 Diplodocus / Brachiosaurus", period:"Jurassique",
                                desc:"Diplodocus : 27 m, queue fouet. Brachiosaurus : broutait comme une girafe géante de 18 m.",
                                color:"#6b7280", vivant:false, eteint:true,
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id:"ornit", label:"🦴 Ornithischiens", period:"~230–66 Ma",
                        desc:"Malgré leur nom (bassin d'oiseau), pas les ancêtres des oiseaux. Tous herbivores, tous éteints.",
                        color:"#6b7280", vivant:false, eteint:true,
                        children:[
                          {
                            id:"tricera", label:"💀 Triceratops / Stegosaurus", period:"Crétacé / Jurassique",
                            desc:"Triceratops (3 cornes, collerette, 9 m). Stegosaurus (plaques dorsales, 9 m).",
                            color:"#6b7280", vivant:false, eteint:true,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// ── STYLES NOTION ─────────────────────────────────────────────────────────────
const S = {
  wrap: {
    fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
    fontSize:15, lineHeight:1.6, color:"#37352f",
    padding:"24px 32px 40px", background:"#fff",
    borderTop:"1px solid rgba(55,53,47,.09)",
  },
  header: {
    display:"flex", alignItems:"center", gap:10,
    marginBottom:20,
  },
  h2: {
    fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
    fontSize:20, fontWeight:700, color:"#37352f", margin:0,
  },
  badge: {
    fontSize:12, padding:"2px 8px", borderRadius:4,
    background:"rgba(55,53,47,.08)", color:"rgba(55,53,47,.65)",
    fontWeight:500,
  },
  node: (depth) => ({
    marginLeft: depth * 24,
    marginBottom: 2,
  }),
  row: (open, color) => ({
    display:"flex", alignItems:"flex-start", gap:6,
    padding:"3px 6px", borderRadius:4,
    cursor:"pointer",
    transition:"background .1s",
    background: open ? `${color}0f` : "transparent",
    userSelect:"none",
  }),
  chevron: (open, hasKids) => ({
    fontSize:11, color:"rgba(55,53,47,.35)",
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition:"transform .15s",
    marginTop:4, flexShrink:0, width:14, textAlign:"center",
    visibility: hasKids ? "visible" : "hidden",
  }),
  dot: (color) => ({
    width:10, height:10, borderRadius:"50%", background:color,
    flexShrink:0, marginTop:6,
  }),
  label: (depth, eteint) => ({
    fontWeight: depth <= 1 ? 600 : depth <= 3 ? 500 : 400,
    fontSize: depth === 0 ? 16 : depth <= 2 ? 15 : 14,
    color: eteint ? "rgba(55,53,47,.45)" : "#37352f",
    textDecoration: eteint ? "line-through" : "none",
    flexShrink:0,
  }),
  period: {
    fontSize:12, color:"rgba(55,53,47,.45)",
    marginLeft:6, marginTop:4, flexShrink:0,
  },
  desc: (open) => ({
    fontSize:13, color:"rgba(55,53,47,.65)",
    lineHeight:1.5, marginTop:2, marginBottom:6,
    display: open ? "block" : "none",
    marginLeft:30, padding:"6px 10px",
    borderLeft:"2px solid rgba(55,53,47,.1)",
    background:"rgba(55,53,47,.02)", borderRadius:"0 4px 4px 0",
  }),
  extinctTag: {
    fontSize:11, padding:"1px 6px", borderRadius:3,
    background:"rgba(239,68,68,.1)", color:"#dc2626",
    marginLeft:6, fontWeight:500, flexShrink:0, marginTop:4,
  },
  vivantTag: {
    fontSize:11, padding:"1px 6px", borderRadius:3,
    background:"rgba(22,163,74,.1)", color:"#15803d",
    marginLeft:6, fontWeight:500, flexShrink:0, marginTop:4,
  },
};

// ── COMPOSANT NŒUD ────────────────────────────────────────────────────────────
function Node({node, depth=0}) {
  const [open, setOpen] = useState(depth < 2);
  const [showDesc, setShowDesc] = useState(false);
  const hasKids = node.children && node.children.length > 0;

  return (
    <div style={S.node(depth)}>
      {/* Ligne principale */}
      <div
        style={S.row(open, node.color)}
        onClick={() => { if(hasKids) setOpen(o=>!o); setShowDesc(d=>!d); }}
        onMouseEnter={e=>e.currentTarget.style.background=`${node.color}12`}
        onMouseLeave={e=>e.currentTarget.style.background=open?`${node.color}0f`:"transparent"}
      >
        {/* Chevron */}
        <span style={S.chevron(open, hasKids)}>▶</span>
        {/* Point couleur */}
        <div style={S.dot(node.color)}/>
        {/* Label */}
        <span style={S.label(depth, node.eteint)}>{node.label}</span>
        {/* Période */}
        <span style={S.period}>{node.period}</span>
        {/* Badge vivant/éteint */}
        {node.eteint
          ? <span style={S.extinctTag}>Éteint</span>
          : <span style={S.vivantTag}>Vivant</span>
        }
      </div>

      {/* Description */}
      <div style={S.desc(showDesc)}>{node.desc}</div>

      {/* Enfants */}
      {open && hasKids && node.children.map(child => (
        <Node key={child.id} node={child} depth={depth+1}/>
      ))}
    </div>
  );
}

// ── EXPORT ────────────────────────────────────────────────────────────────────
export function LifeTree() {
  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <h2 style={S.h2}>🌿 Arbre de la vie</h2>
        <span style={S.badge}>Cliquer pour déplier · Cliquer encore pour la description</span>
      </div>
      {TREE.map(node => <Node key={node.id} node={node} depth={0}/>)}
    </div>
  );
}
