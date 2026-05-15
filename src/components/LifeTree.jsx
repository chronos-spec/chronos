import { useState, useMemo } from "react";

const MAX_AGE = 540e6;
const pct = (v) => Math.min(100, Math.max(0, (v / MAX_AGE) * 100));

// ══════════════════════════════════════════════════════════════════════════════
// DONNÉES — Arbre complet avec relations phylogénétiques
// chaque nœud : id, label, period, from (années), to (null=vivant), color,
//               vivant, eteint, desc, cousin (ids), children
// ══════════════════════════════════════════════════════════════════════════════
const TREE = [
 // ── PROCARYOTES ────────────────────────────────────────────────────────────
 {id:"bact",label:"🦠 Procaryotes / Bactéries",period:"~3 500 Ma",from:3500e6,to:null,color:"#64748b",vivant:true,
  desc:"Premières formes de vie. Dominent 2 milliards d'années. Stromatolites à −3,5 Ga.",
  children:[
   {id:"cyano",label:"🟦 Cyanobactéries",period:"~2 700 Ma",from:2700e6,to:null,color:"#0891b2",vivant:true,
    desc:"Inventent la photosynthèse oxygénique. Responsables de la Grande Oxydation (−2,4 Ga) qui transforme l'atmosphère."},
  ]},
 // ── EUCARYOTES ─────────────────────────────────────────────────────────────
 {id:"euca",label:"🔵 Eucaryotes",period:"~2 000 Ma",from:2000e6,to:null,color:"#6366f1",vivant:true,
  desc:"Cellules à noyau, issues d'une endosymbiose bactérienne. Ancêtres de tout le vivant complexe.",
  children:[
   {id:"champi",label:"🍄 Champignons",period:"~1 000 Ma",from:1000e6,to:null,color:"#a78bfa",vivant:true,
    desc:"Décomposeurs essentiels. Réseaux mycorhiziens sous les forêts. Plus proches du règne animal que du règne végétal."},
   // PLANTES
   {id:"plantes",label:"🌿 Plantes",period:"~470 Ma",from:470e6,to:null,color:"#16a34a",vivant:true,
    desc:"Colonisent la terre ferme. De la mousse aux angiospermes. Photosynthèse → oxygène et biomasse.",
    children:[
     {id:"mousses",label:"🌱 Mousses / Hépatiques",period:"~470 Ma",from:470e6,to:null,color:"#4ade80",vivant:true,desc:"Premières plantes terrestres. Sans racines ni vaisseaux. Dependent de l'humidité pour se reproduire."},
     {id:"fougeres",label:"🌾 Fougères / Prêles",period:"~360 Ma",from:360e6,to:null,color:"#22c55e",vivant:true,desc:"Forêts carbonifères géantes. À l'origine du charbon. Prêles de 30 m de haut au Carbonifère."},
     {id:"gymno",label:"🌲 Gymnospermes",period:"~320 Ma",from:320e6,to:null,color:"#15803d",vivant:true,desc:"Graines nues. Conifères, cycas, ginkgo. Dominent le Mésozoïque.",
      children:[
       {id:"ginkgo",label:"🌳 Ginkgo biloba",period:"~270 Ma",from:270e6,to:null,color:"#84cc16",vivant:true,desc:"Fossile vivant quasi inchangé depuis 270 Ma. Survit à Hiroshima. Dioïque, médicinal."},
      ]},
     {id:"angios",label:"🌸 Angiospermes",period:"~130 Ma",from:130e6,to:null,color:"#f0abfc",vivant:true,desc:"Plantes à fleurs. Coévoluent avec insectes pollinisateurs. 90% des plantes actuelles. Apparaissent au Crétacé."},
    ]},
   // INVERTÉBRÉS
   {id:"invert",label:"🦑 Invertébrés",period:"~600 Ma",from:600e6,to:null,color:"#f59e0b",vivant:true,
    desc:"Groupe paraphylétique dominant. Arthropodes, mollusques, échinodermes, cnidaires...",
    children:[
     {id:"ediac",label:"💀 Faune d'Édiacara",period:"~600–541 Ma",from:600e6,to:541e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers animaux multicellulaires complexes. Formes molles, aplaties, mystérieuses. Disparaissent au Cambrien."},
     {id:"cnid",label:"🪸 Cnidaires",period:"~580 Ma",from:580e6,to:null,color:"#fb923c",vivant:true,desc:"Méduses, coraux, anémones. Parmi les premiers animaux à symétrie radiale. Coraux = récifs vitaux."},
     {id:"mollus",label:"🐙 Mollusques",period:"~540 Ma",from:540e6,to:null,color:"#e879f9",vivant:true,
      desc:"Pieuvres, calmars, escargots, moules, huîtres. Très diversifiés.",
      children:[
       {id:"ammo",label:"💀 Ammonites",period:"~400–66 Ma",from:400e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Céphalopodes à coquille spiralée. Marqueurs stratigraphiques parfaits. Éteints à −66 Ma."},
       {id:"naut",label:"🐚 Nautile",period:"~500 Ma",from:500e6,to:null,color:"#c026d3",vivant:true,desc:"Seul céphalopode à coquille externe encore vivant. Fossile vivant. Chambre à gaz pour la flottaison."},
       {id:"pieuvre",label:"🐙 Pieuvre / Calmar",period:"~300 Ma",from:300e6,to:null,color:"#9333ea",vivant:true,desc:"Intelligence remarquable. 3 cœurs, sang bleu. La pieuvre résout des puzzles et utilise des outils."},
      ]},
     {id:"arthro",label:"🦀 Arthropodes",period:"~540 Ma",from:540e6,to:null,color:"#ea580c",vivant:true,
      desc:"Plus grand groupe animal : insectes, araignées, crustacés. ~1,2 million d'espèces.",
      children:[
       {id:"trilo",label:"💀 Trilobites",period:"~521–252 Ma",from:521e6,to:252e6,color:"#6b7280",vivant:false,eteint:true,desc:"Arthropodes marins du Paléozoïque. +20 000 espèces décrites. Yeux composites. Éteints au Permien."},
       {id:"insect",label:"🪲 Insectes",period:"~385 Ma",from:385e6,to:null,color:"#d97706",vivant:true,desc:"+1 million d'espèces. Libellules géantes au Carbonifère (70 cm). Pollinisateurs indispensables."},
       {id:"arach",label:"🕷️ Arachnides",period:"~420 Ma",from:420e6,to:null,color:"#92400e",vivant:true,desc:"Scorpions, araignées, acariens. Parmi les premiers animaux terrestres. Venin, soie."},
       {id:"euryp",label:"💀 Euryptérides (scorpions marins)",period:"~470–252 Ma",from:470e6,to:252e6,color:"#6b7280",vivant:false,eteint:true,desc:"Jusqu'à 2,5 m de long. Prédateurs apex des mers paléozoïques. Cousins des limules."},
      ]},
     {id:"echino",label:"⭐ Échinodermes",period:"~520 Ma",from:520e6,to:null,color:"#f472b6",vivant:true,desc:"Étoiles de mer, oursins, holothuries, crinoïdes. Symétrie pentaradiée. Proches cousins des vertébrés."},
    ]},
   // VERTÉBRÉS — branche principale
   {id:"vert",label:"🐟 Vertébrés",period:"~525 Ma",from:525e6,to:null,color:"#0ea5e9",vivant:true,
    desc:"Colonne vertébrale, crâne. ~66 000 espèces. Apparus dans les mers cambriennes.",
    children:[
     {id:"agnath",label:"💀 Agnathes cuirassés",period:"~480–360 Ma",from:480e6,to:360e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers vertébrés à bouclier osseux. Sans mâchoires. Ancêtres des poissons modernes."},
     {id:"lamprey",label:"🐡 Lamproies / Myxines",period:"~360 Ma",from:360e6,to:null,color:"#64748b",vivant:true,desc:"Seuls vertébrés sans mâchoires survivants. Parasites ou détritivores. Fossiles vivants."},
     {id:"poissons",label:"🐟 Poissons à mâchoires",period:"~440 Ma",from:440e6,to:null,color:"#0284c7",vivant:true,
      desc:"Révolution de la mâchoire. Donnent tous les vertébrés supérieurs.",
      children:[
       {id:"requin",label:"🦈 Requins / Raies",period:"~450 Ma",from:450e6,to:null,color:"#1e3a5f",vivant:true,desc:"Squelette cartilagineux. Quasi inchangés depuis 450 Ma. ~1 100 espèces. Apex prédateurs marins."},
       {id:"megalo",label:"💀 Mégalodon",period:"~23–3,6 Ma",from:23e6,to:3.6e6,color:"#6b7280",vivant:false,eteint:true,desc:"Requin géant de 15–18 m. Dents de 18 cm. Prédateur apex des océans du Néogène. Éteint ~3,6 Ma."},
       {id:"placode",label:"💀 Placodermes",period:"~430–360 Ma",from:430e6,to:360e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers poissons à mâchoires, cuirassés. Dunkleosteus : 6 m, morsure de 5 500 N. Éteints −360 Ma."},
       {id:"actino",label:"🐠 Actinoptérygiens",period:"~400 Ma",from:400e6,to:null,color:"#38bdf8",vivant:true,desc:"99% des poissons actuels. ~30 000 espèces. Thons, saumons, carpes, anguilles, hippocampes."},
       {id:"sarco",label:"🫁 Sarcoptérygiens",period:"~420 Ma",from:420e6,to:null,color:"#0369a1",vivant:true,
        desc:"Nageoires charnues. Ancêtres des tétrapodes. Cœlacanthe + dipneustes (vivants).",
        children:[
         {id:"coela",label:"🐟 Cœlacanthe",period:"~400 Ma",from:400e6,to:null,color:"#1d4ed8",vivant:true,desc:"Fossile vivant. Cru éteint, redécouvert en 1938 aux Comores. Nageoires qui ressemblent à des membres."},
         {id:"tiktaalik",label:"💀 Tiktaalik",period:"~375 Ma",from:375e6,to:368e6,color:"#6b7280",vivant:false,eteint:true,desc:"Chaînon manquant poisson-tétrapode. Cou mobile, nageoires-membres. Canada, Dévonien supérieur."},
        ]},
      ]},
     // TÉTRAPODES
     {id:"amphi",label:"🐸 Amphibiens",period:"~370 Ma",from:370e6,to:null,color:"#0f766e",vivant:true,
      desc:"Premiers vertébrés terrestres. Dépendants de l'eau pour la reproduction. ~8 000 espèces.",
      children:[
       {id:"ichthyo_a",label:"💀 Ichthyostega",period:"~374–359 Ma",from:374e6,to:359e6,color:"#6b7280",vivant:false,eteint:true,desc:"Un des premiers tétrapodes. 8 doigts. Encore très aquatique. Groenland, Dévonien."},
       {id:"temno",label:"💀 Temnospondyles",period:"~330–250 Ma",from:330e6,to:250e6,color:"#6b7280",vivant:false,eteint:true,desc:"Amphibiens géants du Paléozoïque. Mastodonsaurus : 6 m. Ancêtres possibles des grenouilles."},
       {id:"grenouille",label:"🐸 Anoures (grenouilles)",period:"~250 Ma",from:250e6,to:null,color:"#10b981",vivant:true,desc:"~6 000 espèces. Bioindicateurs environnementaux. Communication acoustique complexe."},
       {id:"salaman",label:"🦎 Urodèles (salamandres)",period:"~160 Ma",from:160e6,to:null,color:"#059669",vivant:true,desc:"Salamandres, tritons, axolotls. Régénération d'un membre entier. ~700 espèces."},
      ]},
     // AMNIOTES
     {id:"amnio",label:"🥚 Amniotes",period:"~320 Ma",from:320e6,to:null,color:"#b45309",vivant:true,
      desc:"L'œuf amniotique libère les vertébrés de l'eau. Mammifères + reptiles (y compris oiseaux).",
      children:[
       // SYNAPSIDES
       {id:"synap",label:"💀 Synapsida",period:"~315–252 Ma",from:315e6,to:252e6,color:"#78716c",vivant:false,eteint:true,
        desc:"«Reptiles mammaliens». Dominent avant les dinosaures. Traits de mammifères progressifs.",
        children:[
         {id:"dimetro",label:"💀 Dimétrodon",period:"~295–272 Ma",from:295e6,to:272e6,color:"#6b7280",vivant:false,eteint:true,desc:"Voile dorsale thermorégulatrice. Souvent confondu avec un dinosaure — ce n'en est pas un. Permien."},
         {id:"lystro",label:"💀 Lystrosaurus",period:"~255–245 Ma",from:255e6,to:245e6,color:"#6b7280",vivant:false,eteint:true,desc:"Survit à la Grande Extinction du Permien. Colonise le monde vide. Ancêtre lointain des mammifères."},
         {id:"cynogna",label:"💀 Cynognathus",period:"~245 Ma",from:245e6,to:238e6,color:"#6b7280",vivant:false,eteint:true,desc:"Cynodonthe carnivore proche des mammifères. Probablement à sang chaud et emplumé. Trias."},
        ]},
       // MAMMIFÈRES
       {id:"mamm",label:"🦁 Mammifères",period:"~225 Ma",from:225e6,to:null,color:"#be185d",vivant:true,
        desc:"Poils, lait, sang chaud. Discrets sous les dinosaures (~10 cm), explosifs après −66 Ma.",
        children:[
         {id:"monot",label:"🦆 Monotrèmes",period:"~170 Ma",from:170e6,to:null,color:"#9d174d",vivant:true,desc:"Mammifères ovipares. Ornithorynque (venin, électroréception), échidné. 5 espèces. Australie."},
         {id:"marsu",label:"🦘 Marsupiaux",period:"~100 Ma",from:100e6,to:null,color:"#be185d",vivant:true,
          desc:"Gestation courte, développement en poche. Kangourous, koalas, opossums, wombats.",
          children:[
           {id:"thyla",label:"💀 Thylacine (loup marsupial)",period:"~4 Ma–1936",from:4e6,to:0.089,color:"#6b7280",vivant:false,eteint:true,desc:"Prédateur marsupial de Tasmanie. Rayures dorsales. Dernier individu mort en captivité le 7 sept 1936."},
           {id:"dipro",label:"💀 Diprotodon",period:"~1,6 Ma–46 Ka",from:1.6e6,to:46e3,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand marsupial connu. Taille d'un rhinocéros, 2,7 t. Australie. Éteint ~46 000 ans."},
           {id:"thylaleo",label:"💀 Thylacoleo (lion marsupial)",period:"~2 Ma–46 Ka",from:2e6,to:46e3,color:"#6b7280",vivant:false,eteint:true,desc:"Prédateur marsupial d'Australie. Morsure proportionnellement plus puissante que le lion actuel."},
          ]},
         {id:"plac",label:"🐘 Placentaires",period:"~100 Ma",from:100e6,to:null,color:"#db2777",vivant:true,
          desc:"96% des mammifères. Placenta = gestation longue. Radiation après −66 Ma.",
          children:[
           {id:"cetace",label:"🐋 Cétacés",period:"~50 Ma",from:50e6,to:null,color:"#0e7490",vivant:true,
            desc:"Baleines, dauphins, marsouins. Descendants d'ongulés terrestres.",
            children:[
             {id:"pakice",label:"💀 Pakicetus",period:"~53–48 Ma",from:53e6,to:48e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre des baleines. Quadrupède terrestre vivant près des rivières. Pakistan, Éocène."},
             {id:"ambulo",label:"💀 Ambulocetus",period:"~49 Ma",from:49e6,to:46e6,color:"#6b7280",vivant:false,eteint:true,desc:"«Baleine qui marche». Semi-aquatique. Nage en ondulant la colonne comme une loutre."},
             {id:"basilos",label:"💀 Basilosaurus",period:"~41–34 Ma",from:41e6,to:34e6,color:"#6b7280",vivant:false,eteint:true,desc:"18 m. Membres postérieurs vestigiaux. Prédateur apex des mers éocènes."},
             {id:"bbleine",label:"🐋 Baleine bleue",period:"Actuel",from:5e6,to:null,color:"#0ea5e9",vivant:true,desc:"Plus grand animal ayant jamais existé. 30 m, 180 t. Cœur de la taille d'une voiture."},
            ]},
           {id:"probos",label:"🐘 Proboscidiens",period:"~55 Ma",from:55e6,to:null,color:"#78716c",vivant:true,
            children:[
             {id:"moerit",label:"💀 Moeritherium",period:"~37 Ma",from:37e6,to:35e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre primitif des éléphants. Taille d'un cochon, sans trompe. Égypte, Éocène."},
             {id:"mammouth",label:"💀 Mammouth laineux",period:"~400 Ka–4 Ka",from:400e3,to:4e3,color:"#6b7280",vivant:false,eteint:true,desc:"Adapté aux steppes froides. Défenses spiralées jusqu'à 4 m. Éteint −4 000 av.J.-C. (île Wrangel)."},
             {id:"mastodon",label:"💀 Mastodonte",period:"~5 Ma–10 Ka",from:5e6,to:10e3,color:"#6b7280",vivant:false,eteint:true,desc:"Distinct du mammouth. Dents en tubercules. Forêts d'Amérique du Nord. Chassé par Clovis."},
             {id:"elephas",label:"🐘 Éléphant d'Afrique",period:"Actuel",from:6e6,to:null,color:"#57534e",vivant:true,desc:"6 t, 7 m. Mémoire, deuil, empathie observés. Oreilles = radiateurs. Menacé de braconnage."},
            ]},
           {id:"perisso",label:"🦏 Périssodactyles",period:"~55 Ma",from:55e6,to:null,color:"#92400e",vivant:true,
            children:[
             {id:"eohippus",label:"💀 Eohippus",period:"~55 Ma",from:55e6,to:45e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre du cheval. Taille d'un renard. 4 doigts à l'avant, 3 derrière. Éocène."},
             {id:"indrico",label:"💀 Indricotherium",period:"~34–23 Ma",from:34e6,to:23e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand mammifère terrestre connu. 20 t, 5,5 m de haut. Rhinocéros géant sans corne."},
             {id:"cheval",label:"🐎 Cheval / Équidés",period:"Actuel",from:4e6,to:null,color:"#b45309",vivant:true,desc:"Domestiqué ~5 500 av.J.-C. en Asie centrale. Un seul doigt fonctionnel (sabot)."},
            ]},
           {id:"carni",label:"🦁 Carnivores",period:"~60 Ma",from:60e6,to:null,color:"#dc2626",vivant:true,
            children:[
             {id:"smilodon",label:"💀 Smilodon",period:"~2,5 Ma–10 Ka",from:2.5e6,to:10e3,color:"#6b7280",vivant:false,eteint:true,desc:"Canines de 28 cm. Morsure relativement faible — les dents transpercent, ne brisent pas. Amériques."},
             {id:"cave_lion",label:"💀 Lion des cavernes",period:"~370 Ka–13 Ka",from:370e3,to:13e3,color:"#6b7280",vivant:false,eteint:true,desc:"10% plus grand que le lion actuel. Europe et Sibérie. Représenté dans l'art rupestre."},
             {id:"direwolf",label:"💀 Loup terrible (Aenocyon dirus)",period:"~250 Ka–9,5 Ka",from:250e3,to:9.5e3,color:"#6b7280",vivant:false,eteint:true,desc:"Loup géant d'Amérique. Dents plus robustes. 10 000+ individus retrouvés à La Brea."},
             {id:"lion",label:"🦁 Lion",period:"Actuel",from:3e6,to:null,color:"#ca8a04",vivant:true,desc:"Seul félin social. Jadis sur 3 continents. ~20 000 individus restants en Afrique."},
            ]},
           {id:"chiropt",label:"🦇 Chauves-souris",period:"~55 Ma",from:55e6,to:null,color:"#44403c",vivant:true,desc:"Seuls mammifères au vol actif. ~1 400 espèces. Écholocation. Pollinisateurs et régulateurs d'insectes."},
           // ══ PRIMATES ET HOMINIDÉS ═══════════════════════════════════════
           {id:"primate",label:"🐒 Primates",period:"~58 Ma",from:58e6,to:null,color:"#9333ea",vivant:true,
            desc:"Vision stéréoscopique, mains préhensiles, cerveau développé, vie sociale complexe.",
            children:[
             {id:"prosim",label:"🦥 Prosimiens",period:"~55 Ma",from:55e6,to:null,color:"#7c3aed",vivant:true,desc:"Lémuriens, tarsiers, loris, galagos. Primates basaux. Essentiellement nocturnes."},
             {id:"platyr",label:"🐒 Singes du Nouveau Monde",period:"~40 Ma",from:40e6,to:null,color:"#8b5cf6",vivant:true,desc:"Capucins, hurleurs, ouistitis. Queue préhensile souvent. Traversent l'Atlantique depuis l'Afrique ~40 Ma."},
             {id:"catarr",label:"🐵 Singes de l'Ancien Monde",period:"~30 Ma",from:30e6,to:null,color:"#7c3aed",vivant:true,desc:"Babouins, macaques, mandrills, colobes. Afrique et Asie. Pas de queue préhensile."},
             {id:"gibbon",label:"🦧 Gibbons",period:"~20 Ma",from:20e6,to:null,color:"#6d28d9",vivant:true,desc:"20 espèces d'Asie du Sud-Est. Brachiation (vol entre les branches). Monogames. Chant territorial."},
             // GRANDS SINGES + HOMINIDÉS — branche détaillée
             {id:"homin_g",label:"🦍 Grands singes (Hominidae)",period:"~15 Ma",from:15e6,to:null,color:"#5b21b6",vivant:true,
              desc:"Orangs-outans, gorilles, chimpanzés, bonobos, humains. Pas de queue. Grand cerveau.",
              children:[
               {id:"orang",label:"🦧 Orang-outan",period:"~15 Ma",from:15e6,to:null,color:"#c2410c",vivant:true,desc:"Asie (Bornéo, Sumatra). Plus solitaire des grands singes. Fabrique des outils, se soigne avec des plantes."},
               {id:"gorille",label:"🦍 Gorille",period:"~10 Ma",from:10e6,to:null,color:"#374151",vivant:true,desc:"Afrique centrale. Plus grand primate. Herbivore. Intelligence émotionnelle (Koko apprenait la langue des signes)."},
               {id:"dryo",label:"💀 Dryopithèque",period:"~13–8 Ma",from:13e6,to:8e6,color:"#6b7280",vivant:false,eteint:true,
                desc:"Ancêtre commun des grands singes et humains. Europe et Asie, Miocène.",
                cousin:["chimp","homin_h"]},
               // ── LIGNÉE HUMAINE + COUSINS ────────────────────────────
               {id:"chimp",label:"🐒 Chimpanzé / Bonobo",period:"~7 Ma",from:7e6,to:null,color:"#713f12",vivant:true,
                desc:"Nos plus proches cousins vivants. 98,7% d'ADN commun. Utilisent outils, font la guerre, ont une culture.",
                cousin:["homin_h"]},
               {id:"homin_h",label:"👥 HOMINIDÉS — Lignée humaine",period:"~7 Ma",from:7e6,to:null,color:"#1d4ed8",vivant:true,
                desc:"Séparation d'avec les chimpanzés ~7 Ma. Bipédie progressive, cerveau en expansion, outils, langage.",
                children:[
                 // ── ANCÊTRES DIRECTS (lignée principale) ──────────────
                 {id:"sahel",label:"💀 Sahelanthropus tchadensis ★",period:"~7–6 Ma",from:7e6,to:6e6,color:"#1d4ed8",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRE POSSIBLE le plus ancien. Tchad. Foramen magnum positionné pour la bipédie. Débattu.",
                  cousin:["orrorin"]},
                 {id:"orrorin",label:"💀 Orrorin tugenensis ★",period:"~6 Ma",from:6e6,to:5.7e6,color:"#1e40af",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRE PROBABLE. Kenya. Fémur = bipédie quasi-certaine. Contemporain de la séparation chimp/humain.",
                  cousin:["sahel","ardipith"]},
                 {id:"ardipith",label:"💀 Ardipithèque ★",period:"~5,8–4,4 Ma",from:5.8e6,to:4.4e6,color:"#1e3a8a",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRE DIRECT probable. Éthiopie. Bipède mais arboricole. Canines réduites → changements sociaux.",
                  cousin:["kenyanthr"]},
                 // ── AUSTRALOPITHÈQUES ──────────────────────────────────
                 {id:"australo",label:"💀 Australopithèques ★",period:"~4–2 Ma",from:4e6,to:2e6,color:"#1d4ed8",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRES DIRECTS. Bipédie confirmée, cerveau ~450 cc, encore arboricoles. Plusieurs espèces.",
                  children:[
                   {id:"anam",label:"💀 A. anamensis",period:"~4,2–3,8 Ma",from:4.2e6,to:3.8e6,color:"#6b7280",vivant:false,eteint:true,
                    desc:"Une des plus anciennes espèces d'Australopithèques. Kenya. Ancêtre probable d'A. afarensis.",
                    cousin:["afarensis"]},
                   {id:"afarensis",label:"💀 A. afarensis (Lucy) ★",period:"~3,9–2,9 Ma",from:3.9e6,to:2.9e6,color:"#1d4ed8",vivant:false,eteint:true,
                    desc:"⭐ ANCÊTRE DIRECT. Lucy découverte en 1974. Bipédie parfaite. Éthiopie/Tanzanie. Emprunte de Laetoli.",
                    cousin:["africanus"]},
                   {id:"africanus",label:"💀 A. africanus",period:"~3,3–2,1 Ma",from:3.3e6,to:2.1e6,color:"#374151",vivant:false,eteint:true,
                    desc:"Afrique du Sud. Cerveau légèrement plus grand. Premier australopithèque découvert (1924, enfant de Taung).",
                    cousin:["sediba"]},
                   {id:"sediba",label:"💀 A. sediba",period:"~2 Ma",from:2e6,to:1.9e6,color:"#374151",vivant:false,eteint:true,
                    desc:"Afrique du Sud. Traits mélangés australopithèque/Homo. Candidat à l'ancêtre de H. erectus."},
                   {id:"garrhi",label:"💀 A. garhi",period:"~2,5 Ma",from:2.5e6,to:2.3e6,color:"#374151",vivant:false,eteint:true,
                    desc:"Éthiopie. Associé aux premiers outils en pierre (oldo­wayens). Ancêtre possible de Homo habilis."},
                  ]},
                 // ── AUSTRALOPITHÈQUES ROBUSTES (cousins) ──────────────
                 {id:"paranthr",label:"💀 Paranthropus (cousins robustes)",period:"~2,7–1,2 Ma",from:2.7e6,to:1.2e6,color:"#6b7280",vivant:false,eteint:true,
                  desc:"🔀 COUSINS (pas ancêtres). Crête sagittale, herbivores robustes. Contemporains de Homo habilis et erectus.",
                  cousin:["habilis"],
                  children:[
                   {id:"parobust",label:"💀 P. robustus",period:"~2–1,2 Ma",from:2e6,to:1.2e6,color:"#6b7280",vivant:false,eteint:true,desc:"Afrique du Sud. Crête sagittale modérée. Possiblement utilisait des outils en os."},
                   {id:"paboisei",label:"💀 P. boisei (Nutcracker Man)",period:"~2,3–1,2 Ma",from:2.3e6,to:1.2e6,color:"#6b7280",vivant:false,eteint:true,desc:"Afrique de l'Est. Crête immense, molaires de 2 cm. Découvert par Mary Leakey en 1959."},
                   {id:"paethio",label:"💀 P. aethiopicus",period:"~2,7–2,3 Ma",from:2.7e6,to:2.3e6,color:"#6b7280",vivant:false,eteint:true,desc:"La plus ancienne espèce de Paranthropus. Ethiopie/Kenya. Prognathe, crête sagittale."},
                  ]},
                 // ── KENYAN ET AUTRES HOMINIDÉS ─────────────────────────
                 {id:"kenyanthr",label:"💀 Kenyanthropus platyops",period:"~3,5 Ma",from:3.5e6,to:3.2e6,color:"#374151",vivant:false,eteint:true,
                  desc:"🔀 COUSIN d'Afarensis. Face plate unique. Kenya. Relation avec Homo non claire.",
                  cousin:["afarensis"]},
                 // ── GENRE HOMO ─────────────────────────────────────────
                 {id:"habilis",label:"💀 Homo habilis ★",period:"~2,4–1,4 Ma",from:2.4e6,to:1.4e6,color:"#0369a1",vivant:false,eteint:true,
                  desc:"⭐ PREMIER HOMO. Cerveau ~600 cc. Industrie oldowayenne (outils en pierre taillée). Afrique de l'Est.",
                  cousin:["rudolfensis"],
                  children:[
                   {id:"rudolfensis",label:"💀 Homo rudolfensis",period:"~2,4–1,9 Ma",from:2.4e6,to:1.9e6,color:"#374151",vivant:false,eteint:true,
                    desc:"🔀 COUSIN de H. habilis. Kenya. Face plus large. Statut débattu — espèce distincte ou variation?",
                    cousin:["habilis"]},
                  ]},
                 {id:"erectus",label:"💀 Homo erectus ★",period:"~1,9 Ma–110 Ka",from:1.9e6,to:110e3,color:"#0369a1",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRE DIRECT. Maîtrise du feu (~1 Ma). Quitte l'Afrique. Industrie acheuléenne. Cerveau ~900 cc.",
                  children:[
                   {id:"ergaster",label:"💀 H. ergaster (Garçon de Turkana)",period:"~1,9–1,4 Ma",from:1.9e6,to:1.4e6,color:"#374151",vivant:false,eteint:true,
                    desc:"Forme africaine d'H. erectus pour certains. Garçon de Turkana : squelette quasi-complet, 12 ans, 1,6 m."},
                   {id:"georgi",label:"💀 H. georgicus",period:"~1,85–1,7 Ma",from:1.85e6,to:1.7e6,color:"#374151",vivant:false,eteint:true,
                    desc:"Dmanisi (Géorgie). Première sortie d'Afrique documentée. 5 crânes aux morphologies très variées."},
                   {id:"peking",label:"💀 Sinanthrope (H. erectus pekinensis)",period:"~780–230 Ka",from:780e3,to:230e3,color:"#374151",vivant:false,eteint:true,
                    desc:"Pékin, Chine. Utilisait le feu, chassait le cerf géant. 45 individus. Disparus mystérieusement."},
                   {id:"java",label:"💀 Homme de Java (Pithecanthropus)",period:"~1,5 Ma–100 Ka",from:1.5e6,to:100e3,color:"#374151",vivant:false,eteint:true,
                    desc:"Indonésie. Découvert par Dubois en 1891. Survit très tard, contemporain des premiers Sapiens en Asie."},
                  ]},
                 {id:"antecessor",label:"💀 Homo antecessor",period:"~1,2 Ma–800 Ka",from:1.2e6,to:800e3,color:"#0369a1",vivant:false,eteint:true,
                  desc:"Atapuerca (Espagne). Ancêtre commun possible de Neanderthal ET Sapiens selon certains. Pratiquait le cannibalisme.",
                  cousin:["heidel"]},
                 {id:"heidel",label:"💀 Homo heidelbergensis ★",period:"~700–200 Ka",from:700e3,to:200e3,color:"#0369a1",vivant:false,eteint:true,
                  desc:"⭐ ANCÊTRE COMMUN de Néandertal + Sapiens. Chasse le grand gibier, construit des abris. Europe & Afrique.",
                  cousin:["nean","sapiens_a"],
                  children:[
                   {id:"nean",label:"💀 Homo neanderthalensis ★",period:"~400–40 Ka",from:400e3,to:40e3,color:"#7c3aed",vivant:false,eteint:true,
                    desc:"🔀 COUSIN. Cerveau légèrement plus grand que le nôtre. Enterrait ses morts, soignait ses malades. Croisements avec Sapiens (1–4% ADN néandertalien en nous).",
                    cousin:["deniso","sapiens_a"]},
                   {id:"deniso",label:"💀 Denisoviens ★",period:"~500–30 Ka",from:500e3,to:30e3,color:"#7c3aed",vivant:false,eteint:true,
                    desc:"🔀 COUSIN. Connus par ADN + quelques os. Asie centrale/Océanie. Croisements avec Sapiens (jusqu'à 6% en Mélanésie) ET Néandertal.",
                    cousin:["nean","sapiens_a"]},
                  ]},
                 {id:"naledi",label:"💀 Homo naledi",period:"~335–236 Ka",from:335e3,to:236e3,color:"#374151",vivant:false,eteint:true,
                  desc:"🔀 COUSIN. Afrique du Sud. Petit cerveau (~500 cc) mais contemporain de Sapiens. Déposait ses morts dans des grottes. Découvert en 2015."},
                 {id:"longi",label:"💀 Homme du Dragon (H. longi)",period:"~146 Ka",from:146e3,to:130e3,color:"#374151",vivant:false,eteint:true,
                  desc:"🔀 COUSIN possible. Chine. Crâne massif. Certains chercheurs pensent qu'il pourrait être un Denisovien."},
                 {id:"luzon",label:"💀 Homo luzonensis",period:"~67–50 Ka",from:67e3,to:50e3,color:"#374151",vivant:false,eteint:true,
                  desc:"🔀 COUSIN. Philippines (île de Luçon). Traits mélangés primitifs/modernes. Comment y est-il arrivé?"},
                 {id:"floresi",label:"💀 Homo floresiensis (Hobbit) ★",period:"~100–50 Ka",from:100e3,to:50e3,color:"#374151",vivant:false,eteint:true,
                  desc:"🔀 COUSIN nain. 1 m de haut, cerveau 380 cc. Île de Florès, Indonésie. Contemporain de Sapiens. Insularisme évolutif.",
                  cousin:["sapiens_a"]},
                 {id:"sapiens_a",label:"🧠 Homo sapiens ★",period:"~300 Ka",from:300e3,to:null,color:"#b45309",vivant:true,
                  desc:"⭐ NOUS. Jebel Irhoud (Maroc). Cerveau ~1 350 cc. Langage complexe, art, agriculture, écriture, sciences, IA.",
                  children:[
                   {id:"archaiq",label:"💀 Sapiens archaïques",period:"~300–100 Ka",from:300e3,to:100e3,color:"#78716c",vivant:false,eteint:true,
                    desc:"Homo sapiens idaltu (Éthiopie). Traits encore plus robustes. Transition vers l'anatomie moderne."},
                   {id:"idaltu",label:"💀 H. sapiens idaltu",period:"~160 Ka",from:160e3,to:154e3,color:"#6b7280",vivant:false,eteint:true,
                    desc:"Herto, Éthiopie. Crâne légèrement plus grand, sourcils plus marqués. Pratiquer la décarnisation rituelle."},
                   {id:"cromagnon",label:"💀 Cro-Magnon (Homo sapiens)",period:"~40 Ka–10 Ka",from:40e3,to:10e3,color:"#6b7280",vivant:false,eteint:true,
                    desc:"Homo sapiens anatomiquement modernes en Europe. Grotte Chauvet (−36 Ka), Lascaux (−17 Ka). Enterrements élaborés."},
                   {id:"sapiens_mod",label:"🧑 Humains modernes",period:"~40 Ka",from:40e3,to:null,color:"#b45309",vivant:true,
                    desc:"7e miliards d'individus. Ont colonisé chaque continent. Transforment la planète. Époque de l'Anthropocène."},
                  ]},
                ]},
              ]},
             ]},
           ]},
          ]},
        ]},
       // SAUROPSIDES
       {id:"saurop_g",label:"🦎 Sauropsida",period:"~315 Ma",from:315e6,to:null,color:"#15803d",vivant:true,
        desc:"Reptiles + oiseaux. Écailles ou plumes. Œufs à coquille.",
        children:[
         {id:"tortu",label:"🐢 Tortues",period:"~230 Ma",from:230e6,to:null,color:"#65a30d",vivant:true,desc:"Carapace = côtes fusionnées. Quasi inchangées depuis 220 Ma. ~360 espèces. Vivent jusqu'à 200 ans."},
         {id:"squa_g",label:"🐍 Squamates",period:"~200 Ma",from:200e6,to:null,color:"#ca8a04",vivant:true,
          desc:"~10 000 espèces. Lézards, serpents, amphisbènes.",
          children:[
           {id:"lezer_g",label:"🦎 Lézards",period:"~200 Ma",from:200e6,to:null,color:"#84cc16",vivant:true,desc:"Varans, geckos, caméléons, iguanes. Komodo : 3 m, venin. ~6 000 espèces."},
           {id:"serp_g",label:"🐍 Serpents",period:"~150 Ma",from:150e6,to:null,color:"#a3e635",vivant:true,desc:"~3 700 espèces. Du 10 cm (Barbados threadsnake) au 7 m (anaconda vert). Venin ou constriction."},
           {id:"mosa_g",label:"💀 Mosasaures",period:"~98–66 Ma",from:98e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
            children:[
             {id:"mosamoss",label:"💀 Mosasaurus hoffmannii",period:"~82–66 Ma",from:82e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"17 m. Prédateur dominant des mers crétacées tardives. Pays-Bas, 1764, premier grand fossile décrit."},
            ]},
          ]},
         {id:"ichthyo_g",label:"💀 Ichthyosaures",period:"~250–90 Ma",from:250e6,to:90e6,color:"#6b7280",vivant:false,eteint:true,
          desc:"Reptiles marins en forme de dauphins. Vivipares. ~100 espèces.",
          children:[
           {id:"ophtha",label:"💀 Ophthalmosaurus",period:"~165–145 Ma",from:165e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Yeux de 23 cm. Les plus grands proportionnellement. Plongeait à grande profondeur. Jurassique."},
          ]},
         {id:"plesio_g",label:"💀 Plésiosaures",period:"~205–66 Ma",from:205e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
          desc:"Long cou (plésiosaures) ou tête massive (pliosauridés).",
          children:[
           {id:"elasmosaur",label:"💀 Élasmosaure",period:"~80–66 Ma",from:80.5e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"14 m dont 7 m de cou. 76 vertèbres cervicales. Amérique du Nord, Crétacé."},
           {id:"liopleuro",label:"💀 Liopleurodon",period:"~165–155 Ma",from:165e6,to:155e6,color:"#6b7280",vivant:false,eteint:true,desc:"Pliosauridé de 6–7 m. Mâchoires de 3 m. Apex des mers jurassiques. Europe."},
          ]},
         {id:"archo_g",label:"🦖 Archosaures",period:"~252 Ma",from:252e6,to:null,color:"#b91c1c",vivant:true,
          desc:"Crocodiliens, ptérosaures, dinosaures (oiseaux inclus).",
          children:[
           {id:"croco",label:"🐊 Crocodyliens",period:"~230 Ma",from:230e6,to:null,color:"#166534",vivant:true,desc:"Plus proches parents vivants des oiseaux. Inchangés depuis 80 Ma. 25 espèces. Cœur à 4 chambres."},
           {id:"ptero_g",label:"💀 Ptérosaures",period:"~228–66 Ma",from:228e6,to:66e6,color:"#7c3aed",vivant:false,eteint:true,
            desc:"Premiers vertébrés volants. 30 cm à 11 m d'envergure. Sang chaud probable.",
            children:[
             {id:"dimo_pt",label:"💀 Dimorphodon",period:"~195 Ma",from:195e6,to:190e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ptérosaure primitif. Jurassique inférieur. Tête massive, longue queue. Angleterre."},
             {id:"ptero_pt",label:"💀 Pterodactylus",period:"~150 Ma",from:152e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ptérosaure classique. ~1 m d'envergure. Queue très courte. Bavière, Allemagne."},
             {id:"quetz",label:"💀 Quetzalcoatlus",period:"~72–66 Ma",from:72e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"10–11 m d'envergure. Taille d'une girafe au sol (5,5 m). Plus grand animal volant connu."},
            ]},
           {id:"dino_g",label:"🦕 Dinosaures",period:"~230 Ma",from:230e6,to:null,color:"#dc2626",vivant:true,
            desc:"165 Ma de règne. PAS éteints : les oiseaux sont des dinosaures. ~10 000 espèces vivantes.",
            children:[
             {id:"sauris",label:"🦴 Saurischiens",period:"~230 Ma",from:230e6,to:null,color:"#991b1b",vivant:true,
              desc:"Bassin lézard. Théropodes + sauropodes. Les oiseaux en descendent.",
              children:[
               {id:"therop",label:"🦖 Théropodes",period:"~230 Ma",from:230e6,to:null,color:"#a32d2d",vivant:true,
                desc:"Bipèdes, souvent carnivores. Ancêtres des oiseaux.",
                children:[
                 {id:"herrer",label:"💀 Herrerasaurus",period:"~231 Ma",from:231e6,to:228e6,color:"#6b7280",vivant:false,eteint:true,desc:"Un des premiers dinosaures. Argentine, Trias supérieur."},
                 {id:"diloph",label:"💀 Dilophosaurus",period:"~193 Ma",from:193e6,to:188e6,color:"#6b7280",vivant:false,eteint:true,desc:"Double crête. Jurassique inférieur. Arizona. 6 m."},
                 {id:"allosaur",label:"💀 Allosaurus",period:"~155–145 Ma",from:155e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Prédateur dominant du Jurassique. 12 m. Amérique du Nord."},
                 {id:"spinosaur",label:"💀 Spinosaurus",period:"~99–93 Ma",from:99e6,to:93e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus long théropode : 14–18 m. Semi-aquatique. Voile de 1,8 m. Afrique du Nord."},
                 {id:"carcharo",label:"💀 Carcharodontosaurus",period:"~99–94 Ma",from:99e6,to:94e6,color:"#6b7280",vivant:false,eteint:true,desc:"Dents en scie de 20 cm. 13 m. Rival de Spinosaurus en Afrique du Nord."},
                 {id:"giganoto",label:"💀 Giganotosaurus",period:"~99–97 Ma",from:99e6,to:97e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand carnivore d'Amérique du Sud. Chassait peut-être Argentinosaurus."},
                 {id:"tyranno",label:"💀 Tyrannosaurus rex",period:"~68–66 Ma",from:68e6,to:66e6,color:"#7f1d1d",vivant:false,eteint:true,desc:"Prédateur apex. 12 m, 8 t. Bras vestigiaux. Probablement partiellement emplumé. Morsure de 60 000 N."},
                 {id:"yuty",label:"💀 Yutyrannus",period:"~125 Ma",from:125e6,to:121e6,color:"#6b7280",vivant:false,eteint:true,desc:"Tyrannosaure de 9 m couvert de proto-plumes. Chine. Prouve que les grands tyrannosaures étaient emplumés."},
                 {id:"velo",label:"💀 Velociraptor",period:"~75–71 Ma",from:75e6,to:71e6,color:"#6b7280",vivant:false,eteint:true,desc:"Taille d'une dinde, plumes, griffe en faucille. Mongolie. Intelligent, chassait en groupe."},
                 {id:"deinony",label:"💀 Deinonychus",period:"~115–108 Ma",from:115e6,to:108e6,color:"#6b7280",vivant:false,eteint:true,desc:"Le «vrai» raptor de Jurassic Park. Griffe de 12 cm. Chasse en meute. Amérique du Nord."},
                 {id:"therizia",label:"💀 Therizinosaurus",period:"~70 Ma",from:70e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Griffes de 90 cm. Les plus longues de l'histoire animale. Herbivore. Mongolie."},
                 {id:"archaeo",label:"💀 Archaeopteryx",period:"~150 Ma",from:152e6,to:148e6,color:"#6b7280",vivant:false,eteint:true,desc:"Chaînon dinos-oiseaux. Dents, griffe aux ailes ET plumes asymétriques. Bavière."},
                 {id:"oiseau",label:"🐦 Oiseaux",period:"~150 Ma",from:150e6,to:null,color:"#0369a1",vivant:true,
                  desc:"~10 000 espèces. SONT des dinosaures. Ont survécu à −66 Ma.",
                  children:[
                   {id:"moa",label:"💀 Moa",period:"~19 Ma–1400",from:19e6,to:0.6e3,color:"#6b7280",vivant:false,eteint:true,desc:"Oiseaux non volants de Nouvelle-Zélande. Jusqu'à 3,6 m. Éteints à l'arrivée des Maoris (~1300)."},
                   {id:"epyornis",label:"💀 Aepyornis (oiseau-éléphant)",period:"~26 Ma–1700",from:26e6,to:0.3e3,color:"#6b7280",vivant:false,eteint:true,desc:"3 m, 500 kg. Madagascar. Œuf de 10 litres. Éteint ~1700 apr.J.-C."},
                   {id:"gastorn",label:"💀 Gastornis",period:"~56–45 Ma",from:56e6,to:45e6,color:"#6b7280",vivant:false,eteint:true,desc:"Oiseau géant non volant. 1,8 m. Herbivore probable. Europe et Amérique du Nord, Éocène."},
                  ]},
                ]},
               {id:"sauro_g",label:"🦕 Sauropodes",period:"~200–66 Ma",from:200e6,to:66e6,color:"#78716c",vivant:false,eteint:true,
                desc:"Plus grands animaux terrestres. Long cou, queue, herbivores.",
                children:[
                 {id:"brachios",label:"💀 Brachiosaurus",period:"~154–150 Ma",from:154e6,to:150e6,color:"#6b7280",vivant:false,eteint:true,desc:"Pattes avant plus longues. Cou très dressé. 26 m, 60 t. Jurassique."},
                 {id:"diplo",label:"💀 Diplodocus",period:"~154–152 Ma",from:154e6,to:152e6,color:"#6b7280",vivant:false,eteint:true,desc:"27 m dont 14 m de queue-fouet. Amérique du Nord, Jurassique."},
                 {id:"argentin",label:"💀 Argentinosaurus",period:"~96–92 Ma",from:96e6,to:92e6,color:"#6b7280",vivant:false,eteint:true,desc:"Candidat au plus grand dinosaure. ~35–40 m, 70–100 t. Argentine, Crétacé."},
                 {id:"patagot",label:"💀 Patagotitan",period:"~101–98 Ma",from:101e6,to:98e6,color:"#6b7280",vivant:false,eteint:true,desc:"37 m, 70 t. Mieux documenté qu'Argentinosaurus. Argentine."},
                ]},
              ]},
             {id:"ornit_g",label:"🦴 Ornithischiens",period:"~235–66 Ma",from:235e6,to:66e6,color:"#78716c",vivant:false,eteint:true,
              desc:"Tous herbivores, tous éteints. Stégosaures, ankylosaures, cératopsiens, hadrosaures.",
              children:[
               {id:"stego",label:"💀 Stegosaurus",period:"~155–150 Ma",from:155e6,to:150e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plaques dorsales, 4 piquants caudaux (thagomizer). 9 m. Cerveau de 80 g. Jurassique, USA."},
               {id:"ankylo",label:"💀 Ankylosaurus",period:"~68–66 Ma",from:68e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Cuirasse complète, massue caudale. 8 m, 6 t. Crétacé, Amérique du Nord."},
               {id:"tricera",label:"💀 Triceratops",period:"~68–66 Ma",from:68e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"3 cornes, large collerette. 9 m, 12 t. Contemporain de T-rex. Vivait en troupeaux."},
               {id:"parasaur",label:"💀 Parasaurolophus",period:"~76–73 Ma",from:76e6,to:73e6,color:"#6b7280",vivant:false,eteint:true,desc:"Crête creuse de 1,8 m = résonateur sonore. Hadrosaure. Amérique du Nord."},
               {id:"igua",label:"💀 Iguanodon",period:"~130–120 Ma",from:130e6,to:120e6,color:"#6b7280",vivant:false,eteint:true,desc:"2e dinosaure décrit (1825). Pouce en éperon. Bipède et quadrupède. Europe."},
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
];

// ══════════════════════════════════════════════════════════════════════════════
// Collecte de tous les nœuds pour la recherche
// ══════════════════════════════════════════════════════════════════════════════
function collectAll(nodes, arr=[]) {
  for (const n of nodes) {
    arr.push(n);
    if (n.children) collectAll(n.children, arr);
  }
  return arr;
}
const ALL_NODES = collectAll(TREE);

// ══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS
// ══════════════════════════════════════════════════════════════════════════════

const MAX_AGE_TREE = 540e6;
const pctTree = (v) => Math.min(100, Math.max(0, (v / MAX_AGE_TREE) * 100));

function TimeBar({from, to, color, vivant}) {
  const left  = 100 - pctTree(from);
  const right = to  ? 100 - pctTree(to) : 0;
  const width = Math.max(100 - left - right, 0.4);
  return (
    <div style={{position:"relative",height:5,background:"rgba(55,53,47,.07)",
      borderRadius:3,margin:"4px 0 1px",overflow:"hidden"}}>
      <div style={{position:"absolute",left:`${left}%`,width:`${width}%`,height:"100%",
        background:vivant?color:color+"77",borderRadius:3}}/>
    </div>
  );
}

function ScaleBar() {
  const marks=[{l:"Auj.",p:100},{l:"100 Ma",p:100-pctTree(100e6)},
    {l:"250 Ma",p:100-pctTree(250e6)},{l:"400 Ma",p:100-pctTree(400e6)},{l:"540 Ma",p:0}];
  return (
    <div style={{position:"relative",height:20,margin:"2px 0 12px",
      fontSize:10,color:"rgba(55,53,47,.38)",fontFamily:"inherit"}}>
      <div style={{position:"absolute",left:0,right:0,top:9,height:1,background:"rgba(55,53,47,.08)"}}/>
      {marks.map(m=>(
        <div key={m.l} style={{position:"absolute",left:`${m.p}%`,top:0,
          transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap"}}>
          <div style={{width:1,height:5,background:"rgba(55,53,47,.2)",margin:"0 auto 2px"}}/>
          {m.l}
        </div>
      ))}
    </div>
  );
}

function CousinBadge({cousinIds}) {
  if (!cousinIds?.length) return null;
  const cousins = cousinIds.map(id => ALL_NODES.find(n=>n.id===id)).filter(Boolean);
  if (!cousins.length) return null;
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:4,
      marginLeft:6,padding:"1px 7px",borderRadius:4,
      background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",
      fontSize:10,color:"#4338ca",flexShrink:0}}>
      🔀 cousin de {cousins.map(c=>c.label.replace(/💀|🧠|👥|⭐|🔀/g,"").trim()).join(", ")}
    </div>
  );
}

function Node({node, depth=0, highlight=false}) {
  const [open, setOpen]   = useState(depth < 1);
  const [desc, setDesc]   = useState(false);
  const hasKids = node.children?.length > 0;
  const isAncestor = node.label.includes("★") || node.id==="sapiens_a";

  return (
    <div style={{marginLeft:depth*16,marginBottom:1}}>
      <div
        style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",
          borderRadius:5,cursor:"pointer",transition:"background .1s",
          background: highlight
            ? "rgba(250,204,21,.25)"
            : open&&hasKids ? `${node.color}0e` : "transparent",
          outline: highlight ? "2px solid rgba(250,204,21,.6)" : "none"}}
        onClick={()=>{if(hasKids)setOpen(o=>!o);setDesc(d=>!d);}}
        onMouseEnter={e=>e.currentTarget.style.background=highlight?"rgba(250,204,21,.3)":`${node.color}15`}
        onMouseLeave={e=>e.currentTarget.style.background=highlight?"rgba(250,204,21,.25)":open&&hasKids?`${node.color}0e`:"transparent"}
      >
        {/* Chevron */}
        <span style={{fontSize:10,color:"rgba(55,53,47,.3)",width:12,textAlign:"center",
          flexShrink:0,transform:open?"rotate(90deg)":"none",transition:"transform .15s",
          visibility:hasKids?"visible":"hidden"}}>▶</span>
        {/* Dot */}
        <div style={{width:9,height:9,borderRadius:"50%",background:node.color,
          flexShrink:0,opacity:node.eteint?.45:1,
          boxShadow:isAncestor?`0 0 0 2px ${node.color}44`:undefined}}/>
        {/* Label */}
        <span style={{fontWeight:depth===0?700:depth<=2?600:500,
          fontSize:depth===0?15:depth<=2?14:13,
          color:node.eteint?"rgba(55,53,47,.4)":"#37352f",
          textDecoration:node.eteint?"line-through":"none",lineHeight:1.3}}>
          {node.label}
        </span>
        {/* Période */}
        <span style={{fontSize:11,color:"rgba(55,53,47,.38)",marginLeft:3,flexShrink:0}}>
          {node.period}
        </span>
        {/* Badge cousin */}
        <CousinBadge cousinIds={node.cousin}/>
        {/* Badge vivant/éteint */}
        <span style={{marginLeft:"auto",flexShrink:0,fontSize:10,padding:"1px 6px",borderRadius:3,
          background:node.eteint?"rgba(239,68,68,.08)":"rgba(22,163,74,.08)",
          color:node.eteint?"#dc2626":"#15803d",fontWeight:500}}>
          {node.eteint?"Éteint":"Vivant"}
        </span>
      </div>
      {/* Barre temporelle */}
      {node.from&&(
        <div style={{paddingLeft:22,paddingRight:6}}>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
        </div>
      )}
      {/* Description */}
      {desc&&node.desc&&(
        <div style={{marginLeft:22,marginRight:6,marginBottom:5,marginTop:1,
          padding:"8px 12px",background:"rgba(55,53,47,.03)",
          borderLeft:`3px solid ${node.color}55`,borderRadius:"0 5px 5px 0",
          fontSize:12,color:"rgba(55,53,47,.62)",lineHeight:1.6,fontFamily:"inherit"}}>
          {node.desc}
        </div>
      )}
      {/* Enfants */}
      {open&&hasKids&&(
        <div style={{borderLeft:"1.5px solid rgba(55,53,47,.08)",
          marginLeft:13,paddingLeft:3,marginTop:1}}>
          {node.children.map(c=>
            <Node key={c.id} node={c} depth={depth+1} highlight={highlight&&c.id===node.id}/>
          )}
        </div>
      )}
    </div>
  );
}

// Résultat de recherche
function SearchResult({node, onClose}) {
  const [desc, setDesc] = useState(true);
  return (
    <div style={{marginBottom:8,padding:"10px 14px",borderRadius:8,
      background:"rgba(250,204,21,.1)",border:"2px solid rgba(250,204,21,.5)",
      cursor:"pointer"}}
      onClick={()=>setDesc(d=>!d)}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:9,height:9,borderRadius:"50%",background:node.color,flexShrink:0}}/>
        <span style={{fontWeight:600,fontSize:14,color:"#37352f"}}>{node.label}</span>
        <span style={{fontSize:11,color:"rgba(55,53,47,.45)",marginLeft:4}}>{node.period}</span>
        <span style={{marginLeft:"auto",fontSize:10,padding:"1px 6px",borderRadius:3,
          background:node.eteint?"rgba(239,68,68,.08)":"rgba(22,163,74,.08)",
          color:node.eteint?"#dc2626":"#15803d",fontWeight:500}}>
          {node.eteint?"Éteint":"Vivant"}
        </span>
      </div>
      {node.from&&(
        <div style={{marginTop:4}}>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
        </div>
      )}
      {desc&&node.desc&&(
        <div style={{marginTop:8,fontSize:12,color:"rgba(55,53,47,.65)",lineHeight:1.6}}>
          {node.desc}
        </div>
      )}
      <CousinBadge cousinIds={node.cousin}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NŒUD avec ref pour la navigation
// ══════════════════════════════════════════════════════════════════════════════
function NodeWithRef({node, depth=0, targetId=null, nodeRefs}) {
  // Auto-ouvrir si un descendant est la cible
  const hasTarget = (n, id) => {
    if (n.id === id) return true;
    return n.children?.some(c => hasTarget(c, id)) || false;
  };
  const shouldOpen = targetId && hasTarget(node, targetId);
  const [open, setOpen] = useState(depth < 1 || shouldOpen);
  const [desc, setDesc] = useState(node.id === targetId);
  const hasKids = node.children?.length > 0;
  const isTarget = node.id === targetId;

  // Enregistrer la ref du nœud cible
  const nodeRef = useRef(null);
  if (nodeRefs && node.id === targetId) {
    nodeRefs.current = nodeRef;
  }

  return (
    <div ref={nodeRef} style={{marginLeft:depth*16,marginBottom:1}}>
      <div
        style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",
          borderRadius:5,cursor:"pointer",transition:"background .1s",
          background: isTarget
            ? "rgba(250,204,21,.2)"
            : open&&hasKids ? `${node.color}0e` : "transparent",
          outline: isTarget ? "2px solid rgba(250,204,21,.7)" : "none",
        }}
        onClick={()=>{if(hasKids)setOpen(o=>!o);setDesc(d=>!d);}}
        onMouseEnter={e=>e.currentTarget.style.background=isTarget?"rgba(250,204,21,.3)":`${node.color}15`}
        onMouseLeave={e=>e.currentTarget.style.background=isTarget?"rgba(250,204,21,.2)":open&&hasKids?`${node.color}0e`:"transparent"}
      >
        <span style={{fontSize:10,color:"rgba(55,53,47,.3)",width:12,textAlign:"center",
          flexShrink:0,transform:open?"rotate(90deg)":"none",transition:"transform .15s",
          visibility:hasKids?"visible":"hidden"}}>▶</span>
        <div style={{width:9,height:9,borderRadius:"50%",background:node.color,
          flexShrink:0,opacity:node.eteint?.45:1}}/>
        <span style={{fontWeight:depth===0?700:depth<=2?600:500,
          fontSize:depth===0?15:depth<=2?14:13,
          color:node.eteint?"rgba(55,53,47,.4)":"#37352f",
          textDecoration:node.eteint?"line-through":"none",lineHeight:1.3}}>
          {node.label}
        </span>
        <span style={{fontSize:11,color:"rgba(55,53,47,.38)",marginLeft:3,flexShrink:0}}>
          {node.period}
        </span>
        <CousinBadge cousinIds={node.cousin}/>
        <span style={{marginLeft:"auto",flexShrink:0,fontSize:10,padding:"1px 6px",borderRadius:3,
          background:node.eteint?"rgba(239,68,68,.08)":"rgba(22,163,74,.08)",
          color:node.eteint?"#dc2626":"#15803d",fontWeight:500}}>
          {node.eteint?"Éteint":"Vivant"}
        </span>
      </div>
      {node.from&&(
        <div style={{paddingLeft:22,paddingRight:6}}>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
        </div>
      )}
      {desc&&node.desc&&(
        <div style={{marginLeft:22,marginRight:6,marginBottom:5,marginTop:1,
          padding:"8px 12px",background:"rgba(55,53,47,.03)",
          borderLeft:`3px solid ${node.color}55`,borderRadius:"0 5px 5px 0",
          fontSize:12,color:"rgba(55,53,47,.62)",lineHeight:1.6}}>
          {node.desc}
        </div>
      )}
      {open&&hasKids&&(
        <div style={{borderLeft:"1.5px solid rgba(55,53,47,.08)",marginLeft:13,paddingLeft:3,marginTop:1}}>
          {node.children.map(c=>(
            <NodeWithRef key={c.id} node={c} depth={depth+1} targetId={targetId} nodeRefs={nodeRefs}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FICHE LATÉRALE ────────────────────────────────────────────────────────────
function SidePanel({node, onClose}) {
  if (!node) return null;
  const cousins = node.cousin?.map(id=>ALL_NODES.find(n=>n.id===id)).filter(Boolean)||[];
  return (
    <div style={{
      position:"fixed",right:0,top:0,bottom:0,width:"min(420px,90vw)",
      background:"#fff",borderLeft:"1px solid rgba(55,53,47,.12)",
      boxShadow:"-8px 0 32px rgba(0,0,0,.12)",zIndex:500,
      display:"flex",flexDirection:"column",
      fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
    }}>
      {/* Header */}
      <div style={{padding:"20px 24px 16px",borderBottom:"1px solid rgba(55,53,47,.09)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:node.color,opacity:node.eteint?.5:1}}/>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,
              background:node.eteint?"rgba(239,68,68,.1)":"rgba(22,163,74,.1)",
              color:node.eteint?"#dc2626":"#15803d",fontWeight:600}}>
              {node.eteint?"Espèce éteinte":"Espèce vivante"}
            </span>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:7,
            background:"rgba(55,53,47,.06)",border:"none",cursor:"pointer",
            fontSize:14,color:"rgba(55,53,47,.6)",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <h2 style={{fontSize:20,fontWeight:700,color:"#37352f",margin:"0 0 4px",lineHeight:1.2}}>
          {node.label.replace(/💀|⭐|🔀/g,"").trim()}
        </h2>
        <div style={{fontSize:12,color:"rgba(55,53,47,.45)"}}>{node.period}</div>
      </div>
      {/* Barre temporelle */}
      {node.from&&(
        <div style={{padding:"12px 24px",borderBottom:"1px solid rgba(55,53,47,.06)",flexShrink:0}}>
          <div style={{fontSize:11,color:"rgba(55,53,47,.4)",marginBottom:6,letterSpacing:".08em",textTransform:"uppercase"}}>Durée d'existence</div>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(55,53,47,.35)",marginTop:4}}>
            <span>Apparition : {node.period?.split("–")[0]||"?"}</span>
            <span>{node.to?"Extinction : "+node.period?.split("–")[1]||"?":"Vivant aujourd'hui"}</span>
          </div>
        </div>
      )}
      {/* Contenu */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
        {node.desc&&(
          <>
            <div style={{fontSize:11,color:"rgba(55,53,47,.4)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>Description</div>
            <p style={{fontSize:14,lineHeight:1.7,color:"#37352f",margin:"0 0 20px"}}>{node.desc}</p>
          </>
        )}
        {cousins.length>0&&(
          <>
            <div style={{fontSize:11,color:"rgba(55,53,47,.4)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>
              🔀 Espèces cousines (lignées parallèles)
            </div>
            {cousins.map(c=>(
              <div key={c.id} style={{padding:"10px 12px",borderRadius:8,
                background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.15)",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c.color}}/>
                  <span style={{fontWeight:600,fontSize:13,color:"#37352f"}}>{c.label.replace(/💀|⭐|🔀/g,"").trim()}</span>
                  <span style={{fontSize:11,color:"rgba(55,53,47,.4)"}}>{c.period}</span>
                </div>
                {c.desc&&<p style={{fontSize:12,color:"rgba(55,53,47,.6)",margin:0,lineHeight:1.5}}>{c.desc}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export function LifeTree() {
  const [search, setSearch]     = useState("");
  const [targetId, setTargetId] = useState(null);
  const [panel, setPanel]       = useState(null); // nœud affiché en fiche
  const nodeRefs = useRef(null);
  const treeRef  = useRef(null);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_NODES.filter(n =>
      n.label.toLowerCase().includes(q) ||
      (n.desc&&n.desc.toLowerCase().includes(q)) ||
      (n.period&&n.period.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [search]);

  // Clic sur un résultat → ouvre dans l'arbre + fiche
  const handleSelect = (node) => {
    setSearch("");       // ferme la recherche
    setTargetId(node.id);
    setPanel(node);
    // Scroll vers le nœud après un court délai (le temps que React rende)
    setTimeout(() => {
      if (nodeRefs.current?.current) {
        nodeRefs.current.current.scrollIntoView({behavior:"smooth", block:"center"});
      }
    }, 150);
  };

  return (
    <div style={{fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
      background:"#fff",padding:"48px 32px 80px",
      borderTop:"4px solid rgba(55,53,47,.06)",
      marginTop:80, // espace sous la frise
    }}>
      {/* Fiche latérale */}
      {panel&&<SidePanel node={panel} onClose={()=>{setPanel(null);setTargetId(null);}}/>}

      {/* En-tête */}
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
          <h2 style={{fontSize:26,fontWeight:700,color:"#37352f",margin:0}}>🌿 Arbre de la vie</h2>
          <span style={{fontSize:13,color:"rgba(55,53,47,.45)"}}>
            Cliquer pour déplier · cliquer encore pour la description
          </span>
        </div>

        {/* Légende */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,
          fontSize:12,color:"rgba(55,53,47,.45)",flexWrap:"wrap"}}>
          <span>⭐ = ancêtre direct</span>
          <span>🔀 = cousin (lignée parallèle)</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:24,height:5,borderRadius:2,background:"#0ea5e9"}}/><span>Vivant</span>
            <div style={{width:24,height:5,borderRadius:2,background:"#6b728077",marginLeft:6}}/><span>Éteint</span>
          </div>
          <span>— Barre = durée d'existence (échelle 540 Ma)</span>
        </div>

        {/* Barre de recherche */}
        <div style={{position:"relative",marginBottom:24}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",
            fontSize:16,color:"rgba(55,53,47,.35)"}}>🔍</span>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher : T-Rex, Homo sapiens, Jurassique..."
            style={{width:"100%",height:46,borderRadius:10,
              border:"1.5px solid rgba(55,53,47,.15)",background:"#fafafa",
              padding:"0 40px 0 42px",fontSize:14,fontFamily:"inherit",
              color:"#37352f",outline:"none",boxSizing:"border-box",
              boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}
          />
          {search&&(
            <button onClick={()=>setSearch("")}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:16,
                color:"rgba(55,53,47,.4)"}}>✕</button>
          )}
        </div>

        {/* Résultats de recherche */}
        {search.trim()&&(
          <div style={{marginBottom:24,background:"#f9f9f8",borderRadius:10,
            border:"1px solid rgba(55,53,47,.1)",overflow:"hidden"}}>
            {results.length===0?(
              <div style={{padding:"20px",textAlign:"center",color:"rgba(55,53,47,.45)",fontSize:13}}>
                Aucun résultat pour «&nbsp;{search}&nbsp;»
              </div>
            ):(
              <>
                <div style={{padding:"10px 16px 6px",fontSize:11,color:"rgba(55,53,47,.4)",
                  letterSpacing:".1em",textTransform:"uppercase",borderBottom:"1px solid rgba(55,53,47,.07)"}}>
                  {results.length} résultat{results.length>1?"s":""}
                </div>
                {results.map(n=>(
                  <div key={n.id}
                    onClick={()=>handleSelect(n)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
                      cursor:"pointer",borderBottom:"1px solid rgba(55,53,47,.06)",
                      transition:"background .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(55,53,47,.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{width:10,height:10,borderRadius:"50%",background:n.color,
                      flexShrink:0,opacity:n.eteint?.5:1}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14,color:"#37352f",marginBottom:2}}>
                        {n.label.replace(/💀|⭐|🔀/g,"").trim()}
                      </div>
                      <div style={{fontSize:12,color:"rgba(55,53,47,.45)"}}>{n.period}</div>
                    </div>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,flexShrink:0,
                      background:n.eteint?"rgba(239,68,68,.08)":"rgba(22,163,74,.08)",
                      color:n.eteint?"#dc2626":"#15803d",fontWeight:500}}>
                      {n.eteint?"Éteint":"Vivant"}
                    </span>
                    <span style={{fontSize:12,color:"rgba(55,53,47,.3)",flexShrink:0}}>→</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Arbre complet */}
        <div ref={treeRef}>
          <ScaleBar/>
          {TREE.map(n=>(
            <NodeWithRef key={n.id} node={n} depth={0} targetId={targetId} nodeRefs={nodeRefs}/>
          ))}
        </div>
      </div>
    </div>
  );
}
