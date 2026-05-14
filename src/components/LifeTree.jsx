import { useState } from "react";

// ── DONNÉES ──────────────────────────────────────────────────────────────────
// from/to en années (0 = aujourd'hui, null = encore vivant)
const TREE = [
  { id:"vert", label:"🐟 Vertébrés", period:"~525 Ma", from:525e6, to:null, color:"#0ea5e9", vivant:true,
    desc:"Ancêtres communs de tous les animaux à colonne vertébrale. Apparus dans les mers cambriennes.",
    children:[
      { id:"amphi", label:"🐸 Amphibiens", period:"~375 Ma", from:375e6, to:null, color:"#0f766e", vivant:true,
        desc:"Premiers vertébrés à coloniser la terre ferme. Grenouilles, salamandres, cécilies. Dépendants de l'eau pour se reproduire.",
      },
      { id:"amnio", label:"🥚 Amniotes", period:"~320 Ma", from:320e6, to:null, color:"#b45309", vivant:true,
        desc:"L'œuf amniotique libère les vertébrés de l'eau. Tous les mammifères et reptiles (y compris oiseaux) en descendent.",
        children:[
          { id:"mamm", label:"🦁 Mammifères", period:"~225 Ma", from:225e6, to:null, color:"#be185d", vivant:true,
            desc:"Poils, lait, sang chaud. Discrets sous les dinosaures, explosifs après −66 Ma. Cétacés, chauves-souris, primates...",
            children:[
              { id:"primate", label:"🐒 Primates", period:"~55 Ma", from:55e6, to:null, color:"#9333ea", vivant:true,
                desc:"Vision en relief, mains préhensiles, cerveau développé. Apparaissent au début du Cénozoïque.",
                children:[
                  { id:"homini", label:"🦍 Hominidés", period:"~7 Ma", from:7e6, to:null, color:"#c2410c", vivant:true,
                    desc:"Séparation avec les chimpanzés ~7 Ma. Bipédie progressive, outils, cerveau en expansion.",
                    children:[
                      { id:"sapiens", label:"🧠 Homo sapiens", period:"~300 Ka", from:300e3, to:null, color:"#92400e", vivant:true,
                        desc:"Notre espèce. Maroc, ~300 000 ans. Langage articulé, art rupestre, agriculture, écriture, IA générative.",
                      }
                    ]
                  }
                ]
              }
            ]
          },
          { id:"repti", label:"🦎 Reptiles (sens évolutif)", period:"~315 Ma", from:315e6, to:null, color:"#0f6e56", vivant:true,
            desc:"Inclut tortues, squamates, archosaures ET les oiseaux biologiquement. Pas un groupe naturel sans eux.",
            children:[
              { id:"synap", label:"💀 Synapsida", period:"~310–252 Ma", from:310e6, to:252e6, color:"#6b7280", vivant:false, eteint:true,
                desc:"Les «reptiles mammaliens». Ont dominé avant les dinosaures. Ancêtres directs des mammifères. Éteints au Permien.",
              },
              { id:"tortu", label:"🐢 Tortues", period:"~230 Ma", from:230e6, to:null, color:"#65a30d", vivant:true,
                desc:"Carapace formée de côtes et vertèbres soudées. Quasi inchangées depuis 220 Ma. ~360 espèces actuelles.",
              },
              { id:"squa", label:"🐍 Squamates", period:"~200 Ma", from:200e6, to:null, color:"#ca8a04", vivant:true,
                desc:"~10 000 espèces — le groupe le plus diversifié de reptiles. Lézards, serpents et mosasaures marins (éteints).",
                children:[
                  { id:"lezer", label:"🦎 Lézards", period:"~200 Ma", from:200e6, to:null, color:"#84cc16", vivant:true,
                    desc:"Iguanes, geckos, caméléons, varans... ~6 000 espèces.",
                  },
                  { id:"serp", label:"🐍 Serpents", period:"~150 Ma", from:150e6, to:null, color:"#a3e635", vivant:true,
                    desc:"Dérivés de lézards fouisseurs ayant perdu les membres. ~3 700 espèces.",
                  },
                  { id:"mosa", label:"🌊 Mosasaures", period:"~98–66 Ma", from:98e6, to:66e6, color:"#6b7280", vivant:false, eteint:true,
                    desc:"Géants marins du Crétacé, apparentés aux varans modernes. Jusqu'à 17 m. Éteints lors de l'impact −66 Ma.",
                  }
                ]
              },
              { id:"archo", label:"🦖 Archosaures", period:"~250 Ma", from:250e6, to:null, color:"#dc2626", vivant:true,
                desc:"Groupe dominant depuis le Trias : crocodiliens, ptérosaures, dinosaures (dont oiseaux).",
                children:[
                  { id:"croco", label:"🐊 Crocodyliens", period:"~230 Ma", from:230e6, to:null, color:"#166534", vivant:true,
                    desc:"Plus proches parents vivants des oiseaux. Quasi inchangés depuis 80 Ma. 25 espèces.",
                  },
                  { id:"ptero", label:"🦴 Ptérosaures", period:"~228–66 Ma", from:228e6, to:66e6, color:"#7c3aed", vivant:false, eteint:true,
                    desc:"Premiers vertébrés volants. Envergures de 30 cm à 11 m. Pas des dinosaures. Éteints −66 Ma.",
                  },
                  { id:"dino", label:"🦕 Dinosaures", period:"~230 Ma", from:230e6, to:null, color:"#b91c1c", vivant:true,
                    desc:"165 Ma de règne. PAS éteints : leurs descendants les oiseaux comptent ~10 000 espèces vivantes.",
                    children:[
                      { id:"sauris", label:"🦴 Saurischiens", period:"~230 Ma", from:230e6, to:null, color:"#991b1b", vivant:true,
                        desc:"Bassin orienté comme les lézards. Les oiseaux en descendent paradoxalement (pas des ornithischiens).",
                        children:[
                          { id:"therop", label:"🦖 Théropodes", period:"~230 Ma", from:230e6, to:null, color:"#a32d2d", vivant:true,
                            desc:"Bipèdes, souvent carnivores. Ancêtres des oiseaux. T-Rex, Velociraptor, Spinosaurus...",
                            children:[
                              { id:"trex", label:"💀 Tyrannosaurus rex", period:"~68–66 Ma", from:68e6, to:66e6, color:"#6b7280", vivant:false, eteint:true,
                                desc:"12 m, 8 tonnes. Prédateur apex du Crétacé. Probablement emplumé. Disparu −66 Ma.",
                              },
                              { id:"velo", label:"💀 Velociraptor", period:"~75–71 Ma", from:75e6, to:71e6, color:"#6b7280", vivant:false, eteint:true,
                                desc:"Taille d'une dinde, couvert de plumes. Mongolie. Lié à Deinonychus (plus grand).",
                              },
                              { id:"oiseau", label:"🐦 Oiseaux", period:"~150 Ma", from:150e6, to:null, color:"#0369a1", vivant:true,
                                desc:"SONT des dinosaures théropodes. Archaeopteryx −150 Ma. ~10 000 espèces vivantes aujourd'hui.",
                              }
                            ]
                          },
                          { id:"sauro", label:"🦕 Sauropodes", period:"~200–66 Ma", from:200e6, to:66e6, color:"#6b7280", vivant:false, eteint:true,
                            desc:"Plus grands animaux terrestres. Diplodocus (27 m), Brachiosaurus (18 m de haut). Herbivores.",
                            children:[
                              { id:"diplo", label:"💀 Diplodocus / Brachiosaurus", period:"Jurassique", from:155e6, to:145e6, color:"#6b7280", vivant:false, eteint:true,
                                desc:"Diplodocus : 27 m, queue fouet. Brachiosaurus : broutait comme une girafe géante de 18 m.",
                              }
                            ]
                          }
                        ]
                      },
                      { id:"ornit", label:"🦴 Ornithischiens", period:"~230–66 Ma", from:230e6, to:66e6, color:"#6b7280", vivant:false, eteint:true,
                        desc:"Malgré leur nom (bassin d'oiseau), pas les ancêtres des oiseaux. Tous herbivores, tous éteints.",
                        children:[
                          { id:"tricera", label:"💀 Triceratops / Stegosaurus", period:"Crétacé / Jurassique", from:155e6, to:66e6, color:"#6b7280", vivant:false, eteint:true,
                            desc:"Triceratops (3 cornes, 9 m, Crétacé). Stegosaurus (plaques dorsales, 9 m, Jurassique).",
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

// ── BARRE TEMPORELLE ──────────────────────────────────────────────────────────
const MAX_AGE = 530e6; // 530 Ma = échelle de la barre

function TimeBar({ from, to, color, vivant }) {
  const pct = (v) => Math.min(100, Math.max(0, (v / MAX_AGE) * 100));
  const left  = 100 - pct(from);   // plus ancien = plus à gauche
  const right = to ? 100 - pct(to) : 0;
  const width = 100 - left - right;

  return (
    <div style={{
      position:"relative", height:6, background:"rgba(55,53,47,.07)",
      borderRadius:3, margin:"5px 0 2px", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute",
        left:`${left}%`, width:`${Math.max(width,0.5)}%`, height:"100%",
        background: vivant ? color : color+"88",
        borderRadius:3,
        transition:"width .3s",
      }}/>
      {/* Labels échelle */}
    </div>
  );
}

// ── ÉTIQUETTES DE L'ÉCHELLE ───────────────────────────────────────────────────
function ScaleBar() {
  const marks = [
    { label:"Aujourd'hui", pct:100 },
    { label:"100 Ma",  pct:100-100e6/MAX_AGE*100 },
    { label:"250 Ma",  pct:100-250e6/MAX_AGE*100 },
    { label:"400 Ma",  pct:100-400e6/MAX_AGE*100 },
    { label:"530 Ma",  pct:0 },
  ];
  return (
    <div style={{position:"relative",height:18,margin:"4px 0 16px",fontSize:10,
      color:"rgba(55,53,47,.35)",fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif"}}>
      <div style={{position:"absolute",left:0,right:0,top:8,height:1,background:"rgba(55,53,47,.08)"}}/>
      {marks.map(m=>(
        <div key={m.label} style={{position:"absolute",left:`${m.pct}%`,top:0,
          transform:"translateX(-50%)",whiteSpace:"nowrap",textAlign:"center"}}>
          <div style={{width:1,height:5,background:"rgba(55,53,47,.2)",margin:"0 auto 2px"}}/>
          {m.label}
        </div>
      ))}
    </div>
  );
}

// ── NŒUD ─────────────────────────────────────────────────────────────────────
function Node({ node, depth=0 }) {
  const [open, setOpen]       = useState(depth < 2);
  const [showDesc, setShowDesc] = useState(false);
  const hasKids = node.children && node.children.length > 0;

  const indent = depth * 20;

  return (
    <div style={{marginLeft:indent, marginBottom:1}}>

      {/* Ligne principale */}
      <div
        style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"4px 8px", borderRadius:5, cursor:"pointer",
          transition:"background .1s",
          background: open && hasKids ? `${node.color}0d` : "transparent",
        }}
        onClick={()=>{ if(hasKids) setOpen(o=>!o); setShowDesc(d=>!d); }}
        onMouseEnter={e=>e.currentTarget.style.background=`${node.color}14`}
        onMouseLeave={e=>e.currentTarget.style.background=open&&hasKids?`${node.color}0d`:"transparent"}
      >
        {/* Chevron */}
        <span style={{
          fontSize:10, color:"rgba(55,53,47,.3)",
          transform:open?"rotate(90deg)":"rotate(0deg)",
          transition:"transform .15s", flexShrink:0, width:12,
          visibility:hasKids?"visible":"hidden",
        }}>▶</span>

        {/* Point couleur */}
        <div style={{
          width:9, height:9, borderRadius:"50%",
          background:node.color, flexShrink:0,
          opacity:node.eteint?.5:1,
        }}/>

        {/* Label */}
        <span style={{
          fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
          fontWeight: depth===0?700:depth<=2?600:500,
          fontSize: depth===0?16:depth<=2?15:14,
          color: node.eteint ? "rgba(55,53,47,.4)" : "#37352f",
          textDecoration: node.eteint?"line-through":"none",
        }}>
          {node.label}
        </span>

        {/* Période */}
        <span style={{
          fontSize:12,
          fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
          color:"rgba(55,53,47,.38)", marginLeft:2,
        }}>
          {node.period}
        </span>

        {/* Badge */}
        {node.eteint
          ? <span style={{fontSize:11,padding:"1px 7px",borderRadius:4,
              background:"rgba(239,68,68,.1)",color:"#dc2626",fontWeight:500,marginLeft:"auto",flexShrink:0}}>
              Éteint
            </span>
          : <span style={{fontSize:11,padding:"1px 7px",borderRadius:4,
              background:"rgba(22,163,74,.1)",color:"#15803d",fontWeight:500,marginLeft:"auto",flexShrink:0}}>
              Vivant
            </span>
        }
      </div>

      {/* Barre temporelle */}
      {node.from && (
        <div style={{paddingLeft:26, paddingRight:8}}>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
        </div>
      )}

      {/* Description (dépliable au clic) */}
      {showDesc && (
        <div style={{
          marginLeft:26, marginRight:8, marginBottom:6, marginTop:2,
          padding:"8px 12px",
          background:"rgba(55,53,47,.03)",
          borderLeft:`3px solid ${node.color}55`,
          borderRadius:"0 6px 6px 0",
          fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
          fontSize:13, color:"rgba(55,53,47,.65)", lineHeight:1.6,
        }}>
          {node.desc}
        </div>
      )}

      {/* Enfants */}
      {open && hasKids && (
        <div style={{
          borderLeft:"1.5px solid rgba(55,53,47,.09)",
          marginLeft:14, paddingLeft:4, marginTop:2,
        }}>
          {node.children.map(child => (
            <Node key={child.id} node={child} depth={depth+1}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ── EXPORT ────────────────────────────────────────────────────────────────────
export function LifeTree() {
  return (
    <div style={{
      fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
      background:"#fff", borderTop:"1px solid rgba(55,53,47,.09)",
      padding:"28px 32px 48px",
    }}>
      {/* En-tête */}
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
        <h2 style={{
          fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
          fontSize:22, fontWeight:700, color:"#37352f", margin:0,
        }}>
          🌿 Arbre de la vie
        </h2>
        <span style={{
          fontSize:13, color:"rgba(55,53,47,.45)",
          fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
        }}>
          Cliquer pour déplier · cliquer encore pour la description
        </span>
      </div>

      {/* Légende barre temporelle */}
      <div style={{
        fontSize:12, color:"rgba(55,53,47,.4)", marginBottom:16,
        fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
        display:"flex", alignItems:"center", gap:8,
      }}>
        <div style={{width:32,height:5,borderRadius:2,background:"#0ea5e9"}}/>
        <span>Durée d'existence (de l'apparition à l'extinction ou aujourd'hui)</span>
        <div style={{width:32,height:5,borderRadius:2,background:"#6b7280aa",marginLeft:8}}/>
        <span>Éteint</span>
      </div>

      <ScaleBar/>

      {/* Arbre */}
      {TREE.map(node => <Node key={node.id} node={node} depth={0}/>)}
    </div>
  );
}
