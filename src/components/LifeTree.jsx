import { useState } from "react";

const MAX_AGE = 540e6;
const pct = (v) => Math.min(100, Math.max(0, (v / MAX_AGE) * 100));

// ─── DONNÉES : 200+ espèces ────────────────────────────────────────────────
const TREE = [
 {id:"proto",label:"🦠 Procaryotes / Bactéries",period:"~3 500 Ma",from:3500e6,to:null,color:"#64748b",vivant:true,
  desc:"Premières formes de vie. Dominent pendant 2 milliards d'années. Stromatolites visibles dès −3,5 Ga.",
  children:[
   {id:"cyano",label:"🟦 Cyanobactéries",period:"~2 700 Ma",from:2700e6,to:null,color:"#0891b2",vivant:true,
    desc:"Produisent l'oxygène via la photosynthèse. Responsables de la Grande Oxydation −2,4 Ga."},
  ]},
 {id:"euca",label:"🔵 Eucaryotes",period:"~2 000 Ma",from:2000e6,to:null,color:"#6366f1",vivant:true,
  desc:"Cellules avec noyau. Apparaissent suite à une endosymbiose bactérienne. Ancêtres de tout le vivant complexe.",
  children:[
   {id:"champi",label:"🍄 Champignons",period:"~1 000 Ma",from:1000e6,to:null,color:"#a78bfa",vivant:true,
    desc:"Décomposeurs essentiels. Forment des réseaux mycorhiziens avec les plantes."},
   {id:"plantes",label:"🌿 Plantes",period:"~470 Ma",from:470e6,to:null,color:"#16a34a",vivant:true,
    desc:"Colonisent la terre ferme depuis ~470 Ma. De la mousse aux arbres géants.",
    children:[
     {id:"mousses",label:"🌱 Mousses / Hépatiques",period:"~470 Ma",from:470e6,to:null,color:"#4ade80",vivant:true,desc:"Premières plantes terrestres, sans racines ni vaisseaux."},
     {id:"fougeres",label:"🌾 Fougères / Prêles",period:"~360 Ma",from:360e6,to:null,color:"#22c55e",vivant:true,desc:"Forment les forêts géantes du Carbonifère, à l'origine du charbon actuel."},
     {id:"gymno",label:"🌲 Gymnospermes",period:"~320 Ma",from:320e6,to:null,color:"#15803d",vivant:true,desc:"Conifères, cycas, ginkgo. Graines nues. Dominent au Mésozoïque.",
      children:[
       {id:"ginkgo",label:"🌳 Ginkgo biloba",period:"~270 Ma",from:270e6,to:null,color:"#84cc16",vivant:true,desc:"Fossile vivant. Quasi inchangé depuis 270 Ma. Résiste à la bombe atomique."},
      ]},
     {id:"angios",label:"🌸 Angiospermes (plantes à fleurs)",period:"~130 Ma",from:130e6,to:null,color:"#f0abfc",vivant:true,desc:"Révolutionnent les écosystèmes en coévoluant avec les insectes pollinisateurs."},
    ]},
   {id:"invert",label:"🦑 Invertébrés",period:"~600 Ma",from:600e6,to:null,color:"#f59e0b",vivant:true,
    desc:"Groupe paraphylétique dominant. Arthropodes, mollusques, échinodermes, cnidaires...",
    children:[
     {id:"ediac",label:"💀 Faune d'Édiacara",period:"~600–541 Ma",from:600e6,to:541e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers animaux multicellulaires complexes. Formes molles, aplaties. Disparaissent au Cambrien."},
     {id:"cnid",label:"🪸 Cnidaires",period:"~580 Ma",from:580e6,to:null,color:"#fb923c",vivant:true,desc:"Méduses, coraux, anémones. Parmi les premiers animaux à symétrie radiale."},
     {id:"anneli",label:"🪱 Annélides / Vers",period:"~550 Ma",from:550e6,to:null,color:"#a16207",vivant:true,desc:"Vers de terre, sangsues, vers marins. Essentiels à la formation des sols."},
     {id:"mollus",label:"🐙 Mollusques",period:"~540 Ma",from:540e6,to:null,color:"#e879f9",vivant:true,
      desc:"Pieuvres, calmars, escargots, moules. Groupe très diversifié.",
      children:[
       {id:"cepha",label:"🦑 Céphalopodes",period:"~500 Ma",from:500e6,to:null,color:"#c026d3",vivant:true,desc:"Ammonites (éteintes), nautiles, pieuvres, calmars. Intelligence remarquable chez les céphalopodes actuels."},
       {id:"ammo",label:"💀 Ammonites",period:"~400–66 Ma",from:400e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Mollusques à coquille en spirale. Excellents marqueurs stratigraphiques. Éteints −66 Ma."},
      ]},
     {id:"arthro",label:"🦀 Arthropodes",period:"~540 Ma",from:540e6,to:null,color:"#ea580c",vivant:true,
      desc:"Plus grand groupe animal : insectes, araignées, crustacés, trilobites...",
      children:[
       {id:"trilo",label:"💀 Trilobites",period:"~521–252 Ma",from:521e6,to:252e6,color:"#6b7280",vivant:false,eteint:true,desc:"Arthropodes marins emblématiques du Paléozoïque. Disparus lors de l'extinction du Permien."},
       {id:"insect",label:"🪲 Insectes",period:"~385 Ma",from:385e6,to:null,color:"#d97706",vivant:true,desc:"Plus de 1 million d'espèces décrites. Libellules géantes au Carbonifère (70 cm d'envergure)."},
       {id:"arach",label:"🕷️ Arachnides",period:"~420 Ma",from:420e6,to:null,color:"#92400e",vivant:true,desc:"Scorpions, araignées, acariens. Parmi les premiers animaux terrestres."},
       {id:"crusta",label:"🦞 Crustacés",period:"~510 Ma",from:510e6,to:null,color:"#f97316",vivant:true,desc:"Crabes, homards, crevettes, bernacles. Majoritairement marins."},
      ]},
     {id:"echino",label:"⭐ Échinodermes",period:"~520 Ma",from:520e6,to:null,color:"#f472b6",vivant:true,desc:"Étoiles de mer, oursins, holothuries. Symétrie pentaradiée. Proches parents des vertébrés."},
    ]},
   // ── VERTÉBRÉS ─────────────────────────────────────────────────────────
   {id:"vert",label:"🐟 Vertébrés",period:"~525 Ma",from:525e6,to:null,color:"#0ea5e9",vivant:true,
    desc:"Colonne vertébrale, crâne osseux. Apparus dans les mers cambriennes. ~66 000 espèces actuelles.",
    children:[
     {id:"agnath",label:"💀 Agnathes (sans mâchoires)",period:"~480–360 Ma",from:480e6,to:360e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers vertébrés à bouclier osseux. Ancêtres des poissons à mâchoires."},
     {id:"lamprey",label:"🐡 Lamproies / Myxines",period:"~360 Ma",from:360e6,to:null,color:"#64748b",vivant:true,desc:"Vertébrés sans mâchoires survivants. Fossiles vivants quasiment inchangés."},
     {id:"poissons",label:"🐟 Poissons à mâchoires",period:"~440 Ma",from:440e6,to:null,color:"#0284c7",vivant:true,
      desc:"Apparition des mâchoires — révolution évolutive. Donnent tous les vertébrés supérieurs.",
      children:[
       {id:"requin",label:"🦈 Requins / Élasmobranches",period:"~450 Ma",from:450e6,to:null,color:"#1e3a5f",vivant:true,desc:"Squelette cartilagineux. Quasi inchangés depuis 450 Ma. ~500 espèces."},
       {id:"megalo",label:"💀 Mégalodon",period:"~23–3,6 Ma",from:23e6,to:3.6e6,color:"#6b7280",vivant:false,eteint:true,desc:"Requin géant de 18 m. Prédateur apex des océans du Néogène. Éteint ~3,6 Ma."},
       {id:"placoderme",label:"💀 Placodermes",period:"~430–360 Ma",from:430e6,to:360e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premiers poissons à mâchoires, cuirassés. Disparaissent à l'extinction du Dévonien."},
       {id:"actino",label:"🐠 Actinoptérygiens (poissons osseux)",period:"~400 Ma",from:400e6,to:null,color:"#38bdf8",vivant:true,desc:"99% des poissons actuels. Thons, saumons, carpes, anguilles... ~30 000 espèces."},
       {id:"sarco",label:"🫁 Sarcoptérygiens (nageoires charnues)",period:"~420 Ma",from:420e6,to:null,color:"#0369a1",vivant:true,
        desc:"Ancêtres des tétrapodes. Cœlacanthes (fossiles vivants) et dipneustes.",
        children:[
         {id:"coela",label:"🐟 Cœlacanthe",period:"~400 Ma",from:400e6,to:null,color:"#1d4ed8",vivant:true,desc:"Fossile vivant. Cru éteint depuis −66 Ma, redécouvert en 1938. Nageoires qui ressemblent à des membres."},
         {id:"tiktaalik",label:"💀 Tiktaalik",period:"~375 Ma",from:375e6,to:368e6,color:"#6b7280",vivant:false,eteint:true,desc:"Chaînon manquant poisson-tétrapode. Nageoires en membres, cou mobile. Dévonien supérieur."},
        ]},
      ]},
     // ── TÉTRAPODES ──────────────────────────────────────────────────────
     {id:"amphi",label:"🐸 Amphibiens",period:"~370 Ma",from:370e6,to:null,color:"#0f766e",vivant:true,
      desc:"Premiers vertébrés terrestres. Dépendants de l'eau pour se reproduire. Grenouilles, salamandres, cécilies.",
      children:[
       {id:"ichthyo",label:"💀 Ichthyostega",period:"~374–359 Ma",from:374e6,to:359e6,color:"#6b7280",vivant:false,eteint:true,desc:"Un des premiers tétrapodes. 8 doigts. Dévonien supérieur. Encore très aquatique."},
       {id:"grenouille",label:"🐸 Anoures (grenouilles)",period:"~250 Ma",from:250e6,to:null,color:"#10b981",vivant:true,desc:"~6 000 espèces. Bioindicateurs environnementaux essentiels."},
       {id:"salaman",label:"🦎 Urodèles (salamandres)",period:"~160 Ma",from:160e6,to:null,color:"#059669",vivant:true,desc:"Salamandres, tritons, axolotls. Capacité de régénération remarquable."},
      ]},
     // ── AMNIOTES ────────────────────────────────────────────────────────
     {id:"amnio",label:"🥚 Amniotes",period:"~320 Ma",from:320e6,to:null,color:"#b45309",vivant:true,
      desc:"L'œuf amniotique libère les vertébrés de l'eau. Mammifères + tous les reptiles (y compris oiseaux).",
      children:[
       // ── SYNAPSIDES / MAMMIFÈRES ─────────────────────────────────────
       {id:"synap",label:"💀 Synapsida (reptiles mammaliens)",period:"~315–252 Ma",from:315e6,to:252e6,color:"#78716c",vivant:false,eteint:true,
        desc:"Dominant avant les dinosaures. Possèdent déjà des traits de mammifères. Éteints au Permien.",
        children:[
         {id:"dimetro",label:"💀 Dimétrodon",period:"~295–272 Ma",from:295e6,to:272e6,color:"#6b7280",vivant:false,eteint:true,desc:"Synapse avec voile dorsale thermorégulatrice. Souvent confondu avec un dinosaure — il ne l'est pas."},
         {id:"lystro",label:"💀 Lystrosaurus",period:"~255–245 Ma",from:255e6,to:245e6,color:"#6b7280",vivant:false,eteint:true,desc:"Survit à la Grande Extinction du Permien. Herbivore trapu, ancêtre lointain des mammifères."},
        ]},
       {id:"mamm",label:"🦁 Mammifères",period:"~225 Ma",from:225e6,to:null,color:"#be185d",vivant:true,
        desc:"Poils, lait, sang chaud. Discrets sous les dinosaures (~10 cm), explosifs après −66 Ma.",
        children:[
         {id:"monot",label:"🦆 Monotrèmes",period:"~170 Ma",from:170e6,to:null,color:"#9d174d",vivant:true,desc:"Mammifères ovipares. Ornithorynque, échidné. Conservent des caractères reptiliens."},
         {id:"marsu",label:"🦘 Marsupiaux",period:"~100 Ma",from:100e6,to:null,color:"#be185d",vivant:true,
          desc:"Kangourous, koalas, opossums, wombats, diables de Tasmanie.",
          children:[
           {id:"thylacos",label:"💀 Thylacine (loup marsupial)",period:"~4 Ma–1936",from:4e6,to:0.089,color:"#6b7280",vivant:false,eteint:true,desc:"Prédateur marsupial de Tasmanie. Dernier individu mort en captivité en 1936."},
           {id:"dipro",label:"💀 Diprotodon",period:"~1,6 Ma–40 Ka",from:1.6e6,to:40e3,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand marsupial connu. Taille d'un rhinocéros. Éteint à l'arrivée des humains en Australie."},
          ]},
         {id:"plac",label:"🐘 Placentaires",period:"~100 Ma",from:100e6,to:null,color:"#db2777",vivant:true,
          desc:"96% des mammifères actuels. Gestation complète, placenta. Radiation explosive après −66 Ma.",
          children:[
           // GRANDS GROUPES
           {id:"cetace",label:"🐋 Cétacés",period:"~50 Ma",from:50e6,to:null,color:"#0e7490",vivant:true,
            desc:"Baleines, dauphins, marsouins. Descendant d'artiodactyles terrestres (Pakicetus).",
            children:[
             {id:"pakice",label:"💀 Pakicetus",period:"~53–48 Ma",from:53e6,to:48e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre des baleines. Quadrupède terrestre vivant près des rivières. Pakistan, Éocène."},
             {id:"basilos",label:"💀 Basilosaurus",period:"~41–34 Ma",from:41e6,to:34e6,color:"#6b7280",vivant:false,eteint:true,desc:"Cétacé primitif de 18 m. Membres postérieurs vestigiaux. Prédateur des mers éocènes."},
             {id:"bleine",label:"🐋 Baleine bleue",period:"Actuel",from:5e6,to:null,color:"#0ea5e9",vivant:true,desc:"Plus grand animal ayant jamais existé. 30 m, 180 tonnes. Encore présente mais menacée."},
            ]},
           {id:"probos",label:"🐘 Proboscidiens (éléphants)",period:"~55 Ma",from:55e6,to:null,color:"#78716c",vivant:true,
            children:[
             {id:"mammouth",label:"💀 Mammouth laineux",period:"~400 Ka–4 Ka",from:400e3,to:4e3,color:"#6b7280",vivant:false,eteint:true,desc:"S'adapte aux steppes glaciaires. Défenses jusqu'à 4 m. Éteint ~4 000 av.J.-C., partiellement à cause des humains."},
             {id:"mastodon",label:"💀 Mastodonte",period:"~5 Ma–10 Ka",from:5e6,to:10e3,color:"#6b7280",vivant:false,eteint:true,desc:"Distinct du mammouth. Habitait forêts et prairies. Chassé par Homo sapiens en Amérique."},
             {id:"elephas",label:"🐘 Éléphant d'Afrique",period:"Actuel",from:6e6,to:null,color:"#57534e",vivant:true,desc:"Plus grand animal terrestre actuel. 6 tonnes. Mémoire, empathie, deuil observés."},
            ]},
           {id:"perisso",label:"🦏 Périssodactyles",period:"~55 Ma",from:55e6,to:null,color:"#92400e",vivant:true,
            children:[
             {id:"eohippus",label:"💀 Eohippus (ancêtre cheval)",period:"~55 Ma",from:55e6,to:45e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre du cheval. Taille d'un renard, 4 doigts à l'avant. Évolue progressivement vers Equus."},
             {id:"indrico",label:"💀 Indricotherium",period:"~34–23 Ma",from:34e6,to:23e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand mammifère terrestre connu. 20 tonnes, 5,5 m de haut. Rhinocéros géant sans corne."},
            ]},
           {id:"carni",label:"🦁 Carnivores",period:"~60 Ma",from:60e6,to:null,color:"#dc2626",vivant:true,
            children:[
             {id:"smilodon",label:"💀 Smilodon (dents de sabre)",period:"~2,5 Ma–10 Ka",from:2.5e6,to:10e3,color:"#6b7280",vivant:false,eteint:true,desc:"Canines de 28 cm. Prédateur des grandes plaines américaines. Éteint avec la mégafaune."},
             {id:"arctothe",label:"💀 Ours à face courte",period:"~1,8 Ma–11 Ka",from:1.8e6,to:11e3,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand ours connu. 900 kg. Amérique du Nord. Concurrent de l'homme de Cro-Magnon."},
             {id:"lion",label:"🦁 Lion",period:"Actuel",from:3e6,to:null,color:"#ca8a04",vivant:true,desc:"Seul félin à vivre en groupes sociaux. Jadis présent sur 3 continents."},
             {id:"loup",label:"🐺 Loup",period:"Actuel",from:1e6,to:null,color:"#78716c",vivant:true,desc:"Ancêtre du chien domestique. Stratège coopératif redoutable."},
            ]},
           {id:"rodents",label:"🐭 Rongeurs",period:"~65 Ma",from:65e6,to:null,color:"#a8a29e",vivant:true,desc:"40% des espèces de mammifères. Rats, souris, castors, écureuils, capybaras."},
           {id:"chiropt",label:"🦇 Chiroptères (chauves-souris)",period:"~55 Ma",from:55e6,to:null,color:"#44403c",vivant:true,desc:"Seuls mammifères au vol actif. ~1 400 espèces. Pollinisateurs, régulateurs d'insectes essentiels."},
           {id:"primate",label:"🐒 Primates",period:"~58 Ma",from:58e6,to:null,color:"#9333ea",vivant:true,
            desc:"Vision stéréoscopique, mains préhensiles, cerveau développé, vie sociale complexe.",
            children:[
             {id:"prosim",label:"🦥 Prosimiens (lémuriens, loris)",period:"~55 Ma",from:55e6,to:null,color:"#7c3aed",vivant:true,desc:"Primates basaux. Lémuriens de Madagascar, tarsiers, loris."},
             {id:"platyr",label:"🐒 Singes du Nouveau Monde",period:"~35 Ma",from:35e6,to:null,color:"#8b5cf6",vivant:true,desc:"Capucins, ouistitis, atèles. Queue préhensile souvent. Amérique du Sud."},
             {id:"catarr",label:"🐵 Singes de l'Ancien Monde",period:"~30 Ma",from:30e6,to:null,color:"#7c3aed",vivant:true,desc:"Babouins, macaques, colobes, mandrills. Afrique et Asie."},
             {id:"gibbon",label:"🦧 Gibbons (Hylobatidae)",period:"~20 Ma",from:20e6,to:null,color:"#6d28d9",vivant:true,desc:"Grands singes arboricoles d'Asie. Brachiation remarquable. 20 espèces."},
             {id:"homin",label:"🦍 Grands singes (Hominidae)",period:"~15 Ma",from:15e6,to:null,color:"#5b21b6",vivant:true,
              desc:"Orangs-outans, gorilles, chimpanzés, bonobos, humains. Absence de queue.",
              children:[
               {id:"dryopi",label:"💀 Dryopithèque",period:"~13–8 Ma",from:13e6,to:8e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre commun des grands singes et des humains. Europe et Asie, Miocène."},
               {id:"sahelan",label:"💀 Sahelanthropus",period:"~7 Ma",from:7e6,to:6e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus ancien possible ancêtre de la lignée humaine. Tchad. Marche possible bipède."},
               {id:"ardipith",label:"💀 Ardipithèque",period:"~4,4 Ma",from:4.4e6,to:4e6,color:"#6b7280",vivant:false,eteint:true,desc:"Hominidé bipède mais encore arboricole. Éthiopie. Précède Lucy."},
               {id:"lucy",label:"💀 Australopithèque / Lucy",period:"~4–2 Ma",from:4e6,to:2e6,color:"#6b7280",vivant:false,eteint:true,desc:"Bipédie confirmée. Cerveau encore petit (~450 cc). Lucy découverte en 1974 en Éthiopie."},
               {id:"paranthr",label:"💀 Paranthropus",period:"~2,7–1,2 Ma",from:2.7e6,to:1.2e6,color:"#6b7280",vivant:false,eteint:true,desc:"Crête sagittale, muscles temporaux puissants. Herbivore robuste. Concurrent de Homo habilis."},
               {id:"habilis",label:"💀 Homo habilis",period:"~2,4–1,4 Ma",from:2.4e6,to:1.4e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premier Homo. Fabrique les premiers outils en pierre (industrie oldowayenne)."},
               {id:"erectus",label:"💀 Homo erectus",period:"~1,9 Ma–110 Ka",from:1.9e6,to:110e3,color:"#6b7280",vivant:false,eteint:true,desc:"Maîtrise le feu. Quitte l'Afrique. Atteint l'Asie et l'Europe. Industrie acheuléenne."},
               {id:"heidel",label:"💀 Homo heidelbergensis",period:"~700–200 Ka",from:700e3,to:200e3,color:"#6b7280",vivant:false,eteint:true,desc:"Ancêtre commun de Néandertal et Sapiens. Chasse le grand gibier. Europe et Afrique."},
               {id:"nean",label:"💀 Homo neanderthalensis",period:"~400–40 Ka",from:400e3,to:40e3,color:"#6b7280",vivant:false,eteint:true,desc:"Cerveau plus grand que le nôtre. Enterrait ses morts. A croisé Sapiens. Disparu −40 Ka."},
               {id:"deniso",label:"💀 Denisoviens",period:"~500–30 Ka",from:500e3,to:30e3,color:"#6b7280",vivant:false,eteint:true,desc:"Connus par ADN et quelques ossements. Asie. Croisements avec Sapiens et Néandertal."},
               {id:"floresi",label:"💀 Homo floresiensis (Hobbit)",period:"~100–50 Ka",from:100e3,to:50e3,color:"#6b7280",vivant:false,eteint:true,desc:"1 m de haut, cerveau minuscule. Île de Florès, Indonésie. Contemporain de Sapiens."},
               {id:"sapiens",label:"🧠 Homo sapiens",period:"~300 Ka",from:300e3,to:null,color:"#92400e",vivant:true,desc:"Notre espèce. Maroc, ~300 000 ans. Langage, art, agriculture, écriture, voyages spatiaux, IA."},
              ]},
            ]},
          ]},
        ]},
       // ── SAUROPSIDES / REPTILES ───────────────────────────────────────
       {id:"saurop_g",label:"🦎 Sauropsida (reptiles + oiseaux)",period:"~315 Ma",from:315e6,to:null,color:"#15803d",vivant:true,
        desc:"Tous les reptiles actuels et les oiseaux. Peau écailleuse ou plumes. Œufs à coquille.",
        children:[
         {id:"tortu",label:"🐢 Tortues",period:"~230 Ma",from:230e6,to:null,color:"#65a30d",vivant:true,desc:"Carapace = côtes et vertèbres fusionnées. Quasi inchangées depuis 220 Ma. ~360 espèces."},
         {id:"archo_g",label:"🦖 Archosaures",period:"~252 Ma",from:252e6,to:null,color:"#b91c1c",vivant:true,
          desc:"Groupe dominant depuis le Trias : crocodiliens, ptérosaures, dinosaures (dont oiseaux).",
          children:[
           {id:"croco",label:"🐊 Crocodyliens",period:"~230 Ma",from:230e6,to:null,color:"#166534",vivant:true,desc:"Plus proches parents vivants des oiseaux. ~25 espèces. Quasi inchangés depuis 80 Ma."},
           {id:"ptero_g",label:"💀 Ptérosaures",period:"~228–66 Ma",from:228e6,to:66e6,color:"#7c3aed",vivant:false,eteint:true,
            desc:"Premiers vertébrés volants. Pas des dinosaures. 30 cm à 11 m d'envergure.",
            children:[
             {id:"dimo_pt",label:"💀 Dimorphodon",period:"~195 Ma",from:195e6,to:190e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ptérosaure primitif du Jurassique inférieur. Tête massive, longue queue."},
             {id:"ptero_pt",label:"💀 Pterodactylus",period:"~150 Ma",from:152e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Ptérosaure classique du Jurassique. Envergure ~1 m. Queue très courte."},
             {id:"quetz",label:"💀 Quetzalcoatlus",period:"~72–66 Ma",from:72e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand animal volant connu. 10–11 m d'envergure. Taille d'une girafe au sol."},
            ]},
           {id:"dino_g",label:"🦕 Dinosaures",period:"~230 Ma",from:230e6,to:null,color:"#dc2626",vivant:true,
            desc:"Dominent la Terre 165 Ma. PAS éteints : leurs descendants, les oiseaux, comptent ~10 000 espèces.",
            children:[
             // ── SAURISCHIENS ──────────────────────────────────────────
             {id:"sauris",label:"🦴 Saurischiens (bassin lézard)",period:"~230 Ma",from:230e6,to:null,color:"#991b1b",vivant:true,
              desc:"Bassin orienté comme les lézards. Comprend théropodes ET sauropodes. Les oiseaux en descendent.",
              children:[
               // THÉROPODES
               {id:"therop",label:"🦖 Théropodes",period:"~230 Ma",from:230e6,to:null,color:"#a32d2d",vivant:true,
                desc:"Bipèdes, souvent carnivores. Donnent les oiseaux. Groupe le plus diversifié de dinosaures.",
                children:[
                 {id:"herrer",label:"💀 Herrerasaurus",period:"~231 Ma",from:231e6,to:228e6,color:"#6b7280",vivant:false,eteint:true,desc:"Un des premiers dinosaures. Argentine, Trias supérieur. Carnivore rapide."},
                 {id:"cerato",label:"💀 Coelophysis",period:"~210 Ma",from:210e6,to:202e6,color:"#6b7280",vivant:false,eteint:true,desc:"Théropode gracile du Trias. Vivait en groupes. Nouveau-Mexique."},
                 {id:"diloph",label:"💀 Dilophosaurus",period:"~193 Ma",from:193e6,to:188e6,color:"#6b7280",vivant:false,eteint:true,desc:"Théropode à double crête. Jurassique inférieur. Arizona. 6 m de long."},
                 {id:"megalos",label:"💀 Megalosaurus",period:"~167 Ma",from:167e6,to:161e6,color:"#6b7280",vivant:false,eteint:true,desc:"Premier dinosaure décrit scientifiquement (1824). Angleterre, Jurassique moyen."},
                 {id:"allosaur",label:"💀 Allosaurus",period:"~155–145 Ma",from:155e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Prédateur dominant du Jurassique. 12 m. Amérique du Nord. Chassait peut-être en meute."},
                 {id:"spinosaur",label:"💀 Spinosaurus",period:"~99–93 Ma",from:99e6,to:93e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus long théropode connu : 14–18 m. Semi-aquatique. Voile dorsale de 1,8 m. Afrique du Nord."},
                 {id:"carcharo",label:"💀 Carcharodontosaurus",period:"~99–94 Ma",from:99e6,to:94e6,color:"#6b7280",vivant:false,eteint:true,desc:"Rival de Spinosaurus en Afrique du Nord. Dents en scie de 20 cm. 13 m, 6 tonnes."},
                 {id:"giganoto",label:"💀 Giganotosaurus",period:"~99–97 Ma",from:99e6,to:97e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand carnivore d'Amérique du Sud. 13 m. Chassait peut-être Argentinosaurus."},
                 {id:"tyranno",label:"💀 Tyrannosaurus rex",period:"~68–66 Ma",from:68e6,to:66e6,color:"#7f1d1d",vivant:false,eteint:true,desc:"Prédateur apex du Crétacé. 12 m, 8 t. Bras vestigiaux. Probablement emplumé partiellement."},
                 {id:"tarbosaur",label:"💀 Tarbosaurus",period:"~70–66 Ma",from:70e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"«T-rex asiatique». Mongolie, Crétacé sup. Légèrement plus petit, bras encore plus courts."},
                 {id:"yuty",label:"💀 Yutyrannus",period:"~125 Ma",from:125e6,to:121e6,color:"#6b7280",vivant:false,eteint:true,desc:"Tyrannosauridé de 9 m couvert de proto-plumes. Chine. Preuve que les grands tyrannosaures étaient emplumés."},
                 {id:"velo",label:"💀 Velociraptor",period:"~75–71 Ma",from:75e6,to:71e6,color:"#6b7280",vivant:false,eteint:true,desc:"Taille d'une dinde, couvert de plumes. Griffes en faucille. Mongolie."},
                 {id:"deinony",label:"💀 Deinonychus",period:"~115–108 Ma",from:115e6,to:108e6,color:"#6b7280",vivant:false,eteint:true,desc:"Le «vrai» raptor de Jurassic Park (taille réelle). Griffe de 12 cm. Chasse en meute probable."},
                 {id:"therizia",label:"💀 Therizinosaurus",period:"~70 Ma",from:70e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Griffes de 90 cm — les plus longues de l'histoire animale. Herbivore. Mongolie."},
                 {id:"ovirapt",label:"💀 Oviraptor",period:"~75–71 Ma",from:75e6,to:71e6,color:"#6b7280",vivant:false,eteint:true,desc:"Crête osseuse, bec sans dents. Couvait ses œufs comme un oiseau. Son nom (voleur d'œufs) est une erreur."},
                 {id:"gallimi",label:"💀 Gallimimus",period:"~70–66 Ma",from:70e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Théropode ornitomimosaure. Rapide (~45 km/h), sans dents, long cou. Mongolie."},
                 {id:"archaeo",label:"💀 Archaeopteryx",period:"~150 Ma",from:152e6,to:148e6,color:"#6b7280",vivant:false,eteint:true,desc:"Chaînon entre dinosaures et oiseaux. Dents, griffe aux ailes ET plumes asymétriques. Jurassique."},
                 {id:"oiseau",label:"🐦 Oiseaux (Aves)",period:"~150 Ma",from:150e6,to:null,color:"#0369a1",vivant:true,
                  desc:"~10 000 espèces vivantes. SONT des dinosaures. Les seuls ayant survécu à −66 Ma.",
                  children:[
                   {id:"hesperor",label:"💀 Hesperornithes",period:"~100–66 Ma",from:100e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Oiseaux plongeurs géants avec dents. Crétacé. Éteints −66 Ma."},
                   {id:"gastorn",label:"💀 Gastornis",period:"~56–45 Ma",from:56e6,to:45e6,color:"#6b7280",vivant:false,eteint:true,desc:"Oiseau géant non volant. 1,8 m, bec massif. Herbivore probable. Europe et Amérique du Nord."},
                   {id:"moa",label:"💀 Moa",period:"~19 Ma–1400",from:19e6,to:0.6e3,color:"#6b7280",vivant:false,eteint:true,desc:"Oiseaux non volants de Nouvelle-Zélande. Jusqu'à 3,6 m. Éteints à l'arrivée des Maoris."},
                   {id:"epyornis",label:"💀 Aepyornis (oiseau-éléphant)",period:"~~26 Ma–1700",from:26e6,to:0.3e3,color:"#6b7280",vivant:false,eteint:true,desc:"Plus grand oiseau connu. 3 m, 500 kg. Madagascar. Œuf de 10 litres. Éteint ~1700."},
                  ]},
                ]},
               // SAUROPODES
               {id:"sauro_g",label:"🦕 Sauropodes",period:"~200–66 Ma",from:200e6,to:66e6,color:"#78716c",vivant:false,eteint:true,
                desc:"Plus grands animaux terrestres de l'histoire. Quadrupèdes, long cou et queue, herbivores.",
                children:[
                 {id:"brachios",label:"💀 Brachiosaurus",period:"~154–150 Ma",from:154e6,to:150e6,color:"#6b7280",vivant:false,eteint:true,desc:"Pattes avant plus longues → cou très dressé comme une girafe. 26 m, 60 t. Tanzanie, USA."},
                 {id:"diplo",label:"💀 Diplodocus",period:"~154–152 Ma",from:154e6,to:152e6,color:"#6b7280",vivant:false,eteint:true,desc:"27 m dont 14 m de queue-fouet. Pattes égales. Herbivore de plaine. Amérique du Nord."},
                 {id:"apatosaur",label:"💀 Apatosaurus (ex-Brontosaurus)",period:"~152–151 Ma",from:152e6,to:151e6,color:"#6b7280",vivant:false,eteint:true,desc:"Longtemps confondu avec Diplodocus. Cou plus court et robuste. 22 m, 25 t."},
                 {id:"argentin",label:"💀 Argentinosaurus",period:"~96–92 Ma",from:96e6,to:92e6,color:"#6b7280",vivant:false,eteint:true,desc:"Candidat au titre du plus grand dinosaure. Estimé à 35–40 m, 70–100 t. Argentine, Crétacé."},
                 {id:"patagot",label:"💀 Patagotitan",period:"~101–98 Ma",from:101e6,to:98e6,color:"#6b7280",vivant:false,eteint:true,desc:"Sauropode titanosaure de 37 m et 70 t. Mieux documenté qu'Argentinosaurus. Argentine."},
                ]},
              ]},
             // ── ORNITHISCHIENS ────────────────────────────────────────
             {id:"ornit_g",label:"🦴 Ornithischiens (bassin d'oiseau)",period:"~235–66 Ma",from:235e6,to:66e6,color:"#78716c",vivant:false,eteint:true,
              desc:"Malgré leur nom, pas les ancêtres des oiseaux. Tous herbivores. Tous éteints à −66 Ma.",
              children:[
               {id:"stego_g",label:"💀 Stégosauridés",period:"~156–145 Ma",from:156e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"stego",label:"💀 Stegosaurus",period:"~155–150 Ma",from:155e6,to:150e6,color:"#6b7280",vivant:false,eteint:true,desc:"Plaques dorsales (thermorégulation/parade), piquants caudaux redoutables. 9 m. Cerveau de 80 g."},
                ]},
               {id:"anky_g",label:"💀 Ankylosaures",period:"~125–66 Ma",from:125e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"ankylo",label:"💀 Ankylosaurus",period:"~68–66 Ma",from:68e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Cuirasse osseuse complète, massue caudale. 8 m, 6 t. Crétacé sup. Amérique du Nord."},
                ]},
               {id:"cerato_g",label:"💀 Cératopsiens",period:"~160–66 Ma",from:160e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"tricera",label:"💀 Triceratops",period:"~68–66 Ma",from:68e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"3 cornes, large collerette. 9 m, 12 t. Contemporain de T-rex. Vivait en troupeaux."},
                 {id:"proto",label:"💀 Protoceratops",period:"~75–71 Ma",from:75e6,to:71e6,color:"#6b7280",vivant:false,eteint:true,desc:"Petit cératopsien sans corne. Mongolie. Connu pour ses nids avec œufs."},
                ]},
               {id:"hadro_g",label:"💀 Hadrosaures (becs de canard)",period:"~100–66 Ma",from:100e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"parasaur",label:"💀 Parasaurolophus",period:"~76–73 Ma",from:76e6,to:73e6,color:"#6b7280",vivant:false,eteint:true,desc:"Crête creuse de 1,8 m servant de résonateur sonore. Amérique du Nord."},
                ]},
               {id:"ornith_g",label:"💀 Ornithopodes",period:"~170–66 Ma",from:170e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"igua",label:"💀 Iguanodon",period:"~130–120 Ma",from:130e6,to:120e6,color:"#6b7280",vivant:false,eteint:true,desc:"2e dinosaure décrit scientifiquement. Pouce en éperon. Bipède/quadrupède. Europe."},
                ]},
               {id:"pachyc",label:"💀 Pachycéphalosaures",period:"~76–66 Ma",from:76e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
                children:[
                 {id:"pachyc_sp",label:"💀 Pachycephalosaurus",period:"~76–66 Ma",from:76e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"Crâne dôme de 25 cm d'épaisseur. Combats par chocs crâniens. Amérique du Nord."},
                ]},
              ]},
            ]},
          ]},
         {id:"squa_g",label:"🐍 Squamates",period:"~200 Ma",from:200e6,to:null,color:"#ca8a04",vivant:true,
          desc:"Lézards, serpents, amphisbènes. ~10 000 espèces. Groupe le plus diversifié de reptiles.",
          children:[
           {id:"lezer_g",label:"🦎 Lézards",period:"~200 Ma",from:200e6,to:null,color:"#84cc16",vivant:true,desc:"Iguanes, geckos, caméléons, varans, Komodo. ~6 000 espèces."},
           {id:"serp_g",label:"🐍 Serpents",period:"~150 Ma",from:150e6,to:null,color:"#a3e635",vivant:true,desc:"Dérivés de lézards fouisseurs. ~3 700 espèces. Du 10 cm (Barbados threadsnake) au 7 m (anaconda)."},
           {id:"mosa_g",label:"💀 Mosasaures",period:"~98–66 Ma",from:98e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
            children:[
             {id:"mosamoss",label:"💀 Mosasaurus",period:"~82–66 Ma",from:82e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"17 m. Prédateur marin dominant du Crétacé tardif. Pays-Bas. Nageur puissant."},
             {id:"tylosar",label:"💀 Tylosaurus",period:"~85–75 Ma",from:85e6,to:75e6,color:"#6b7280",vivant:false,eteint:true,desc:"14 m. Mosasaure nord-américain. Museau proéminent utilisé comme bélier."},
            ]},
          ]},
         // REPTILES MARINS MÉSOZOÏQUES
         {id:"ichthyo_g",label:"💀 Ichthyosaures",period:"~250–90 Ma",from:250e6,to:90e6,color:"#6b7280",vivant:false,eteint:true,
          desc:"Reptiles marins à forme de dauphin. Vivipares. Ancêtres terrestres retournés à la mer.",
          children:[
           {id:"ichthyo_sp",label:"💀 Ichthyosaurus",period:"~200–175 Ma",from:200e6,to:175e6,color:"#6b7280",vivant:false,eteint:true,desc:"2 m, yeux géants (adaptés aux grandes profondeurs). Jurassique inférieur. Angleterre."},
           {id:"ophtha",label:"💀 Ophthalmosaurus",period:"~165–145 Ma",from:165e6,to:145e6,color:"#6b7280",vivant:false,eteint:true,desc:"Yeux de 23 cm — les plus grands proportionnellement de l'histoire. Plongeait très profond."},
           {id:"temnod",label:"💀 Temnodontosaurus",period:"~200–182 Ma",from:200e6,to:182e6,color:"#6b7280",vivant:false,eteint:true,desc:"9 m. Très gros yeux. Prédateur de céphalopodes géants. Jurassique inférieur."},
          ]},
         {id:"plesio_g",label:"💀 Plésiosaures",period:"~205–66 Ma",from:205e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,
          desc:"Reptiles marins à long cou (plésiosaures) ou tête massive (pliosauridés).",
          children:[
           {id:"elasmosaur",label:"💀 Élasmosaure",period:"~80,5–66 Ma",from:80.5e6,to:66e6,color:"#6b7280",vivant:false,eteint:true,desc:"14 m dont 7 m de cou (76 vertèbres). Mange des poissons. Crétacé sup. Amérique du Nord."},
           {id:"kronosau",label:"💀 Kronosaurus",period:"~119–98 Ma",from:119e6,to:98e6,color:"#6b7280",vivant:false,eteint:true,desc:"Pliosauridé de 10 m. Crâne de 2,7 m. Prédateur apex des mers crétacées d'Australie."},
           {id:"liopleuro",label:"💀 Liopleurodon",period:"~165–155 Ma",from:165e6,to:155e6,color:"#6b7280",vivant:false,eteint:true,desc:"Pliosauridé de 6–7 m (parfois surestimé à 25 m). Mâchoires de 3 m. Jurassique. Europe."},
          ]},
        ]},
      ]},
    ]},
  ]},
];

// ── COMPOSANTS ────────────────────────────────────────────────────────────────

function TimeBar({from, to, color, vivant}) {
  const left  = 100 - pct(from);
  const right = to  ? 100 - pct(to) : 0;
  const width = Math.max(100 - left - right, 0.4);
  return (
    <div style={{position:"relative",height:5,background:"rgba(55,53,47,.07)",borderRadius:3,margin:"4px 0 1px",overflow:"hidden"}}>
      <div style={{position:"absolute",left:`${left}%`,width:`${width}%`,height:"100%",
        background:vivant?color:color+"77",borderRadius:3}}/>
    </div>
  );
}

function ScaleBar() {
  const marks = [
    {label:"Auj.",pct:100},{label:"100 Ma",pct:100-pct(100e6)},
    {label:"250 Ma",pct:100-pct(250e6)},{label:"400 Ma",pct:100-pct(400e6)},
    {label:"540 Ma",pct:0},
  ];
  return (
    <div style={{position:"relative",height:20,margin:"2px 0 14px",
      fontSize:10,color:"rgba(55,53,47,.38)",fontFamily:"inherit"}}>
      <div style={{position:"absolute",left:0,right:0,top:9,height:1,background:"rgba(55,53,47,.08)"}}/>
      {marks.map(m=>(
        <div key={m.label} style={{position:"absolute",left:`${m.pct}%`,top:0,
          transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap"}}>
          <div style={{width:1,height:5,background:"rgba(55,53,47,.2)",margin:"0 auto 2px"}}/>
          {m.label}
        </div>
      ))}
    </div>
  );
}

function Node({node, depth=0}) {
  const [open, setOpen] = useState(depth < 1);
  const [desc, setDesc] = useState(false);
  const hasKids = node.children?.length > 0;

  return (
    <div style={{marginLeft:depth*18,marginBottom:1}}>
      <div
        style={{display:"flex",alignItems:"center",gap:5,padding:"3px 7px",
          borderRadius:4,cursor:"pointer",transition:"background .1s",
          background:open&&hasKids?`${node.color}0e`:"transparent"}}
        onClick={()=>{if(hasKids)setOpen(o=>!o);setDesc(d=>!d);}}
        onMouseEnter={e=>e.currentTarget.style.background=`${node.color}15`}
        onMouseLeave={e=>e.currentTarget.style.background=open&&hasKids?`${node.color}0e`:"transparent"}
      >
        <span style={{fontSize:10,color:"rgba(55,53,47,.3)",width:11,textAlign:"center",flexShrink:0,
          transform:open?"rotate(90deg)":"none",transition:"transform .15s",
          visibility:hasKids?"visible":"hidden"}}>▶</span>
        <div style={{width:8,height:8,borderRadius:"50%",background:node.color,flexShrink:0,opacity:node.eteint?.45:1}}/>
        <span style={{fontWeight:depth===0?700:depth<=2?600:500,
          fontSize:depth===0?16:depth<=2?14:13,
          color:node.eteint?"rgba(55,53,47,.4)":"#37352f",
          textDecoration:node.eteint?"line-through":"none",lineHeight:1.3}}>
          {node.label}
        </span>
        <span style={{fontSize:11,color:"rgba(55,53,47,.38)",marginLeft:3}}>{node.period}</span>
        <span style={{marginLeft:"auto",flexShrink:0,fontSize:10,padding:"1px 6px",borderRadius:3,
          background:node.eteint?"rgba(239,68,68,.08)":"rgba(22,163,74,.08)",
          color:node.eteint?"#dc2626":"#15803d",fontWeight:500}}>
          {node.eteint?"Éteint":"Vivant"}
        </span>
      </div>
      {node.from&&(
        <div style={{paddingLeft:24,paddingRight:6}}>
          <TimeBar from={node.from} to={node.to} color={node.color} vivant={node.vivant}/>
        </div>
      )}
      {desc&&node.desc&&(
        <div style={{marginLeft:24,marginRight:6,marginBottom:5,marginTop:1,
          padding:"7px 10px",background:"rgba(55,53,47,.03)",
          borderLeft:`3px solid ${node.color}55`,borderRadius:"0 5px 5px 0",
          fontSize:12,color:"rgba(55,53,47,.62)",lineHeight:1.6,fontFamily:"inherit"}}>
          {node.desc}
        </div>
      )}
      {open&&hasKids&&(
        <div style={{borderLeft:"1.5px solid rgba(55,53,47,.08)",marginLeft:12,paddingLeft:3,marginTop:1}}>
          {node.children.map(c=><Node key={c.id} node={c} depth={depth+1}/>)}
        </div>
      )}
    </div>
  );
}

export function LifeTree() {
  const [search, setSearch] = useState("");
  return (
    <div style={{fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",
      background:"#fff",borderTop:"1px solid rgba(55,53,47,.09)",padding:"28px 32px 48px"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
        <h2 style={{fontSize:22,fontWeight:700,color:"#37352f",margin:0,fontFamily:"inherit"}}>🌿 Arbre de la vie</h2>
        <span style={{fontSize:13,color:"rgba(55,53,47,.45)"}}>200+ espèces · cliquer pour déplier · cliquer encore pour la description</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(55,53,47,.45)"}}>
          <div style={{width:28,height:5,borderRadius:2,background:"#0ea5e9"}}/><span>Vivant</span>
          <div style={{width:28,height:5,borderRadius:2,background:"#6b728077",marginLeft:8}}/><span>Éteint</span>
          <span style={{marginLeft:8}}>— Barre = durée d'existence (échelle : 540 Ma)</span>
        </div>
      </div>
      <ScaleBar/>
      {TREE.map(n=><Node key={n.id} node={n} depth={0}/>)}
    </div>
  );
}
