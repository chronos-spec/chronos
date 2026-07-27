// ══════════════════════════════════════════════════════════════════════════
// ÉVÉNEMENTS BIBLIQUES — Ancien et Nouveau Testament
// ──────────────────────────────────────────────────────────────────────────
// Dates : la chronologie biblique traditionnelle quand le texte permet de la
// calculer (ex. calcul de l'archevêque Ussher, 1650, pour les origines ; les
// « 480 ans » de 1 Rois 6:1 pour l'Exode), sinon la date la plus communément
// retenue par les historiens et archéologues.
//
// Chaque événement porte un verdict d'historicité explicite :
//  - historique   : solidement corroboré par des sources externes (archives,
//                   archéologie, auteurs non bibliques).
//  - probable     : plausible et partiellement recoupé, sans preuve directe.
//  - debattu      : la recherche reste divisée, faute de preuve tranchante.
//  - legendaire   : récit traditionnel, souvent apparenté à des motifs
//                   narratifs connus ailleurs dans le Proche-Orient ancien ;
//                   sans corroboration externe.
//  - theologique  : affirmation de foi (miracle, révélation, résurrection...)
//                   qui échappe par nature à la méthode historique — elle
//                   n'est ni prouvée ni réfutée par elle, elle lui est
//                   extérieure.
// ══════════════════════════════════════════════════════════════════════════

const TIER = {
  historique:  { label:"Historiquement confirmé",                bg:"rgba(10,120,72,.10)",  border:"rgba(10,120,72,.38)",  color:"#0a7848" },
  probable:    { label:"Probable / partiellement confirmé",      bg:"rgba(8,104,168,.10)",  border:"rgba(8,104,168,.38)",  color:"#0868a8" },
  debattu:     { label:"Débattu / incertain",                     bg:"rgba(185,130,47,.14)", border:"rgba(185,130,47,.42)", color:"#8a5f1d" },
  legendaire:  { label:"Légendaire / récit traditionnel",         bg:"rgba(107,114,128,.14)",border:"rgba(107,114,128,.42)",color:"#4b5563" },
  theologique: { label:"Théologique — hors du champ historique",  bg:"rgba(124,58,237,.10)", border:"rgba(124,58,237,.38)", color:"#6d28d9" },
};

function badge(tier) {
  const t = TIER[tier];
  return `<div style="display:inline-block;padding:5px 13px;border-radius:999px;background:${t.bg};border:1px solid ${t.border};color:${t.color};font-size:11.5px;font-weight:700;letter-spacing:.02em;margin-bottom:16px;">${t.label}</div>`;
}

function content({ tier, ref, recit, histoire, savoir }) {
  return `${badge(tier)}`
    + `<h3>📖 Récit biblique</h3><p><em>${ref}</em> — ${recit}</p>`
    + `<h3>🔍 Regard historique</h3><p>${histoire}</p>`
    + (savoir ? `<h3>Le saviez-vous ?</h3><p>${savoir}</p>` : "");
}

// ── ANCIEN TESTAMENT ─────────────────────────────────────────────────────
const AT = [
  {
    id:"bib01", yearsAgo:6029, title:"Création du monde", date_label:"~4004 av. J.-C. (calcul d'Ussher, 1650)",
    desc:"Dieu crée le ciel, la terre et toute vie en six jours, puis se repose le septième.", importance:1, tier:"theologique",
    ref:"Genèse 1–2",
    recit:"En six jours, Dieu sépare la lumière des ténèbres, les eaux du ciel, crée la terre ferme, les astres, les végétaux, les animaux, puis l'être humain « à son image ». Le septième jour, il se repose — origine du sabbat.",
    histoire:"Ce récit n'est pas un compte-rendu historique mais un texte fondateur théologique, composé (dans sa forme actuelle) vers le VI<sup>e</sup>-V<sup>e</sup> siècle av. J.-C. Il partage sa structure avec d'autres cosmogonies mésopotamiennes (l'<em>Enûma Elish</em> babylonien) tout en s'en démarquant par son monothéisme. La science (Big Bang il y a 13,8 Ga, évolution du vivant sur ~3,5 Ga) décrit un tout autre déroulé et une tout autre échelle de temps ; les deux lectures — théologique et scientifique — répondent à des questions différentes (« pourquoi » contre « comment »).",
    savoir:"La date de 4004 av. J.-C. vient d'un calcul de l'archevêque irlandais James Ussher, qui additionna les généalogies bibliques en 1650. Elle n'a aucune valeur scientifique mais reste une référence culturelle du « jeune-terrisme » (young earth creationism)."
  },
  {
    id:"bib02", yearsAgo:6025, title:"Adam et Ève, le jardin d'Éden", date_label:"~4004 av. J.-C. (chronologie traditionnelle)",
    desc:"Le premier couple humain, créé à l'image de Dieu, est chassé du jardin après avoir désobéi.", importance:2, tier:"theologique",
    ref:"Genèse 2–3",
    recit:"Dieu façonne Adam de la poussière puis Ève d'une côte d'Adam. Le couple vit au jardin d'Éden jusqu'à ce qu'il mange le fruit défendu de l'arbre de la connaissance, tentés par le serpent. Ils sont alors expulsés du jardin, condamnés au travail, à la douleur et à la mort.",
    histoire:"Aucune trace archéologique d'un « premier couple » ni d'un jardin d'Éden localisable n'existe — et n'est attendue : le récit est un mythe étiologique, expliquant l'origine du mal, du travail pénible et de la mortalité humaine, un genre littéraire commun dans l'Antiquité proche-orientale. La génétique des populations (étude de l'ADN humain moderne) est catégorique : l'espèce humaine n'est jamais passée par un goulot d'étranglement de seulement deux individus.",
    savoir:"Le nom « Ève » (Hava en hébreu) signifie « celle qui donne la vie ». Le concept chrétien de « péché originel » transmis par ce couple à toute l'humanité est une interprétation théologique développée surtout par saint Augustin au IV<sup>e</sup>-V<sup>e</sup> siècle, bien après la rédaction du texte."
  },
  {
    id:"bib03", yearsAgo:4373, title:"Le Déluge et l'arche de Noé", date_label:"~2348 av. J.-C. (chronologie d'Ussher)",
    desc:"Dieu envoie un déluge universel ; seuls Noé, sa famille et un couple de chaque espèce survivent dans l'arche.", importance:1, tier:"legendaire",
    ref:"Genèse 6–9",
    recit:"Devant la corruption des hommes, Dieu décide d'effacer toute vie par un déluge de quarante jours et quarante nuits. Il épargne Noé, « homme juste », qui construit une arche géante et y embarque sa famille et des couples de chaque espèce animale. Après la décrue, un arc-en-ciel scelle l'alliance divine de ne plus jamais détruire la terre par les eaux.",
    histoire:"Aucune preuve géologique d'un déluge planétaire simultané n'existe. En revanche, le récit partage une structure quasi identique avec des mythes mésopotamiens bien plus anciens — l'<em>Épopée de Gilgamesh</em> (Utnapishtim) et le mythe d'<em>Atrahasis</em> — probablement des sources communes ou une influence directe. Des inondations locales catastrophiques du Tigre, de l'Euphrate ou de la mer Noire ont pu nourrir ce type de récit, sans qu'aucune ne corresponde à un déluge universel.",
    savoir:"L'arche décrite (environ 137 m de long selon les mesures bibliques) serait, à l'échelle, l'un des plus grands navires en bois jamais conçus — comparable aux plus grands clippers du XIX<sup>e</sup> siècle, construits avec des techniques d'ingénierie navale bien plus avancées."
  },
  {
    id:"bib04", yearsAgo:4267, title:"La tour de Babel", date_label:"~2247 av. J.-C. (chronologie traditionnelle)",
    desc:"Les hommes veulent bâtir une tour jusqu'au ciel ; Dieu confond leurs langues et les disperse.", importance:2, tier:"legendaire",
    ref:"Genèse 11:1-9",
    recit:"Après le Déluge, l'humanité unie parle une seule langue et entreprend de bâtir une ville et une tour « dont le sommet touche le ciel ». Dieu, pour contrecarrer cette ambition, brouille leur langage — ils ne se comprennent plus — et les disperse sur toute la terre.",
    histoire:"C'est un mythe étiologique classique : il explique après-coup la diversité des langues humaines, un phénomène que l'on sait aujourd'hui résulter de dizaines de milliers d'années de divergence linguistique naturelle, sans événement unique. La tour évoque probablement les ziggourats mésopotamiennes réelles (comme celle d'Étemenanki à Babylone), dont la construction et l'abandon partiel ont pu inspirer le récit — mais aucune tour n'a jamais littéralement « touché le ciel » ni provoqué de confusion linguistique soudaine.",
    savoir:"« Babel » joue sur un mot hébreu proche de « confusion » (balal), alors que le nom babylonien Bab-ilu signifiait en réalité « porte du dieu ». Le jeu de mots est une étymologie populaire, pas une origine linguistique réelle."
  },
  {
    id:"bib05", yearsAgo:3925, title:"Abraham et l'alliance", date_label:"~1900 av. J.-C. (fourchette usuelle : 2000-1800 av. J.-C.)",
    desc:"Abraham quitte Ur pour Canaan, appelé par Dieu, qui lui promet une descendance et une terre.", importance:1, tier:"debattu",
    ref:"Genèse 12–17",
    recit:"Dieu appelle Abram (bientôt renommé Abraham) à quitter Ur en Chaldée pour un pays inconnu, lui promettant une descendance aussi nombreuse que les étoiles et le pays de Canaan pour ses héritiers. Cette promesse — l'Alliance — est scellée par la circoncision de tous les mâles de sa maison.",
    histoire:"Aucune trace archéologique ou textuelle extérieure ne confirme l'existence d'Abraham : ni inscription, ni mention dans les archives des empires contemporains, pourtant abondantes. Les détails du récit (chameaux domestiqués, noms de peuples, structures politiques) correspondent souvent mieux au premier millénaire av. J.-C. qu'au IIe millénaire supposé, ce qui suggère une rédaction — ou une réécriture majeure — bien postérieure aux faits qu'elle raconte. La majorité des historiens contemporains considèrent Abraham comme une figure semi-légendaire, ancêtre éponyme et théologique plutôt qu'un individu historiquement documentable.",
    savoir:"Abraham est vénéré comme patriarche fondateur par les trois grandes religions monothéistes — judaïsme, christianisme et islam — qui se réclament toutes de son alliance avec Dieu, directement ou via son fils Ismaël."
  },
  {
    id:"bib06", yearsAgo:3895, title:"Le sacrifice d'Isaac", date_label:"~1870 av. J.-C. (chronologie traditionnelle)",
    desc:"Dieu demande à Abraham de sacrifier son fils Isaac, puis retient son geste au dernier instant.", importance:2, tier:"theologique",
    ref:"Genèse 22",
    recit:"Pour éprouver la foi d'Abraham, Dieu lui ordonne de sacrifier son fils unique Isaac sur le mont Moriah. Abraham obéit jusqu'à lever le couteau ; un ange l'arrête alors, et un bélier pris dans un buisson est sacrifié à la place d'Isaac.",
    histoire:"Récit théologique par excellence — la « Akedah » (ligature) — destiné à illustrer la foi absolue et à marquer, en creux, le rejet du sacrifice humain pratiqué par d'autres cultes du Proche-Orient ancien au profit du sacrifice animal. Il ne prétend pas relater un fait vérifiable et s'inscrit dans le récit plus large d'Abraham, dont l'historicité elle-même reste débattue.",
    savoir:"Le mont Moriah est traditionnellement identifié à l'esplanade du Temple de Jérusalem, faisant de ce récit un texte fondateur pour les trois religions abrahamiques — dans la tradition musulmane, c'est Ismaël, et non Isaac, qui est visé par le sacrifice."
  },
  {
    id:"bib07", yearsAgo:3725, title:"Joseph vendu en Égypte", date_label:"~1700 av. J.-C. (chronologie traditionnelle)",
    desc:"Vendu par ses frères jaloux, Joseph devient vizir d'Égypte et sauve sa famille de la famine.", importance:2, tier:"legendaire",
    ref:"Genèse 37–50",
    recit:"Jalousés à cause de la tunique multicolore que lui offre son père Jacob et de ses rêves prophétiques, les frères de Joseph le vendent à des marchands. Réduit en esclavage en Égypte, il finit par interpréter les rêves de Pharaon, prédit sept années de famine, et devient le second personnage du royaume — sauvant sa famille venue chercher du grain.",
    histoire:"Aucune source égyptienne ne mentionne de vizir sémite nommé Joseph, alors que l'administration égyptienne antique était particulièrement bien documentée. Le récit contient des éléments égyptiens plausibles (titres, coutumes funéraires) qui montrent une connaissance réelle de l'Égypte, mais le schéma narratif — l'étranger humble devenu premier ministre grâce à l'interprétation des rêves — est un motif littéraire répandu dans l'Antiquité. La présence de communautés sémites en Égypte (attestée par ailleurs, notamment les Hyksôs) rend le cadre plausible sans confirmer l'histoire précise.",
    savoir:"Le nom égyptien donné à Joseph dans le texte, Tsaphnath-Paenéach, est un véritable titre égyptien authentique — signe que l'auteur biblique connaissait bien la culture égyptienne, qu'il ait ou non relaté un fait réel."
  },
  {
    id:"bib08", yearsAgo:3550, title:"Naissance de Moïse", date_label:"~1526 av. J.-C. (chronologie traditionnelle)",
    desc:"Sauvé des eaux du Nil enfant, Moïse est élevé à la cour de Pharaon avant de fuir en Madiân.", importance:1, tier:"legendaire",
    ref:"Exode 2",
    recit:"Pharaon ordonne de tuer tous les nouveau-nés hébreux. La mère de Moïse le dépose dans un panier sur le Nil ; la fille de Pharaon le recueille et l'élève au palais. Devenu adulte, Moïse tue un contremaître égyptien battant un esclave hébreu et doit fuir au désert de Madiân.",
    histoire:"Le motif de « l'enfant sauvé des eaux, destiné à un grand destin » est un schéma narratif très ancien et répandu — on le retrouve presque à l'identique dans la légende de Sargon d'Akkad (roi mésopotamien du XXIIIe siècle av. J.-C., déposé enfant dans un panier sur l'Euphrate). Cette ressemblance frappante suggère un emprunt littéraire plutôt qu'un fait vérifiable. Aucune trace égyptienne d'un décret de génocide des nouveau-nés hébreux n'a été retrouvée.",
    savoir:"Le nom « Moïse » (Moshè) est rapproché en hébreu du verbe « tirer (des eaux) », mais il dérive plus probablement de la racine égyptienne <em>mose</em> (« né de », que l'on retrouve dans Thoutmôsis ou Ramsès) — cohérent avec un cadre égyptien authentique."
  },
  {
    id:"bib09", yearsAgo:3471, related:["bib10"], uncertain:[3471,3275], title:"L'Exode et les dix plaies d'Égypte", date_label:"~1446 av. J.-C. (calcul de 1 Rois 6:1) ou ~1250 av. J.-C. (hypothèse « Ramsès »)",
    desc:"Moïse réclame la libération des Hébreux ; dix plaies frappent l'Égypte jusqu'au départ du peuple.", importance:1, tier:"debattu",
    ref:"Exode 7–14",
    recit:"Moïse et son frère Aaron exigent de Pharaon qu'il laisse partir le peuple hébreu asservi. Devant son refus, dix plaies s'abattent sur l'Égypte — sang, grenouilles, moustiques, mort des premiers-nés... Pharaon finit par céder, puis change d'avis et poursuit les Hébreux ; la mer Rouge s'ouvre pour laisser passer le peuple et se referme sur l'armée égyptienne.",
    histoire:"C'est l'un des débats les plus vifs de l'archéologie biblique. Aucun document égyptien — pourtant abondant sur cette période — ne mentionne la présence d'esclaves hébreux en masse, dix plaies ni la perte d'une armée entière en mer Rouge. Les fouilles dans le Sinaï n'ont livré aucune trace d'un campement de centaines de milliers de personnes pendant 40 ans. Deux datations bibliques concurrentes existent (1446 av. J.-C. selon 1 Rois 6:1, ou vers 1250 av. J.-C. sous Ramsès II, mentionné en Exode 1:11), sans qu'aucune ne soit confirmée archéologiquement. Une minorité d'égyptologues et d'archéologues bibliques défend un noyau historique — une migration ou une fuite de moindre ampleur, amplifiée avec le temps — tandis qu'une majorité y voit une épopée fondatrice nationale, composée bien après les faits pour souder l'identité israélite.",
    savoir:"Le Papyrus Ipuwer, parfois cité comme preuve « externe » des plaies, date en réalité de plusieurs siècles avant la période supposée de l'Exode et décrit un chaos social générique, sans lien démontré avec le récit biblique."
  },
  {
    id:"bib10", yearsAgo:3471, related:["bib09","bib11"], uncertain:[3471,3275], title:"Les Dix Commandements au Sinaï", date_label:"~1446 av. J.-C. (chronologie traditionnelle, peu après l'Exode)",
    desc:"Dieu remet à Moïse les Dix Commandements gravés sur des tables de pierre, au sommet du Sinaï.", importance:1, tier:"theologique",
    ref:"Exode 19–20",
    recit:"Trois mois après la sortie d'Égypte, le peuple campe au pied du mont Sinaï. Moïse y monte seul et reçoit de Dieu, dans le tonnerre et la fumée, les Dix Commandements gravés sur deux tables de pierre, fondement de l'Alliance entre Dieu et Israël.",
    histoire:"La remise d'une loi divine sur une montagne est, par nature, un événement de révélation théologique et non un fait vérifiable par la méthode historique — comme pour l'Exode dont il partage le cadre débattu. Le contenu même des Dix Commandements (interdits du meurtre, du vol, du faux témoignage) recoupe cependant des principes juridiques et moraux attestés dans d'autres codes du Proche-Orient ancien, comme le Code de Hammurabi (XVIIIe siècle av. J.-C.), signe d'un terreau culturel commun.",
    savoir:"La localisation exacte du « mont Sinaï » biblique reste débattue : la tradition chrétienne l'identifie depuis le IVe siècle au Djebel Moussa, dans le Sinaï égyptien actuel, mais rien dans le texte ne permet de le confirmer avec certitude."
  },
  {
    id:"bib11", yearsAgo:3431, related:["bib10"], uncertain:[3431,3225], title:"Josué et la bataille de Jéricho", date_label:"~1406 av. J.-C. (chronologie traditionnelle) ou ~1200 av. J.-C. (hypothèse basse)",
    desc:"Les murailles de Jéricho s'effondrent après que les Hébreux en ont fait le tour sept fois.", importance:2, tier:"legendaire",
    ref:"Josué 6",
    recit:"Après la mort de Moïse, Josué mène les Hébreux à la conquête de Canaan. À Jéricho, sur ordre divin, l'armée fait le tour de la ville pendant six jours, puis sept fois le septième jour, au son des trompettes de bélier. Les murailles s'effondrent alors miraculeusement, livrant la ville.",
    histoire:"Les fouilles archéologiques de Jéricho (notamment celles de Kathleen Kenyon dans les années 1950) montrent que la ville était probablement abandonnée ou très peu peuplée aux deux dates possibles de la conquête (~1400 ou ~1200 av. J.-C.) : ses fortifications majeures dataient d'un effondrement bien antérieur, vers 1550 av. J.-C. Plus largement, l'archéologie du Levant ne montre pas de conquête militaire massive et rapide de Canaan à cette époque, mais plutôt une émergence progressive et largement pacifique de communautés israélites locales — un scénario aujourd'hui privilégié par la majorité des archéologues bibliques, très différent du récit du livre de Josué.",
    savoir:"« Faire tomber les murs de Jéricho » est devenu une expression courante pour désigner la chute d'un obstacle apparemment infranchissable — bien au-delà du cercle biblique."
  },
  {
    id:"bib12", yearsAgo:3100, title:"Samson et Dalila", date_label:"~1075 av. J.-C. (période des Juges)",
    desc:"Le juge Samson, doué d'une force surhumaine liée à ses cheveux, est trahi par Dalila.", importance:3, tier:"legendaire",
    ref:"Juges 13–16",
    recit:"Consacré à Dieu dès sa naissance (nazir), Samson tire sa force herculéenne de ses cheveux jamais coupés. Amoureux de la Philistine Dalila, il finit par lui révéler ce secret ; elle le fait tondre pendant son sommeil et le livre aux Philistins, qui l'aveuglent. Enchaîné entre deux colonnes du temple de Dagon, il retrouve assez de force dans une dernière prière pour faire écrouler l'édifice, périssant avec ses ennemis.",
    histoire:"Aucune trace archéologique ou textuelle externe ne confirme l'existence de Samson. Le récit relève du cycle des « Juges », des héros charismatiques régionaux dans un cadre historique flou (vers 1200-1050 av. J.-C.), mêlé de motifs folkloriques classiques — force surhumaine, trahison amoureuse, secret fatal — comparables à d'autres traditions héroïques du bassin méditerranéen. Le conflit israélito-philistin qu'il illustre est, lui, bien réel et documenté archéologiquement.",
    savoir:"« Un colosse aux pieds d'argile » ou perdre sa force en perdant ses cheveux : l'image de Samson a nourri l'expression populaire de la faiblesse cachée derrière une force apparente, jusque dans le vocabulaire courant."
  },
  {
    id:"bib13", yearsAgo:3075, title:"Samuel et l'onction de Saül", date_label:"~1050 av. J.-C.",
    desc:"Le prophète Samuel oint Saül, qui devient le premier roi d'Israël, sous la pression populaire.", importance:2, tier:"debattu",
    ref:"1 Samuel 8–10",
    recit:"Le peuple d'Israël, jusque-là dirigé par des juges, réclame un roi « comme toutes les nations ». Dieu, par la voix du prophète Samuel, met en garde contre les abus de la royauté, mais cède : Samuel oint Saül, un jeune homme de la tribu de Benjamin, qui devient le premier roi d'Israël.",
    histoire:"La transition d'une confédération tribale à une monarchie unifiée est plausible dans le contexte du Levant du XIe siècle av. J.-C., période de pressions militaires (notamment philistines) favorisant une centralisation du pouvoir. Aucune inscription contemporaine ne mentionne Saül directement, et l'étendue réelle de son « royaume » — probablement une chefferie régionale plus modeste que le récit biblique ne le suggère — reste débattue parmi les archéologues.",
    savoir:"Le nom « Saül » signifie en hébreu « demandé » (à Dieu) — un jeu sur le fait que c'est le peuple qui a réclamé, contre l'avis initial de Dieu, l'instauration de la royauté."
  },
  {
    id:"bib14", yearsAgo:3045, title:"David et Goliath", date_label:"~1020 av. J.-C.",
    desc:"Le jeune berger David terrasse le géant philistin Goliath d'une fronde, face aux armées rassemblées.", importance:1, tier:"legendaire",
    ref:"1 Samuel 17",
    recit:"Alors que les armées d'Israël et des Philistins se font face, le géant philistin Goliath défie tout champion israélite en combat singulier. Le jeune berger David, refusant l'armure de Saül, l'affronte armé d'une simple fronde et de cinq pierres lisses, et le tue d'un projectile en plein front.",
    histoire:"Le duel de champions est une pratique de guerre antique attestée ailleurs dans le Proche-Orient et le monde grec — le cadre général est donc plausible. Mais le récit précis (la taille extraordinaire de Goliath, variant même d'un manuscrit biblique à l'autre) porte les marques d'une élaboration littéraire et légendaire postérieure, destinée à magnifier la jeunesse de David avant son accession au trône. Un passage plus tardif (2 Samuel 21:19) attribue d'ailleurs la mort de Goliath à un autre guerrier, Elhanân — signe probable d'un transfert de récit vers la figure plus prestigieuse de David.",
    savoir:"L'expression « combat de David contre Goliath » est passée dans le langage courant pour désigner tout affrontement où le plus faible en apparence l'emporte sur un adversaire bien plus puissant."
  },
  {
    id:"bib15", yearsAgo:3028, title:"Le règne de David et la prise de Jérusalem", date_label:"~1003 av. J.-C.",
    desc:"David devient roi d'Israël unifié et fait de Jérusalem, ville jébuséenne conquise, sa capitale.", importance:1, tier:"probable",
    ref:"2 Samuel 5",
    recit:"Après la mort de Saül, David est sacré roi sur tout Israël. Il s'empare de la forteresse jébuséenne de Jérusalem — jusque-là restée hors de portée israélite — par une ruse impliquant le canal d'eau de la ville, et en fait sa capitale politique et religieuse, y transférant l'Arche d'alliance.",
    histoire:"L'existence de David comme fondateur d'une dynastie est aujourd'hui largement admise par les historiens depuis la découverte en 1993 de la stèle de Tel Dan, une inscription araméenne du IXe siècle av. J.-C. mentionnant la « Maison de David » — la première attestation extra-biblique de son nom. En revanche, l'ampleur de son royaume telle que la Bible la décrit (un empire unifié dominant toute la région) est jugée exagérée par de nombreux archéologues : les vestiges de Jérusalem à cette période suggèrent une ville-État modeste plutôt qu'une capitale impériale.",
    savoir:"La stèle de Tel Dan, brisée en plusieurs fragments retrouvés entre 1993 et 1994 dans le nord d'Israël, est encore aujourd'hui la seule mention connue de David en dehors de la Bible et des textes qui en dépendent."
  },
  {
    id:"bib16", yearsAgo:2991, related:["bib17","bib20"], uncertain:[2991,2875], title:"Salomon et la construction du Temple", date_label:"~966 av. J.-C. (4e année du règne de Salomon)",
    desc:"Le roi Salomon, réputé pour sa sagesse, fait construire le premier Temple de Jérusalem.", importance:1, tier:"debattu",
    ref:"1 Rois 5–8",
    recit:"Fils et successeur de David, Salomon est réputé pour sa sagesse proverbiale (le jugement du partage de l'enfant, 1 Rois 3) et sa richesse extraordinaire. Il fait construire à Jérusalem, avec l'aide du roi Hiram de Tyr, un Temple somptueux destiné à abriter l'Arche d'alliance — cœur du culte israélite pour près de quatre siècles.",
    histoire:"Le Temple de Salomon lui-même ne peut être fouillé — le site (l'actuelle esplanade des Mosquées) est inaccessible à l'archéologie pour des raisons religieuses et politiques. Des structures monumentales datées traditionnellement du règne de Salomon (portes de Megiddo, Hazor et Guézer) sont attribuées par certains archéologues à cette période, mais l'égyptologue et archéologue Israël Finkelstein propose une « chronologie basse » qui les daterait plutôt du siècle suivant, sous la dynastie des Omrides en Israël du Nord — ce qui minimiserait fortement la grandeur réelle du royaume de Salomon décrite par la Bible.",
    savoir:"La légende de la reine de Saba venant éprouver la sagesse de Salomon (1 Rois 10) a inspiré d'immenses traditions parallèles, notamment en Éthiopie, où la dynastie royale a longtemps revendiqué une descendance directe de leur union."
  },
  {
    id:"bib17", yearsAgo:2956, related:["bib16","bib19"], title:"Le schisme du royaume d'Israël", date_label:"~931 av. J.-C.",
    desc:"À la mort de Salomon, le royaume se scinde en deux : Israël au nord, Juda au sud.", importance:2, tier:"historique",
    ref:"1 Rois 12",
    recit:"À la mort de Salomon, son fils Roboam refuse d'alléger les charges fiscales imposées au peuple. Dix tribus du nord se révoltent, font sécession sous Jéroboam et fondent le royaume d'Israël, tandis que Roboam ne conserve que Juda et Benjamin au sud, autour de Jérusalem.",
    histoire:"L'existence de deux royaumes distincts, Israël (capitale Samarie) et Juda (capitale Jérusalem), coexistant du Xe au VIIIe siècle av. J.-C., est solidement établie par de nombreuses sources externes convergentes : inscriptions assyriennes, moabites (stèle de Mesha) et égyptiennes mentionnant l'un ou l'autre royaume, ainsi qu'une abondante archéologie régionale distincte pour chacun.",
    savoir:"Le royaume du Nord, Israël, était en réalité plus riche et plus peuplé que Juda à son apogée — c'est pourtant le récit biblique, rédigé du point de vue de Juda, qui a façonné la mémoire de cette période pour la postérité."
  },
  {
    id:"bib18", yearsAgo:2885, title:"Élie et les prophètes de Baal", date_label:"~860 av. J.-C. (règne d'Achab)",
    desc:"Le prophète Élie défie 450 prophètes de Baal sur le mont Carmel dans un duel de sacrifices.", importance:2, tier:"theologique",
    ref:"1 Rois 18",
    recit:"Face à l'introduction du culte de Baal par la reine Jézabel, le prophète Élie défie 450 prophètes de ce dieu sur le mont Carmel : chaque camp prépare un sacrifice, et le dieu qui répond par le feu sera reconnu comme le vrai Dieu. Baal reste silencieux malgré les invocations frénétiques de ses prophètes ; le feu de Yahvé consume instantanément l'offrande d'Élie, trempée d'eau.",
    histoire:"Le royaume d'Achab et l'existence d'un conflit religieux réel entre yahvisme et cultes cananéens (dont celui de Baal) sont bien documentés par ailleurs — Achab est mentionné dans les annales assyriennes de Salmanazar III. L'épisode précis du duel miraculeux du Carmel, en revanche, relève du récit théologique destiné à affirmer la supériorité exclusive de Yahvé, un genre littéraire polémique fréquent dans la littérature prophétique de l'époque.",
    savoir:"Le mont Carmel, site du défi, est aujourd'hui encore un lieu de pèlerinage ; un monastère carmélite y commémore la tradition d'Élie, considéré comme le père spirituel de cet ordre religieux fondé bien plus tard, au XIIe siècle."
  },
  {
    id:"bib19", yearsAgo:2747, related:["bib17"], title:"La chute de Samarie et l'exil d'Israël", date_label:"722 av. J.-C.",
    desc:"L'Empire assyrien détruit Samarie et déporte les tribus du royaume d'Israël — les « tribus perdues ».", importance:1, tier:"historique",
    ref:"2 Rois 17",
    recit:"Après un siège de trois ans, le roi assyrien Sargon II s'empare de Samarie, capitale du royaume d'Israël, et déporte une large partie de sa population vers d'autres régions de l'empire, tandis que des populations étrangères sont installées à sa place. Le texte biblique interprète cette catastrophe comme le châtiment de l'infidélité d'Israël envers Dieu.",
    histoire:"Cet événement est l'un des mieux corroborés de toute la Bible hébraïque : les propres annales du roi Sargon II d'Assyrie, retrouvées dans son palais de Khorsabad, revendiquent explicitement la déportation de « 27 290 » habitants de Samarie. C'est un rare cas de convergence quasi parfaite entre source biblique et source royale étrangère contemporaine.",
    savoir:"La légende des « dix tribus perdues d'Israël », dispersées et jamais retrouvées après cette déportation, a inspiré d'innombrables théories — parfois farfelues — cherchant à leur attribuer une descendance dans des peuples aussi variés que les Pachtounes, les Japonais ou les Amérindiens."
  },
  {
    id:"bib20", yearsAgo:2611, related:["bib16","bib22"], title:"La chute de Jérusalem et l'exil à Babylone", date_label:"586 av. J.-C.",
    desc:"Nabuchodonosor II détruit Jérusalem et son Temple, déportant l'élite de Juda à Babylone.", importance:1, tier:"historique",
    ref:"2 Rois 25",
    recit:"Après plusieurs rébellions de Juda, le roi babylonien Nabuchodonosor II assiège et détruit Jérusalem, rase le Temple de Salomon et déporte une grande partie de l'élite politique, religieuse et intellectuelle à Babylone. C'est le début de l'Exil, période de deuil et de profonde réflexion théologique qui façonnera une large partie de la Bible hébraïque telle que nous la connaissons.",
    histoire:"Cet épisode figure parmi les mieux documentés de l'histoire ancienne : les Chroniques babyloniennes (tablettes cunéiformes conservées au British Museum) confirment les campagnes de Nabuchodonosor contre Juda, et l'archéologie de Jérusalem montre une destruction massive et une rupture nette de l'occupation datée précisément de cette période.",
    savoir:"C'est pendant cet exil que naît la synagogue comme lieu de prière sans sacrifice, et que se cristallise une identité juive capable de survivre sans Temple ni terre — une transformation religieuse dont les effets se prolongent jusqu'à aujourd'hui."
  },
  {
    id:"bib21", yearsAgo:2563, title:"Daniel dans la fosse aux lions", date_label:"~538 av. J.-C. (sous « Darius le Mède »)",
    desc:"Jeté aux lions pour avoir prié malgré l'interdit royal, Daniel en ressort indemne au matin.", importance:2, tier:"legendaire",
    ref:"Daniel 6",
    recit:"Sous le règne de « Darius le Mède », des courtisans jaloux font promulguer un décret interdisant toute prière adressée à un dieu autre que le roi. Daniel, haut fonctionnaire juif fidèle à Yahvé, continue de prier ouvertement et est jeté dans la fosse aux lions en punition. Au matin, il en ressort miraculeusement indemne, un ange ayant fermé la gueule des fauves.",
    histoire:"Le personnage de « Darius le Mède », roi qui succéderait à Babylone juste avant Cyrus le Grand, ne correspond à aucun souverain connu par les sources historiques et archéologiques de la période — c'est l'une des difficultés historiques majeures du livre de Daniel. La plupart des historiens datent d'ailleurs la rédaction finale du livre bien plus tard, au IIe siècle av. J.-C. (période des Maccabées), comme un récit édifiant destiné à encourager la résistance à la persécution religieuse, plutôt que comme un compte-rendu contemporain des événements perses.",
    savoir:"Le livre de Daniel est en partie rédigé en araméen et non en hébreu — un indice supplémentaire, avec son style littéraire, qui pousse les spécialistes à situer sa composition plusieurs siècles après les événements qu'il prétend rapporter."
  },
  {
    id:"bib22", yearsAgo:2563, related:["bib20","bib23"], title:"L'édit de Cyrus et le retour d'exil", date_label:"538 av. J.-C.",
    desc:"Le roi perse Cyrus le Grand autorise les Juifs exilés à rentrer à Jérusalem et à reconstruire le Temple.", importance:1, tier:"historique",
    ref:"Esdras 1",
    recit:"Après avoir conquis Babylone, le roi perse Cyrus le Grand publie un édit autorisant tous les peuples déportés par les Babyloniens, dont les Juifs, à retourner dans leur pays d'origine et à y reconstruire leurs sanctuaires. Une partie des exilés juifs rentre alors à Jérusalem, emportant les objets sacrés du Temple emportés par Nabuchodonosor.",
    histoire:"Cet édit est remarquablement bien corroboré par une source externe majeure : le Cylindre de Cyrus, un artefact babylonien découvert en 1879 (aujourd'hui au British Museum), dans lequel Cyrus se présente comme un libérateur restaurant les cultes et rapatriant les peuples déportés — une politique impériale bien plus large que le seul cas juif, mais dont le principe recoupe exactement le récit biblique.",
    savoir:"Le Cylindre de Cyrus est parfois présenté, de façon anachronique, comme la « première déclaration des droits de l'homme » — une lecture moderne discutable d'un texte de propagande royale antique, mais qui témoigne de sa portée symbolique durable."
  },
  {
    id:"bib23", yearsAgo:2541, related:["bib22","bib37"], title:"La reconstruction du second Temple", date_label:"516 av. J.-C.",
    desc:"Le second Temple de Jérusalem est achevé, 70 ans après la destruction du premier.", importance:2, tier:"historique",
    ref:"Esdras 6",
    recit:"Malgré l'opposition de populations locales et des difficultés de financement, les Juifs rentrés d'exil achèvent la reconstruction du Temple de Jérusalem, sous l'impulsion des gouverneurs Zorobabel et des prophètes Aggée et Zacharie — accomplissant, selon le texte, la prophétie de Jérémie annonçant 70 ans d'exil.",
    histoire:"La reconstruction du second Temple est un fait bien établi par la convergence des textes bibliques (Esdras, Aggée, Zacharie) avec le contexte politique perse plus largement documenté par ailleurs. Ce second Temple, plus modeste que celui de Salomon selon la tradition, restera le centre du culte juif jusqu'à sa destruction par les Romains en 70 apr. J.-C. — Hérode le Grand l'agrandira considérablement à partir de 20 av. J.-C.",
    savoir:"Les anciens qui avaient connu le premier Temple pleurèrent, dit le texte, en voyant combien le second lui était inférieur en splendeur (Esdras 3:12) — un témoignage rare de déception collective consigné dans un texte religieux."
  },
  {
    id:"bib24", yearsAgo:2504, title:"Esther et le salut des Juifs de Perse", date_label:"~479 av. J.-C. (règne de Xerxès Ier / Assuérus)",
    desc:"La reine juive Esther déjoue le complot d'Haman visant à exterminer les Juifs de l'empire perse.", importance:2, tier:"legendaire",
    ref:"Livre d'Esther",
    recit:"Esther, jeune juive devenue reine de Perse sous le nom d'épouse du roi Assuérus (identifié à Xerxès Ier), dissimule d'abord son identité. Quand le vizir Haman obtient un décret d'extermination de tous les Juifs de l'empire, Esther intervient auprès du roi au péril de sa vie, fait échouer le complot et sauve son peuple — événement commémoré chaque année par la fête de Pourim.",
    histoire:"Aucune source perse ne mentionne de reine nommée Esther ni de projet d'extermination généralisée des Juifs sous Xerxès Ier, dont l'épouse connue par l'historien grec Hérodote se nommait Amestris. Le récit, riche en rebondissements de cour et en ironie dramatique, est aujourd'hui largement considéré par les spécialistes comme un roman historique édifiant plutôt qu'un compte-rendu factuel — sans que cela diminue son importance culturelle et festive dans le judaïsme.",
    savoir:"Le livre d'Esther est le seul livre de la Bible hébraïque qui ne mentionne jamais explicitement le nom de Dieu — une particularité littéraire qui a nourri des siècles de débats sur sa place dans le canon biblique."
  },
  {
    id:"bib25", yearsAgo:2192, related:["bib23"], title:"La révolte des Maccabées", date_label:"167 av. J.-C.",
    desc:"La famille des Maccabées mène une révolte victorieuse contre l'hellénisation forcée de la Judée.", importance:1, tier:"historique",
    ref:"1 Maccabées",
    recit:"Le roi séleucide Antiochos IV Épiphane interdit le culte juif et profane le Temple de Jérusalem en y dressant une statue de Zeus. Le prêtre Mattathias et ses fils, dont Judas surnommé « Maccabée » (le marteau), lèvent une révolte armée, reconquièrent Jérusalem et purifient le Temple — événement commémoré par la fête de Hanoucca.",
    histoire:"Cet épisode est l'un des mieux attestés de toute la littérature biblique et intertestamentaire, corroboré par de multiples sources convergentes : les livres des Maccabées eux-mêmes (rédigés proches des événements), l'historien juif Flavius Josèphe, et des sources grecques séleucides indépendantes. La révolte aboutit à la fondation de la dynastie hasmonéenne, qui gouvernera la Judée de façon indépendante jusqu'à la conquête romaine de 63 av. J.-C.",
    savoir:"La légende de la fiole d'huile ne devant durer qu'un jour mais ayant brûlé miraculeusement huit jours — origine de la durée de Hanoucca — n'apparaît pas dans les livres des Maccabées eux-mêmes mais seulement des siècles plus tard, dans le Talmud."
  },
];

// ── NOUVEAU TESTAMENT ────────────────────────────────────────────────────
const NT = [
  {
    id:"bib26", yearsAgo:2030, uncertain:[2031,2029], title:"La naissance de Jésus à Bethléem", date_label:"~6-4 av. J.-C.",
    desc:"Jésus naît à Bethléem, de Marie et Joseph, à l'occasion d'un recensement impérial.", importance:1, tier:"debattu",
    ref:"Matthieu 1–2, Luc 1–2",
    recit:"Marie, vierge fiancée à Joseph, conçoit Jésus par l'action de l'Esprit Saint, selon l'annonce de l'ange Gabriel. La naissance a lieu à Bethléem — Luc l'explique par un recensement impérial obligeant Joseph à s'y rendre — dans une étable, faute de place ailleurs. Des bergers puis des mages venus d'Orient, guidés par une étoile, viennent adorer l'enfant.",
    histoire:"L'existence historique de Jésus de Nazareth comme figure ayant réellement vécu au Ier siècle fait l'objet d'un consensus quasi unanime chez les historiens, y compris non chrétiens. Les circonstances précises de sa naissance sont en revanche débattues : le recensement de Quirinius évoqué par Luc (6 apr. J.-C.) est difficile à concilier avec le règne d'Hérode le Grand, mort en 4 av. J.-C., évoqué par Matthieu — un problème chronologique classique de l'exégèse historico-critique. La date de naissance est elle-même estimée a posteriori entre 6 et 4 av. J.-C., avant la mort d'Hérode.",
    savoir:"Le calendrier chrétien actuel, fixant l'an 1 à la naissance du Christ, fut calculé par le moine Denys le Petit en 525 apr. J.-C. — avec une erreur de calcul aujourd'hui bien identifiée, qui fait que Jésus serait, paradoxalement, né « avant Jésus-Christ »."
  },
  {
    id:"bib27", yearsAgo:2029, title:"Le massacre des Innocents", date_label:"~4 av. J.-C.",
    desc:"Hérode le Grand, craignant un rival, ordonne le massacre des enfants de moins de deux ans à Bethléem.", importance:2, tier:"legendaire",
    ref:"Matthieu 2:16-18",
    recit:"Averti par les mages qu'un « roi des Juifs » vient de naître, Hérode le Grand, craignant pour son trône, ordonne le massacre de tous les garçons de moins de deux ans à Bethléem et dans sa région. Joseph, prévenu en songe, fuit en Égypte avec Marie et l'enfant Jésus, échappant au massacre.",
    histoire:"Cet épisode n'est mentionné dans aucune autre source, ni chrétienne ni païenne — un silence frappant, notamment de la part de l'historien juif Flavius Josèphe, qui documente pourtant en détail, et avec beaucoup de sévérité, les nombreuses cruautés réelles d'Hérode (dont l'exécution de plusieurs de ses propres fils). La plupart des historiens y voient une construction théologique de Matthieu, destinée à faire écho au massacre des nouveau-nés hébreux par Pharaon (Exode) et à présenter Jésus comme un « nouveau Moïse » — plutôt qu'un événement réellement survenu, bien qu'Hérode fût effectivement capable d'une telle cruauté.",
    savoir:"Bethléem étant un village de quelques centaines d'habitants à l'époque, le nombre d'enfants tués aurait été, dans les faits, de l'ordre d'une dizaine — bien loin des « milliers d'innocents » de la tradition artistique postérieure."
  },
  {
    id:"bib28", yearsAgo:1997, related:["bib29"], title:"Le baptême de Jésus", date_label:"~28 apr. J.-C.",
    desc:"Jean-Baptiste baptise Jésus dans le Jourdain ; une voix céleste le proclame « Fils bien-aimé ».", importance:1, tier:"probable",
    ref:"Marc 1:9-11",
    recit:"Jean-Baptiste prêche un baptême de repentance dans le Jourdain. Jésus, alors âgé d'environ trente ans, se fait baptiser par lui ; les cieux s'ouvrent, l'Esprit descend « comme une colombe », et une voix proclame : « Tu es mon Fils bien-aimé ». Cet événement marque le début du ministère public de Jésus.",
    histoire:"L'existence de Jean-Baptiste comme prédicateur baptiseur ayant réellement rassemblé des foules dans le Jourdain est confirmée par une source non chrétienne indépendante et fiable : l'historien juif Flavius Josèphe (Antiquités judaïques, XVIII, 5, 2), qui relate aussi sa mise à mort par Hérode Antipas. Que Jésus ait été l'un de ses disciples ou proches, puis baptisé par lui, est jugé très probable par les historiens : ce fait est même considéré comme particulièrement fiable au nom du « critère de gêne » — les évangélistes n'auraient probablement pas inventé un épisode plaçant Jésus en position de subordonné face à Jean.",
    savoir:"Le « critère de gêne » est un outil classique de l'analyse historico-critique : un événement embarrassant pour la cause que défend un texte a plus de chances d'être authentique, car un auteur n'a normalement aucun intérêt à l'inventer."
  },
  {
    id:"bib29", yearsAgo:1995, related:["bib28","bib30"], uncertain:[1995,1992], title:"La crucifixion de Jésus", date_label:"~30 apr. J.-C. (ou 33 selon certaines chronologies)",
    desc:"Jésus est condamné par Ponce Pilate et crucifié à Jérusalem à l'occasion de la Pâque juive.", importance:1, tier:"historique",
    ref:"Marc 15, Matthieu 27, Luc 23, Jean 19",
    recit:"Arrêté après la Cène, jugé par le Sanhédrin puis livré au préfet romain Ponce Pilate, Jésus est condamné à la crucifixion — le supplice réservé aux esclaves et aux rebelles — sous l'accusation de se prétendre « roi des Juifs ». Il meurt sur la croix au mont du Golgotha, à l'occasion de la fête juive de la Pâque.",
    histoire:"La crucifixion de Jésus sous Ponce Pilate est l'un des faits les mieux établis de toute l'Antiquité concernant sa personne, corroboré par des sources non chrétiennes indépendantes : l'historien romain Tacite (Annales, XV, 44, vers 116 apr. J.-C.) mentionne explicitement que « Christus » fut exécuté sous Ponce Pilate ; Flavius Josèphe l'évoque également (Antiquités judaïques, XVIII, 3, 3, passage partiellement remanié par des copistes chrétiens mais dont le noyau est jugé authentique). L'existence même de Ponce Pilate comme préfet de Judée (26-36 apr. J.-C.) a été confirmée archéologiquement en 1961 par la découverte de la « Pierre de Pilate » à Césarée, portant son nom gravé.",
    savoir:"La Pierre de Pilate, découverte par des archéologues italiens, est aujourd'hui le seul artefact archéologique connu portant le nom de Ponce Pilate — elle est exposée au Musée d'Israël à Jérusalem, une réplique demeurant sur le site de Césarée."
  },
  {
    id:"bib30", yearsAgo:1995, related:["bib29","bib31"], uncertain:[1995,1992], title:"La résurrection", date_label:"~30 apr. J.-C., trois jours après la crucifixion",
    desc:"Selon les évangiles, Jésus ressuscite le troisième jour et apparaît à ses disciples.", importance:1, tier:"theologique",
    ref:"Matthieu 28, Marc 16, Luc 24, Jean 20",
    recit:"Le troisième jour après sa mort, des femmes venues embaumer le corps de Jésus trouvent le tombeau vide. Jésus ressuscité apparaît ensuite à plusieurs reprises à ses disciples, leur parle, mange avec eux, avant de « monter au ciel ». Cet événement fonde la proclamation chrétienne selon laquelle la mort a été vaincue.",
    histoire:"La résurrection est par définition une affirmation de foi, extérieure au champ que peut trancher la méthode historique, laquelle ne peut ni la prouver ni la réfuter — elle étudie des traces documentaires, non des événements surnaturels en tant que tels. Ce que les historiens peuvent constater, quelles que soient leurs convictions personnelles, c'est que les premiers disciples de Jésus, traumatisés par son exécution publique et humiliante, en sont venus très rapidement — en l'espace de quelques années — à proclamer sa résurrection au péril de leur propre vie, un fait sociologique qui appelle explication mais que les historiens interprètent de façons radicalement différentes (expérience mystique collective, vol du corps, vision, ou fait réel selon la foi de chacun).",
    savoir:"Le tombeau vide, à lui seul, ne prouve rien pour les historiens : c'est un fait qui admet plusieurs explications naturelles concurrentes, ce qui explique pourquoi le débat reste avant tout d'ordre théologique et philosophique plutôt que strictement historique."
  },
  {
    id:"bib31", yearsAgo:1995, related:["bib30","bib32"], uncertain:[1995,1992], title:"La Pentecôte", date_label:"~30 apr. J.-C., 50 jours après Pâque",
    desc:"L'Esprit Saint descend sur les apôtres réunis à Jérusalem, qui se mettent à parler en d'autres langues.", importance:2, tier:"theologique",
    ref:"Actes des Apôtres 2",
    recit:"Cinquante jours après Pâque, les apôtres sont réunis à Jérusalem pour la fête juive de Chavouot lorsqu'un bruit de vent violent se fait entendre et que des « langues de feu » se posent sur chacun d'eux. Remplis de l'Esprit Saint, ils se mettent à parler en des langues étrangères, compréhensibles par les pèlerins venus de tout le bassin méditerranéen — épisode fondateur de l'Église chrétienne et de sa vocation universelle.",
    histoire:"Comme pour tout événement décrit comme une intervention directe et surnaturelle de l'Esprit divin, la Pentecôte échappe à la vérification historique. Les historiens s'accordent en revanche sur le fait que le mouvement des disciples de Jésus, initialement une petite secte juive locale, a connu à Jérusalem une expansion rapide et significative peu après la mort de Jésus — un phénomène social et religieux réel, quelle que soit l'explication qu'on lui donne.",
    savoir:"La fête chrétienne de la Pentecôte tire directement son nom du grec <em>pentekostē</em> (« cinquantième »), désignant le cinquantième jour après Pâque — un héritage direct du calendrier festif juif."
  },
  {
    id:"bib32", yearsAgo:1991, related:["bib31","bib34"], title:"La conversion de Paul sur le chemin de Damas", date_label:"~34-36 apr. J.-C.",
    desc:"Saul de Tarse, persécuteur des chrétiens, est terrassé par une vision de Jésus et devient l'apôtre Paul.", importance:1, tier:"probable",
    ref:"Actes des Apôtres 9",
    recit:"Saul de Tarse, pharisien zélé, persécute activement les premiers disciples de Jésus. Sur la route de Damas, où il se rend pour arrêter des chrétiens, une lumière éblouissante le terrasse et il entend la voix de Jésus lui demander : « Pourquoi me persécutes-tu ? ». Aveuglé puis guéri trois jours plus tard, il se convertit et devient Paul, le plus grand missionnaire du christianisme naissant.",
    histoire:"Contrairement à beaucoup d'épisodes du Nouveau Testament, celui-ci bénéficie d'un appui de poids : Paul lui-même l'évoque, dans ses propres lettres authentiques (Galates 1:13-16, 1 Corinthiens 15:8), écrites de son vivant et largement considérées comme fiables par les historiens, chrétiens ou non. Que Paul, ancien persécuteur, ait vécu une expérience bouleversante qui l'a conduit à devenir l'un des plus fervents propagateurs du message chrétien, est ainsi considéré comme l'un des faits les mieux établis de l'histoire paulinienne — la nature exacte de cette expérience (vision, hallucination, rencontre réelle) restant, elle, du ressort de l'interprétation de chacun.",
    savoir:"Paul ne raconte jamais lui-même être « tombé de cheval », détail resté célèbre grâce à la peinture et à l'iconographie postérieures : le texte des Actes précise seulement qu'il « tomba par terre »."
  },
  {
    id:"bib33", yearsAgo:1981, related:["bib34"], title:"Le martyre de Jacques et l'emprisonnement de Pierre", date_label:"~44 apr. J.-C.",
    desc:"Le roi Hérode Agrippa Ier fait exécuter l'apôtre Jacques et emprisonne Pierre, miraculeusement libéré.", importance:2, tier:"probable",
    ref:"Actes des Apôtres 12",
    recit:"Le roi Hérode Agrippa Ier, petit-fils d'Hérode le Grand, fait exécuter par l'épée l'apôtre Jacques, frère de Jean, pour plaire aux autorités juives. Voyant que cela est bien accueilli, il fait aussi arrêter Pierre, qui est délivré de sa prison la nuit même par un ange, ses chaînes tombant miraculeusement.",
    histoire:"Le contexte politique de cet épisode est solidement corroboré : Flavius Josèphe relate en détail le règne d'Hérode Agrippa Ier et sa mort brutale la même année 44 apr. J.-C. (frappé, selon Josèphe, d'une maladie soudaine après avoir accepté d'être acclamé comme un dieu) — un fait qui recoupe et date précisément l'épisode des Actes. L'exécution de Jacques, l'un des tout premiers martyrs chrétiens connus, est également jugée historiquement plausible par la plupart des spécialistes ; l'évasion miraculeuse de Pierre relève, elle, du récit théologique.",
    savoir:"Jacques, fils de Zébédée et frère de l'apôtre Jean, est ainsi le tout premier des douze apôtres dont la mort soit relatée dans le Nouveau Testament lui-même."
  },
  {
    id:"bib34", yearsAgo:1975, related:["bib32","bib35"], title:"Les voyages missionnaires de Paul", date_label:"~46-57 apr. J.-C.",
    desc:"Paul parcourt l'Asie Mineure, la Grèce et fonde des communautés chrétiennes autour de la Méditerranée.", importance:1, tier:"historique",
    ref:"Actes des Apôtres 13–21",
    recit:"Envoyé par l'Église d'Antioche, Paul entreprend plusieurs longs voyages missionnaires à travers l'Asie Mineure (actuelle Turquie) puis la Grèce — Philippes, Thessalonique, Athènes, Corinthe — fondant des communautés chrétiennes, souvent en butte à l'hostilité des autorités locales, juives comme romaines, et correspondant ensuite avec elles par lettres.",
    histoire:"Ces voyages figurent parmi les épisodes les mieux documentés du christianisme naissant, grâce à la convergence de deux types de sources indépendantes : le récit des Actes des Apôtres et les épîtres authentiques de Paul lui-même (Romains, Corinthiens, Galates, Thessaloniciens, Philippiens...), qui mentionnent nombre des mêmes lieux, personnes et événements. Les détails administratifs romains rapportés (proconsuls, magistrats locaux, titres exacts de fonctionnaires) ont par ailleurs été vérifiés comme historiquement exacts pour chaque province et chaque époque mentionnées — un indice de fiabilité important pour les historiens.",
    savoir:"L'inscription de Delphes, découverte au XXe siècle, mentionne le proconsul Gallion — cité en Actes 18:12 lors du passage de Paul à Corinthe — permettant de dater cet épisode avec une précision rare, autour de l'an 51-52 apr. J.-C."
  },
  {
    id:"bib35", yearsAgo:1976, related:["bib34"], title:"Le concile de Jérusalem", date_label:"~48-50 apr. J.-C.",
    desc:"Les apôtres se réunissent à Jérusalem pour trancher si les chrétiens non juifs doivent suivre la loi mosaïque.", importance:2, tier:"probable",
    ref:"Actes des Apôtres 15",
    recit:"Une controverse éclate : les nouveaux convertis venus du paganisme doivent-ils être circoncis et observer la loi juive pour devenir chrétiens ? Réunis à Jérusalem, Pierre, Jacques (le « frère du Seigneur ») et Paul débattent et tranchent en faveur d'une ouverture aux non-Juifs sans obligation de la loi mosaïque complète — décision fondatrice pour l'expansion universelle du christianisme.",
    histoire:"Cet épisode est corroboré, quoique avec quelques divergences de détail, par le récit qu'en fait Paul lui-même dans l'épître aux Galates (chapitre 2) — une source indépendante du livre des Actes, rédigée par un témoin direct. La question théologique et sociale qu'il tranche (l'universalisme du message chrétien face au particularisme juif) est reconnue par les historiens comme un tournant réel et décisif dans la séparation progressive entre judaïsme et christianisme naissant.",
    savoir:"Ce concile est considéré comme le prototype de tous les conciles chrétiens ultérieurs, jusqu'à ceux, bien plus tardifs et institutionnels, de Nicée (325) ou de Vatican II (1962-1965)."
  },
  {
    id:"bib36", yearsAgo:1961, related:["bib37"], title:"L'incendie de Rome et la persécution de Néron", date_label:"64 apr. J.-C.",
    desc:"Après le grand incendie de Rome, l'empereur Néron fait porter le chapeau aux chrétiens et les persécute.", importance:2, tier:"historique",
    ref:"Tradition chrétienne (1 Pierre, tradition patristique)",
    recit:"La tradition chrétienne rapporte qu'après le grand incendie de Rome de 64 apr. J.-C., l'empereur Néron, cherchant un bouc émissaire, désigne les chrétiens comme coupables et déclenche une persécution d'une extrême violence à leur encontre dans la capitale de l'empire.",
    histoire:"Cet épisode est directement confirmé par l'historien romain Tacite (Annales, XV, 44), source païenne indépendante et hostile aux chrétiens, qui décrit en détail comment Néron fit porter aux chrétiens la responsabilité de l'incendie et les fit exécuter par des supplices atroces (crucifixions, bûchers vivants, mise en pièces par des bêtes) — tout en précisant lui-même que la rumeur populaire soupçonnait Néron d'avoir provoqué l'incendie. C'est l'une des toutes premières mentions des chrétiens comme groupe distinct dans une source romaine officielle.",
    savoir:"Tacite précise que la population romaine, bien qu'hostile aux chrétiens, en vint à éprouver de la pitié devant l'ampleur des supplices — preuve que même des observateurs hostiles jugeaient la répression excessive."
  },
  {
    id:"bib37", yearsAgo:1955, related:["bib23","bib36","bib38"], title:"La destruction du Temple de Jérusalem", date_label:"70 apr. J.-C.",
    desc:"Les légions romaines de Titus détruisent Jérusalem et son Temple après un long siège.", importance:1, tier:"historique",
    ref:"Contexte historique évoqué en Matthieu 24 et Luc 21",
    recit:"Les évangiles rapportent une prophétie de Jésus annonçant qu'il ne resterait pas pierre sur pierre du Temple de Jérusalem. Quarante ans plus tard, lors de la Première guerre judéo-romaine, les légions du futur empereur Titus assiègent et détruisent Jérusalem, rasant le second Temple — jamais reconstruit depuis.",
    histoire:"Cet événement est exceptionnellement bien documenté : l'historien juif Flavius Josèphe, témoin oculaire, en a laissé un récit détaillé (La Guerre des Juifs) ; l'Arc de Titus, érigé à Rome et toujours visible aujourd'hui, représente le pillage des objets sacrés du Temple, dont la célèbre Menorah ; l'archéologie de Jérusalem confirme une destruction et un incendie massifs datés précisément de cette année. C'est l'un des événements les mieux corroborés de toute l'Antiquité concernant la région.",
    savoir:"Le Mur des Lamentations, lieu saint majeur du judaïsme aujourd'hui, n'est pas un vestige du Temple lui-même mais un mur de soutènement extérieur de son esplanade, l'une des rares parties ayant subsisté à la destruction de 70."
  },
  {
    id:"bib38", yearsAgo:1930, related:["bib37"], uncertain:[1955,1930], title:"L'Apocalypse de Jean à Patmos", date_label:"~95 apr. J.-C. (règne de Domitien)",
    desc:"Exilé sur l'île de Patmos, Jean rédige le dernier livre du Nouveau Testament, riche en visions symboliques.", importance:2, tier:"debattu",
    ref:"Apocalypse 1:9",
    recit:"Exilé sur l'île grecque de Patmos « à cause de la parole de Dieu », l'auteur qui se présente comme Jean reçoit une série de visions spectaculaires — sceaux, trompettes, bêtes, cavaliers, nouvelle Jérusalem — annonçant le triomphe final de Dieu sur le mal, dans un langage symbolique dense destiné à encourager des communautés chrétiennes en butte à la persécution.",
    histoire:"La date et l'auteur exacts du livre restent débattus parmi les spécialistes : la tradition ancienne (Irénée de Lyon, vers 180 apr. J.-C.) la situe sous le règne de Domitien (~95 apr. J.-C.), tandis qu'une minorité d'exégètes privilégie une datation plus précoce, sous Néron (avant 70 apr. J.-C.), en s'appuyant sur des indices internes au texte. L'identification de l'auteur à l'apôtre Jean ou à un autre « Jean » (dit « le Presbytre ») est également discutée depuis l'Antiquité. Le texte est en revanche unanimement reconnu comme un exemple typique de littérature apocalyptique juive et chrétienne, un genre littéraire codifié destiné à des lecteurs opprimés, à ne pas confondre avec une prédiction littérale d'événements futurs.",
    savoir:"Le mot grec <em>apokalypsis</em> signifie littéralement « révélation », « dévoilement » — et non « fin du monde » ou « catastrophe », sens qu'il n'a pris que bien plus tard dans le langage courant."
  },
];

export const BIBLE_EVENTS = [...AT, ...NT].map(({ tier, ref, recit, histoire, savoir, ...ev }) => ({
  ...ev,
  cat: "biblique",
  minZoom: 0,
}));

export const BIBLE_CONTENT = Object.fromEntries(
  [...AT, ...NT].map(ev => [ev.id, content(ev)])
);

// Référence scripturaire de chaque événement — citée telle quelle à l'export.
export const BIBLE_SOURCES = Object.fromEntries(
  [...AT, ...NT].map(ev => [ev.id, ev.ref])
);

export const BIBLE_TIERS = TIER;
