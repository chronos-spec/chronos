// ══════════════════════════════════════════════════════════════════════════
// RÉCITS DE THÈME — pour la page dédiée ouverte depuis une "couche" (Couches :
// Civilisations, Religions, Sciences, Guerres, Arts, Personnages).
// ──────────────────────────────────────────────────────────────────────────
// Chaque entrée reprend les items de THEMES (drawTimeline.js) par leur id et
// leur associe une courte note narrative. `links` décrit les reliages à
// afficher entre deux items du même thème (continuité, influence, rupture).
// ══════════════════════════════════════════════════════════════════════════

export const THEME_NARRATIVES = {
  civilisations: {
    intro: "Depuis les premières cités des marais mésopotamiens jusqu'aux empires globaux du XXe siècle, la même expérience recommence sans cesse : des hommes s'organisent, bâtissent un pouvoir assez fort pour durer, puis le voient se fissurer sous son propre poids. Ce fil retrace quinze de ces constructions politiques, de la Mésopotamie aux Amériques précolombiennes, et montre comment chacune hérite parfois des ruines de la précédente.",
    closing: "Aucun empire de cette liste n'est tombé du seul fait d'un ennemi extérieur : tous ont d'abord été fragilisés de l'intérieur — succession disputée, fiscalité à bout de souffle, religion qui ne fédère plus. Ce qui frappe, en les parcourant dans l'ordre, c'est la vitesse à laquelle un pouvoir présenté comme éternel par ses contemporains finit, sur l'échelle du temps long, par n'être qu'un chapitre parmi d'autres.",
    notes: {
      sumer: "Dans le delta du Tigre et de l'Euphrate naissent les premières cités-États — Uruk, Ur, Lagash — avec écriture, temples et rois. C'est le prototype de toute civilisation urbaine à venir.",
      egypte: "Unifiée par Narmer, l'Égypte pharaonique tient près de trois millénaires grâce au Nil, à une administration précoce et à une religion d'État qui légitime le pouvoir royal.",
      maya: "Sans grand empire centralisé, les cités-États mayas d'Amérique centrale développent astronomie, écriture glyphique et pyramides à degrés, avant un effondrement encore débattu par les chercheurs.",
      grece: "Un archipel de cités rivales — Athènes, Sparte, Corinthe — invente la démocratie, la philosophie et le théâtre, puis s'épuise dans ses propres guerres avant de tomber sous Rome.",
      perse: "De Cyrus à Darius, l'Empire perse achéménide relie l'Égée à l'Inde par des routes royales et une administration tolérante envers les peuples conquis — un modèle impérial durable.",
      rome: "De cité du Latium à empire méditerranéen, Rome invente le droit, l'ingénierie civile et une citoyenneté extensible, avant que la pression aux frontières et les crises internes ne la scindent.",
      chine_h: "Depuis l'unification par Qin Shi Huang, la Chine impériale alterne dynasties et fragmentations sur deux millénaires, portée par une administration mandarinale qui survit à chaque changement de maison régnante.",
      byzance: "Héritière directe de Rome à Constantinople, Byzance prolonge le droit romain et le christianisme orthodoxe pendant mille ans, verrou oriental de l'Europe face aux invasions successives.",
      islam: "Depuis Bagdad, les Abbassides président un âge d'or scientifique et commercial où mathématiques, médecine et astronomie circulent entre Cordoue et l'Asie centrale, avant la fragmentation politique du monde musulman.",
      france: "Des Capétiens à Louis XVI, la monarchie française construit un État centralisé autour de Paris, avant qu'une crise fiscale et sociale n'ouvre la voie à la Révolution de 1789.",
      mongol: "En quelques décennies, Gengis Khan et ses héritiers assemblent le plus vaste empire terrestre continu de l'histoire, reliant la Chine à l'Europe et provoquant, par sa chute, un vide que d'autres empires vont combler.",
      aztec: "Confédération guerrière centrée sur Tenochtitlan, l'empire aztèque domine le Mexique central par le tribut et la guerre rituelle, avant de s'effondrer en deux ans face aux conquistadors espagnols.",
      inca: "Le long des Andes, l'empire inca relie un réseau de routes et de greniers d'État sur des milliers de kilomètres, avant d'être décapité par la capture d'Atahualpa en 1533.",
      ottoman: "Héritiers indirects du vide laissé par les Mongols et la chute de Byzance, les Ottomans bâtissent depuis Constantinople un empire tricontinental qui dure plus de six siècles.",
      brit: "Depuis une île de l'Atlantique Nord, l'Empire britannique finit par couvrir un quart des terres émergées, avant une décolonisation rapide après la Seconde Guerre mondiale.",
    },
    links: {
      rome: ["byzance"], byzance: ["ottoman"],
      perse: ["islam"], grece: ["rome"],
      mongol: ["ottoman"], france: ["brit"],
    },
  },

  religions: {
    intro: "Les grandes traditions religieuses et philosophiques n'apparaissent pas au hasard : chacune répond à une crise de sens de son époque, puis se transforme au contact des suivantes. Ce fil suit sept courants majeurs, de l'Inde védique aux Lumières européennes, et montre comment ils se sont parfois nourris, parfois affrontés.",
    closing: "Trois millénaires plus tard, ces sept courants structurent encore la vie de la majorité de l'humanité. Leur histoire commune enseigne surtout ceci : aucune tradition ne naît pure de toute influence extérieure, et c'est précisément ce dialogue — pacifique ou violent — entre traditions qui a façonné la carte religieuse actuelle du monde.",
    notes: {
      hindou: "Sans fondateur unique, l'hindouisme se forme par sédimentation depuis les hymnes védiques jusqu'aux épopées classiques, absorbant des cultes locaux sur plus de trois mille ans.",
      judaisme: "Né du monothéisme des tribus hébraïques puis codifié après l'exil de Babylone, le judaïsme fonde la notion d'alliance entre un peuple et un Dieu unique — matrice des deux traditions abrahamiques suivantes.",
      confuc: "En Chine, Confucius fonde une éthique du devoir social et de la piété filiale plus qu'une religion révélée ; elle façonnera l'administration impériale chinoise pendant deux millénaires.",
      boud: "Sur les traces du renoncement de Siddhartha Gautama, le bouddhisme propose une voie de libération individuelle par la méditation, sans dieu créateur, et se diffuse de l'Inde jusqu'en Asie orientale.",
      christi: "Issu d'un mouvement juif du Ier siècle centré sur Jésus de Nazareth, le christianisme devient religion d'État romaine puis se scinde en traditions catholique, orthodoxe et, plus tard, protestante.",
      islami: "Porté par la prédication de Mahomet puis par une expansion militaire et commerciale fulgurante, l'islam relie en un siècle l'Espagne à l'Asie centrale, héritant au passage de la philosophie grecque et perse.",
      lumiere: "Au XVIIIe siècle, les Lumières placent la raison individuelle au-dessus de l'autorité religieuse révélée, ouvrant la voie aux révolutions politiques et à la sécularisation progressive de l'Europe.",
    },
    links: {
      judaisme: ["christi"], christi: ["islami"],
      hindou: ["boud"], islami: ["lumiere"], christi: ["lumiere"],
    },
  },

  sciences: {
    intro: "De l'invention de l'écriture à l'intelligence artificielle générative, l'histoire des sciences et des techniques est une chaîne où chaque rupture rend possible la suivante. Ce fil retrace huit étapes qui ont changé la façon dont l'humanité stocke, vérifie et diffuse la connaissance.",
    closing: "Le rythme de cette chaîne s'accélère de façon spectaculaire : plusieurs millénaires séparent l'écriture de l'imprimerie, quelques décennies séparent Internet de l'IA générative. Cette compression du temps entre deux ruptures majeures est peut-être, plus que chaque invention prise isolément, la vraie signature de l'histoire des sciences.",
    notes: {
      ecriture: "En Mésopotamie, des marques comptables sur argile évoluent vers un système symbolique complet : pour la première fois, une pensée peut survivre à celui qui l'a eue.",
      imprim: "Gutenberg mécanise la reproduction du texte avec des caractères mobiles : le savoir cesse d'être rare et cher, condition matérielle de la Réforme et des Lumières qui suivront.",
      copern: "En déplaçant la Terre du centre de l'univers, Copernic — puis Galilée et Kepler — inaugure une méthode où l'observation prime sur l'autorité des textes anciens.",
      revind: "La machine à vapeur puis l'usine transforment le travail humain et la production de richesse à une échelle inédite, redessinant villes, classes sociales et rapports au temps.",
      darwin: "En proposant la sélection naturelle, Darwin explique la diversité du vivant sans dessein préétabli, provoquant un choc culturel dont les répliques se font sentir bien après 1859.",
      einstein: "La relativité restreinte puis générale d'Einstein bouleversent les notions d'espace, de temps et de gravité héritées de Newton, ouvrant la voie à la physique du XXe siècle.",
      internet: "En reliant des réseaux d'ordinateurs entre eux puis en y ajoutant le Web, une infrastructure de communication mondiale et instantanée émerge en quelques décennies à peine.",
      ia: "Les modèles de langage génératifs rendent la production de texte, d'image et de code accessible à quiconque en une conversation — une rupture dont les effets restent encore à mesurer.",
    },
    links: {
      ecriture: ["imprim"], imprim: ["copern"],
      copern: ["darwin"], darwin: ["einstein"],
      internet: ["ia"],
    },
  },

  guerres: {
    intro: "Six conflits majeurs suffisent à esquisser une histoire de la guerre elle-même : de l'affrontement religieux médiéval à la confrontation nucléaire silencieuse du XXe siècle, chaque épisode redéfinit ce que veut dire faire la guerre — et la paix qui suit.",
    closing: "D'un conflit à l'autre, l'échelle change radicalement : des chevaliers des Croisades aux millions de soldats des guerres mondiales, jusqu'à une guerre froide qui ne se combat presque plus sur le terrain mais par la dissuasion. Le risque de destruction totale, apparu avec l'arme nucléaire, referme pour l'instant ce cycle d'escalade.",
    notes: {
      croisades: "Sur près de deux siècles, plusieurs expéditions chrétiennes tentent de reprendre Jérusalem aux musulmans, laissant en héritage autant d'échanges culturels et commerciaux que de ressentiments durables.",
      gua: "Ce conflit intermittent entre couronnes anglaise et française, ponctué par Jeanne d'Arc, façonne l'identité nationale des deux royaumes et signe la fin de la chevalerie médiévale classique.",
      napo: "Les campagnes de Napoléon redessinent la carte de l'Europe et diffusent, souvent malgré elles, les idéaux et le code civil issus de la Révolution française.",
      g1: "La Première Guerre mondiale, déclenchée par un système d'alliances rigide, engloutit un empire entier de soldats dans les tranchées et met fin à quatre grands empires.",
      g2: "Conflit le plus meurtrier de l'histoire, la Seconde Guerre mondiale voit la Shoah et l'arme atomique redéfinir pour toujours ce dont l'humanité est capable, en bien comme en mal.",
      cold: "Sans affrontement direct entre les deux superpuissances, la Guerre froide oppose États-Unis et URSS par proxys interposés, course à l'armement et rivalité spatiale, jusqu'à l'effondrement soviétique.",
    },
    links: { g1: ["g2"], g2: ["cold"], napo: ["g1"] },
  },

  arts: {
    intro: "De la première grotte peinte à l'invention du cinéma, l'art ne cesse de réinventer ses propres outils autant que ses sujets. Ce fil resserré suit cinq moments où une nouvelle façon de représenter le monde s'impose.",
    closing: "Chaque rupture artistique de ce fil naît d'une nouvelle technique — perspective, éclairage, couleur pure, image en mouvement — autant que d'une nouvelle idée. L'art rupestre et le cinéma, séparés par trente-six mille ans, posent au fond la même question : comment fixer et transmettre ce que l'œil a vu.",
    notes: {
      chauvet: "Dans la grotte Chauvet, des artistes paléolithiques peignent chevaux et lions avec une maîtrise du mouvement qui bouscule l'idée d'un art humain d'abord rudimentaire.",
      renaiss: "En Italie, peintres et sculpteurs redécouvrent la perspective et l'anatomie antique, plaçant l'individu — et non plus seulement le sacré — au centre de la représentation.",
      baroque: "En réaction à la sobriété de la Renaissance tardive, le baroque déploie mouvement, contrastes de lumière et démesure, au service autant de la foi que du pouvoir princier.",
      impression: "En peignant la lumière changeante plutôt que le motif figé, les impressionnistes rompent avec l'atelier académique et ouvrent la voie à toutes les avant-gardes du XXe siècle.",
      cinema: "En capturant l'image en mouvement, le cinéma invente un art de synthèse qui absorbe théâtre, photographie et musique — le seul né entièrement d'une technologie moderne.",
    },
    links: { renaiss: ["baroque"], baroque: ["impression"], impression: ["cinema"] },
  },

  personnages: {
    intro: "Sept trajectoires individuelles suffisent à traverser deux mille trois cents ans d'histoire : un conquérant, un dictateur devenu dieu vivant, un artiste-ingénieur, un empereur, deux savants et un résistant non-violent. Chacun a, à sa manière, déplacé la limite de ce qu'un seul homme pouvait changer.",
    closing: "Ce qui relie ces sept vies si différentes, c'est moins leur domaine — guerre, art, science, politique — que leur capacité à faire converger sur un seul nom l'énergie de toute une époque. Certains ont changé des frontières, d'autres notre vision du monde ; tous ont laissé un héritage qui leur survit largement.",
    notes: {
      alex: "En treize ans à peine, Alexandre le Grand conquiert un empire de la Grèce à l'Inde et diffuse la culture hellénistique sur trois continents avant de mourir à 32 ans.",
      cesar: "Général et homme politique, Jules César concentre les pouvoirs de la République romaine jusqu'à son assassinat aux Ides de Mars, précipitant la naissance de l'Empire.",
      leon: "Peintre de la Joconde, ingénieur et anatomiste, Léonard de Vinci incarne l'esprit de la Renaissance en refusant toute frontière entre art et science.",
      napoleon: "Général puis empereur des Français, Napoléon Bonaparte impose le Code civil à une large part de l'Europe avant que ses guerres n'entraînent sa propre chute.",
      darwin2: "Naturaliste discret, Charles Darwin met vingt ans à formuler la sélection naturelle avant de publier L'Origine des espèces, bouleversant la biologie et la place de l'homme dans la nature.",
      einstein2: "Physicien réfugié puis figure publique, Albert Einstein redéfinit espace, temps et énergie tout en devenant, malgré lui, le symbole populaire du génie scientifique.",
      gandhi: "En opposant la résistance non-violente à l'Empire britannique, Gandhi obtient l'indépendance de l'Inde et inspire directement les mouvements pour les droits civiques du XXe siècle.",
    },
    links: { alex: ["cesar"], cesar: ["napoleon"], darwin2: ["einstein2"] },
  },
};
