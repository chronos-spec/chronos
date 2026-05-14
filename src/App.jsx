import { useState, useEffect, useRef, useCallback } from "react";

const UA = 13.8e9;
const L = (ya) => Math.log10(Math.max(ya, 0.1));

const EPOCHS = [
  { label:"Cosmique",      from:UA,    to:4.6e9,  bg:"#0a0520", stripe:"#7c5cf0", text:"#b090ff", pillBg:"rgba(124,92,240,.15)", pillText:"#7c5cf0" },
  { label:"Hadéen",        from:4.6e9, to:4.0e9,  bg:"#1e0802", stripe:"#d43a0a", text:"#f07050", pillBg:"rgba(212,58,10,.12)",  pillText:"#d43a0a" },
  { label:"Archéen",       from:4.0e9, to:2.5e9,  bg:"#020e1c", stripe:"#0878c8", text:"#50b0e8", pillBg:"rgba(8,120,200,.12)",  pillText:"#0878c8" },
  { label:"Protérozoïque", from:2.5e9, to:541e6,  bg:"#02120a", stripe:"#18b050", text:"#50d880", pillBg:"rgba(24,176,80,.12)",  pillText:"#18b050" },
  { label:"Paléozoïque",   from:541e6, to:252e6,  bg:"#0a1602", stripe:"#78b010", text:"#a0d040", pillBg:"rgba(120,176,16,.12)", pillText:"#78b010" },
  { label:"Mésozoïque",    from:252e6, to:66e6,   bg:"#160a02", stripe:"#c86010", text:"#f09040", pillBg:"rgba(200,96,16,.12)",  pillText:"#c86010" },
  { label:"Cénozoïque",    from:66e6,  to:2.6e6,  bg:"#100220", stripe:"#a028c8", text:"#d060f0", pillBg:"rgba(160,40,200,.12)", pillText:"#a028c8" },
  { label:"Préhistoire",   from:2.6e6, to:12e3,   bg:"#160204", stripe:"#c02828", text:"#e06060", pillBg:"rgba(192,40,40,.12)",  pillText:"#c02828" },
  { label:"Histoire",      from:12e3,  to:0,      bg:"#02081c", stripe:"#1850cc", text:"#6090f0", pillBg:"rgba(24,80,204,.12)",  pillText:"#1850cc" },
];

const CAT_COL = { cosmique:"#5a3db8", geologique:"#0868a8", biologique:"#0a7848", prehistoire:"#b03010", histoire:"#8a6000" };
const cc = (cat) => CAT_COL[cat] || "#555";

// ── ARBRE DE LA VIE ──────────────────────────────────────────────────────────
// Chaque nœud : id, label, from (Ma), to (Ma, 0=vivant), color, parent, row, children (expandable)
const LIFE_TREE = [
  // Niveau 0 — Racines
  { id:"lt00", label:"Bactéries",      from:3500e6, to:0,     color:"#64748b", row:0, depth:0 },
  { id:"lt01", label:"Eucaryotes",     from:2000e6, to:0,     color:"#6366f1", row:1, depth:0 },
  { id:"lt02", label:"Champignons",    from:1000e6, to:0,     color:"#a78bfa", row:2, depth:1 },
  { id:"lt03", label:"Plantes",        from:470e6,  to:0,     color:"#16a34a", row:3, depth:1 },
  { id:"lt04", label:"Invertébrés",    from:541e6,  to:0,     color:"#f59e0b", row:4, depth:1 },
  // Vertébrés
  { id:"lt05", label:"Poissons",       from:520e6,  to:0,     color:"#0ea5e9", row:5, depth:1 },
  { id:"lt06", label:"Amphibiens",     from:375e6,  to:0,     color:"#0f766e", row:6, depth:2 },
  { id:"lt07", label:"Amniotes",       from:320e6,  to:0,     color:"#b45309", row:7, depth:2 },
  // Branche Mammifères
  { id:"lt08", label:"Mammifères",     from:225e6,  to:0,     color:"#be185d", row:8, depth:3 },
  { id:"lt09", label:"Primates",       from:55e6,   to:0,     color:"#9333ea", row:9, depth:4 },
  { id:"lt10", label:"Hominidés",      from:7e6,    to:0,     color:"#c2410c", row:10,depth:5 },
  { id:"lt11", label:"Homo Sapiens",   from:300e3,  to:0,     color:"#92400e", row:11,depth:6 },
  // Branche Reptiles / Sauropsida
  { id:"lt12", label:"Tortues",        from:230e6,  to:0,     color:"#65a30d", row:8, depth:3 },
  { id:"lt13", label:"Squamates",      from:200e6,  to:0,     color:"#ca8a04", row:9, depth:4 },
  { id:"lt14", label:"Archosaures",    from:250e6,  to:0,     color:"#dc2626", row:10,depth:4 },
  { id:"lt15", label:"Crocodiliens",   from:230e6,  to:0,     color:"#166534", row:11,depth:5 },
  { id:"lt16", label:"Ptérosaures 🦅", from:228e6,  to:66e6,  color:"#7c3aed", row:12,depth:5 },
  { id:"lt17", label:"Dinosaures 🦖",  from:230e6,  to:66e6,  color:"#b91c1c", row:13,depth:5 },
  { id:"lt18", label:"Sauropodes",     from:210e6,  to:66e6,  color:"#c2410c", row:14,depth:6 },
  { id:"lt19", label:"Théropodes",     from:230e6,  to:0,     color:"#991b1b", row:15,depth:6 },
  { id:"lt20", label:"Oiseaux 🐦",     from:150e6,  to:0,     color:"#0369a1", row:16,depth:7 },
  { id:"lt21", label:"Mosasaures 🌊",  from:98e6,   to:66e6,  color:"#0c4a6e", row:14,depth:5 },
];

// Fiches des périodes et ères — affichées au clic
const PERIOD_DESCRIPTIONS = {
  "Cosmique": { summary:"13,8 à 4,6 Ga : naissance de l'espace, du temps, des étoiles et des galaxies. Le Big Bang, les premières supernovæ, la Voie Lactée.", highlights:["Big Bang −13,8 Ga","Premières étoiles −13,6 Ga","Voie Lactée −10 Ga","Nébuleuse solaire −4,6 Ga"] },
  "Hadéen":   { summary:"4,6 à 4,0 Ga : formation de la Terre en fusion, bombardement intense, formation de la Lune. Aucune vie possible.", highlights:["Formation de la Terre","Impact Théia → Lune","Grand Bombardement Tardif","Premiers océans en formation"] },
  "Archéen":  { summary:"4,0 à 2,5 Ga : premières traces de vie (stromatolites), premiers continents. Atmosphère sans oxygène.", highlights:["Premiers continents","Stromatolites −3,5 Ga","Premières bactéries","Tectonique des plaques naissante"] },
  "Protérozoïque": { summary:"2,5 Ga à 541 Ma : la Grande Oxydation transforme l'atmosphère. Apparition des cellules eucaryotes et de la reproduction sexuée.", highlights:["Grande Oxydation −2,4 Ga","Cellules eucaryotes −2 Ga","Reproduction sexuée −1,2 Ga","Faune d'Ediacara −600 Ma"] },
  "Paléozoïque": { summary:"541 à 252 Ma : explosion de la vie animale, colonisation des terres, premiers vertébrés, forêts géantes. Se termine par la plus grande extinction de l'histoire.", highlights:["Explosion cambrienne −541 Ma","Premiers vertébrés −520 Ma","Plantes terrestres −475 Ma","Extinction Permien −252 Ma"] },
  "Mésozoïque": { summary:"252 à 66 Ma : ère des dinosaures. Trias, Jurassique, Crétacé. Apparition des mammifères, des oiseaux et des fleurs.", highlights:["Premiers dinosaures −230 Ma","Premiers mammifères −225 Ma","Archaeopteryx −150 Ma","Premières fleurs −130 Ma","Astéroïde Chicxulub −66 Ma"] },
  "Cénozoïque": { summary:"66 Ma à aujourd'hui : ère des mammifères. Diversification explosive après les dinosaures. Apparition des primates, des hominidés, et d'Homo Sapiens.", highlights:["Radiation des mammifères","Primates −55 Ma","Séparation Homo/Chimp −7 Ma","Homo Sapiens −300 000 ans"] },
  "Cambrien":   { summary:"541 à 485 Ma : explosion de la diversité animale. Quasi tous les grands plans d'organisation apparaissent en quelques millions d'années.", highlights:["Premiers arthropodes","Premiers mollusques","Premiers cordés","Anomalocaris"] },
  "Ordovicien": { summary:"485 à 444 Ma : diversification marine intense. La vie reste aquatique. Se termine par une glaciation massive et la 2e plus grande extinction.", highlights:["Diversification marine","Premiers vertébrés sans mâchoire","Glaciation Gondwana","Extinction −444 Ma : 86% des espèces"] },
  "Silurien":   { summary:"444 à 419 Ma : la vie commence à coloniser les terres. Premiers poissons à mâchoires, premières plantes vasculaires.", highlights:["Premières plantes vasculaires","Premiers insectes","Poissons à mâchoires","Coraux et récifs"] },
  "Dévonien":   { summary:"419 à 359 Ma : âge des poissons. Premiers vertébrés terrestres (Tiktaalik). Grandes forêts primitives. Extinction majeure.", highlights:["Tiktaalik −375 Ma","Premiers amphibiens","Forêts primitives","Extinction −359 Ma"] },
  "Carbonifère":{ summary:"359 à 299 Ma : forêts tropicales gigantesques qui deviendront le charbon. Premiers reptiles. Insectes géants dans une atmosphère riche en O₂.", highlights:["Forêts de fougères géantes","Premiers reptiles −312 Ma","Insectes géants (libellules 70cm)","Charbon formé ici"] },
  "Permien":    { summary:"299 à 252 Ma : supercontinant Pangée. Reptiles mammaliens dominants. Fin catastrophique : 96% des espèces marines disparaissent.", highlights:["Pangée assemblée","Reptiles mammaliens","Trapps sibériens","Grande Extinction −252 Ma"] },
  "Trias":      { summary:"252 à 201 Ma : renaissance après la grande extinction. Les dinosaures et les mammifères apparaissent. Premiers ptérosaures.", highlights:["Premiers dinosaures −230 Ma","Premiers mammifères −225 Ma","Premiers ptérosaures","Fragmentation de la Pangée"] },
  "Jurassique": { summary:"201 à 145 Ma : âge d'or des dinosaures. Sauropodes géants, premiers oiseaux. Les continents se séparent.", highlights:["Sauropodes géants (Diplodocus)","Stégosaure","Archaeopteryx −150 Ma","Mers chaudes et tropicales"] },
  "Crétacé":    { summary:"145 à 66 Ma : apogée des dinosaures. Apparition des plantes à fleurs. Mosasaures dans les mers. Impact de Chicxulub.", highlights:["T-Rex, Triceratops","Premières fleurs −130 Ma","Mosasaures marins","Astéroïde Chicxulub −66 Ma"] },
  "Paléogène":  { summary:"66 à 23 Ma : radiation explosive des mammifères. Apparition des primates, cétacés, chauves-souris. Climat chaud puis refroidissement.", highlights:["Radiation des mammifères","Primates −55 Ma","Premiers cétacés","Glaciation de l'Antarctique"] },
  "Néogène":    { summary:"23 à 2,6 Ma : les continents prennent leur forme actuelle. Apparition des grands singes puis des hominidés. Prairies et herbivores.", highlights:["Grands singes −23 Ma","Séparation Homo/Chimp −7 Ma","Australopithèques −4 Ma","Soulèvement de l'Himalaya"] },
  "Quaternaire":{ summary:"2,6 Ma à aujourd'hui : grandes glaciations cycliques. Homo Sapiens. Civilisation. L'Anthropocène.", highlights:["Glaciations cycliques","Homo Sapiens −300 Ka","Sortie d'Afrique −70 Ka","Agriculture −10 Ka","Civilisations","IA générative 2022"] },
  "Préhistoire":{ summary:"De l'apparition d'Homo Sapiens jusqu'à l'invention de l'écriture. Maîtrise du feu, art rupestre, agriculture.", highlights:["Homo Sapiens −300 Ka","Art de Chauvet −40 Ka","Révolution néolithique −10 Ka","Premières villes"] },
  "Histoire":   { summary:"De l'écriture sumérienne à aujourd'hui. Civilisations, empires, révolutions scientifiques et industrielles.", highlights:["Écriture −3 200 av.J.-C.","Grèce classique −500 av.J.-C.","Révolution française 1789","Révolution industrielle","IA 2022"] },
};



// Geological periods (ICS color scheme) — shown as a sub-band on the timeline
const PERIODS = [
  // Paléozoïque
  { label:"Cambrien",     from:541e6,  to:485.4e6, color:"#7fa056", textColor:"#fff" },
  { label:"Ordovicien",   from:485.4e6,to:443.8e6, color:"#009270", textColor:"#fff" },
  { label:"Silurien",     from:443.8e6,to:419.2e6, color:"#b3e1b6", textColor:"#333" },
  { label:"Dévonien",     from:419.2e6,to:358.9e6, color:"#cb8c37", textColor:"#fff" },
  { label:"Carbonifère",  from:358.9e6,to:298.9e6, color:"#67a599", textColor:"#fff" },
  { label:"Permien",      from:298.9e6,to:251.9e6, color:"#f04028", textColor:"#fff" },
  // Mésozoïque
  { label:"Trias",        from:251.9e6,to:201.4e6, color:"#812b92", textColor:"#fff" },
  { label:"Jurassique",   from:201.4e6,to:145e6,   color:"#34b2c9", textColor:"#fff" },
  { label:"Crétacé",      from:145e6,  to:66e6,    color:"#7fc64e", textColor:"#333" },
  // Cénozoïque
  { label:"Paléogène",    from:66e6,   to:23.03e6, color:"#fd9a52", textColor:"#333" },
  { label:"Néogène",      from:23.03e6,to:2.58e6,  color:"#ffff00", textColor:"#333" },
  { label:"Quaternaire",  from:2.58e6, to:0,       color:"#f9f97f", textColor:"#333" },
];


const ALL_EVENTS = [
  // COSMIQUE
  {id:"c01",yearsAgo:13.8e9, title:"Big Bang",                  date_label:"−13,8 Ga",         desc:"Naissance de l'espace, du temps et de la matière en une singularité infiniment dense.",                       cat:"cosmique",    importance:1,minZoom:0},
  {id:"c02",yearsAgo:13.6e9, title:"Premières étoiles",         date_label:"−13,6 Ga",         desc:"Les premières étoiles massives s'allument et forgent les atomes lourds par fusion nucléaire.",                 cat:"cosmique",    importance:1,minZoom:0},
  {id:"c03",yearsAgo:13.4e9, title:"Premières galaxies",        date_label:"−13,4 Ga",         desc:"Des proto-galaxies se forment autour de filaments de matière noire.",                                          cat:"cosmique",    importance:2,minZoom:1},
  {id:"c04",yearsAgo:13.2e9, title:"Réionisation univers",      date_label:"−13,2 Ga",         desc:"Les étoiles ionisent le gaz intergalactique : l'univers devient transparent à la lumière.",                    cat:"cosmique",    importance:2,minZoom:1.5},
  {id:"c05",yearsAgo:12e9,   title:"Premières supernovæ",       date_label:"−12 Ga",           desc:"Les supernovæ enrichissent l'espace en métaux et déclenchent de nouvelles formations stellaires.",              cat:"cosmique",    importance:2,minZoom:1},
  {id:"c06",yearsAgo:10e9,   title:"Voie Lactée",               date_label:"−10 Ga",           desc:"Notre galaxie se forme progressivement par fusions et accrétion de gaz et d'étoiles.",                         cat:"cosmique",    importance:1,minZoom:0},
  {id:"c07",yearsAgo:8e9,    title:"Accélération expansion",    date_label:"−8 Ga",            desc:"L'énergie noire prend le dessus sur la gravité : l'expansion de l'univers s'accélère.",                        cat:"cosmique",    importance:2,minZoom:1},
  {id:"c08",yearsAgo:6e9,    title:"Nébuleuse solaire",         date_label:"−6 Ga",            desc:"Le nuage de gaz qui donnera naissance au Soleil commence à se contracter sous la gravité.",                    cat:"cosmique",    importance:2,minZoom:1.5},
  // GÉOLOGIQUE
  {id:"g01",yearsAgo:4.6e9,  title:"Naissance du Soleil",       date_label:"−4,6 Ga",          desc:"Le Soleil naît de l'effondrement gravitationnel d'un nuage interstellaire.",                                   cat:"geologique",  importance:1,minZoom:0},
  {id:"g02",yearsAgo:4.53e9, title:"Formation de la Lune",      date_label:"−4,53 Ga",         desc:"Théia percute la proto-Terre. Les débris en orbite s'agrègent pour former la Lune.",                          cat:"geologique",  importance:2,minZoom:1},
  {id:"g03",yearsAgo:4.5e9,  title:"Formation de la Terre",     date_label:"−4,5 Ga",          desc:"La Terre se forme par accrétion de planétésimaux dans la nébuleuse solaire.",                                  cat:"geologique",  importance:1,minZoom:0},
  {id:"g04",yearsAgo:4.4e9,  title:"Premiers cristaux",         date_label:"−4,4 Ga",          desc:"Les zircons de Jack Hills (Australie) : les plus anciens minéraux connus à 4,4 milliards d'années.",           cat:"geologique",  importance:2,minZoom:1.5},
  {id:"g05",yearsAgo:4.1e9,  title:"Grand Bombardement",        date_label:"−4,1 Ga",          desc:"L'Hadéen tardif : une pluie d'astéroïdes s'abat sur la Terre et creuse les cratères lunaires.",               cat:"geologique",  importance:2,minZoom:1},
  {id:"g06",yearsAgo:4e9,    title:"Premiers océans",           date_label:"−4 Ga",            desc:"La vapeur d'eau se condense : les premières mers recouvrent progressivement la planète.",                      cat:"geologique",  importance:1,minZoom:0},
  {id:"g07",yearsAgo:3.8e9,  title:"Premiers continents",       date_label:"−3,8 Ga",          desc:"Les premiers cratons granitiques émergent de l'océan mondial : naissance des continents.",                    cat:"geologique",  importance:2,minZoom:1},
  {id:"g08",yearsAgo:3e9,    title:"Tectonique des plaques",    date_label:"−3 Ga",            desc:"La tectonique des plaques se met en place, moteur de la géologie terrestre.",                                  cat:"geologique",  importance:2,minZoom:1},
  {id:"g09",yearsAgo:2.3e9,  title:"Glaciation huronienne",     date_label:"−2,3 Ga",          desc:"La Terre se couvre entièrement de glace lors de la première grande glaciation planétaire.",                    cat:"geologique",  importance:2,minZoom:1},
  {id:"g10",yearsAgo:750e6,  title:"Terre boule de neige",      date_label:"−750 Ma",          desc:"La Terre est à nouveau entièrement gelée — crise climatique majeure du Néoprotérozoïque.",                    cat:"geologique",  importance:2,minZoom:2},
  {id:"g11",yearsAgo:300e6,  title:"Pangée",                    date_label:"−300 Ma",          desc:"Tous les continents fusionnent en un supercontinent unique : la Pangée.",                                     cat:"geologique",  importance:2,minZoom:2},
  {id:"g12",yearsAgo:200e6,  title:"Fragmentation Pangée",      date_label:"−200 Ma",          desc:"La Pangée se fragmente, donnant naissance aux continents actuels.",                                           cat:"geologique",  importance:2,minZoom:2},
  {id:"g13",yearsAgo:65e6,   title:"Formation Himalaya",        date_label:"−65 Ma",           desc:"La collision entre l'Inde et l'Asie soulève progressivement la chaîne himalayenne.",                         cat:"geologique",  importance:2,minZoom:2.5},
  // BIOLOGIQUE
  {id:"b01",yearsAgo:3.8e9,  title:"Premières molécules vivantes",date_label:"−3,8 Ga",       desc:"Les premières molécules auto-réplicantes apparaissent dans les océans primitifs.",                            cat:"biologique",  importance:2,minZoom:1},
  {id:"b02",yearsAgo:3.5e9,  title:"Premières bactéries",       date_label:"−3,5 Ga",          desc:"Les stromatolites témoignent des premières communautés bactériennes photosynthétiques.",                       cat:"biologique",  importance:1,minZoom:0},
  {id:"b03",yearsAgo:2.7e9,  title:"Cyanobactéries",            date_label:"−2,7 Ga",          desc:"Les cyanobactéries perfectionnent la photosynthèse oxygénique, transformant l'atmosphère.",                   cat:"biologique",  importance:2,minZoom:1},
  {id:"b04",yearsAgo:2.4e9,  title:"Grande Oxydation",          date_label:"−2,4 Ga",          desc:"L'oxygène envahit l'atmosphère. Catastrophe pour les anaérobies, opportunité pour les aérobies.",             cat:"biologique",  importance:1,minZoom:0},
  {id:"b05",yearsAgo:2e9,    title:"Cellules eucaryotes",       date_label:"−2 Ga",            desc:"Apparition des premières cellules avec noyau — une bactérie absorbée devient mitochondrie.",                  cat:"biologique",  importance:2,minZoom:1},
  {id:"b06",yearsAgo:1.2e9,  title:"Reproduction sexuée",       date_label:"−1,2 Ga",          desc:"La reproduction sexuée apparaît, accélérant considérablement le rythme de l'évolution.",                     cat:"biologique",  importance:2,minZoom:1},
  {id:"b07",yearsAgo:600e6,  title:"Faune d'Ediacara",          date_label:"−600 Ma",          desc:"Les premiers animaux multicellulaires complexes apparaissent, encore sans organes ni squelette.",             cat:"biologique",  importance:2,minZoom:2},
  {id:"b08",yearsAgo:541e6,  title:"Explosion cambrienne",      date_label:"−541 Ma",          desc:"En quelques millions d'années, quasi tous les grands plans d'organisation animaux apparaissent.",              cat:"biologique",  importance:1,minZoom:0},
  {id:"b09",yearsAgo:530e6,  title:"Premiers poissons",         date_label:"−530 Ma",          desc:"Les premiers vertébrés : poissons sans mâchoire (agnathes) dans les mers du Cambrien.",                      cat:"biologique",  importance:2,minZoom:2},
  {id:"b10",yearsAgo:475e6,  title:"Plantes terrestres",        date_label:"−475 Ma",          desc:"Les premières plantes colonisent les continents, créant sols et atmosphère modifiés.",                        cat:"biologique",  importance:2,minZoom:2},
  {id:"b11",yearsAgo:430e6,  title:"Extinction Ordovicien",     date_label:"−430 Ma",          desc:"86 % des espèces disparaissent lors de la 2e plus grande extinction de l'histoire.",                         cat:"biologique",  importance:2,minZoom:2},
  {id:"b12",yearsAgo:400e6,  title:"Premiers insectes",         date_label:"−400 Ma",          desc:"Les insectes apparaissent et se diversifient rapidement, dominant les écosystèmes terrestres.",               cat:"biologique",  importance:2,minZoom:2.5},
  {id:"b13",yearsAgo:375e6,  title:"Vertébrés terrestres",      date_label:"−375 Ma",          desc:"Le Tiktaalik, poisson à nageoires charnues, commence à ramper sur les rives.",                               cat:"biologique",  importance:2,minZoom:1},
  {id:"b14",yearsAgo:360e6,  title:"Extinction Dévonien",       date_label:"−360 Ma",          desc:"75 % des espèces marines disparaissent. La vie terrestre résiste mieux.",                                    cat:"biologique",  importance:2,minZoom:2},
  {id:"b15",yearsAgo:350e6,  title:"Forêts carbonifères",       date_label:"−350 Ma",          desc:"D'immenses forêts tropicales couvrent la Terre, stockant le carbone futur charbon.",                        cat:"biologique",  importance:2,minZoom:2},
  {id:"b16",yearsAgo:312e6,  title:"Premiers reptiles",         date_label:"−312 Ma",          desc:"Les reptiles maîtrisent l'œuf amniotique et conquièrent définitivement les milieux terrestres.",              cat:"biologique",  importance:2,minZoom:2},
  {id:"b17",yearsAgo:252e6,  title:"Extinction Permien-Trias",  date_label:"−252 Ma",          desc:"96 % des espèces marines disparaissent. La plus grande crise du vivant de toute l'histoire.",               cat:"biologique",  importance:1,minZoom:0},
  {id:"b18",yearsAgo:230e6,  title:"Premiers dinosaures",       date_label:"−230 Ma",          desc:"Les dinosaures émergent au Trias et domineront la Terre pendant 165 millions d'années.",                    cat:"biologique",  importance:1,minZoom:0},
  {id:"b19",yearsAgo:225e6,  title:"Premiers mammifères",       date_label:"−225 Ma",          desc:"De petits mammifères nocturnes s'adaptent à l'ombre des dinosaures.",                                       cat:"biologique",  importance:2,minZoom:1},
  {id:"b20",yearsAgo:201e6,  title:"Extinction Trias-Jura",     date_label:"−201 Ma",          desc:"80 % des espèces disparaissent, libérant les niches pour la diversification des dinosaures.",               cat:"biologique",  importance:2,minZoom:2},
  {id:"b21",yearsAgo:150e6,  title:"Archaeopteryx",             date_label:"−150 Ma",          desc:"L'Archaeopteryx, intermédiaire entre dinosaure et oiseau, illustre la transition évolutive.",               cat:"biologique",  importance:2,minZoom:2},
  {id:"b22",yearsAgo:130e6,  title:"Premières fleurs",          date_label:"−130 Ma",          desc:"Les angiospermes révolutionnent les écosystèmes terrestres en lien avec les insectes pollinisateurs.",      cat:"biologique",  importance:2,minZoom:2},
  {id:"b23",yearsAgo:66e6,   title:"Astéroïde Yucatán",         date_label:"−66 Ma",           desc:"Un astéroïde de 10 km éteint 75 % des espèces, dont tous les dinosaures non-aviaires.",                    cat:"biologique",  importance:1,minZoom:0},
  {id:"b24",yearsAgo:55e6,   title:"Radiation des primates",    date_label:"−55 Ma",           desc:"Les primates se diversifient rapidement après la disparition des dinosaures.",                              cat:"biologique",  importance:2,minZoom:2},
  {id:"b25",yearsAgo:34e6,   title:"Glaciation Antarctique",    date_label:"−34 Ma",           desc:"L'Antarctique se couvre de glace, refroidissant le climat et modifiant les faunes mondiales.",             cat:"biologique",  importance:2,minZoom:2.5},
  {id:"b26",yearsAgo:23e6,   title:"Premiers grands singes",    date_label:"−23 Ma",           desc:"Les premiers hominoïdes (grands singes) apparaissent en Afrique.",                                         cat:"biologique",  importance:2,minZoom:2},
  {id:"b27",yearsAgo:7e6,    title:"Séparation Homo/Chimp",     date_label:"−7 Ma",            desc:"La lignée menant à l'Homme se sépare de celle des chimpanzés. Le bipédisme s'impose.",                    cat:"biologique",  importance:1,minZoom:0},
  {id:"b28",yearsAgo:5e6,    title:"Glaciations Pléistocène",   date_label:"−5 Ma",            desc:"Début des grandes glaciations cycliques qui sculptent paysages et faunes.",                                cat:"biologique",  importance:2,minZoom:2},
  // PRÉHISTOIRE
  {id:"p01",yearsAgo:4e6,    title:"Australopithèques",          date_label:"−4 Ma",           desc:"Les australopithèques marchent debout en Afrique de l'Est. Cerveau en expansion progressive.",             cat:"prehistoire", importance:2,minZoom:2},
  {id:"p02",yearsAgo:3.2e6,  title:"Lucy",                      date_label:"−3,2 Ma",          desc:"Lucy (A. afarensis), découverte en Éthiopie, est l'un des fossiles humains les plus célèbres.",           cat:"prehistoire", importance:2,minZoom:2},
  {id:"p03",yearsAgo:2.5e6,  title:"Premiers outils",           date_label:"−2,5 Ma",          desc:"Les premiers outils en pierre taillée (Oldowayen) marquent le début du Paléolithique.",                   cat:"prehistoire", importance:2,minZoom:2},
  {id:"p04",yearsAgo:2.3e6,  title:"Homo habilis",              date_label:"−2,3 Ma",          desc:"Homo habilis, « l'homme habile », fabrique les premiers outils reconnus.",                                cat:"prehistoire", importance:2,minZoom:2},
  {id:"p05",yearsAgo:1.8e6,  title:"Homo erectus",              date_label:"−1,8 Ma",          desc:"Homo erectus maîtrise le feu et est le premier hominidé à quitter l'Afrique.",                           cat:"prehistoire", importance:2,minZoom:2},
  {id:"p06",yearsAgo:1.5e6,  title:"Biface acheuléen",          date_label:"−1,5 Ma",          desc:"Le biface acheuléen, outil symétrique taillé des deux faces, représente un bond technologique majeur.",   cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p07",yearsAgo:800e3,  title:"Maîtrise du feu",           date_label:"−800 Ka",          desc:"La maîtrise contrôlée du feu transforme l'alimentation, la sociabilité et la survie.",                   cat:"prehistoire", importance:2,minZoom:2},
  {id:"p08",yearsAgo:400e3,  title:"Néandertal",                date_label:"−400 Ka",          desc:"Les Néandertaliens s'installent en Europe et au Proche-Orient. Ils enterrent leurs morts.",              cat:"prehistoire", importance:2,minZoom:2},
  {id:"p09",yearsAgo:300e3,  title:"Homo Sapiens",              date_label:"−300 000 ans",     desc:"Notre espèce apparaît au Maroc (Jebel Irhoud). Langage complexe, pensée symbolique.",                    cat:"prehistoire", importance:1,minZoom:0},
  {id:"p10",yearsAgo:120e3,  title:"Premières parures",         date_label:"−120 Ka",          desc:"Des coquillages percés et ocres colorés témoignent des premières pratiques ornementales.",               cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p11",yearsAgo:70e3,   title:"Sortie d'Afrique",          date_label:"−70 000 ans",      desc:"Une population d'Homo Sapiens quitte l'Afrique et colonise progressivement toute la planète.",           cat:"prehistoire", importance:2,minZoom:2},
  {id:"p12",yearsAgo:45e3,   title:"Colonisation Australie",    date_label:"−45 000 ans",      desc:"Les premiers humains atteignent l'Australie en traversant des bras de mer.",                             cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p13",yearsAgo:40e3,   title:"Art rupestre",              date_label:"−40 000 ans",      desc:"Grotte Chauvet : explosion de créativité humaine. Peintures, sculptures animales.",                      cat:"prehistoire", importance:2,minZoom:2},
  {id:"p14",yearsAgo:35e3,   title:"Disparition Néandertal",    date_label:"−35 000 ans",      desc:"Les derniers Néandertaliens disparaissent. Homo Sapiens est le dernier représentant du genre Homo.",     cat:"prehistoire", importance:2,minZoom:2},
  {id:"p15",yearsAgo:20e3,   title:"Vénus de Willendorf",       date_label:"−20 000 ans",      desc:"Les statuettes féminines du Gravettien témoignent d'une spiritualité déjà sophistiquée.",               cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p16",yearsAgo:15e3,   title:"Colonisation Amériques",    date_label:"−13 000 av.J.-C.", desc:"Les premiers humains traversent le détroit de Béring et colonisent les Amériques.",                     cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p17",yearsAgo:12e3,   title:"Révolution néolithique",    date_label:"~10 000 av.J.-C.", desc:"Agriculture, élevage, sédentarisation au Croissant Fertile. Les premières villes naissent.",            cat:"prehistoire", importance:1,minZoom:0},
  {id:"p18",yearsAgo:9e3,    title:"Domestication animaux",     date_label:"~7 000 av.J.-C.",  desc:"Chiens, moutons, chèvres, bovins domestiqués. L'élevage révolutionne l'alimentation humaine.",          cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p19",yearsAgo:7500,   title:"Çatal Höyük",               date_label:"~5 500 av.J.-C.",  desc:"L'une des premières villes : 10 000 habitants, art mural, sanctuaires en Turquie.",                    cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p20",yearsAgo:7e3,    title:"Mégalithes",                date_label:"~5 000 av.J.-C.",  desc:"Les premières structures mégalithiques (dolmens, menhirs) apparaissent en Europe.",                    cat:"prehistoire", importance:2,minZoom:2.5},
  {id:"p21",yearsAgo:6500,   title:"Invention de la roue",      date_label:"~4 500 av.J.-C.",  desc:"La roue est inventée en Mésopotamie, révolutionnant le transport et la poterie.",                      cat:"prehistoire", importance:2,minZoom:2.5},
  // ANTIQUITÉ
  {id:"h01",yearsAgo:5200,   title:"Écriture cunéiforme",       date_label:"~3 200 av.J.-C.",  desc:"Les Sumériens inventent l'écriture en Mésopotamie. La mémoire dépasse le cerveau individuel.",         cat:"histoire",    importance:1,minZoom:0},
  {id:"h02",yearsAgo:5100,   title:"Unification Égypte",        date_label:"~3 100 av.J.-C.",  desc:"Narmer unifie la Haute et Basse Égypte. Premier État centralisé de l'histoire.",                      cat:"histoire",    importance:2,minZoom:2},
  {id:"h03",yearsAgo:4900,   title:"Stonehenge",                date_label:"~2 900 av.J.-C.",  desc:"Construction de Stonehenge en Angleterre. Observatoire astronomique et lieu de culte.",               cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h04",yearsAgo:4560,   title:"Pyramides de Gizeh",        date_label:"~2 560 av.J.-C.",  desc:"Khéops fait construire la Grande Pyramide : 100 000 ouvriers, 20 ans, 2,3 millions de blocs.",        cat:"histoire",    importance:2,minZoom:2},
  {id:"h05",yearsAgo:4400,   title:"Premier empire — Akkad",    date_label:"~2 350 av.J.-C.",  desc:"Sargon d'Akkad crée le premier empire de l'histoire en unissant la Mésopotamie.",                    cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h06",yearsAgo:4200,   title:"Code de Hammurabi",         date_label:"~2 100 av.J.-C.",  desc:"Premier code de lois écrit de l'histoire, gravé sur une stèle babylonienne.",                        cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h07",yearsAgo:3500,   title:"Alphabet phénicien",        date_label:"~1 500 av.J.-C.",  desc:"Les Phéniciens développent le premier alphabet — ancêtre de tous les alphabets modernes.",           cat:"histoire",    importance:2,minZoom:2},
  {id:"h08",yearsAgo:3300,   title:"Moïse — Exode",             date_label:"~1 300 av.J.-C.",  desc:"L'Exode et la Torah posent les bases du monothéisme hébraïque, matrice des religions abrahamiques.",  cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h09",yearsAgo:3200,   title:"Guerre de Troie",           date_label:"~1 200 av.J.-C.",  desc:"La guerre de Troie inspire l'Iliade et l'Odyssée d'Homère. Fin du monde mycénien.",                  cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h10",yearsAgo:2800,   title:"Fondation de Rome",         date_label:"753 av.J.-C.",     desc:"Selon la tradition, Romulus fonde Rome sur 7 collines. Naissance d'un futur empire mondial.",        cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h11",yearsAgo:2550,   title:"Bouddha",                   date_label:"~563 av.J.-C.",    desc:"Siddhartha Gautama fonde le bouddhisme en Inde. Sa philosophie gagne toute l'Asie.",                 cat:"histoire",    importance:2,minZoom:2},
  {id:"h12",yearsAgo:2500,   title:"Grèce classique",           date_label:"~500 av.J.-C.",    desc:"Athènes invente la démocratie. Socrate, Platon, Aristote fondent la philosophie occidentale.",        cat:"histoire",    importance:1,minZoom:0},
  {id:"h13",yearsAgo:2490,   title:"Guerres médiques",          date_label:"490 av.J.-C.",     desc:"Marathon, Thermopyles, Salamine : la Grèce repousse la Perse et sauve sa civilisation.",             cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h14",yearsAgo:2380,   title:"Alexandre le Grand",        date_label:"356–323 av.J.-C.", desc:"En 13 ans, Alexandre conquiert un empire de la Grèce à l'Inde et diffuse la culture grecque.",       cat:"histoire",    importance:2,minZoom:2},
  {id:"h15",yearsAgo:2270,   title:"Chine unifiée — Qin",       date_label:"221 av.J.-C.",     desc:"Qin Shi Huang unifie la Chine et lance la Grande Muraille. Premier empire chinois.",                 cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h16",yearsAgo:2070,   title:"Mort de Jules César",       date_label:"44 av.J.-C.",      desc:"L'assassinat de César aux Ides de Mars entraîne la fin de la République romaine.",                   cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h17",yearsAgo:2029,   title:"Naissance de Jésus",        date_label:"~4 av.J.-C.",      desc:"Point de départ du calendrier grégorien. Naissance du christianisme.",                               cat:"histoire",    importance:2,minZoom:2},
  // MOYEN ÂGE
  {id:"h18",yearsAgo:1549,   title:"Chute de Rome",             date_label:"476 ap.J.-C.",     desc:"La chute de l'Empire romain d'Occident marque la fin de l'Antiquité et le début du Moyen Âge.",    cat:"histoire",    importance:2,minZoom:2},
  {id:"h19",yearsAgo:1455,   title:"Mahomet — Islam",           date_label:"570–632",          desc:"Mahomet reçoit la révélation. En un siècle, l'islam s'étend de l'Espagne à l'Inde.",               cat:"histoire",    importance:2,minZoom:2},
  {id:"h20",yearsAgo:1225,   title:"Charlemagne",               date_label:"800 ap.J.-C.",     desc:"Charlemagne couronné Empereur d'Occident. Il unifie l'Europe et relance la culture carolingienne.",  cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h21",yearsAgo:971,    title:"Schisme de 1054",           date_label:"1054",             desc:"Le christianisme se divise entre catholiques romains et orthodoxes orientaux.",                      cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h22",yearsAgo:930,    title:"Croisades",                 date_label:"1095–1291",        desc:"Les croisades remodèlent les relations Orient-Occident et favorisent les échanges culturels.",      cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h23",yearsAgo:810,    title:"Magna Carta",               date_label:"1215",             desc:"La Magna Carta limite le pouvoir royal. Premier jalon des libertés constitutionnelles.",            cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h24",yearsAgo:677,    title:"Peste Noire",               date_label:"1347–1351",        desc:"30 à 50 % de la population européenne meurt en 4 ans. Traumatisme civilisationnel.",               cat:"histoire",    importance:2,minZoom:2},
  {id:"h25",yearsAgo:600,    title:"Chute de Constantinople",   date_label:"1453",             desc:"Les Ottomans prennent Constantinople. Fin de l'Empire byzantin. Début de la Renaissance.",         cat:"histoire",    importance:2,minZoom:2.5},
  // TEMPS MODERNES
  {id:"h26",yearsAgo:575,    title:"Imprimerie Gutenberg",      date_label:"1450",             desc:"Les caractères mobiles révolutionnent la diffusion du savoir. La Renaissance s'accélère.",         cat:"histoire",    importance:2,minZoom:2},
  {id:"h27",yearsAgo:533,    title:"Colomb — Amériques",        date_label:"1492",             desc:"Colomb atteint les Amériques. La rencontre de deux mondes transforme l'histoire.",                 cat:"histoire",    importance:2,minZoom:2},
  {id:"h28",yearsAgo:508,    title:"Réforme protestante",       date_label:"1517 — Luther",    desc:"Luther publie ses 95 thèses. La Réforme brise l'unité du christianisme occidental.",              cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h29",yearsAgo:482,    title:"Copernic — héliocentrisme", date_label:"1543",             desc:"Copernic publie son système héliocentrique. La révolution scientifique commence.",                 cat:"histoire",    importance:2,minZoom:2},
  {id:"h30",yearsAgo:338,    title:"Newton — gravitation",      date_label:"1687",             desc:"Newton publie les Principia. La loi de la gravitation universelle explique le cosmos.",            cat:"histoire",    importance:2,minZoom:2},
  {id:"h31",yearsAgo:305,    title:"Révolution américaine",     date_label:"1776",             desc:"La Déclaration d'indépendance américaine proclame les droits naturels de l'Homme.",              cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h32",yearsAgo:295,    title:"Révolution industrielle",   date_label:"~1730–1840",       desc:"La machine à vapeur transforme production, transport et société. L'économie mondiale bascule.",    cat:"histoire",    importance:2,minZoom:2},
  {id:"h33",yearsAgo:236,    title:"Révolution française",      date_label:"1789",             desc:"Droits de l'Homme. Fin de la monarchie absolue. La démocratie moderne s'invente.",               cat:"histoire",    importance:1,minZoom:0},
  // XIXe
  {id:"h34",yearsAgo:221,    title:"Sacre de Napoléon",         date_label:"2 déc. 1804",      desc:"Napoléon se couronne Empereur à Notre-Dame. David immortalise la scène.",                        cat:"histoire",    importance:2,minZoom:2},
  {id:"h35",yearsAgo:210,    title:"Bataille de Waterloo",      date_label:"1815",             desc:"La défaite de Napoléon referme l'ère napoléonienne et remodèle l'Europe.",                      cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h36",yearsAgo:166,    title:"Darwin — L'évolution",      date_label:"1859",             desc:"Darwin publie L'Origine des espèces. La sélection naturelle révolutionne la biologie.",          cat:"histoire",    importance:2,minZoom:2},
  {id:"h37",yearsAgo:155,    title:"Unification Allemagne",      date_label:"1871",            desc:"Bismarck unifie l'Allemagne sous la Prusse. Le Reich modifie l'équilibre européen.",            cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h38",yearsAgo:146,    title:"Tour Eiffel",               date_label:"1889",             desc:"La Tour Eiffel est construite pour l'Exposition universelle. Symbole de la modernité.",          cat:"histoire",    importance:2,minZoom:2.5},
  // XXe
  {id:"h39",yearsAgo:120,    title:"Einstein — relativité",     date_label:"1905",             desc:"L'annus mirabilis d'Einstein : relativité restreinte, E=mc², effet photoélectrique.",           cat:"histoire",    importance:2,minZoom:2},
  {id:"h40",yearsAgo:111,    title:"1ère Guerre Mondiale",      date_label:"1914–1918",        desc:"18 millions de morts. Fin des grands empires. L'Europe est dévastée.",                         cat:"histoire",    importance:1,minZoom:0},
  {id:"h41",yearsAgo:108,    title:"Révolution bolchévique",    date_label:"1917",             desc:"Lénine renverse le tsar. L'URSS naît et change la géopolitique mondiale pour 70 ans.",          cat:"histoire",    importance:2,minZoom:2},
  {id:"h42",yearsAgo:95,     title:"Grande Dépression",         date_label:"1929",             desc:"Le krach boursier plonge le monde dans une crise économique sans précédent.",                   cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h43",yearsAgo:86,     title:"2ème Guerre Mondiale",      date_label:"1939–1945",        desc:"70 millions de morts. Shoah. Bombe atomique. Naissance de l'ONU.",                            cat:"histoire",    importance:1,minZoom:0},
  {id:"h44",yearsAgo:80,     title:"Bombe atomique",            date_label:"Août 1945",        desc:"Hiroshima et Nagasaki. L'humanité dispose de la capacité de s'autodétruire.",                  cat:"histoire",    importance:2,minZoom:2},
  {id:"h45",yearsAgo:68,     title:"Spoutnik — ère spatiale",   date_label:"1957",             desc:"L'URSS lance Spoutnik, premier satellite artificiel. La conquête spatiale commence.",          cat:"histoire",    importance:2,minZoom:2.5},
  {id:"h46",yearsAgo:56,     title:"Homme sur la Lune",         date_label:"21 juil. 1969",    desc:"Apollo 11 : Armstrong et Aldrin marchent sur la Lune. Premier pas sur un autre monde.",       cat:"histoire",    importance:1,minZoom:0},
  {id:"h47",yearsAgo:36,     title:"Chute du Mur de Berlin",    date_label:"9 nov. 1989",      desc:"Le mur tombe. Fin de la Guerre Froide. Réunification allemande.",                             cat:"histoire",    importance:2,minZoom:2},
  {id:"h48",yearsAgo:34,     title:"Web — internet",            date_label:"1991–1993",        desc:"Tim Berners-Lee invente le World Wide Web. Internet devient accessible à tous.",               cat:"histoire",    importance:2,minZoom:2},
  {id:"h49",yearsAgo:24,     title:"11 Septembre",              date_label:"11 sept. 2001",    desc:"Les attentats du World Trade Center changent la géopolitique mondiale.",                       cat:"histoire",    importance:2,minZoom:2},
  {id:"h50",yearsAgo:18,     title:"iPhone — ère mobile",       date_label:"2007",             desc:"L'iPhone révolutionne les usages. Internet devient mobile et universel.",                      cat:"histoire",    importance:2,minZoom:2},
  {id:"h51",yearsAgo:5,      title:"Covid-19",                  date_label:"2020",             desc:"La pandémie paralyse le monde. 6 millions de morts. Vaccination massive inédite.",            cat:"histoire",    importance:2,minZoom:2},
  {id:"h52",yearsAgo:3,      title:"IA générative",             date_label:"2022 — ChatGPT",   desc:"ChatGPT démocratise l'IA générative. Une nouvelle révolution technologique commence.",        cat:"histoire",    importance:2,minZoom:2},
];

// Pre-written rich content for static events — no API call needed
const STATIC_CONTENT = {
"c01":`<p>Il y a 13,8 milliards d'années, tout ce qui existe — espace, temps, matière, énergie — jaillit d'un état de densité et de chaleur infinies. Ce n'est pas une explosion <em>dans</em> l'espace : c'est l'espace lui-même qui commence à exister et à s'étendre.</p><h3>Contexte</h3><p>La physique moderne ne peut décrire ce qui précède le Big Bang : les lois de la relativité générale s'effondrent à la singularité initiale. Dans le premier millionième de seconde, l'univers est un plasma de quarks et de gluons à des températures de plusieurs milliers de milliards de degrés.</p><h3>Ce qui s'est passé</h3><p>En moins de trois minutes, les premiers noyaux d'hydrogène et d'hélium se forment. Il faudra 380 000 ans pour que l'univers refroidisse assez et devienne transparent — libérant le <strong>fond diffus cosmologique</strong>, cette lumière primordiale que nous captons encore aujourd'hui avec nos télescopes.</p><h3>Héritage</h3><p>Le Big Bang est le fondement de toute cosmologie moderne. Il explique l'expansion de l'univers, l'abondance des éléments légers, et prédit avec une précision extraordinaire la température du rayonnement de fond. C'est l'une des théories les mieux vérifiées de la science.</p><h3>Le saviez-vous ?</h3><p>Le terme « Big Bang » fut inventé en 1949 par l'astronome Fred Hoyle… pour <em>se moquer</em> de la théorie. Partisan d'un univers statique et éternel, il ne croyait pas à cette idée d'une origine explosive. Ironie de l'histoire : le surnom qu'il lui donna est resté.</p>`,
"c06":`<p>Il y a dix milliards d'années, dans un recoin de l'univers en expansion, des nuages de gaz et de poussières issus de supernovæ mortes commencent à s'effondrer sous leur propre gravité. De cet effondrement naîtra notre galaxie : la Voie Lactée.</p><h3>Contexte</h3><p>L'univers a alors déjà trois milliards d'années. Les premières générations d'étoiles ont vécu, explosé, et enrichi le cosmos en éléments plus lourds que l'hydrogène. Ces « cendres stellaires » constituent la matière première de notre galaxie.</p><h3>Ce qui s'est passé</h3><p>La Voie Lactée se forme par fusions successives de proto-galaxies et d'amas d'étoiles. Son disque spiral, ses bras, son bulbe central et son halo de matière noire se mettent progressivement en place. Elle contiendra à terme plus de <strong>200 milliards d'étoiles</strong>.</p><h3>Héritage</h3><p>La Voie Lactée est notre adresse cosmique. Elle abrite notre Soleil, notre Terre, et représente l'écosystème dans lequel toute vie connue s'est développée. Son trou noir central, Sagittarius A*, pèse 4 millions de fois la masse du Soleil.</p><h3>Le saviez-vous ?</h3><p>La Voie Lactée est en collision lente avec la galaxie d'Andromède. Dans environ 4,5 milliards d'années, les deux galaxies fusionneront en une elliptique géante. Les étoiles, trop espacées, ne se percuteront pas — mais le Soleil sera probablement éjecté dans une nouvelle orbite.</p>`,
"g01":`<p>Il y a 4,6 milliards d'années, un nuage de gaz et de poussières interstellaires se met à tourner sur lui-même et à s'effondrer. En quelques millions d'années, la matière s'agglomère en un disque tournoyant dont le centre s'embrase : notre étoile est née.</p><h3>Contexte</h3><p>Une supernova voisine aurait pu déclencher l'effondrement du nuage proto-solaire. Les éléments lourds qu'elle a forgés — fer, uranium, or — sont désormais incorporés dans notre système solaire, faisant de nous littéralement des <em>poussières d'étoiles</em>.</p><h3>Ce qui s'est passé</h3><p>La fusion nucléaire s'allume au cœur du Soleil, transformant 600 millions de tonnes d'hydrogène en hélium chaque seconde. Le disque de gaz et poussières restant donnera naissance aux planètes. En quelques dizaines de millions d'années, le système solaire prend sa forme actuelle.</p><h3>Héritage</h3><p>Le Soleil fournit l'énergie qui permet la vie sur Terre depuis des milliards d'années. Il entrera en phase géante rouge dans 5 milliards d'années, engloutissant probablement Mercure et Vénus.</p><h3>Le saviez-vous ?</h3><p>Le Soleil est une étoile de troisième génération : il contient des éléments forgés par au moins deux générations d'étoiles mortes avant lui. Chaque atome de fer dans notre sang a été créé dans le cœur explosif d'une étoile disparue il y a des milliards d'années.</p>`,
"g03":`<p>Il y a 4,5 milliards d'années, dans le disque tournoyant qui entoure le jeune Soleil, des grains de poussière s'agglomèrent, grossissent, et finissent par former la troisième planète du système solaire. La Terre est née dans la violence et la chaleur.</p><h3>Contexte</h3><p>Le processus d'accrétion dure plusieurs dizaines de millions d'années. La proto-Terre est entièrement en fusion, bombardée en permanence par des météorites et des planétésimaux. Sa surface ressemble à un océan de lave bouillonnant.</p><h3>Ce qui s'est passé</h3><p>Les éléments les plus lourds — fer, nickel — coulent vers le centre pour former le noyau. Les plus légers remontent en surface. Environ 50 millions d'années après la formation du Soleil, un corps de la taille de Mars percute la proto-Terre : les débris formeront la Lune.</p><h3>Héritage</h3><p>La Terre est la seule planète connue abritant la vie. Sa position dans la zone habitable du Soleil, son atmosphère, son champ magnétique et sa Lune stabilisatrice en font un environnement exceptionnellement favorable à l'émergence du vivant.</p><h3>Le saviez-vous ?</h3><p>La Terre ne « tourne pas autour du Soleil » exactement. Les deux corps orbitent autour de leur centre de masse commun — le barycentre — qui se trouve à l'intérieur du Soleil mais pas exactement en son centre. Chaque planète du système solaire fait légèrement « vaciller » notre étoile.</p>`,
"g06":`<p>Il y a quatre milliards d'années, la Terre se refroidit progressivement. La vapeur d'eau accumulée dans l'atmosphère se condense et tombe en pluie pendant des millions d'années. Les premiers océans recouvrent peu à peu la planète.</p><h3>Contexte</h3><p>La Terre venait de traverser l'Hadéen, une époque de bombardements intenses et de chaleur extrême. La surface était hostile à toute vie. Le refroidissement progressif et l'arrivée d'eau — en partie apportée par des comètes et météorites — permet enfin la formation d'eau liquide stable.</p><h3>Ce qui s'est passé</h3><p>Des études sur des cristaux de zircon montrent que de l'eau liquide existait déjà il y a 4,4 milliards d'années. Les premiers océans couvrent sans doute la majeure partie du globe, les continents n'étant alors que de petits îlots émergés dispersés.</p><h3>Héritage</h3><p>L'eau est le solvant universel de la vie. Les océans ont régulé le climat terrestre, dissous les minéraux nécessaires à la chimie du vivant, et fourni le milieu où la vie allait apparaître. Ils recouvrent encore aujourd'hui 71 % de la surface terrestre.</p><h3>Le saviez-vous ?</h3><p>L'eau des océans n'est pas entièrement originaire de la Terre. Une partie significative — peut-être 20 à 30 % — aurait été apportée par des astéroïdes et comètes carbonés lors du Grand Bombardement tardif. Chaque gorgée d'eau contient des molécules nées dans l'espace interstellaire.</p>`,
"b02":`<p>Il y a 3,5 milliards d'années, dans des eaux chaudes peu profondes, des communautés de bactéries construisent des structures laminées appelées stromatolites. Ces amas microbiologiques sont les premières traces indubitables de vie sur Terre.</p><h3>Contexte</h3><p>La Terre est alors très différente : atmosphère quasi dépourvue d'oxygène, rayonnements ultraviolets intenses, océans chauds et riches en minéraux. C'est dans cet environnement hostile que la chimie du vivant a trouvé les conditions pour émerger.</p><h3>Ce qui s'est passé</h3><p>Les cyanobactéries forment des tapis microbiens qui piègent les sédiments couche après couche, créant ces dômes calcaires que l'on retrouve fossilisés en Australie (Pilbara) et au Canada. Elles pratiquent déjà la <strong>photosynthèse</strong>, libérant de l'oxygène comme déchet.</p><h3>Héritage</h3><p>Ces premiers organismes ont littéralement construit la biosphère terrestre. En produisant de l'oxygène pendant des milliards d'années, ils ont transformé l'atmosphère et rendu possible toute vie complexe. Des stromatolites vivants existent encore aujourd'hui à Shark Bay, en Australie.</p><h3>Le saviez-vous ?</h3><p>Les stromatolites furent d'abord identifiés comme des structures géologiques inanimées. Ce n'est qu'en 1954 que le géologue Stanley Tyler reconnut leur origine biologique dans des roches du Canada vieilles de 2 milliards d'années. La vie avait été là depuis si longtemps qu'on ne la voyait plus.</p>`,
"b04":`<p>Il y a 2,4 milliards d'années, les cyanobactéries ont trop bien travaillé. L'oxygène qu'elles libèrent depuis des centaines de millions d'années commence à s'accumuler dans l'atmosphère. Pour la plupart des organismes vivants de l'époque, c'est une catastrophe.</p><h3>Contexte</h3><p>Pendant des milliards d'années, l'oxygène produit était immédiatement neutralisé : il oxydait le fer dissous dans les océans (formant les célèbres formations de fer rubanées), les roches des continents, et les gaz volcaniques. Mais un jour, tout ce qui pouvait être oxydé l'avait été.</p><h3>Ce qui s'est passé</h3><p>L'oxygène libre commence à s'accumuler dans l'atmosphère. Pour les micro-organismes anaérobies qui dominaient la Terre, ce gaz est un poison mortel. <strong>La première grande extinction de masse</strong> de l'histoire du vivant décime une large partie de la biosphère.</p><h3>Héritage</h3><p>Cette catastrophe est aussi la plus grande opportunité évolutive de l'histoire : elle ouvre la voie à la respiration aérobie, bien plus efficace énergétiquement que la fermentation. Les organismes capables d'utiliser l'oxygène vont dominer la planète — nous en sommes les descendants.</p><h3>Le saviez-vous ?</h3><p>La Grande Oxydation a aussi provoqué la première glaciation planétaire mondiale. L'oxygène a réagi avec le méthane atmosphérique — un puissant gaz à effet de serre — le convertissant en CO₂ moins efficace. La Terre s'est alors couverte de glace des pôles aux tropiques.</p>`,
"b08":`<p>Il y a 541 millions d'années, dans les mers du Cambrien, quelque chose d'extraordinaire se produit. En l'espace de quelques millions d'années — un clin d'œil à l'échelle géologique — la quasi-totalité des grands plans d'organisation animaux apparaissent simultanément.</p><h3>Contexte</h3><p>Pendant des centaines de millions d'années, la vie était restée simple : bactéries, algues, quelques organismes mous. Puis, brusquement, une diversification explosive. Les causes exactes restent débattues : enrichissement en oxygène, changements climatiques post-glaciation, ou développement des yeux comme moteur évolutif.</p><h3>Ce qui s'est passé</h3><p>Les fossiles de la faune de Burgess (Canada) et de Chengjiang (Chine) révèlent une incroyable diversité : arthropodes, mollusques, échinodermes, cordés — ancêtres des vertébrés. Certains animaux, comme <strong>Anomalocaris</strong>, n'ont aucun équivalent moderne.</p><h3>Héritage</h3><p>L'explosion cambrienne a fixé le « plan de construction » de tous les animaux modernes. Chaque vertébré — poisson, grenouille, dinosaure, humain — descend des organismes apparus dans ces quelques millions d'années remarquables.</p><h3>Le saviez-vous ?</h3><p>Charles Darwin était perturbé par l'explosion cambrienne, qu'il considérait comme une réfutation potentielle de sa théorie de l'évolution graduelle. Il espérait que des fossiles précambriens seraient découverts pour combler le vide. La paléontologie moderne lui a donné partiellement raison : des précurseurs existaient, mais la diversification resta remarquablement rapide.</p>`,
"b17":`<p>Il y a 252 millions d'années, la vie sur Terre frôle l'extinction totale. En quelques centaines de milliers d'années, 96 % des espèces marines et 70 % des espèces terrestres disparaissent. C'est la plus grande crise biologique de toute l'histoire de notre planète.</p><h3>Contexte</h3><p>La fin du Permien est marquée par un volcanisme colossal : les trapps sibériens libèrent des millions de kilomètres cubes de lave, injectant dans l'atmosphère des quantités cataclysmiques de CO₂ et de méthane. Le réchauffement climatique brutal qui s'ensuit acidifie les océans.</p><h3>Ce qui s'est passé</h3><p>Les océans se réchauffent, perdent leur oxygène, s'acidifient. Les coraux, les trilobites, les brachiopodes disparaissent. Sur terre, les forêts brûlent ou se dessèchent. Il faudra <strong>10 millions d'années</strong> pour que la biodiversité retrouve un niveau comparable à celui d'avant la crise.</p><h3>Héritage</h3><p>La Grande Extinction du Permien-Trias a profondément remodelé la biosphère. En éliminant les espèces dominantes, elle a ouvert l'espace écologique qui permettra aux archosaures — ancêtres des dinosaures et des crocodiles — de dominer l'ère suivante.</p><h3>Le saviez-vous ?</h3><p>Des études récentes sur les roches marines de l'époque révèlent que les océans ont atteint des températures de 40°C dans certaines régions tropicales — au-delà du seuil de survie de la plupart des organismes marins. Le Permien-Trias nous offre un miroir troublant des conséquences possibles d'un réchauffement climatique non contrôlé.</p>`,
"b18":`<p>Il y a 230 millions d'années, au Trias moyen, un groupe de reptiles discrets commence à se démarquer de ses cousins. Ces premiers dinosaures sont de petites créatures bipèdes, guère plus impressionnantes qu'un grand lézard. Rien ne laisse présager qu'ils vont régner 165 millions d'années.</p><h3>Contexte</h3><p>La grande extinction du Permien a laissé la Terre dévastée. Les archosaures — un groupe incluant les ancêtres des dinosaures et des crocodiles — profitent du vide laissé pour se diversifier rapidement. Le climat chaud et humide du Trias favorise leur expansion.</p><h3>Ce qui s'est passé</h3><p>Les premiers dinosaures vrais — Eoraptor, Herrerasaurus — apparaissent en Amérique du Sud. Bipèdes, agiles, probablement endothermes, ils prennent rapidement l'avantage sur leurs concurrents. À la fin du Trias, ils dominent déjà les écosystèmes terrestres mondiaux.</p><h3>Héritage</h3><p>Les dinosaures ont dominé la Terre pendant 165 millions d'années — contre seulement 300 000 ans pour Homo Sapiens. Ils ne se sont pas éteints : leurs descendants directs, les oiseaux, constituent le groupe de vertébrés terrestres le plus diversifié aujourd'hui avec 10 000 espèces.</p><h3>Le saviez-vous ?</h3><p>Contrairement à l'image populaire, la plupart des dinosaures étaient recouverts de plumes ou de protoplumes. Le T-Rex lui-même portait probablement des plumes filamenteuses sur une partie de son corps. La frontière entre dinosaure et oiseau est bien plus floue qu'on ne le pensait il y a trente ans.</p>`,
"b23":`<p>Il y a 66 millions d'années, une roche de 10 kilomètres de diamètre percute la péninsule du Yucatán à 70 000 km/h. En quelques heures, elle déclenche la fin d'un monde : celui des dinosaures non-aviaires. C'est l'extinction de masse la plus célèbre de l'histoire.</p><h3>Contexte</h3><p>La Terre connaissait déjà des tensions : le volcanisme des trapps du Deccan réchauffait le climat depuis 200 000 ans. L'astéroïde tombe dans un moment de fragilité biologique. L'impact libère une énergie équivalente à des milliards de bombes atomiques.</p><h3>Ce qui s'est passé</h3><p>L'impact projette des milliards de tonnes de poussière et de suie dans la stratosphère, bloquant la lumière solaire pendant des mois. Les températures chutent brutalement. Les chaînes alimentaires s'effondrent. <strong>75 % des espèces</strong> disparaissent en quelques milliers d'années.</p><h3>Héritage</h3><p>La disparition des dinosaures libère des niches écologiques immenses. Les mammifères — discrets depuis 160 millions d'années — vont se diversifier explosiquement. Sans cet astéroïde, nos ancêtres seraient peut-être restés de petits insectivores nocturnes. L'humanité doit son existence à cette catastrophe.</p><h3>Le saviez-vous ?</h3><p>Le cratère de Chicxulub, au Mexique, mesure 180 km de diamètre et 20 km de profondeur. Il a été identifié en 1978 par des géophysiciens cherchant du pétrole — pas de l'histoire. L'astéroïde est tombé dans une zone riche en soufre, ce qui a aggravé considérablement les effets de l'impact.</p>`,
"b27":`<p>Il y a environ 7 millions d'années, dans les forêts et savanes d'Afrique orientale, une population de grands singes commence à se distinguer de ses cousins. La lignée qui mènera à l'Homme vient de se séparer de celle qui donnera les chimpanzés.</p><h3>Contexte</h3><p>Le climat africain se refroidit et s'assèche progressivement. Les forêts reculent, les savanes s'étendent. Dans ce contexte, différentes stratégies évolutives émergent : certains primates restent arboricoles, d'autres s'adaptent aux milieux ouverts. Le bipédisme devient un avantage sélectif décisif.</p><h3>Ce qui s'est passé</h3><p>Des fossiles comme Sahelanthropus tchadensis (7 Ma, Tchad) ou Orrorin tugenensis (6 Ma, Kenya) témoignent de cette transition. Ces hominidés primitifs marchaient probablement déjà partiellement debout, libérant les mains pour d'autres usages. Le cerveau, lui, n'a pas encore commencé sa croissance spectaculaire.</p><h3>Héritage</h3><p>Cette séparation est le point de départ de l'aventure humaine. En 7 millions d'années, notre lignée passera d'un primate forestier à une espèce capable de marcher sur la Lune, de peindre la Joconde et d'écrire des symphonies.</p><h3>Le saviez-vous ?</h3><p>Les génomes humain et chimpanzé sont identiques à 98,7 %. Pourtant, ces 1,3 % de différence encodent tout ce qui nous distingue : langage, conscience réflexive, écriture, culture. De très petites différences génétiques peuvent produire des organismes extraordinairement différents.</p>`,
"p09":`<p>Il y a 300 000 ans, sur les pentes du Jebel Irhoud au Maroc, des individus possédant tous les traits anatomiques modernes mènent leur vie quotidienne. Ils sont parmi les plus anciens Homo Sapiens jamais identifiés. Notre histoire vient de commencer.</p><h3>Contexte</h3><p>L'Afrique est alors parsemée de différentes populations d'hominidés. Les conditions climatiques fluctuent constamment. C'est dans ce contexte de pression évolutive intense que le cerveau humain atteint sa taille et sa complexité actuelles, permettant un langage articulé et une pensée symbolique sans équivalent.</p><h3>Ce qui s'est passé</h3><p>Homo Sapiens se distingue par un crâne arrondi, un visage plat, et un cerveau dont les lobes frontaux développés permettent la planification, l'abstraction et le langage. Ces capacités cognitives exceptionnelles donnent à notre espèce un avantage décisif sur tous ses compétiteurs.</p><h3>Héritage</h3><p>Homo Sapiens est aujourd'hui la seule espèce humaine survivante, présente sur tous les continents. En 300 000 ans, elle a radicalement transformé la planète, maîtrisé le feu, l'agriculture, l'écriture, la technologie — et pour la première fois dans l'histoire du vivant, une espèce s'interroge sur ses propres origines.</p><h3>Le saviez-vous ?</h3><p>Les fossiles de Jebel Irhoud ont d'abord été datés des années 1960 à 130 000 ans. C'est en 2017 que des techniques de datation plus précises ont repoussé leur âge à 300 000 ans, reculant de 100 000 ans la naissance de notre espèce et montrant qu'elle est apparue non pas en Afrique de l'Est mais dans toute l'Afrique.</p>`,
"p17":`<p>Il y a environ 10 000 ans, au Croissant Fertile entre Tigre et Euphrate, des populations de chasseurs-cueilleurs font quelque chose d'inédit dans l'histoire de la vie : elles commencent à contrôler délibérément la reproduction des plantes et des animaux. La révolution néolithique change tout.</p><h3>Contexte</h3><p>La fin du dernier âge glaciaire, il y a 12 000 ans, crée des conditions climatiques plus stables et humides. Des plantes sauvages abondantes — blé, orge, lentilles — et des animaux domesticables — moutons, chèvres, porcs, bovins — sont disponibles dans cette région.</p><h3>Ce qui s'est passé</h3><p>L'agriculture et l'élevage permettent de nourrir des populations bien plus denses. Les villages deviennent des villes. La sédentarisation entraîne la spécialisation du travail, les hiérarchies sociales, la propriété, l'écriture, le commerce. En quelques millénaires, tout le tissu de la civilisation humaine se tisse.</p><h3>Héritage</h3><p>La révolution néolithique est probablement la transformation la plus profonde jamais opérée par une espèce sur son environnement et sa propre organisation sociale. Elle est à l'origine de toutes les civilisations qui ont suivi, et directement de notre monde contemporain.</p><h3>Le saviez-vous ?</h3><p>La transition vers l'agriculture n'a pas amélioré immédiatement la qualité de vie. Les squelettes néolithiques montrent des tailles réduites, des carences nutritionnelles et de nouvelles maladies infectieuses par rapport aux chasseurs-cueilleurs. L'agriculture a permis la croissance démographique — pas nécessairement le bonheur individuel.</p>`,
"h01":`<p>Vers 3 200 avant notre ère, dans les cités-États sumériennes de Mésopotamie, des scribes tracent des marques en forme de coin sur des tablettes d'argile. Ces signes représentent d'abord des quantités de grain et de bétail. Sans le savoir, ils viennent d'inventer l'écriture.</p><h3>Contexte</h3><p>Les sociétés sumériennes sont devenues si complexes — commerce longue distance, temples redistributeurs, armées professionnelles — que la mémoire humaine ne suffit plus à gérer les transactions. L'écriture naît d'une nécessité comptable, pas d'un désir artistique.</p><h3>Ce qui s'est passé</h3><p>En quelques siècles, le cunéiforme évolue des pictogrammes vers des signes abstraits représentant des sons. Les scribes peuvent bientôt noter non seulement des comptes, mais des lois, des poèmes, des mythes. L'<strong>Épopée de Gilgamesh</strong> — première grande œuvre littéraire — est couchée sur argile vers 2 100 av.J.-C.</p><h3>Héritage</h3><p>L'écriture a permis la transmission fidèle du savoir à travers le temps et l'espace, la coordination de sociétés de plus en plus complexes, et la création de la littérature, de la science et du droit. Elle marque le début de ce que nous appelons « l'Histoire ».</p><h3>Le saviez-vous ?</h3><p>L'écriture a été inventée indépendamment au moins quatre fois dans l'histoire : en Mésopotamie (~3 200 av.J.-C.), en Égypte (~3 100 av.J.-C.), en Chine (~1 200 av.J.-C.) et en Méso-Amérique (~900 av.J.-C.). Chaque fois, des sociétés suffisamment complexes ont ressenti le même besoin et trouvé des solutions similaires.</p>`,
"h12":`<p>Au Ve siècle avant notre ère, Athènes connaît une floraison intellectuelle et politique sans précédent dans l'histoire. En quelques décennies, une cité de quelques dizaines de milliers d'habitants invente la démocratie, la philosophie, le théâtre, et pose les fondations de la pensée occidentale.</p><h3>Contexte</h3><p>Les victoires contre les Perses à Marathon (490 av.J.-C.) et Salamine (480 av.J.-C.) ont dopé la confiance athénienne. Périclès, au pouvoir depuis 461, finance une politique culturelle et architecturale ambitieuse. Le commerce maritime enrichit la cité et attire des esprits de tout le monde grec.</p><h3>Ce qui s'est passé</h3><p>Socrate questionne dans les rues, Platon fonde l'Académie, Aristote systématise toutes les sciences. Le Parthénon s'élève sur l'Acropole. Sophocle et Euripide inventent la tragédie. Hérodote et Thucydide créent l'histoire comme discipline. En quelques décennies, tout cela — simultanément.</p><h3>Héritage</h3><p>La Grèce classique est la matrice intellectuelle de l'Occident. Démocratie, philosophie, logique formelle, sciences naturelles, histoire critique, théâtre — ces outils conceptuels ont traversé les siècles et structurent encore notre façon de penser, gouverner et créer.</p><h3>Le saviez-vous ?</h3><p>La démocratie athénienne excluait femmes, esclaves et étrangers, qui représentaient 80-90 % de la population. Sur 250 000 habitants d'Athènes, seuls 30 000 à 40 000 citoyens pouvaient voter. Mais le principe révolutionnaire — que les citoyens se gouvernent eux-mêmes — allait traverser les millénaires.</p>`,
"h33":`<p>En 1789, la France est au bord de la faillite. Louis XVI convoque les États Généraux pour trouver de l'argent. Il déclenche sans le savoir la révolution politique la plus influente de l'histoire moderne. En quelques mois, un monde millénaire s'effondre.</p><h3>Contexte</h3><p>Les Lumières ont diffusé des idées nouvelles : droits naturels, contrat social, séparation des pouvoirs. L'Amérique vient de montrer qu'une révolution démocratique est possible. La famine et les inégalités fiscales extrêmes entre le tiers état et la noblesse créent une poudrière.</p><h3>Ce qui s'est passé</h3><p>La Bastille tombe le 14 juillet. La Déclaration des droits de l'Homme est adoptée en août. La monarchie est abolie, le roi guillotiné. La Terreur fait des milliers de victimes. Puis Napoléon, sorti du chaos révolutionnaire, exporte les idées de la Révolution dans toute l'Europe à la pointe des baïonnettes.</p><h3>Héritage</h3><p>Liberté, égalité, fraternité. La Révolution française a planté les germes de la démocratie moderne, de la laïcité, du nationalisme, des droits civiques et du droit international. Elle reste une référence incontournable pour tous les mouvements politiques modernes.</p><h3>Le saviez-vous ?</h3><p>La Marseillaise, hymne national français depuis 1795, a été composée en une nuit en avril 1792 par Claude Joseph Rouget de Lisle, officier du génie à Strasbourg. Il l'appelait « Chant de guerre pour l'armée du Rhin ». Ce sont des volontaires de Marseille qui l'ont popularisée en la chantant en marchant vers Paris.</p>`,
"h40":`<p>Le 28 juin 1914, l'archiduc François-Ferdinand d'Autriche est assassiné à Sarajevo. Cet acte déclenche un mécanisme d'alliances et de mobilisations qui plonge l'Europe dans la guerre la plus meurtrière qu'elle ait jamais connue.</p><h3>Contexte</h3><p>L'Europe de 1914 est un baril de poudre : rivalités coloniales entre grandes puissances, nationalisme exacerbé dans les Balkans, course aux armements, système d'alliances rigides (Triple Entente vs Triple Alliance). Il ne manquait qu'une étincelle.</p><h3>Ce qui s'est passé</h3><p>En quelques semaines, toutes les grandes puissances européennes entrent en guerre. Les tranchées s'installent sur le front occidental. Verdun, la Somme, Gallipoli — des batailles industrielles d'une brutalité sans précédent font des centaines de milliers de morts en quelques jours. <strong>18 millions de personnes</strong> mourront avant l'armistice du 11 novembre 1918.</p><h3>Héritage</h3><p>La Grande Guerre détruit quatre empires (ottoman, austro-hongrois, russe, allemand), redessine la carte de l'Europe et du Moyen-Orient, et prépare directement la Seconde Guerre mondiale. Elle marque la fin de la Belle Époque et l'entrée dans le siècle des extrêmes.</p><h3>Le saviez-vous ?</h3><p>Le 11 novembre 1918, à 11h du matin, l'armistice entre en vigueur. Mais les derniers combats eurent lieu jusqu'à la dernière minute. Ce matin-là, plus de soldats moururent que n'importe quel autre jour de la guerre — des deux côtés — parce que certains officiers continuèrent à donner l'assaut jusqu'au dernier instant.</p>`,
"h43":`<p>Le 1er septembre 1939, les chars allemands franchissent la frontière polonaise. Deux jours plus tard, la France et le Royaume-Uni déclarent la guerre à l'Allemagne. Le monde bascule dans le conflit le plus meurtrier de son histoire.</p><h3>Contexte</h3><p>La montée du fascisme en Europe, les humiliations du Traité de Versailles, la Grande Dépression et la faiblesse des démocraties face aux dictatures avaient rendu le conflit presque inévitable. Hitler avait engagé l'Allemagne dans une voie expansionniste que les accords de Munich de 1938 n'avaient fait qu'encourager.</p><h3>Ce qui s'est passé</h3><p>Six ans de guerre totale : la Shoah extermine six millions de Juifs, les bombes atomiques rasent Hiroshima et Nagasaki, 70 millions de personnes meurent. L'Europe est dévastée. En 1945, les États-Unis et l'URSS émergent comme superpuissances rivales d'un monde reconfiguré.</p><h3>Héritage</h3><p>La Seconde Guerre mondiale a redessiné le monde : création de l'ONU, Déclaration universelle des droits de l'Homme, décolonisation, construction européenne, Guerre Froide. L'humanité a appris — au prix de 70 millions de morts — que le nationalisme extrême et les totalitarismes mènent à l'abîme.</p><h3>Le saviez-vous ?</h3><p>La bataille de Stalingrad (1942-1943) fut à elle seule plus meurtrière que toutes les pertes américaines, britanniques et françaises réunies pendant toute la guerre. L'URSS a perdu 27 millions de personnes — civils compris — dans le conflit, contre 400 000 pour les États-Unis. Le « front de l'Est » reste le plus grand théâtre de guerre de toute l'histoire humaine.</p>`,
"h46":`<p>Le 20 juillet 1969 à 20h17 UTC, le module lunaire Eagle se pose dans la mer de la Tranquillité. Six heures plus tard, Neil Armstrong pose le pied sur la Lune et prononce ses mots historiques. Pour la première fois, un être vivant de la Terre marche sur un autre monde.</p><h3>Contexte</h3><p>La course spatiale entre États-Unis et URSS, lancée par Spoutnik en 1957, a conduit Kennedy à annoncer en 1961 l'objectif d'envoyer un homme sur la Lune avant la fin de la décennie. Le programme Apollo mobilise 400 000 ingénieurs, techniciens et scientifiques et représente 4 % du budget fédéral américain.</p><h3>Ce qui s'est passé</h3><p>Apollo 11 décolle le 16 juillet. Après trois jours de voyage, Armstrong et Aldrin descendent en Eagle tandis que Collins reste en orbite. Les deux astronautes passent 21 heures sur la Lune, collectent 21 kg de roches lunaires, et plantent un drapeau américain. Ils rentrent sains et saufs le 24 juillet.</p><h3>Héritage</h3><p>Apollo 11 reste l'exploit technologique le plus audacieux de l'histoire humaine. Il a démontré que l'humanité peut quitter sa planète natale et explorer d'autres mondes. Il a aussi produit l'une des images les plus célèbres de tous les temps : la Terre vue depuis la Lune.</p><h3>Le saviez-vous ?</h3><p>L'ordinateur de guidage d'Apollo 11 avait moins de puissance de calcul qu'une calculette moderne. Il fonctionnait à 0,043 MHz avec 4 Ko de RAM. Votre smartphone est des millions de fois plus puissant. Nixon avait préparé un discours en cas de catastrophe, au cas où Armstrong et Aldrin ne pourraient pas décoller de la Lune.</p>`,
};

function fmt(ya) {
  if (ya >= 1e9) return `${(ya/1e9).toFixed(1)} Ga`;
  if (ya >= 1e6) return `${Math.round(ya/1e6)} Ma`;
  if (ya >= 1e3) return `${Math.round(ya/1e3)} Ka`;
  const yr = Math.round(2025-ya);
  return yr <= 0 ? `${Math.abs(yr)} av.J.-C.` : yr.toString();
}
function epochAt(ya) { for (const e of EPOCHS) if (ya<=e.from&&ya>=e.to) return e; return EPOCHS[EPOCHS.length-1]; }
function makeCoord(vs,ve,W) {
  const ls=L(vs),le=L(ve),range=ls-le;
  return { toX:(ya)=>((ls-L(ya))/range)*W, toYa:(x)=>Math.pow(10,ls-(x/W)*range), logRange:range };
}
function zoomLvl(vs,ve){ return Math.max(0,Math.log10(UA)-(L(vs)-L(ve))); }

function buildPrompt(startYa,endYa){
  const span=startYa-endYa;
  let gran,ex;
  if(span>5e9){gran="cosmique, milliards d'années";ex="supernovæ, quasars, nébuleuses";}
  else if(span>500e6){gran="géologique, centaines de Ma";ex="glaciations, extinctions secondaires";}
  else if(span>50e6){gran="paléontologique, millions d'années";ex="faunes locales, flores, migrations";}
  else if(span>1e6){gran="préhistorique, centaines de Ka";ex="sites archéologiques, pratiques culturelles";}
  else if(span>50e3){gran="néolithique, millénaires";ex="fondations de cités, inventions matérielles";}
  else if(span>5000){gran="antique/médiéval, siècles";ex="batailles, traités, inventions, personnages";}
  else if(span>200){gran="historique précis, décennies";ex="événements politiques, scientifiques, culturels";}
  else{gran="très précis, années";ex="personnes, œuvres, découvertes précises";}
  return `Historien expert. Génère des événements supplémentaires entre ${fmt(startYa)} et ${fmt(Math.max(endYa,0.1))} avant aujourd'hui. Granularité : ${gran}. Exemples : ${ex}.
RÈGLES : répondre UNIQUEMENT par un tableau JSON valide (sans markdown). 4 à 6 événements, tous dans la fenêtre. Ne pas répéter les événements déjà présents dans la base (Big Bang, Terre, dinosaures, Napoléon, etc.).
Format : [{"yearsAgo":number,"title":"max 5 mots","date_label":"date lisible","desc":"1 phrase","cat":"cosmique|geologique|biologique|prehistoire|histoire"}]`;
}

function drawAll(canvas, miniCanvas, params) {
  const {vs,ve,aiEvents,selectedId,hoveredId} = params;
  const W=canvas.width, H=canvas.height;
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,W,H);
  const coord=makeCoord(vs,ve,W), {toX}=coord;
  const zl=zoomLvl(vs,ve);
  const LINE_Y=Math.round(H*0.44), TREE_TOP=Math.round(H*0.56), TREE_H=Math.round(H*0.40);
  const PERIOD_H=18, PERIOD_Y=LINE_Y-PERIOD_H-1;

  // Epoch bands — more opaque for readability
  for(const ep of EPOCHS){
    const x1=toX(ep.from),x2=toX(Math.max(ep.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
    // Solid background — more opaque
    ctx.fillStyle=ep.bg+"f5"; ctx.fillRect(rx,56,rw,PERIOD_Y-56);
    ctx.fillStyle=ep.stripe; ctx.fillRect(rx,56,rw,4);
    // Epoch label — larger and bolder
    if(rw>80){
      ctx.save(); ctx.beginPath(); ctx.rect(rx+5,63,rw-10,22); ctx.clip();
      ctx.font="600 11px 'DM Mono',monospace"; ctx.fillStyle=ep.text+"ff"; ctx.textAlign="left";
      ctx.fillText(ep.label.toUpperCase(),rx+7,75); ctx.restore();
    } else if(rw>30){
      ctx.save(); ctx.beginPath(); ctx.rect(rx+2,63,rw-4,18); ctx.clip();
      ctx.font="600 9px 'DM Mono',monospace"; ctx.fillStyle=ep.text+"ff"; ctx.textAlign="left";
      ctx.fillText(ep.label.toUpperCase().slice(0,6),rx+3,73); ctx.restore();
    }
    if(x1>1&&x1<W-1){
      ctx.strokeStyle=ep.stripe+"88"; ctx.lineWidth=1.5; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1,59); ctx.lineTo(x1,PERIOD_Y); ctx.stroke();
    }
  }

  // Geological periods band — ICS colors, taller for readability
  for(const per of PERIODS){
    const x1=toX(per.from),x2=toX(Math.max(per.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)),rw=Math.min(W,Math.abs(x2-x1));
    if(rw<1) continue;
    ctx.fillStyle=per.color;
    ctx.fillRect(rx,PERIOD_Y,rw,PERIOD_H);
    ctx.strokeStyle="rgba(0,0,0,.22)"; ctx.lineWidth=0.6; ctx.setLineDash([]);
    ctx.strokeRect(rx+0.3,PERIOD_Y+0.3,rw-0.6,PERIOD_H-0.6);
    if(rw>32){
      ctx.save(); ctx.beginPath(); ctx.rect(rx+2,PERIOD_Y,rw-4,PERIOD_H); ctx.clip();
      ctx.font="600 8.5px 'DM Mono',monospace";
      ctx.fillStyle=per.textColor||"#fff";
      ctx.textAlign="center";
      ctx.shadowColor="rgba(0,0,0,.25)"; ctx.shadowBlur=2;
      ctx.fillText(per.label, rx+rw/2, PERIOD_Y+PERIOD_H-4);
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── ARBRE DE LA VIE ──────────────────────────────────────────────────────
  ctx.fillStyle="rgba(10,8,6,.97)"; ctx.fillRect(0,TREE_TOP-2,W,TREE_H+10);
  ctx.strokeStyle="rgba(200,150,60,.35)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,TREE_TOP-2); ctx.lineTo(W,TREE_TOP-2); ctx.stroke();

  // Label
  ctx.font="600 9px 'DM Mono',monospace"; ctx.fillStyle="rgba(200,150,60,.7)";
  ctx.textAlign="left"; ctx.letterSpacing="0.15em";
  ctx.fillText("ARBRE DE LA VIE",10,TREE_TOP+11);

  const NROWS_TREE=17;
  const rowH=Math.min((TREE_H-16)/NROWS_TREE,14);

  for(const node of LIFE_TREE){
    const x1=toX(node.from), x2=toX(Math.max(node.to,0.1));
    if(Math.min(x1,x2)>W||Math.max(x1,x2)<0) continue;
    const rx=Math.max(0,Math.min(x1,x2)), rw=Math.min(W,Math.abs(x2-x1));
    if(rw<1) continue;

    const ry=TREE_TOP+14+node.row*rowH;
    const rh=Math.max(rowH-2,4);
    const extinct=node.to>0;

    // Bar
    ctx.fillStyle=extinct?node.color+"99":node.color+"dd";
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(rx,ry,rw,rh,2); else ctx.rect(rx,ry,rw,rh);
    ctx.fill();

    // Extinction marker (right end)
    if(extinct&&node.to>0){
      const ex=toX(node.to);
      if(ex>0&&ex<W){
        ctx.fillStyle="#ef4444";
        ctx.beginPath(); ctx.moveTo(ex-4,ry+1); ctx.lineTo(ex+1,ry+rh/2); ctx.lineTo(ex-4,ry+rh-1); ctx.closePath(); ctx.fill();
      }
    }

    // Label
    if(rw>45){
      const depth=node.depth||0;
      const indent=depth*8;
      ctx.save(); ctx.beginPath(); ctx.rect(rx+3+indent,ry,rw-6-indent,rh); ctx.clip();
      const fs=Math.min(rh-1,10);
      ctx.font=`${node.depth<=2?"600":"500"} ${fs}px 'DM Mono',monospace`;
      ctx.fillStyle=extinct?"rgba(255,255,255,.5)":"rgba(255,255,255,.92)";
      ctx.textAlign="left";
      ctx.fillText(node.label, rx+5+indent, ry+rh/2+fs*0.35);
      ctx.restore();
    }
  }

  // Tree legend
  ctx.font="8px 'DM Mono',monospace"; ctx.fillStyle="rgba(255,255,255,.25)"; ctx.textAlign="right";
  ctx.fillText("▶ rouge = extinction",W-8,TREE_TOP+TREE_H+4);

  // Timeline
  ctx.strokeStyle="rgba(18,16,14,.28)"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,LINE_Y); ctx.lineTo(W,LINE_Y); ctx.stroke();

  // Ticks
  const span=vs-ve;
  const IVS=[1e10,5e9,2e9,1e9,5e8,2e8,1e8,5e7,1e7,5e6,1e6,5e5,1e5,1e4,1e3,500,100,50,10,5,2,1];
  let chosen=IVS[0]; for(const iv of IVS){if(span/iv>=5&&span/iv<=16){chosen=iv;break;}}
  ctx.font="9px 'DM Mono',monospace";
  for(let ya=Math.ceil(ve/chosen)*chosen;ya<=vs;ya+=chosen){
    if(ya<0.1) continue;
    const x=toX(ya); if(x<0||x>W) continue;
    ctx.strokeStyle="rgba(18,16,14,.16)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,LINE_Y-5); ctx.lineTo(x,LINE_Y+5); ctx.stroke();
    const lbl=fmt(ya),tw=ctx.measureText(lbl).width;
    ctx.fillStyle="rgba(250,247,242,.9)"; ctx.fillRect(x-tw/2-2,LINE_Y+7,tw+4,13);
    ctx.fillStyle="rgba(18,16,14,.38)"; ctx.textAlign="center"; ctx.fillText(lbl,x,LINE_Y+18);
  }

  // Filter events by zoom
  const all=[...ALL_EVENTS.filter(ev=>ev.minZoom<=zl), ...aiEvents];
  const vis=all.filter(ev=>{const x=toX(ev.yearsAgo);return x>=-80&&x<=W+80;});
  // Sort: importance first so important events win dedup
  vis.sort((a,b)=>(a.importance||2)-(b.importance||2));

  // Spatial dedup: keep most important when within 24px
  const deduped=[];
  for(const ev of vis){
    const x=toX(ev.yearsAgo);
    if(!deduped.find(p=>Math.abs(p.x-x)<24)) deduped.push({x,ev});
  }
  deduped.sort((a,b)=>a.x-b.x);

  const placed=[];
  for(const {x,ev} of deduped){
    const col=cc(ev.cat), imp=ev.importance||2;
    const isHov=hoveredId===ev.id, isSel=selectedId===ev.id;
    const nearby=placed.filter(p=>Math.abs(p.x-x)<78);
    const side=nearby.length>0&&nearby[nearby.length-1].side===1?-1:1;
    placed.push({x,ev,side});

    // Scale factor: shrink less-important events when zoomed out
    const zThresh=imp===1?0:imp===2?1.5:2.5;
    const zExcess=Math.max(0,zl-zThresh);
    const scaleFactor=Math.min(1,0.25+zExcess*0.3);
    const sF=isSel||isHov?1:scaleFactor;

    const baseStem=imp===1?64:imp===2?50:38;
    const stemLen=(side===1?baseStem:baseStem-14)*sF;
    const endY=LINE_Y-side*stemLen;

    // Halo
    if(isHov||isSel){ctx.beginPath();ctx.arc(x,LINE_Y,12,0,Math.PI*2);ctx.fillStyle=col+"14";ctx.fill();}

    // Stem
    ctx.strokeStyle=(isHov||isSel)?col:col+(imp===1?"cc":imp===2?"77":"44");
    ctx.lineWidth=((isHov||isSel)?2:imp===1?1.5:imp===2?1:0.6)*sF;
    ctx.setLineDash(imp===1?[]:imp===2?[5,3]:[2,5]);
    ctx.beginPath();ctx.moveTo(x,LINE_Y);ctx.lineTo(x,endY);ctx.stroke();ctx.setLineDash([]);

    // Dot — scales with sF
    const baseR=isSel?7:isHov?6:imp===1?5:imp===2?3.5:2.5;
    const r=Math.max(baseR*sF,isSel||isHov?baseR:1.2);
    ctx.beginPath();ctx.arc(x,LINE_Y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
    if(imp===1&&!isSel&&sF>0.5){ctx.beginPath();ctx.arc(x,LINE_Y,Math.max(r-2.5,0.5),0,Math.PI*2);ctx.fillStyle="rgba(250,247,242,.85)";ctx.fill();}
    if(isSel){ctx.beginPath();ctx.arc(x,LINE_Y,r+5,0,Math.PI*2);ctx.strokeStyle=col+"66";ctx.lineWidth=1.5;ctx.stroke();}

    // Label — only show if dot is large enough or active
    const minR=imp===1?2:imp===2?2.5:3;
    if(r>=minR||isHov||isSel){
      const fontSize=Math.max(7,(imp===1?11:10)*sF);
      const maxW=imp===1?112:96;
      ctx.font=(imp===1?"500 ":"")+Math.round(fontSize)+"px 'DM Mono',monospace";
      const words=ev.title.split(" ");
      let line="",lines=[];
      for(const w of words){const t=line+w+" ";if(ctx.measureText(t).width>maxW&&line){lines.push(line.trim());line=w+" ";}else line=t;}
      lines.push(line.trim());
      const lh=Math.round(fontSize)+2;
      const startY=endY-side*8-(side===1?lines.length*lh:0);
      const bgA=sF>0.7?(imp===1?".9":imp===2?".8":".65"):(imp===1?".7":".5");
      lines.forEach((l,i)=>{
        const tw2=ctx.measureText(l).width;
        ctx.fillStyle=`rgba(250,247,242,${bgA})`;
        ctx.beginPath();
        if(ctx.roundRect)ctx.roundRect(x-tw2/2-3,startY+i*lh-lh+2,tw2+6,lh,2);
        else ctx.fillRect(x-tw2/2-3,startY+i*lh-lh+2,tw2+6,lh);
        ctx.fill();
        ctx.fillStyle=(isHov||isSel)?col:col+(imp===1?"f0":imp===2?sF>0.6?"cc":"99":"88");
        ctx.textAlign="center";
        ctx.fillText(l,x,startY+i*lh);
      });
    }
  }

  // Today
  const nowX=toX(0.5);
  if(nowX>2&&nowX<W-2){
    ctx.strokeStyle="rgba(180,40,30,.5)";ctx.lineWidth=1.2;ctx.setLineDash([5,4]);
    ctx.beginPath();ctx.moveTo(nowX,LINE_Y-55);ctx.lineTo(nowX,TREE_TOP+TREE_H);ctx.stroke();ctx.setLineDash([]);
    ctx.font="bold 8px 'DM Mono',monospace";ctx.fillStyle="#b42820";ctx.textAlign="center";
    ctx.fillText("AUJOURD'HUI",nowX,LINE_Y-60);
  }

  // Minimap
  if(miniCanvas){
    const mw=miniCanvas.width,mh=miniCanvas.height,mctx=miniCanvas.getContext("2d");
    mctx.clearRect(0,0,mw,mh);
    const tls=Math.log10(UA),tle=0,tR=tls-tle;
    for(const ep of EPOCHS){
      const ex1=(tls-L(ep.from))/tR*mw,ex2=(tls-L(Math.max(ep.to,0.1)))/tR*mw;
      mctx.fillStyle=ep.stripe+"44";mctx.fillRect(Math.max(0,ex1),3,Math.abs(ex2-ex1),mh-6);
      mctx.fillStyle=ep.stripe+"aa";mctx.fillRect(Math.max(0,ex1),3,1,mh-6);
    }
    for(const ev of ALL_EVENTS.filter(e=>e.importance===1)){
      const lv=L(ev.yearsAgo);if(lv<tle||lv>tls)continue;
      const mx=(tls-lv)/tR*mw;
      mctx.beginPath();mctx.arc(mx,mh/2,2,0,Math.PI*2);mctx.fillStyle=cc(ev.cat)+"99";mctx.fill();
    }
    const vls=L(vs),vle=L(Math.max(ve,0.1));
    const vx1=(tls-vls)/tR*mw,vx2=(tls-vle)/tR*mw;
    mctx.fillStyle="rgba(18,16,14,.12)";mctx.fillRect(Math.max(0,vx1),0,vx2-vx1,mh);
    mctx.strokeStyle="rgba(18,16,14,.55)";mctx.lineWidth=1.5;mctx.strokeRect(Math.max(0,vx1),0,vx2-vx1,mh);
  }
  return {placed,LINE_Y,PERIOD_Y,PERIOD_H,TREE_TOP};
}

export default function Chronos() {
  const canvasRef=useRef(null),miniRef=useRef(null),wrapRef=useRef(null);
  const S=useRef({vs:UA*1.04,ve:20,aiEvents:[],selectedId:null,hoveredId:null,fetchedZones:new Set(),fetching:false,fetchQueue:[],panelCache:{},placed:[],lineY:0});
  const rafRef=useRef(null),fetchDebRef=useRef(null),animRef=useRef(null);

  // ── STORAGE: load saved content + bookmarks on mount ──
  useEffect(()=>{
    (async()=>{
      try{
        // Load cached rich content
        const cached=JSON.parse(localStorage.getItem("chronos-cache") || "null");
        if(cached?.value){
          const data=JSON.parse(cached.value);
          Object.assign(S.current.panelCache,data);
        }
      }catch(e){}
      try{
        // Load bookmarks
        const bm=JSON.parse(localStorage.getItem("chronos-bookmarks") || "null");
        if(bm?.value) setBookmarks(JSON.parse(bm.value));
      }catch(e){}
      try{
        // Load custom tags
        const tags=JSON.parse(localStorage.getItem("chronos-tags") || "null");
        if(tags?.value) setCustomTags(JSON.parse(tags.value));
      }catch(e){}
    })();
  },[]);

  const saveCache=useCallback(async()=>{
    try{ localStorage.setItem("chronos-cache",JSON.stringify(S.current.panelCache)); }catch(e){}
  },[]);

  const saveBookmarks=useCallback(async(bm)=>{
    try{ localStorage.setItem("chronos-bookmarks",JSON.stringify(bm)); }catch(e){}
  },[]);

  const saveTags=useCallback(async(tags)=>{
    try{ localStorage.setItem("chronos-tags",JSON.stringify(tags)); }catch(e){}
  },[]);

  const toggleBookmark=useCallback((ev,tag)=>{
    setBookmarks(prev=>{
      const next={...prev};
      if(next[ev.id]?.tag===tag){
        delete next[ev.id]; // remove if same tag clicked again
      } else {
        next[ev.id]={tag,title:ev.title,date_label:ev.date_label,cat:ev.cat,yearsAgo:ev.yearsAgo,desc:ev.desc||""};
      }
      saveBookmarks(next);
      return next;
    });
    setUi(u=>({...u,showBookmarkMenu:false}));
  },[saveBookmarks]);

  const removeBookmark=useCallback((evId)=>{
    setBookmarks(prev=>{
      const next={...prev};
      delete next[evId];
      saveBookmarks(next);
      return next;
    });
  },[saveBookmarks]);

  const addCustomTag=useCallback((tag)=>{
    if(!tag.trim())return;
    setCustomTags(prev=>{
      const next=[...prev,tag.trim()];
      saveTags(next);
      return next;
    });
    setNewTagInput(""); setAddingTag(false);
  },[saveTags]);

  const removeCustomTag=useCallback((tag)=>{
    setCustomTags(prev=>{
      const next=prev.filter(t=>t!==tag);
      saveTags(next);
      return next;
    });
    // Remove bookmarks using this tag
    setBookmarks(prev=>{
      const next=Object.fromEntries(Object.entries(prev).filter(([,v])=>v.tag!==tag));
      saveBookmarks(next);
      return next;
    });
  },[saveTags,saveBookmarks]);
  const [ui,setUi]=useState({epochLabel:"Vue globale",range:"",aiVisible:false,aiLabel:"",legendOpen:false,panelOpen:false,panelCat:"",panelCatColor:"#555",panelDate:"",panelTitle:"",panelContent:null,tooltip:null,searchOpen:false,searchQuery:"",searchResults:[],searchLoading:false,searchDone:false,panelEventId:null,bookmarkTag:null,showBookmarkMenu:false,showBookmarksView:false});
  const [bookmarks,setBookmarks]=useState({});       // {eventId: {tag, title, date_label, cat, yearsAgo}}
  const [customTags,setCustomTags]=useState(["Favori","À revoir","Intéressant"]); // editable list
  const [addingTag,setAddingTag]=useState(false);
  const [newTagInput,setNewTagInput]=useState("");

  const redraw=useCallback(()=>{
    const cnv=canvasRef.current,mcnv=miniRef.current,wrap=wrapRef.current;
    if(!cnv||!wrap)return;
    cnv.width=wrap.offsetWidth;cnv.height=wrap.offsetHeight;
    if(mcnv){mcnv.width=160;mcnv.height=28;}
    const s=S.current;
    const r=drawAll(cnv,mcnv,{vs:s.vs,ve:s.ve,aiEvents:s.aiEvents,selectedId:s.selectedId,hoveredId:s.hoveredId});
    s.placed=r.placed;s.lineY=r.LINE_Y;s.periodY=r.PERIOD_Y;s.periodH=r.PERIOD_H;s.treeTop=r.TREE_TOP;
    const mid=makeCoord(s.vs,s.ve,cnv.width).toYa(cnv.width/2);
    const ep=epochAt(mid);
    setUi(u=>({...u,epochLabel:ep.label+"  ·  "+fmt(s.vs)+" → "+fmt(Math.max(s.ve,0.1)),range:`zoom ×${Math.pow(10,zoomLvl(s.vs,s.ve)).toFixed(0)}`}));
  },[]);

  const scheduleRedraw=useCallback(()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);rafRef.current=requestAnimationFrame(redraw);},[redraw]);

  const navigateToEpoch=useCallback((ep)=>{
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const s=S.current,targetVs=ep.from*1.05,targetVe=Math.max(ep.to*0.8,0.1);
    const startVs=s.vs,startVe=s.ve,steps=28;let step=0;
    const animate=()=>{step++;const t=step/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      const ls=L(startVs)+(L(targetVs)-L(startVs))*ease,le=L(startVe)+(L(targetVe)-L(startVe))*ease;
      s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);scheduleRedraw();
      if(step<steps)animRef.current=requestAnimationFrame(animate);};
    animRef.current=requestAnimationFrame(animate);
  },[scheduleRedraw]);

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
        s.aiEvents.push({id:`ai_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,yearsAgo:ya,title:ev.title,date_label:ev.date_label||fmt(ya),desc:ev.desc||"",cat:ev.cat||"histoire",importance:3,minZoom:0});
        added++;
      }
      if(added>0)scheduleRedraw();
    }catch(e){console.warn("AI:",e);}
    finally{
      s.fetching=false;setTimeout(()=>setUi(u=>({...u,aiVisible:false})),700);
      if(s.fetchQueue.length>0){const n=s.fetchQueue.shift();if(!s.fetchedZones.has(n.key))setTimeout(()=>fetchZone(n.startYa,n.endYa),350);}
    }
  },[scheduleRedraw]);

  const triggerFetch=useCallback(()=>{
    clearTimeout(fetchDebRef.current);
    fetchDebRef.current=setTimeout(()=>{
      const s=S.current,ls=L(s.vs),le=L(Math.max(s.ve,0.1));
      fetchZone(s.vs,Math.max(s.ve,0.1));
      if(ls-le>0.7){const mid=Math.pow(10,(ls+le)/2);fetchZone(s.vs,mid);fetchZone(mid,Math.max(s.ve,0.1));}
    },800);
  },[fetchZone]);

  const fetchRich=useCallback(async(ev)=>{
    const s=S.current;
    // 1. Pre-written static content — instant, no API
    if(STATIC_CONTENT[ev.id]){setUi(u=>({...u,panelContent:STATIC_CONTENT[ev.id],panelEventId:ev.id}));return;}
    // 2. Already cached (from storage or previous API call)
    if(s.panelCache[ev.id]){setUi(u=>({...u,panelContent:s.panelCache[ev.id],panelEventId:ev.id}));return;}
    // 3. Generate via API then persist
    setUi(u=>({...u,panelContent:"loading",panelEventId:ev.id}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:900,messages:[{role:"user",content:`Rédige une fiche encyclopédique engageante sur :
Événement : ${ev.title}
Date : ${ev.date_label}
Contexte : ${ev.desc}
En HTML simple (<p>,<h3>,<strong> uniquement). Sections : intro immersive (1§), <h3>Contexte</h3>(1§), <h3>Ce qui s'est passé</h3>(1§), <h3>Héritage</h3>(1§), <h3>Le saviez-vous ?</h3>(1§). ~260 mots. HTML direct, sans balises html/body.`}]})});
      const data=await res.json();
      const html=(data.content||[]).find(b=>b.type==="text")?.text||"<p>Indisponible.</p>";
      s.panelCache[ev.id]=html;
      setUi(u=>({...u,panelContent:html,panelEventId:ev.id}));
      saveCache(); // persist to storage
    }catch(e){setUi(u=>({...u,panelContent:"<p>Erreur de connexion.</p>",panelEventId:ev.id}));}
  },[saveCache]);

  const openPeriodPanel=useCallback((item)=>{
    S.current.selectedId=null; scheduleRedraw();
    const desc=PERIOD_DESCRIPTIONS[item.label]||{summary:"",highlights:[]};
    const html=`<p style="font-family:Georgia,serif;font-size:14px;line-height:1.8;color:#12100e;margin-bottom:12px">${desc.summary}</p>`+
      (desc.highlights.length?`<h3 style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:rgba(18,16,14,.4);margin:14px 0 8px">Points clés</h3><ul style="list-style:none;padding:0;margin:0">${desc.highlights.map(h=>`<li style="font-family:Georgia,serif;font-size:13px;color:#12100e;padding:5px 0;border-bottom:1px solid rgba(18,16,14,.06);display:flex;align-items:flex-start;gap:8px"><span style="color:#c8963c;flex-shrink:0">◆</span>${h}</li>`).join("")}</ul>`:"");
    setUi(u=>({...u,panelOpen:true,panelCat:item.from>1e9?"ÈRE":"PÉRIODE",
      panelCatColor:item.stripe||item.color||"#c8963c",
      panelDate:fmt(item.from)+" → "+(item.to>0?fmt(item.to):"aujourd'hui"),
      panelTitle:item.label,panelContent:html,tooltip:null,panelEventId:"period_"+item.label,showBookmarkMenu:false}));
    S.current._currentPanelEv={id:"period_"+item.label,title:item.label,date_label:fmt(item.from),yearsAgo:item.from,cat:"geologique"};
  },[scheduleRedraw]);

  const openPanel=useCallback((ev)=>{
    S.current._currentPanelEv=ev;
    scheduleRedraw();
    setUi(u=>({...u,panelOpen:true,panelCat:ev.cat.toUpperCase(),panelCatColor:cc(ev.cat),panelDate:ev.date_label,panelTitle:ev.title,panelContent:"loading",tooltip:null,panelEventId:ev.id,showBookmarkMenu:false}));
    fetchRich(ev);
  },[scheduleRedraw,fetchRich]);

  const closePanel=useCallback(()=>{S.current.selectedId=null;scheduleRedraw();setUi(u=>({...u,panelOpen:false}));},[scheduleRedraw]);

  const searchDebRef=useRef(null);

  // Universal search: local match + AI search across all of human history
  const searchWithAI=useCallback(async(query)=>{
    if(!query.trim()){setUi(u=>({...u,searchResults:[],searchDone:false,searchLoading:false}));return;}

    // 1. Local match
    const q=query.toLowerCase();
    const s=S.current;
    const local=[...ALL_EVENTS,...s.aiEvents].filter(ev=>
      ev.title.toLowerCase().includes(q)||
      ev.desc.toLowerCase().includes(q)||
      ev.date_label.toLowerCase().includes(q)||
      ev.cat.toLowerCase().includes(q)
    ).slice(0,4);
    setUi(u=>({...u,searchResults:local,searchLoading:true,searchDone:false}));

    // 2. Universal AI search — any event in all of history
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:1000,
          messages:[{role:"user",content:`Tu es un historien et scientifique expert de toute l'histoire de l'univers, de la Terre, de la vie et de l'humanité.

L'utilisateur recherche : "${query}"

Trouve les événements historiques, scientifiques, biologiques ou cosmiques les plus pertinents correspondant à cette recherche. Tu peux inclure :
- Des événements très précis et peu connus (batailles, inventions, naissances, découvertes, traités...)
- Des personnages historiques (leur naissance ou mort comme événement)
- Des phénomènes naturels, géologiques, biologiques
- N'importe quelle période de l'histoire, de n'importe quel pays ou région du monde
- Des événements aussi petits ou grands que nécessaire pour répondre à la requête

Réponds UNIQUEMENT par un tableau JSON valide (sans markdown). Max 6 résultats, du plus pertinent au moins pertinent :
[{"yearsAgo":number,"title":"titre court max 6 mots","date_label":"date précise lisible","desc":"1-2 phrases de description factuelle","cat":"cosmique|geologique|biologique|prehistoire|histoire","relevance":"lien avec la recherche en 4 mots max"}]

IMPORTANT : yearsAgo doit être un nombre positif représentant combien d'années avant 2025. Ex: 1804 ap.J.-C. → yearsAgo=221, 500 av.J.-C. → yearsAgo=2525.
Si aucun événement réel ne correspond, retourne [].`}]})});
      if(!res.ok)throw new Error(res.status);
      const data=await res.json();
      const raw=(data.content||[]).find(b=>b.type==="text")?.text||"[]";
      const match=raw.match(/\[[\s\S]*?\]/);
      if(!match)throw new Error("no array");
      const aiResults=JSON.parse(match[0]);
      const merged=[...local];
      for(const r of aiResults){
        const ya=Number(r.yearsAgo);
        if(isNaN(ya)||ya<0)continue;
        const dup=merged.find(e=>e.title.toLowerCase()===r.title.toLowerCase());
        if(!dup){
          merged.push({
            id:`srch_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
            yearsAgo:ya,title:r.title,date_label:r.date_label||"",
            desc:r.desc||"",cat:r.cat||"histoire",
            relevance:r.relevance,importance:2,minZoom:0,fromSearch:true
          });
        }
      }
      setUi(u=>({...u,searchResults:merged.slice(0,8),searchLoading:false,searchDone:true}));
    }catch(e){
      setUi(u=>({...u,searchLoading:false,searchDone:true}));
    }
  },[]);

  const handleSearch=useCallback((query)=>{
    setUi(u=>({...u,searchQuery:query,searchResults:[],searchDone:false}));
    clearTimeout(searchDebRef.current);
    if(!query.trim()){setUi(u=>({...u,searchLoading:false}));return;}
    searchDebRef.current=setTimeout(()=>searchWithAI(query),500);
  },[searchWithAI]);

  // Navigate to a search result: zoom in on the event, add it if not present, open panel
  const goToResult=useCallback((ev)=>{
    // Add to aiEvents if not already there
    const s=S.current;
    if(!ALL_EVENTS.find(e=>e.id===ev.id)&&!s.aiEvents.find(e=>e.id===ev.id)){
      s.aiEvents.push({...ev,importance:ev.importance||2,minZoom:0});
    }
    // Animate to event: zoom in to ~50× around the event's date
    const targetYa=ev.yearsAgo;
    const span=Math.max(targetYa*0.15,500); // show ±15% of event date, min 500 years
    const targetVs=targetYa+span, targetVe=Math.max(targetYa-span,0.1);
    if(animRef.current)cancelAnimationFrame(animRef.current);
    const startVs=s.vs,startVe=s.ve,steps=30;let step=0;
    const animate=()=>{
      step++;const t=step/steps,ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      const ls=L(startVs)+(L(targetVs)-L(startVs))*ease,le=L(startVe)+(L(targetVe)-L(startVe))*ease;
      s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);
      scheduleRedraw();
      if(step<steps)animRef.current=requestAnimationFrame(animate);
      else{
        // Open panel after animation
        setUi(u=>({...u,searchOpen:false,searchQuery:"",searchResults:[],searchDone:false}));
        openPanel(ev);
        triggerFetch();
      }
    };
    animRef.current=requestAnimationFrame(animate);
  },[scheduleRedraw,openPanel,triggerFetch]);

  const zoomAround=useCallback((pivotYa,factor)=>{
    const s=S.current;
    const ns=pivotYa+(s.vs-pivotYa)*factor,ne=pivotYa+(s.ve-pivotYa)*factor;
    if(ns>UA*1.1||ne<0.05)return;if(L(ns)-L(Math.max(ne,0.1))<0.03)return;
    s.vs=Math.min(ns,UA*1.1);s.ve=Math.max(ne,0.05);
  },[]);

  // Stable refs — évite que useEffect se réenregistre à chaque render
  const openPanelRef=useRef(null);
  const openPeriodPanelRef=useRef(null);
  const closePanelRef=useRef(null);
  const scheduleRedrawRef=useRef(null);
  const triggerFetchRef=useRef(null);
  const zoomAroundRef=useRef(null);
  openPanelRef.current=openPanel;
  openPeriodPanelRef.current=openPeriodPanel;
  closePanelRef.current=closePanel;
  scheduleRedrawRef.current=scheduleRedraw;
  triggerFetchRef.current=triggerFetch;
  zoomAroundRef.current=zoomAround;

  useEffect(()=>{
    const wrap=wrapRef.current,cnv=canvasRef.current;if(!wrap||!cnv)return;
    const onWheel=(e)=>{
      e.preventDefault();
      const rect=cnv.getBoundingClientRect();
      zoomAroundRef.current(makeCoord(S.current.vs,S.current.ve,cnv.width).toYa(e.clientX-rect.left),e.deltaY>0?1.13:.88);
      scheduleRedrawRef.current();triggerFetchRef.current();
    };
    let dragging=false;
    const onMD=()=>{dragging=true;wrap.style.cursor="grabbing";};
    const onMU=()=>{dragging=false;wrap.style.cursor="grab";};
    const onMM=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
      if(dragging){
        const s=S.current,lr=L(s.vs)-L(s.ve),sh=-(e.movementX/cnv.width)*lr,ls=L(s.vs)+sh,le=L(s.ve)+sh;
        if(ls>Math.log10(UA*1.1)||le<0)return;
        s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);
        scheduleRedrawRef.current();triggerFetchRef.current();return;
      }
      const s=S.current;let found=null;
      for(const p of s.placed)if(Math.abs(p.x-mx)<18&&Math.abs(s.lineY-my)<100){found=p.ev;break;}
      const nid=found?found.id:null;
      if(nid!==s.hoveredId){
        s.hoveredId=nid;wrap.style.cursor=found?"pointer":"grab";scheduleRedrawRef.current();
        if(found){let tx=mx+16,ty=my-68;if(tx+220>cnv.width)tx=mx-226;if(ty<10)ty=my+20;setUi(u=>({...u,tooltip:{x:tx,y:ty,date:found.date_label,title:found.title}}));}
        else setUi(u=>({...u,tooltip:null}));
      }
    };
    const onClick=(e)=>{
      const rect=cnv.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,s=S.current;
      // 1. Événements — zone de clic élargie
      for(const p of s.placed)if(Math.abs(p.x-mx)<22&&Math.abs(s.lineY-my)<110){openPanelRef.current(p.ev);return;}
      // 2. Bande des périodes géologiques
      if(s.periodY!=null&&my>=s.periodY&&my<=s.periodY+(s.periodH||20)){
        const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);
        const per=PERIODS.find(p=>ya<=p.from&&ya>=p.to);
        if(per){openPeriodPanelRef.current(per);return;}
      }
      // 3. Bandes d'époques (au-dessus des périodes)
      if(s.periodY!=null&&my<s.periodY&&my>44){
        const ya=makeCoord(s.vs,s.ve,cnv.width).toYa(mx);
        const ep=EPOCHS.find(p=>ya<=p.from&&ya>=p.to);
        if(ep){openPeriodPanelRef.current(ep);return;}
      }
      closePanelRef.current();
    };
    let lt=null,ld=null;
    const onTS=(e)=>{if(e.touches.length===1)lt=e.touches[0].clientX;else if(e.touches.length===2)ld=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);};
    const onTM=(e)=>{
      e.preventDefault();const rect=cnv.getBoundingClientRect(),s=S.current;
      if(e.touches.length===1&&lt!==null){const dx=e.touches[0].clientX-lt;lt=e.touches[0].clientX;const lr=L(s.vs)-L(s.ve),sh=-(dx/cnv.width)*lr,ls=L(s.vs)+sh,le=L(s.ve)+sh;if(ls>Math.log10(UA*1.1)||le<0)return;s.vs=Math.pow(10,ls);s.ve=Math.pow(10,le);scheduleRedrawRef.current();triggerFetchRef.current();}
      else if(e.touches.length===2&&ld!==null){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const mx=(e.touches[0].clientX+e.touches[1].clientX)/2-rect.left;zoomAroundRef.current(makeCoord(s.vs,s.ve,cnv.width).toYa(mx),ld/d);ld=d;scheduleRedrawRef.current();triggerFetchRef.current();}
    };
    const onTE=()=>{lt=null;ld=null;};
    const onResize=()=>scheduleRedrawRef.current();
    cnv.addEventListener("wheel",onWheel,{passive:false});
    cnv.addEventListener("mousedown",onMD);
    cnv.addEventListener("click",onClick);
    cnv.addEventListener("touchstart",onTS,{passive:false});
    cnv.addEventListener("touchmove",onTM,{passive:false});
    cnv.addEventListener("touchend",onTE);
    window.addEventListener("mousemove",onMM);
    window.addEventListener("mouseup",onMU);
    window.addEventListener("resize",onResize);
    scheduleRedrawRef.current();triggerFetchRef.current();
    return()=>{
      cnv.removeEventListener("wheel",onWheel);cnv.removeEventListener("mousedown",onMD);cnv.removeEventListener("click",onClick);
      cnv.removeEventListener("touchstart",onTS);cnv.removeEventListener("touchmove",onTM);cnv.removeEventListener("touchend",onTE);
      window.removeEventListener("mousemove",onMM);window.removeEventListener("mouseup",onMU);window.removeEventListener("resize",onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const css={
    app:{display:"flex",flexDirection:"column",height:"100vh",background:"#faf7f2",fontFamily:"'DM Mono',monospace",overflow:"hidden"},
    topbar:{height:56,background:"#faf7f2",borderBottom:"1px solid rgba(18,16,14,.09)",display:"flex",flexDirection:"column",padding:"0 14px",gap:0,flexShrink:0,boxShadow:"0 1px 6px rgba(18,16,14,.04)",zIndex:30},
    topbarRow:{display:"flex",alignItems:"center",gap:10,height:28},
    brand:{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#12100e",flexShrink:0},
    brandSub:{fontFamily:"'DM Mono',monospace",fontSize:8,color:"#c8963c",letterSpacing:".1em",marginLeft:4},
    pills:{display:"flex",gap:4,overflowX:"auto",flex:1,scrollbarWidth:"none"},
    pill:(ep)=>({flexShrink:0,padding:"3px 9px",borderRadius:14,fontSize:9,letterSpacing:".07em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",border:`1.5px solid ${ep.stripe}55`,background:ep.pillBg,color:ep.pillText,whiteSpace:"nowrap",transition:"all .15s"}),
    topR:{display:"flex",gap:5,flexShrink:0},
    iconBtn:{width:28,height:28,borderRadius:6,border:"1px solid rgba(18,16,14,.12)",background:"#faf7f2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#12100e"},
    wrap:{flex:1,position:"relative",overflow:"hidden",cursor:"grab"},
    cnv:{position:"absolute",top:0,left:0},
    zoomBtns:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:5,zIndex:20},
    zoomBtn:{width:30,height:30,borderRadius:7,background:"#faf7f2",border:"1px solid rgba(18,16,14,.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300,color:"#12100e",boxShadow:"0 1px 5px rgba(18,16,14,.08)"},
    mini:{position:"absolute",bottom:42,right:10,width:160,height:28,background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",borderRadius:4,overflow:"hidden",zIndex:20},
    statusbar:{height:32,background:"#faf7f2",borderTop:"1px solid rgba(18,16,14,.09)",display:"flex",alignItems:"center",padding:"0 14px",gap:14,flexShrink:0},
    statusEpoch:{fontFamily:"Georgia,serif",fontSize:11,fontStyle:"italic",color:"#12100e",flex:1},
    aiBadge:(v)=>({display:"flex",alignItems:"center",gap:5,padding:"2px 8px",borderRadius:10,background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",fontSize:9,letterSpacing:".1em",opacity:v?1:0,transition:"opacity .3s"}),
    aiDot:{width:5,height:5,borderRadius:"50%",background:"#c8963c",animation:"dp 1.2s ease-in-out infinite"},
    statusR:{fontSize:9,color:"rgba(18,16,14,.3)"},
    tt:(t)=>({position:"absolute",left:t.x,top:t.y,pointerEvents:"none",zIndex:50,background:"#12100e",color:"#faf7f2",borderRadius:7,padding:"8px 12px",maxWidth:210,boxShadow:"0 4px 18px rgba(0,0,0,.25)"}),
    ttDate:{fontSize:8,color:"#c8963c",letterSpacing:".1em",marginBottom:3},
    ttTitle:{fontFamily:"Georgia,serif",fontSize:13,lineHeight:1.3},
    ttHint:{fontSize:8,color:"rgba(250,247,242,.3)",marginTop:4},
    panel:(o)=>({position:"absolute",right:0,top:0,bottom:0,width:340,background:"#faf7f2",borderLeft:"1px solid rgba(18,16,14,.1)",transform:o?"translateX(0)":"translateX(100%)",transition:"transform .34s cubic-bezier(.16,1,.3,1)",display:"flex",flexDirection:"column",zIndex:40,boxShadow:"-4px 0 18px rgba(18,16,14,.07)"}),
    panelStripe:(c)=>({height:4,flexShrink:0,background:c}),
    panelHdr:{padding:"14px 18px 12px",borderBottom:"1px solid rgba(18,16,14,.07)",flexShrink:0,position:"relative"},
    panelClose:{position:"absolute",top:10,right:12,width:24,height:24,borderRadius:"50%",background:"#f0ebe0",border:"1px solid rgba(18,16,14,.1)",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",color:"#12100e"},
    panelCat:{fontSize:8,letterSpacing:".18em",textTransform:"uppercase",fontWeight:500,marginBottom:3,opacity:.7},
    panelDate:{fontSize:9,color:"#c8963c",marginBottom:6},
    panelTitle:{fontFamily:"Georgia,serif",fontSize:19,lineHeight:1.25,color:"#12100e"},
    panelBody:{flex:1,overflowY:"auto",padding:"14px 18px",scrollbarWidth:"thin",scrollbarColor:"#e0d9cc transparent"},
    panelContent:{fontFamily:"Georgia,serif",fontSize:14,lineHeight:1.85,color:"#12100e"},
    loading:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:160,gap:12},
    bars:{display:"flex",gap:4,alignItems:"flex-end",height:20},
    barsLbl:{fontSize:9,letterSpacing:".14em",color:"rgba(18,16,14,.35)",textTransform:"uppercase"},
    legend:(o)=>({position:"absolute",left:0,top:0,bottom:0,width:185,background:"#faf7f2",borderRight:"1px solid rgba(18,16,14,.09)",transform:o?"translateX(0)":"translateX(-100%)",transition:"transform .3s cubic-bezier(.16,1,.3,1)",overflowY:"auto",padding:12,zIndex:35,boxShadow:"4px 0 14px rgba(18,16,14,.05)"}),
    legHead:{fontSize:7,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(18,16,14,.28)",fontWeight:500,marginBottom:7},
    legItem:{display:"flex",alignItems:"center",gap:7,marginBottom:5},
    legDot:(c)=>({width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}),
    legBar:(c)=>({width:12,height:5,borderRadius:2,background:c,flexShrink:0}),
    searchWrap:{position:"relative",flexShrink:0},
    searchInput:{height:28,width:200,borderRadius:6,border:"1px solid rgba(18,16,14,.18)",background:"#faf7f2",padding:"0 30px 0 28px",fontSize:10,fontFamily:"'DM Mono',monospace",color:"#12100e",outline:"none",transition:"all .2s"},
    searchIcon:{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"rgba(18,16,14,.35)",pointerEvents:"none"},
    searchClear:{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"rgba(18,16,14,.4)",cursor:"pointer",background:"none",border:"none",padding:0,lineHeight:1},
    searchDropdown:{position:"absolute",top:"calc(100% + 6px)",left:0,width:360,background:"#faf7f2",border:"1px solid rgba(18,16,14,.14)",borderRadius:8,boxShadow:"0 8px 32px rgba(18,16,14,.12)",zIndex:100,overflow:"hidden"},
    searchHeader:{padding:"8px 12px 6px",borderBottom:"1px solid rgba(18,16,14,.07)",display:"flex",alignItems:"center",gap:6},
    searchHeaderTxt:{fontSize:9,color:"rgba(18,16,14,.35)",letterSpacing:".1em",textTransform:"uppercase",flex:1},
    searchSpinner:{width:10,height:10,borderRadius:"50%",border:"1.5px solid rgba(18,16,14,.15)",borderTop:"1.5px solid #c8963c",animation:"spin .7s linear infinite"},
    searchItem:{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid rgba(18,16,14,.05)",transition:"background .12s"},
    searchDot:(c)=>({width:8,height:8,borderRadius:"50%",background:c,flexShrink:0,marginTop:3}),
    searchItemInfo:{flex:1,minWidth:0},
    searchItemTitle:{fontSize:11,fontWeight:500,color:"#12100e",marginBottom:2,fontFamily:"Georgia,serif"},
    searchItemDate:{fontSize:9,color:"#c8963c",marginBottom:2},
    searchItemDesc:{fontSize:9,color:"rgba(18,16,14,.5)",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},
    searchItemRel:{fontSize:8,color:"rgba(18,16,14,.35)",fontStyle:"italic",marginTop:2},
    searchItemNav:{fontSize:9,color:"rgba(18,16,14,.3)",flexShrink:0,marginTop:2},
    searchEmpty:{padding:"20px 12px",textAlign:"center",fontSize:10,color:"rgba(18,16,14,.35)"},
    bmBar:{display:"flex",alignItems:"center",gap:6,padding:"8px 18px 6px",borderBottom:"1px solid rgba(18,16,14,.06)",flexShrink:0,flexWrap:"wrap"},
    bmBtn:(active,col)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:12,fontSize:9,letterSpacing:".08em",fontWeight:500,cursor:"pointer",border:`1.5px solid ${col||"rgba(18,16,14,.2)"}`,background:active?`${col||"#c8963c"}18`:"transparent",color:active?(col||"#c8963c"):"rgba(18,16,14,.5)",transition:"all .15s",whiteSpace:"nowrap"}),
    bmMenu:{position:"absolute",bottom:"calc(100% + 4px)",left:0,background:"#faf7f2",border:"1px solid rgba(18,16,14,.14)",borderRadius:8,boxShadow:"0 6px 24px rgba(18,16,14,.12)",zIndex:60,minWidth:160,overflow:"hidden"},
    bmMenuItem:(active)=>({padding:"8px 14px",cursor:"pointer",fontSize:10,color:active?"#c8963c":"#12100e",background:active?"rgba(200,150,60,.07)":"transparent",display:"flex",alignItems:"center",gap:8,transition:"background .12s"}),
    bmSection:{padding:"6px 14px 4px",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(18,16,14,.3)"},
    bmViewPanel:{position:"absolute",left:0,top:0,bottom:0,width:300,background:"#faf7f2",borderRight:"1px solid rgba(18,16,14,.1)",transform:"translateX(0)",display:"flex",flexDirection:"column",zIndex:38,boxShadow:"4px 0 16px rgba(18,16,14,.06)"},
    bmViewItem:{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 14px",borderBottom:"1px solid rgba(18,16,14,.05)",cursor:"pointer",transition:"background .12s"},
    bmTag:(col)=>({display:"inline-flex",alignItems:"center",padding:"1px 6px",borderRadius:8,fontSize:8,letterSpacing:".08em",border:`1px solid ${col}44`,background:`${col}12`,color:col,flexShrink:0,marginTop:1}),
    searchAiBadge:{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 7px",borderRadius:10,background:"rgba(200,150,60,.1)",border:"1px solid rgba(200,150,60,.2)",fontSize:8,color:"#c8963c",letterSpacing:".08em"},
    legLbl:{fontSize:9.5,color:"#12100e"},
  };

  const barH=[7,14,20,14,7];
  return (
    <div style={css.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');@keyframes dp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.5)}}@keyframes bw{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}@keyframes spin{to{transform:rotate(360deg)}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#e0d9cc}.srch-item:hover{background:#f5f0e8!important}`}</style>

      <div style={css.topbar}>
        {/* Row 1: brand + epochs + controls */}
        <div style={css.topbarRow}>
          <div style={css.brand}>Chronos<span style={css.brandSub}>IA</span></div>
          <div style={css.pills}>
            {EPOCHS.map(ep=>(
              <div key={ep.label} style={css.pill(ep)} onClick={()=>navigateToEpoch(ep)}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                {ep.label}
              </div>
            ))}
          </div>
          <div style={css.topR}>
            {/* SEARCH */}
            <div style={css.searchWrap}>
              <span style={css.searchIcon}>⌕</span>
              <input
                style={css.searchInput}
                placeholder="Rechercher un événement…"
                value={ui.searchQuery}
                onChange={e=>handleSearch(e.target.value)}
                onFocus={()=>setUi(u=>({...u,searchOpen:true}))}
                onBlur={()=>setTimeout(()=>setUi(u=>({...u,searchOpen:false})),200)}
              />
              {ui.searchQuery&&(
                <button style={css.searchClear} onMouseDown={e=>{e.preventDefault();handleSearch("");}}>✕</button>
              )}
              {ui.searchOpen&&ui.searchQuery&&(
                <div style={css.searchDropdown}>
                  <div style={css.searchHeader}>
                    <span style={css.searchHeaderTxt}>
                      {ui.searchLoading?"Recherche IA en cours…":ui.searchDone?`${ui.searchResults.length} résultat${ui.searchResults.length!==1?"s":""}`:ui.searchResults.length>0?"Résultats locaux…":""}
                    </span>
                    {ui.searchLoading&&<div style={css.searchSpinner}/>}
                    {ui.searchDone&&<span style={css.searchAiBadge}>✦ IA</span>}
                  </div>
                  {ui.searchResults.length===0&&!ui.searchLoading&&ui.searchDone&&(
                    <div style={css.searchEmpty}>Aucun événement trouvé pour « {ui.searchQuery} »</div>
                  )}
                  {ui.searchResults.length===0&&!ui.searchLoading&&!ui.searchDone&&(
                    <div style={css.searchEmpty}>Recherche en cours…</div>
                  )}
                  {ui.searchResults.map((ev,i)=>(
                    <div key={ev.id||i} className="srch-item" style={css.searchItem}
                      onMouseDown={e=>{e.preventDefault();goToResult(ev);}}>
                      <div style={css.searchDot(cc(ev.cat))}/>
                      <div style={css.searchItemInfo}>
                        <div style={css.searchItemTitle}>{ev.title}</div>
                        <div style={css.searchItemDate}>{ev.date_label}</div>
                        <div style={css.searchItemDesc}>{ev.desc}</div>
                        {ev.relevance&&<div style={css.searchItemRel}>↳ {ev.relevance}</div>}
                      </div>
                      <div style={css.searchItemNav}>→</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button style={css.iconBtn} onClick={()=>setUi(u=>({...u,showBookmarksView:!u.showBookmarksView,legendOpen:false}))} title="Signets">🔖</button>
            <button style={css.iconBtn} onClick={()=>setUi(u=>({...u,legendOpen:!u.legendOpen,showBookmarksView:false}))}>◫</button>
            <button style={css.iconBtn} onClick={()=>{S.current.vs=UA*1.04;S.current.ve=20;scheduleRedraw();triggerFetch();}}>⌂</button>
          </div>
        </div>
        {/* Row 2: geological periods */}
        <div style={{...css.topbarRow,gap:3,paddingBottom:2}}>
          <span style={{fontSize:7,letterSpacing:".12em",color:"rgba(18,16,14,.3)",textTransform:"uppercase",flexShrink:0,marginRight:2}}>Périodes</span>
          <div style={{...css.pills,gap:3}}>
            {PERIODS.map(per=>(
              <div key={per.label}
                style={{flexShrink:0,padding:"1px 7px",borderRadius:10,fontSize:7.5,letterSpacing:".04em",fontWeight:500,cursor:"pointer",
                  border:`1px solid ${per.color}99`,background:per.color+"33",
                  color:per.textColor==="#fff"?"#222":per.textColor||"#222",
                  whiteSpace:"nowrap",transition:"all .15s"}}
                onClick={()=>navigateToEpoch({from:per.from,to:per.to})}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                {per.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={wrapRef} style={css.wrap}>
        <canvas ref={canvasRef} style={css.cnv}/>

        <div style={css.legend(ui.legendOpen)}>
          <div style={{...css.legHead,marginBottom:9}}>Importance</div>
          {[["●●","Majeur — tige pleine, gros point"],["●·","Notable — pointillé fin"],["·","Contextuel — pointillé léger"]].map(([s,l])=>(
            <div key={l} style={{...css.legItem,marginBottom:5,alignItems:"flex-start"}}>
              <span style={{fontSize:12,color:"#8a6000",flexShrink:0,marginTop:1}}>{s[0]}</span>
              <span style={{fontSize:9,color:"rgba(18,16,14,.5)",lineHeight:1.4}}>{l}</span>
            </div>
          ))}
          <div style={{...css.legHead,marginTop:13}}>Catégories</div>
          {Object.entries(CAT_COL).map(([k,v])=>(
            <div key={k} style={css.legItem}><div style={css.legDot(v)}/><span style={css.legLbl}>{k.charAt(0).toUpperCase()+k.slice(1)}</span></div>
          ))}
          <div style={{...css.legHead,marginTop:13}}>Espèces</div>
          {SPECIES.map(s=>(
            <div key={s.label} style={css.legItem}><div style={css.legBar(s.color)}/><span style={css.legLbl}>{s.label}</span></div>
          ))}
          <div style={{...css.legHead,marginTop:13}}>Navigation</div>
          {["🖱 Molette → zoom","↔ Drag → déplacer","◎ Clic → fiche IA","Pilules → époque animée","⌂ → vue complète"].map(t=>(
            <div key={t} style={{fontSize:9.5,color:"rgba(18,16,14,.45)",marginBottom:4,lineHeight:1.6}}>{t}</div>
          ))}
        </div>

        <div style={css.zoomBtns}>
          {["+","−"].map((lbl,i)=>(
            <button key={lbl} style={css.zoomBtn}
              onMouseEnter={e=>e.currentTarget.style.background="#f0ebe0"}
              onMouseLeave={e=>e.currentTarget.style.background="#faf7f2"}
              onClick={()=>{const s=S.current,W=canvasRef.current?.width||800,c=makeCoord(s.vs,s.ve,W).toYa(W/2);zoomAround(c,i===0?.72:1.38);scheduleRedraw();triggerFetch();}}>
              {lbl}
            </button>
          ))}
        </div>
        <div style={css.mini}><canvas ref={miniRef}/></div>

        {ui.tooltip&&(
          <div style={css.tt(ui.tooltip)}>
            <div style={css.ttDate}>{ui.tooltip.date}</div>
            <div style={css.ttTitle}>{ui.tooltip.title}</div>
            <div style={css.ttHint}>Cliquer pour la fiche complète</div>
          </div>
        )}

        {/* BOOKMARKS VIEW */}
        {ui.showBookmarksView&&(
          <div style={css.bmViewPanel}>
            <div style={{padding:"12px 14px 8px",borderBottom:"1px solid rgba(18,16,14,.08)",display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:400,color:"#12100e",flex:1}}>Signets</div>
              <span style={{fontSize:10,color:"rgba(18,16,14,.35)"}}>{Object.keys(bookmarks).length}</span>
              <button style={{...css.panelClose,position:"static"}} onClick={()=>setUi(u=>({...u,showBookmarksView:false}))}>✕</button>
            </div>
            {/* Tags management */}
            <div style={{padding:"8px 14px 6px",borderBottom:"1px solid rgba(18,16,14,.06)"}}>
              <div style={{fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(18,16,14,.3)",marginBottom:6}}>Catégories</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {customTags.map(tag=>(
                  <div key={tag} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:10,background:"rgba(18,16,14,.05)",border:"1px solid rgba(18,16,14,.1)",fontSize:9}}>
                    <span style={{color:"#12100e"}}>{tag}</span>
                    <span style={{cursor:"pointer",color:"rgba(18,16,14,.3)",fontSize:11,lineHeight:1}} onClick={()=>removeCustomTag(tag)}>×</span>
                  </div>
                ))}
                {addingTag?(
                  <div style={{display:"flex",gap:4}}>
                    <input autoFocus value={newTagInput} onChange={e=>setNewTagInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")addCustomTag(newTagInput);if(e.key==="Escape"){setAddingTag(false);setNewTagInput("");}}}
                      style={{width:80,height:20,border:"1px solid rgba(18,16,14,.2)",borderRadius:4,padding:"0 6px",fontSize:9,fontFamily:"'DM Mono',monospace",outline:"none"}}
                      placeholder="Nouvelle…"/>
                    <button onClick={()=>addCustomTag(newTagInput)} style={{...css.panelClose,position:"static",width:20,height:20,fontSize:10}}>✓</button>
                  </div>
                ):(
                  <div style={{padding:"2px 8px",borderRadius:10,border:"1px dashed rgba(18,16,14,.2)",fontSize:9,color:"rgba(18,16,14,.4)",cursor:"pointer"}}
                    onClick={()=>setAddingTag(true)}>+ Ajouter</div>
                )}
              </div>
            </div>
            {/* Bookmarked events */}
            <div style={{flex:1,overflowY:"auto"}}>
              {Object.keys(bookmarks).length===0&&(
                <div style={{padding:"24px 14px",textAlign:"center",fontSize:10,color:"rgba(18,16,14,.3)"}}>
                  Aucun signet pour l'instant.<br/>
                  <span style={{fontSize:9}}>Ouvrez un événement et cliquez 🔖</span>
                </div>
              )}
              {Object.entries(bookmarks).map(([evId,bm])=>{
                const tagColor=["#c8963c","#0868a8","#0a7848","#b03010","#7a5fa5"][customTags.indexOf(bm.tag)%5]||"#888";
                return(
                  <div key={evId} className="srch-item" style={css.bmViewItem}
                    onClick={()=>{
                      // Navigate to event
                      const ev=ALL_EVENTS.find(e=>e.id===evId)||S.current.aiEvents.find(e=>e.id===evId)||{id:evId,...bm,importance:2,minZoom:0};
                      goToResult(ev);
                    }}>
                    <div style={css.legDot(cc(bm.cat))}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontFamily:"Georgia,serif",color:"#12100e",marginBottom:2}}>{bm.title}</div>
                      <div style={{fontSize:9,color:"#c8963c",marginBottom:3}}>{bm.date_label}</div>
                      <div style={css.bmTag(tagColor)}>{bm.tag}</div>
                    </div>
                    <span style={{fontSize:10,color:"rgba(18,16,14,.25)",cursor:"pointer",flexShrink:0,marginLeft:4}}
                      onClick={e=>{e.stopPropagation();removeBookmark(evId);}}>×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EVENT PANEL */}
        <div style={css.panel(ui.panelOpen)}>
          <div style={css.panelStripe(ui.panelCatColor)}/>
          <div style={css.panelHdr}>
            <button style={css.panelClose} onClick={closePanel}>✕</button>
            <div style={{...css.panelCat,color:ui.panelCatColor}}>{ui.panelCat}</div>
            <div style={css.panelDate}>{ui.panelDate}</div>
            <div style={css.panelTitle}>{ui.panelTitle}</div>
          </div>
          {/* Bookmark bar */}
          {ui.panelEventId&&(
            <div style={{...css.bmBar,position:"relative"}}>
              <span style={{fontSize:9,color:"rgba(18,16,14,.35)",marginRight:2}}>Signet :</span>
              {customTags.map((tag,i)=>{
                const col=["#c8963c","#0868a8","#0a7848","#b03010","#7a5fa5"][i%5];
                const ev=S.current._currentPanelEv;
                const active=ev&&bookmarks[ev.id]?.tag===tag;
                return(
                  <div key={tag} style={css.bmBtn(active,col)}
                    onClick={()=>{const ev2=S.current._currentPanelEv;if(ev2)toggleBookmark(ev2,tag);}}>
                    {active?"✓ ":""}{tag}
                  </div>
                );
              })}
              {addingTag?(
                <div style={{display:"flex",gap:3,alignItems:"center"}}>
                  <input autoFocus value={newTagInput} onChange={e=>setNewTagInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")addCustomTag(newTagInput);if(e.key==="Escape"){setAddingTag(false);setNewTagInput("");}}}
                    style={{width:70,height:18,border:"1px solid rgba(18,16,14,.2)",borderRadius:4,padding:"0 5px",fontSize:9,fontFamily:"'DM Mono',monospace",outline:"none"}}
                    placeholder="Nom…"/>
                  <span style={{cursor:"pointer",fontSize:10,color:"#0a7848"}} onClick={()=>addCustomTag(newTagInput)}>✓</span>
                </div>
              ):(
                <div style={{...css.bmBtn(false,"rgba(18,16,14,.3)"),borderStyle:"dashed"}}
                  onClick={()=>setAddingTag(true)}>+ Tag</div>
              )}
            </div>
          )}
          <div style={css.panelBody}>
            {ui.panelContent==="loading"?(
              <div style={css.loading}>
                <div style={css.bars}>{barH.map((h,i)=>(
                  <span key={i} style={{width:3,height:h,borderRadius:2,background:"#c8963c",animation:`bw 1s ${i*.15}s ease-in-out infinite`,display:"inline-block"}}/>
                ))}</div>
                <div style={css.barsLbl}>Claude rédige la fiche…</div>
              </div>
            ):(
              <div style={css.panelContent} dangerouslySetInnerHTML={{__html:ui.panelContent||""}}/>
            )}
          </div>
        </div>
      </div>

      <div style={css.statusbar}>
        <div style={css.statusEpoch}>{ui.epochLabel}</div>
        <div style={css.aiBadge(ui.aiVisible)}><div style={css.aiDot}/><span>{ui.aiLabel}</span></div>
        <div style={css.statusR}>{ui.range}</div>
      </div>
    </div>
  );
}
