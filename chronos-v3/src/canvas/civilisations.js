// ── DONNÉES CIVILISATIONS / THÈMES ────────────────────────────────────────────
// Chaque entrée : id, label, from, to (années avant aujourd'hui), color, cat, desc
// from > to (from = plus ancien)

export const THEMES = {
  civilisations: {
    label: "Civilisations & Empires",
    color: "#f59e0b",
    icon: "🏛️",
    items: [
      // Mésopotamie
      { id:"sumer",    label:"Sumer",              from:5500,  to:1900,  color:"#f59e0b", desc:"Première civilisation écrite. Mésopotamie." },
      { id:"akkad",    label:"Empire akkadien",    from:2334,  to:2154,  color:"#f97316", desc:"Premier empire de l'histoire. Sargon d'Akkad." },
      { id:"babylon",  label:"Babylone",           from:1894,  to:539,   color:"#ea580c", desc:"Hammurabi, jardins suspendus, astronomie." },
      { id:"assyrie",  label:"Empire assyrien",    from:2025,  to:609,   color:"#c2410c", desc:"Puissance militaire du Proche-Orient ancien." },
      // Égypte
      { id:"egypte",   label:"Égypte ancienne",    from:3100,  to:30,    color:"#eab308", desc:"Pharaons, pyramides, 3 000 ans de civilisation." },
      { id:"nkvale",   label:"Nubie / Koush",      from:2500,  to:350,   color:"#ca8a04", desc:"Civilisation africaine rivale de l'Égypte." },
      // Méditerranée
      { id:"minoens",  label:"Civilisation minoenne",from:2700,to:1450,  color:"#06b6d4", desc:"Crète, palais de Cnossos, écriture linéaire A." },
      { id:"grece",    label:"Grèce antique",      from:800,   to:146,   color:"#3b82f6", desc:"Démocratie, philosophie, Olympiades, art." },
      { id:"macedoine",label:"Empire macédonien",  from:336,   to:323,   color:"#6366f1", desc:"Alexandre le Grand. De la Grèce à l'Inde." },
      { id:"rome",     label:"Rome / Empire romain",from:753,  to:476,   color:"#ef4444", desc:"De la cité-état à l'empire méditerranéen." },
      { id:"byzance",  label:"Empire byzantin",    from:330,   to:1453,  color:"#8b5cf6", desc:"Continuation de Rome à l'Est. Constantinople." },
      // Perse
      { id:"perse",    label:"Empire perse achéménide",from:550,to:330,  color:"#f97316", desc:"Cyrus le Grand. Premier empire multiculturel." },
      { id:"sassanides",label:"Empire sassanide",  from:224,   to:651,   color:"#ea580c", desc:"Renaissance perse. Rival de Rome puis Byzance." },
      // Islam
      { id:"islam",    label:"Califat / Âge d'or islamique",from:632,to:1258,color:"#10b981",desc:"Science, mathématiques, philosophie, commerce." },
      { id:"ottoman",  label:"Empire ottoman",     from:1299,  to:1922,  color:"#059669", desc:"Du Bosphore à la Mésopotamie. 600 ans." },
      // Asie
      { id:"indus",    label:"Civilisation de l'Indus",from:2600,to:1900,color:"#ec4899",desc:"Harappa, Mohenjo-daro. Urbanisme avancé." },
      { id:"maurya",   label:"Empire Maurya",      from:322,   to:185,   color:"#db2777", desc:"Ashoka, bouddhisme, unification de l'Inde." },
      { id:"chine_qin",label:"Chine — Qin/Han",   from:221,   to:220,   color:"#dc2626", desc:"Grande Muraille, unification, papier, soie." },
      { id:"tang",     label:"Chine — Tang/Song",  from:618,   to:1279,  color:"#b91c1c", desc:"Âge d'or chinois. Imprimerie, boussole, poudre." },
      { id:"mongol",   label:"Empire mongol",      from:1206,  to:1368,  color:"#78716c", desc:"Gengis Khan. Plus grand empire terrestre." },
      { id:"japon",    label:"Japon féodal",       from:1185,  to:1868,  color:"#ef4444", desc:"Samouraïs, shoguns, isolement et culture." },
      { id:"maya",     label:"Civilisation maya",  from:2000,  to:1500,  color:"#16a34a", desc:"Astronomie, calendrier, cités-États en Mésoamérique." },
      { id:"aztec",    label:"Empire aztèque",     from:1345,  to:1521,  color:"#15803d", desc:"Tenochtitlan, Quetzalcoatl, Cortés." },
      { id:"inca",     label:"Empire inca",        from:1438,  to:1533,  color:"#166534", desc:"Machu Picchu, routes, Andes. Pizarro." },
      // Europe moderne
      { id:"caroling", label:"Empire carolingien", from:768,   to:843,   color:"#6366f1", desc:"Charlemagne. Fondation de l'Europe médiévale." },
      { id:"mongol2",  label:"Saint-Empire romain", from:962,  to:1806,  color:"#7c3aed", desc:"Germanique. Cœur de l'Europe médiévale." },
      { id:"france",   label:"France — Ancien Régime",from:987,to:1792,  color:"#2563eb", desc:"Capétiens, Valois, Bourbons. Louis XIV." },
      { id:"brit",     label:"Empire britannique", from:1583,  to:1997,  color:"#1d4ed8", desc:"Plus grand empire de l'histoire. 'Le soleil ne se couche jamais.'" },
    ]
  },
  religions: {
    label: "Religions & Philosophies",
    color: "#8b5cf6",
    icon: "✨",
    items: [
      { id:"hindou",   label:"Hindouisme",         from:3500,  to:null,  color:"#f97316", desc:"Plus ancienne religion encore pratiquée. Védas." },
      { id:"judaisme", label:"Judaïsme",           from:2000,  to:null,  color:"#3b82f6", desc:"Monothéisme fondateur. Torah, alliance avec Dieu." },
      { id:"zoroas",   label:"Zoroastrisme",       from:1500,  to:null,  color:"#f59e0b", desc:"Perse. Bien vs mal. Influence sur les 3 grandes religions." },
      { id:"boud",     label:"Bouddhisme",         from:2530,  to:null,  color:"#eab308", desc:"Siddharta Gautama. Nirva, dharma, méditation." },
      { id:"confuc",   label:"Confucianisme",      from:2500,  to:null,  color:"#dc2626", desc:"Confucius. Morale, famille, ordre social." },
      { id:"christi",  label:"Christianisme",      from:2025,  to:null,  color:"#6366f1", desc:"Jésus de Nazareth. 2,4 milliards de fidèles." },
      { id:"islami",   label:"Islam",              from:1393,  to:null,  color:"#10b981", desc:"Mahomet. Coran. 1,9 milliards de fidèles." },
      { id:"philo_gr", label:"Philosophie grecque",from:2600,  to:2200,  color:"#06b6d4", desc:"Socrate, Platon, Aristote. Fondements de la pensée occidentale." },
      { id:"lumiere",  label:"Lumières",           from:350,   to:200,   color:"#0ea5e9", desc:"Voltaire, Rousseau, Kant. Raison, liberté, droits." },
    ]
  },
  sciences: {
    label: "Sciences & Inventions",
    color: "#06b6d4",
    icon: "🔬",
    items: [
      { id:"ecriture", label:"Invention de l'écriture",from:5200,to:5000,color:"#f59e0b", desc:"Cunéiforme sumériense. Révolution de la transmission du savoir." },
      { id:"roue",     label:"Roue & charrue",    from:5500,  to:5000,  color:"#ea580c", desc:"Mésopotamie. Révolution agricole et transport." },
      { id:"math_gr",  label:"Mathématiques grecques",from:2600,to:2200,color:"#3b82f6", desc:"Euclide, Pythagore, Archimède. Fondements de la géométrie." },
      { id:"papier",   label:"Papier (Chine)",    from:1900,  to:1800,  color:"#dc2626", desc:"Cai Lun, 105 apr.J.-C. Révolution de la communication." },
      { id:"imprim",   label:"Imprimerie (Gutenberg)",from:571,to:571,  color:"#7c3aed", desc:"1454. Révolution de la diffusion du savoir en Europe." },
      { id:"copern",   label:"Révolution copernicienne",from:480,to:430,color:"#0ea5e9", desc:"Copernic, Galilée, Kepler. La Terre tourne autour du Soleil." },
      { id:"newton",   label:"Newton — Mécanique",from:335,  to:300,   color:"#6366f1", desc:"Principia Mathematica, 1687. Gravitation universelle." },
      { id:"revind",   label:"Révolution industrielle",from:265,to:125, color:"#78716c", desc:"Vapeur, charbon, machine. Angleterre, 1760-1900." },
      { id:"darwin",   label:"Darwin — Évolution", from:166,  to:163,  color:"#16a34a", desc:"L'Origine des espèces, 1859. Sélection naturelle." },
      { id:"einstein", label:"Einstein — Relativité",from:120,to:70,   color:"#f59e0b", desc:"1905-1915. E=mc². Révolution de la physique." },
      { id:"adn",      label:"Découverte de l'ADN",from:72,   to:70,   color:"#10b981", desc:"Watson & Crick, 1953. Structure en double hélice." },
      { id:"internet", label:"Internet",           from:55,   to:45,   color:"#06b6d4", desc:"ARPANET 1969, Web 1991. Révolution de la communication." },
      { id:"ia",       label:"IA générative",      from:3,    to:null,  color:"#8b5cf6", desc:"GPT, Stable Diffusion. Nouvelle révolution cognitive." },
    ]
  },
  guerres: {
    label: "Guerres & Conflits",
    color: "#ef4444",
    icon: "⚔️",
    items: [
      { id:"gperses",  label:"Guerres médiques",   from:2500,  to:2449,  color:"#dc2626", desc:"Grèce vs Perse. Marathon, Salamine, Platées." },
      { id:"pelopon",  label:"Guerre du Péloponnèse",from:2431,to:2404, color:"#b91c1c", desc:"Athènes vs Sparte. Déclin de la Grèce classique." },
      { id:"puniques", label:"Guerres puniques",   from:2264,  to:2146,  color:"#ef4444", desc:"Rome vs Carthage. Hannibal. Domination romaine." },
      { id:"croisades",label:"Croisades",          from:1096,  to:1291,  color:"#7c3aed", desc:"8 croisades. Jérusalem, Orient, choc des civilisations." },
      { id:"gua",      label:"Guerre de Cent Ans", from:1337,  to:1453,  color:"#2563eb", desc:"France vs Angleterre. Jeanne d'Arc. Fin du Moyen Âge." },
      { id:"g30ans",   label:"Guerre de 30 ans",   from:1618,  to:1648,  color:"#6366f1", desc:"Europe centrale. Traités de Westphalie. Nations modernes." },
      { id:"napo",     label:"Guerres napoléoniennes",from:221,to:210,  color:"#1d4ed8", desc:"1803-1815. Europe bouleversée. Waterloo." },
      { id:"secession",label:"Guerre de Sécession",from:164,  to:160,   color:"#dc2626", desc:"États-Unis, 1861-1865. Esclavage, unification." },
      { id:"g1",       label:"Première Guerre mondiale",from:110,to:107,color:"#78716c", desc:"1914-1918. 20 millions de morts. Fin des empires." },
      { id:"g2",       label:"Seconde Guerre mondiale",from:86,to:80,   color:"#1f2937", desc:"1939-1945. 70-85 millions de morts. Holocauste." },
      { id:"cold",     label:"Guerre froide",      from:80,   to:34,    color:"#7c3aed", desc:"USA vs URSS. Course aux armements, espace, idéologies." },
    ]
  },
  arts: {
    label: "Arts & Culture",
    color: "#ec4899",
    icon: "🎨",
    items: [
      { id:"chauvet",  label:"Art rupestre (Chauvet)",from:36500,to:36000,color:"#f97316",desc:"Plus anciens chefs-d'œuvre de l'humanité. Ardèche." },
      { id:"venus",    label:"Vénus de Willendorf", from:28000, to:25000, color:"#ec4899", desc:"Statuette de fertilité paléolithique. Autriche." },
      { id:"lascaux",  label:"Grottes de Lascaux",  from:17000, to:15000, color:"#f59e0b", desc:"Chef-d'œuvre de la préhistoire. Dordogne, France." },
      { id:"pyramides",label:"Pyramides de Gizeh",  from:4560,  to:4500,  color:"#eab308", desc:"Khéops, Khéphren, Mykérinos. 7e merveille du monde." },
      { id:"parthenon",label:"Parthénon",           from:2447,  to:2432,  color:"#3b82f6", desc:"Athènes, 447-432 av.J.-C. Apogée de l'art grec." },
      { id:"renaiss",  label:"Renaissance italienne",from:430,  to:300,  color:"#ec4899", desc:"Léonard, Michel-Ange, Raphaël. Humanisme, perspective." },
      { id:"baroque",  label:"Baroque",             from:380,   to:250,  color:"#f97316", desc:"Bach, Caravage, Bernin. Grandeur et émotion." },
      { id:"impression",label:"Impressionnisme",    from:155,   to:120,  color:"#8b5cf6", desc:"Monet, Renoir, Degas. Révolution de la peinture." },
      { id:"jazz",     label:"Jazz & musiques modernes",from:130,to:50, color:"#1f2937", desc:"Blues, jazz, rock, rap. Révolutions musicales du XXe." },
      { id:"cinema",   label:"Cinéma",              from:130,   to:null, color:"#7c3aed", desc:"Lumière, 1895. 7e art. Hollywood, Nouvelle Vague." },
    ]
  },
  personnages: {
    label: "Personnages clés",
    color: "#f97316",
    icon: "👤",
    items: [
      { id:"confuc2",  label:"Confucius",           from:2551,  to:2479,  color:"#dc2626", desc:"551-479 av.J.-C. Philosophe chinois. Éthique et société." },
      { id:"bouddha2", label:"Bouddha",             from:2566,  to:2486,  color:"#eab308", desc:"~566-486 av.J.-C. Siddhartha Gautama. Éveil." },
      { id:"socratea", label:"Socrate",             from:2470,  to:2399,  color:"#3b82f6", desc:"470-399 av.J.-C. 'Connais-toi toi-même.'" },
      { id:"alex",     label:"Alexandre le Grand",  from:2356,  to:2323,  color:"#6366f1", desc:"356-323 av.J.-C. Conquête de l'Asie en 13 ans." },
      { id:"cesar",    label:"Jules César",         from:2100,  to:2044,  color:"#ef4444", desc:"100-44 av.J.-C. Conquête des Gaules. Dictateur." },
      { id:"jesusa",   label:"Jésus de Nazareth",   from:2006,  to:1970,  color:"#7c3aed", desc:"~6 av.J.-C.-30 apr.J.-C. Fondateur du christianisme." },
      { id:"mahom",    label:"Mahomet",             from:1570,  to:1508,  color:"#10b981", desc:"570-632. Prophète de l'Islam. Hégire 622." },
      { id:"gengis",   label:"Gengis Khan",         from:1162,  to:1227,  color:"#78716c", desc:"1162-1227. Unificateur des Mongols. Empire mondial." },
      { id:"leon",     label:"Léonard de Vinci",    from:567,   to:515,   color:"#ec4899", desc:"1452-1519. Peintre, ingénieur, scientifique universel." },
      { id:"copern2",  label:"Copernic",            from:527,   to:480,   color:"#06b6d4", desc:"1473-1543. Heliocentrisme. Révolution scientifique." },
      { id:"galilee",  label:"Galilée",             from:441,   to:383,   color:"#0ea5e9", desc:"1564-1642. Télescope, mécanique. Condamné par l'Église." },
      { id:"napoleon", label:"Napoléon Bonaparte",  from:256,   to:204,   color:"#1d4ed8", desc:"1769-1821. Révolution, Code civil, empire européen." },
      { id:"darwin2",  label:"Charles Darwin",      from:216,   to:143,   color:"#16a34a", desc:"1809-1882. Théorie de l'évolution par sélection naturelle." },
      { id:"einstein2",label:"Albert Einstein",      from:146,  to:70,    color:"#f59e0b", desc:"1879-1955. Relativité, E=mc², prix Nobel 1921." },
      { id:"gandhi",   label:"Gandhi",              from:155,   to:77,    color:"#f97316", desc:"1869-1948. Non-violence. Indépendance de l'Inde." },
      { id:"mandela",  label:"Nelson Mandela",      from:107,   to:11,    color:"#10b981", desc:"1918-2013. Lutte anti-apartheid. Président d'Afrique du Sud." },
    ]
  },
};
