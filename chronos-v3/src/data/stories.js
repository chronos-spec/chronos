// ── PARCOURS NARRATIFS ────────────────────────────────────────────────────────
// Chaque parcours est une histoire : une suite d'étapes qui déplacent la frise
// et racontent le fil qui relie les événements. Les fenêtres (from/to) sont en
// "années avant aujourd'hui" ; `focus` sert à synchroniser l'arbre du vivant.
export const STORIES = [
  {
    id: "poussiere",
    emoji: "✨",
    title: "De la poussière d'étoiles à toi",
    blurb: "Comment la matière du cosmos est devenue vivante, puis consciente.",
    steps: [
      { from: 14e9, to: 11e9, focus: 13.8e9, title: "Le Big Bang",
        text: "Tout commence il y a 13,8 milliards d'années. En un instant, l'espace, le temps et la matière surgissent d'un état d'énergie inimaginable." },
      { from: 13.6e9, to: 12e9, focus: 13.4e9, title: "Les premières étoiles",
        text: "La gravité rassemble l'hydrogène en étoiles. En brûlant, elles forgent dans leur cœur le carbone, l'oxygène, le fer — les briques de tout ce qui suivra." },
      { from: 5.2e9, to: 4e9, focus: 4.6e9, title: "La Terre se forme",
        text: "Des poussières issues d'étoiles mortes s'agglomèrent autour d'un jeune Soleil. Il y a 4,6 milliards d'années, notre planète naît, brûlante." },
      { from: 4e9, to: 3e9, focus: 3.5e9, title: "L'étincelle du vivant",
        text: "Dans les océans, la chimie devient biologie : les premières cellules apparaissent. La matière, désormais, se copie elle-même." },
      { from: 6e5, to: 1e4, focus: 3e5, title: "Homo sapiens",
        text: "Après des milliards d'années, un primate se met à peindre, parler, s'interroger. La poussière d'étoiles ouvre les yeux et contemple d'où elle vient." },
    ],
  },
  {
    id: "terre-ferme",
    emoji: "🌿",
    title: "La conquête de la terre ferme",
    blurb: "La longue sortie des eaux : des plantes aux premiers pas des vertébrés.",
    steps: [
      { from: 600e6, to: 470e6, focus: 540e6, title: "L'explosion cambrienne",
        text: "Il y a ~540 millions d'années, la vie invente en quelques millions d'années presque tous les grands plans du corps animal. Mais tout se joue encore dans la mer." },
      { from: 500e6, to: 420e6, focus: 470e6, title: "Les plantes s'installent",
        text: "Les premières plantes colonisent les rivages. Elles verdissent les continents et enrichissent l'air en oxygène, préparant le terrain aux animaux." },
      { from: 470e6, to: 380e6, focus: 420e6, title: "Les arthropodes suivent",
        text: "Insectes et arachnides sortent de l'eau à la suite des plantes. Pour la première fois, des animaux marchent sur la terre sèche." },
      { from: 400e6, to: 340e6, focus: 375e6, title: "Le poisson qui marche",
        text: "Des poissons à nageoires charnues, comme Tiktaalik, développent des membres. Le pas décisif : les vertébrés posent le pied sur la berge." },
      { from: 360e6, to: 280e6, focus: 320e6, title: "L'œuf libère la vie",
        text: "Avec l'œuf amniotique, les tétrapodes n'ont plus besoin de retourner à l'eau pour se reproduire. La terre ferme est définitivement conquise." },
    ],
  },
  {
    id: "geants",
    emoji: "🦕",
    title: "L'ère des géants et leur chute",
    blurb: "165 millions d'années de dinosaures, et l'astéroïde qui changea tout.",
    steps: [
      { from: 260e6, to: 220e6, focus: 245e6, title: "Après la grande extinction",
        text: "La fin du Permien a failli tout effacer. Sur cette table rase, une nouvelle lignée s'élève : les archosaures, ancêtres des dinosaures." },
      { from: 210e6, to: 150e6, focus: 180e6, title: "Le règne des dinosaures",
        text: "Sauropodes gigantesques, prédateurs redoutables : les dinosaures dominent tous les continents pendant des dizaines de millions d'années." },
      { from: 170e6, to: 120e6, focus: 150e6, title: "Les oiseaux prennent leur envol",
        text: "Parmi les petits théropodes à plumes, une branche apprend à voler. Les oiseaux d'aujourd'hui sont ces dinosaures qui ont survécu." },
      { from: 80e6, to: 60e6, focus: 66e6, title: "L'astéroïde",
        text: "Il y a 66 millions d'années, un objet de 10 km percute la Terre. Le ciel s'obscurcit, le climat s'effondre : les trois quarts des espèces disparaissent." },
      { from: 66e6, to: 20e6, focus: 55e6, title: "L'aube des mammifères",
        text: "Dans le monde vidé de ses géants, de petits mammifères sortent de l'ombre. Leur essor mènera, bien plus tard, jusqu'à nous." },
    ],
  },
  {
    id: "civilisation",
    emoji: "📜",
    title: "L'invention de la civilisation",
    blurb: "De la première graine semée à l'intelligence artificielle.",
    steps: [
      { from: 15e3, to: 8e3, focus: 12e3, title: "L'agriculture",
        text: "En domestiquant plantes et animaux, l'humain se sédentarise. Les villages naissent, la population grandit : le point de bascule de notre histoire." },
      { from: 6e3, to: 4e3, focus: 5.2e3, title: "L'écriture",
        text: "À Sumer, on grave les premiers signes. Pour la première fois, la mémoire sort des têtes et se fixe : l'Histoire, au sens strict, commence." },
      { from: 3e3, to: 1.5e3, focus: 2.5e3, title: "L'âge des empires",
        text: "Grèce, Rome, Chine, Perse : de vastes États relient des millions de personnes par le droit, la route et le commerce." },
      { from: 600, to: 400, focus: 570, title: "L'imprimerie",
        text: "Gutenberg mécanise le livre. Le savoir se diffuse à une vitesse inédite et allume les Lumières, la science moderne, les révolutions." },
      { from: 60, to: 0.1, focus: 20, title: "L'ère numérique",
        text: "Internet, puis l'intelligence artificielle. En une poignée de décennies, l'information devient instantanée et mondiale — le chapitre que nous écrivons." },
    ],
  },
  {
    id: "extinctions",
    emoji: "💥",
    title: "Les cinq grandes extinctions",
    blurb: "La vie a déjà frôlé l'anéantissement — et rebondi à chaque fois.",
    steps: [
      { from: 470e6, to: 430e6, focus: 445e6, title: "Ordovicien-Silurien",
        text: "Une glaciation brutale fait chuter le niveau des mers. ~85 % des espèces marines disparaissent. La vie n'existe encore presque que dans l'eau." },
      { from: 390e6, to: 350e6, focus: 372e6, title: "Dévonien",
        text: "Une longue crise frappe les récifs et les poissons cuirassés. Pourtant, c'est aussi l'époque où les vertébrés gagnent la terre ferme." },
      { from: 270e6, to: 240e6, focus: 252e6, title: "Permien — la Grande Mourante",
        text: "La pire de toutes : jusqu'à 96 % des espèces s'éteignent. La vie met des millions d'années à s'en remettre, mais ouvre la voie aux dinosaures." },
      { from: 220e6, to: 190e6, focus: 201e6, title: "Trias-Jurassique",
        text: "Un nouvel effondrement libère les niches écologiques. Les dinosaures en profitent pour devenir les maîtres incontestés du monde." },
      { from: 80e6, to: 50e6, focus: 66e6, title: "Crétacé — l'astéroïde",
        text: "La plus célèbre : la fin des dinosaures non-aviens. Et le début, pour les mammifères puis pour nous, d'une nouvelle histoire." },
    ],
  },
];

export function randomStory(excludeId) {
  const pool = STORIES.filter(s => s.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)] || STORIES[0];
}
