// ══════════════════════════════════════════════════════════════════════════
// TRAJETS ANIMÉS — voyages et campagnes tracés sur le planisphère
// ──────────────────────────────────────────────────────────────────────────
// Chaque trajet est une suite ordonnée d'étapes {lon,lat,plate,yearsAgo,label}.
// Le planisphère interpole la position courante entre deux étapes consécutives
// selon l'instant choisi (curseur temporel ou lecture automatique).
// ══════════════════════════════════════════════════════════════════════════

export const JOURNEYS = [
  {
    id: "exode",
    label: "L'Exode — de l'Égypte à Canaan",
    color: "#8b5e34",
    steps: [
      { lon:31.5,  lat:30.8,  plate:"africa",  yearsAgo:3471, label:"Pi-Ramsès, Égypte" },
      { lon:32.7,  lat:29.5,  plate:"africa",  yearsAgo:3470, label:"Traversée de la mer Rouge" },
      { lon:33.97, lat:28.54, plate:"africa",  yearsAgo:3468, label:"Mont Sinaï" },
      { lon:34.4,  lat:30.7,  plate:"africa",  yearsAgo:3450, label:"Cadès-Barnéa" },
      { lon:35.7,  lat:31.5,  plate:"eurasia", yearsAgo:3432, label:"Plaines de Moab" },
      { lon:35.44, lat:31.87, plate:"eurasia", yearsAgo:3431, label:"Jéricho, Canaan" },
    ],
  },
  {
    id: "paul",
    label: "Les voyages missionnaires de Paul",
    color: "#0868a8",
    steps: [
      { lon:35.2,  lat:31.8, plate:"eurasia", yearsAgo:1979, label:"Jérusalem" },
      { lon:36.2,  lat:36.2, plate:"eurasia", yearsAgo:1978, label:"Antioche de Syrie" },
      { lon:33.9,  lat:35.2, plate:"eurasia", yearsAgo:1977, label:"Chypre (Salamine)" },
      { lon:31.2,  lat:38.3, plate:"eurasia", yearsAgo:1976, label:"Antioche de Pisidie" },
      { lon:32.5,  lat:37.6, plate:"eurasia", yearsAgo:1975, label:"Lystre" },
      { lon:24.3,  lat:41.0, plate:"eurasia", yearsAgo:1973, label:"Philippes" },
      { lon:23.7,  lat:38.0, plate:"eurasia", yearsAgo:1972, label:"Athènes" },
      { lon:22.9,  lat:37.9, plate:"eurasia", yearsAgo:1971, label:"Corinthe" },
      { lon:27.3,  lat:37.9, plate:"eurasia", yearsAgo:1970, label:"Éphèse" },
      { lon:12.5,  lat:41.9, plate:"eurasia", yearsAgo:1968, label:"Rome" },
    ],
  },
];

// Position interpolée (lon/lat/plate) le long d'un trajet à un instant donné.
// Retourne aussi les indices des étapes encadrantes pour dessiner le tracé
// déjà parcouru distinctement du tracé à venir.
export function positionAt(journey, ya) {
  const steps = journey.steps;
  if (ya >= steps[0].yearsAgo) return { ...steps[0], segIndex:0, t:0 };
  if (ya <= steps[steps.length-1].yearsAgo) return { ...steps[steps.length-1], segIndex:steps.length-2, t:1 };
  for (let i=0;i<steps.length-1;i++){
    const a=steps[i], b=steps[i+1];
    if (ya<=a.yearsAgo && ya>=b.yearsAgo) {
      const span=a.yearsAgo-b.yearsAgo;
      const t=span>0?(a.yearsAgo-ya)/span:0;
      return {
        lon: a.lon+(b.lon-a.lon)*t,
        lat: a.lat+(b.lat-a.lat)*t,
        plate: t<0.5?a.plate:b.plate,
        label: t<0.5?a.label:b.label,
        segIndex:i, t,
      };
    }
  }
  return { ...steps[steps.length-1], segIndex:steps.length-2, t:1 };
}
