// ══════════════════════════════════════════════════════════════════════════
// GÉOGRAPHIE STYLISÉE — dérive des continents
// ──────────────────────────────────────────────────────────────────────────
// Approche : chaque plaque est un ensemble de polygones fixes (silhouette
// actuelle — continent principal + îles notables — simplifiée mais fidèle
// aux grands caps et péninsules réels). Pour reconstituer une époque passée,
// on n'invente pas une nouvelle silhouette : on applique à la plaque une
// simple transformation rigide (translation + rotation autour de son propre
// centre) dont les paramètres sont interpolés entre des images-clés
// géologiques datées (voir KEYFRAMES). Résultat : une animation toujours
// fluide (aucune déformation de contour), un seul jeu de coordonnées par
// plaque à entretenir, et un rendu qui reste lisible à tout niveau de zoom.
// Approximation pédagogique (silhouettes à quelques dizaines de points) —
// pas une reconstruction GPlates/GeoJSON au mètre près.
// ══════════════════════════════════════════════════════════════════════════

export const PROJ_W = 1000, PROJ_H = 500;

// Projection équirectangulaire simple : lon [-180,180] → x, lat [90,-90] → y
export function project(lon, lat) {
  return { x: (lon + 180) / 360 * PROJ_W, y: (90 - lat) / 180 * PROJ_H };
}

export const PLATE_IDS = ["africa","eurasia","north_america","south_america","india","australia","antarctica"];

// Chaque plaque a un anneau principal (le continent) et, en option, des
// anneaux secondaires (îles/archipels rattachés) rendus avec la même
// transformation rigide — assez pour reconnaître Madagascar, le Japon,
// les îles Britanniques, le Groenland ou la Nouvelle-Zélande sur la carte.
const RAW_PLATES = {
  africa: { label:"Afrique", color:"#b06a35",
    rings:[
      [[-17.5,20.9],[-9.5,35.8],[-5.3,35.9],[2.9,36.8],[11.2,32.9],[19.9,32.8],[25,31.5],[31.2,31.5],
       [34.9,29.5],[32.8,27.8],[37.2,19.6],[39.5,15.6],[43.3,11.6],[51.3,11.8],[45.3,2.0],[40.5,-2.8],
       [40.7,-14.5],[35.4,-23.9],[32.6,-28.8],[31.0,-29.9],[27.9,-33.0],[18.4,-33.9],[17.9,-31.6],
       [14.5,-22.7],[11.7,-17.9],[13.2,-8.8],[8.8,-4.8],[9.3,0.4],[8.7,4.0],[3.4,6.4],[-1.2,5.6],
       [-4.0,5.3],[-10.8,8.5],[-16.6,12.6],[-17.5,20.9]],
      // Madagascar
      [[43.3,-25.6],[47.1,-25.2],[49.9,-15.2],[49.4,-12.3],[47.8,-14.9],[44.4,-20.3],[43.3,-25.6]],
    ]},
  eurasia: { label:"Eurasie", color:"#6f7d52",
    rings:[
      [[-9.4,38.7],[-5.4,36.1],[3.1,42.4],[9.2,44.4],[12.5,41.9],[16.9,41.1],[19.8,40.6],[23.7,37.9],
       [26.2,40.0],[35.0,36.2],[34.8,31.5],[36.2,33.5],[43.3,15.4],[51.6,25.3],[56.3,26.2],[61.9,25.3],
       [67.0,24.9],[70.0,32.0],[85.0,29.0],[94.0,16.0],[99.0,7.0],[103.5,1.3],[105.0,10.3],[108.0,21.0],
       [110.0,18.0],[121.0,23.5],[121.5,31.2],[127.0,37.5],[131.9,43.1],[158.6,53.0],[170.0,66.0],
       [140.0,73.0],[105.0,73.0],[80.0,73.0],[60.0,70.0],[25.0,70.0],[5.0,62.0],[3.0,51.0],[-9.4,38.7]],
      // Îles Britanniques
      [[-8.2,51.5],[-5.0,55.0],[-3.0,58.6],[-2.0,57.5],[1.7,52.9],[1.4,51.0],[-4.7,50.1],[-8.2,51.5]],
      // Japon
      [[130.4,31.0],[132.5,34.2],[136.9,35.0],[140.9,37.0],[141.9,39.7],[140.0,41.5],[139.8,45.4],
       [141.6,43.0],[139.0,36.5],[135.0,34.5],[130.4,31.0]],
    ]},
  north_america: { label:"Amérique du Nord", color:"#4f7fa6",
    rings:[
      [[-165.0,68.0],[-155.0,71.0],[-140.0,69.5],[-135.0,59.5],[-130.0,55.0],[-125.7,48.4],[-124.2,40.8],
       [-117.1,32.5],[-109.0,23.0],[-105.0,20.5],[-97.0,16.0],[-92.2,15.9],[-88.0,13.7],[-83.0,9.0],
       [-79.5,8.0],[-77.3,7.9],[-82.0,22.1],[-81.8,25.8],[-80.1,26.1],[-80.0,32.0],[-75.5,35.2],
       [-74.0,40.5],[-70.2,41.7],[-66.1,44.3],[-63.6,44.6],[-59.9,47.0],[-52.7,47.5],[-55.6,51.4],
       [-60.4,55.0],[-64.2,60.4],[-68.5,63.6],[-64.0,67.6],[-75.0,68.5],[-85.0,68.0],[-95.0,68.5],
       [-110.0,68.0],[-120.0,69.5],[-140.0,70.5],[-165.0,68.0]],
      // Groenland
      [[-52.0,60.0],[-43.0,60.0],[-22.0,70.0],[-20.0,76.0],[-35.0,83.0],[-55.0,82.0],[-65.0,76.0],[-63.0,68.0],[-52.0,60.0]],
    ]},
  south_america: { label:"Amérique du Sud", color:"#b9822f",
    rings:[
      [[-77.3,7.9],[-77.0,1.2],[-79.9,-2.2],[-80.6,-5.0],[-81.1,-14.5],[-76.3,-13.6],[-70.4,-18.4],
       [-70.2,-23.6],[-71.4,-30.1],[-71.7,-33.0],[-73.7,-42.0],[-74.9,-52.0],[-68.6,-54.9],[-65.0,-54.7],
       [-68.1,-52.3],[-67.3,-45.8],[-65.3,-40.8],[-62.3,-38.9],[-57.5,-36.4],[-58.4,-34.6],[-53.4,-33.7],
       [-48.5,-25.5],[-41.0,-22.9],[-39.0,-13.0],[-38.5,-8.0],[-35.2,-5.5],[-44.4,-2.5],[-48.5,0.0],
       [-51.0,1.8],[-59.8,8.6],[-71.6,10.5],[-77.3,7.9]],
    ]},
  india: { label:"Inde", color:"#9a5b8f",
    rings:[
      [[61.7,25.1],[66.5,25.4],[68.2,23.7],[70.5,20.7],[72.8,20.9],[72.8,18.9],[73.4,15.5],[74.8,12.9],
       [76.6,8.9],[79.9,9.3],[79.3,10.4],[80.3,13.1],[80.2,15.9],[83.9,17.7],[86.5,20.3],[87.0,21.6],
       [88.9,22.0],[92.3,21.5],[93.0,15.9],[88.0,21.9],[85.0,23.0],[80.0,21.5],[75.0,22.0],[70.0,24.0],[61.7,25.1]],
      // Sri Lanka
      [[79.7,9.8],[81.9,9.3],[81.9,6.0],[79.9,6.2],[79.7,9.8]],
    ]},
  australia: { label:"Australie", color:"#c8963c",
    rings:[
      [[113.3,-22.0],[113.9,-25.9],[115.0,-34.0],[117.9,-35.1],[124.2,-32.5],[129.0,-31.6],[131.3,-31.5],
       [133.4,-32.0],[134.6,-33.0],[135.9,-34.9],[137.8,-35.6],[139.9,-36.1],[140.0,-38.0],[144.6,-38.4],
       [146.4,-38.7],[147.9,-37.8],[150.0,-36.8],[150.3,-35.3],[151.3,-33.8],[152.9,-31.5],[153.2,-28.2],
       [153.5,-25.3],[151.7,-24.3],[149.3,-21.4],[146.1,-18.9],[145.8,-16.6],[142.5,-14.5],[141.5,-13.0],
       [137.1,-15.4],[135.4,-14.9],[133.1,-11.6],[130.8,-12.5],[130.0,-14.9],[126.1,-13.9],[123.4,-16.9],
       [121.7,-17.3],[114.9,-21.5],[113.3,-22.0]],
      // Nouvelle-Zélande
      [[172.6,-34.4],[174.7,-36.8],[178.5,-38.7],[177.8,-39.6],[176.9,-40.4],[175.3,-41.3],[174.2,-41.2],
       [172.6,-40.5],[171.2,-42.5],[168.4,-44.7],[166.5,-45.4],[167.6,-44.2],[169.6,-43.6],[170.5,-42.6],
       [172.6,-40.0],[172.7,-38.0],[172.6,-34.4]],
    ]},
  antarctica: { label:"Antarctique", color:"#7d8a94",
    rings:[
      [[-180,-63],[-135,-68],[-90,-74],[-45,-71],[0,-70],[45,-73],[90,-76],[135,-70],[180,-63],[180,-90],[-180,-90],[-180,-63]],
    ]},
};

function centroidOf(projPts) {
  let sx=0, sy=0;
  for (const p of projPts) { sx+=p.x; sy+=p.y; }
  return { x: sx/projPts.length, y: sy/projPts.length };
}

export const PLATES = {};
for (const id of PLATE_IDS) {
  const raw = RAW_PLATES[id];
  const projectedRings = raw.rings.map(ring => ring.map(([lon,lat]) => project(lon,lat)));
  // Le pivot de rotation se calcule sur le continent principal seulement (premier
  // anneau) : une petite île ne doit pas décentrer la rotation de toute la plaque.
  PLATES[id] = { ...raw, projectedRings, pivot: centroidOf(projectedRings[0]) };
}

// ── IMAGES-CLÉS ──────────────────────────────────────────────────────────
// Chronologie recalée sur le schéma « Assembly / Breakup of Pangea » du
// Lisbon Earthquake Museum (Quake, lisbonquake.com/fr/scanner/derive-continents) :
// Rodinia ~750 Ma → 650 Ma → 458 Ma → 390 Ma → Pangée assemblée 237 Ma →
// 195 Ma → 152 Ma (« les continents que nous connaissons prennent forme ») →
// 66 Ma → aujourd'hui. Complétée entre 66 Ma et 23 Ma par deux étapes datées
// de la littérature (Scotese/PALEOMAP, EarthByte/GPlates) que ce schéma
// simplifié ne détaille pas : la collision Inde-Asie (~50 Ma, soulèvement de
// l'Himalaya) et la séparation Australie-Antarctique (~45 Ma). Rodinia reste
// la reconstruction la plus incertaine de toutes (plusieurs hypothèses
// concurrentes existent dans la littérature scientifique) — traitée ici
// comme un point de départ illustratif, pas une position figée. Approximation
// pédagogique par plaque rigide unique — pas une reconstruction GPlates
// exacte (celle-ci utiliserait des pôles d'Euler par micro-plaque et par
// intervalle de quelques millions d'années). Afrique sert de plaque de
// référence (quasi immobile) ; dx/dy en pixels de projection, rot en degrés,
// autour du centre propre de chaque plaque.
const IDENTITY = { dx:0, dy:0, rot:0 };

export const KEYFRAMES = [
  { t:750e6, label:"Rodinia — un supercontinent bien plus ancien que la Pangée",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:25, dy:-35, rot:20 },
      north_america: { dx:-25, dy:15, rot:-25 },
      south_america: { dx:-10, dy:60, rot:-30 },
      india: { dx:-20, dy:100, rot:5 },
      australia: { dx:-15, dy:70, rot:-40 },
      antarctica: { dx:10, dy:20, rot:15 },
    }},
  { t:650e6, label:"Rodinia se disloque",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:10, dy:-25, rot:10 },
      north_america: { dx:-10, dy:20, rot:-10 },
      south_america: { dx:5, dy:50, rot:-15 },
      india: { dx:-18, dy:95, rot:7 },
      australia: { dx:-8, dy:50, rot:-15 },
      antarctica: { dx:5, dy:8, rot:8 },
    }},
  { t:458e6, label:"Ordovicien — Gondwana austral",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-4, dy:-3, rot:-1 },
      north_america: { dx:25, dy:11, rot:3 },
      south_america: { dx:14.5, dy:28, rot:-2.5 },
      india: { dx:-22.5, dy:95, rot:10 },
      australia: { dx:-5, dy:47.5, rot:1.5 },
      antarctica: { dx:1.5, dy:-3, rot:1 },
    }},
  { t:390e6, label:"Dévonien — collision Laurentia/Baltica (Euramérica)",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-8, dy:8, rot:-2 },
      north_america: { dx:40, dy:-5, rot:6 },
      south_america: { dx:15, dy:14, rot:-5 },
      india: { dx:-30, dy:100, rot:12 },
      australia: { dx:-8, dy:55, rot:3 },
      antarctica: { dx:3, dy:-6, rot:2 },
    }},
  { t:237e6, label:"Pangée assemblée",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-32, dy:12, rot:-7 },
      north_america: { dx:100, dy:-26, rot:15 },
      south_america: { dx:58, dy:-33, rot:-19 },
      india: { dx:-60, dy:135, rot:18 },
      australia: { dx:-14, dy:80, rot:5 },
      antarctica: { dx:7, dy:-14, rot:4 },
    }},
  { t:195e6, label:"Trias/Jurassique — la Pangée commence à se fissurer",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-26, dy:9, rot:-6 },
      north_america: { dx:85, dy:-23, rot:13 },
      south_america: { dx:48, dy:-26, rot:-17 },
      india: { dx:-52, dy:128, rot:18 },
      australia: { dx:-12, dy:74, rot:5 },
      antarctica: { dx:6, dy:-12, rot:4 },
    }},
  { t:152e6, label:"Jurassique — les continents actuels prennent forme",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-11, dy:4.5, rot:-3.2 },
      north_america: { dx:48, dy:-16, rot:8.5 },
      south_america: { dx:24, dy:-15, rot:-12.5 },
      india: { dx:-42, dy:112, rot:15.3 },
      australia: { dx:-10.2, dy:61, rot:4.1 },
      antarctica: { dx:5.1, dy:-10.2, rot:3.1 },
    }},
  { t:100e6, label:"Crétacé moyen — l'Atlantique Sud s'ouvre, l'Inde s'isole",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-8, dy:3, rot:-2 },
      north_america: { dx:32, dy:-11, rot:6 },
      south_america: { dx:16, dy:-9, rot:-10 },
      india: { dx:-45, dy:120, rot:17 },
      australia: { dx:-9, dy:53, rot:4 },
      antarctica: { dx:4, dy:-9, rot:3 },
    }},
  { t:66e6, label:"Fin du Crétacé — Chicxulub, l'Inde fonce vers l'Asie",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-6, dy:2, rot:-2 },
      north_america: { dx:22, dy:-8, rot:5 },
      south_america: { dx:12, dy:-6, rot:-8 },
      india: { dx:-25, dy:55, rot:10 },
      australia: { dx:-8, dy:45, rot:3 },
      antarctica: { dx:3, dy:-5, rot:2 },
    }},
  { t:50e6, label:"Éocène — collision Inde-Asie, l'Himalaya se soulève",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-4, dy:1, rot:-1.5 },
      north_america: { dx:14, dy:-6, rot:3.5 },
      south_america: { dx:7, dy:-3, rot:-5.5 },
      india: { dx:-6, dy:12, rot:3 },
      australia: { dx:-6, dy:28, rot:2 },
      antarctica: { dx:2, dy:-3, rot:1.2 },
    }},
  { t:34e6, label:"Éocène-Oligocène — l'Australie quitte l'Antarctique",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-3, dy:0.5, rot:-1.3 },
      north_america: { dx:10, dy:-4, rot:2.8 },
      south_america: { dx:5, dy:-1.5, rot:-4.3 },
      india: { dx:-3.6, dy:6.7, rot:2.4 },
      australia: { dx:-1, dy:2, rot:0.3 },
      antarctica: { dx:0.8, dy:-1.3, rot:0.5 },
    }},
  { t:23e6, label:"Néogène — proche du présent",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-2, dy:0, rot:-1 },
      north_america: { dx:6, dy:-3, rot:2 },
      south_america: { dx:3, dy:0, rot:-3 },
      india: { dx:-2, dy:3, rot:2 },
      australia: { dx:-2, dy:8, rot:1 },
      antarctica: IDENTITY,
    }},
  { t:5e6, label:"Pliocène",
    transforms:{
      africa: IDENTITY, eurasia: IDENTITY, north_america: IDENTITY,
      south_america: IDENTITY, india: IDENTITY, australia: IDENTITY, antarctica: IDENTITY,
    }},
  { t:0, label:"Aujourd'hui",
    transforms:{
      africa: IDENTITY, eurasia: IDENTITY, north_america: IDENTITY,
      south_america: IDENTITY, india: IDENTITY, australia: IDENTITY, antarctica: IDENTITY,
    }},
];

function lerp(a, b, f) { return a + (b - a) * f; }

// Retourne les transformations (par plaque) interpolées pour un instant
// donné (années avant aujourd'hui). Hors bornes → image-clé la plus proche.
export function transformsAt(ya) {
  const kf = KEYFRAMES;
  if (ya >= kf[0].t) return kf[0].transforms;
  if (ya <= kf[kf.length-1].t) return kf[kf.length-1].transforms;
  for (let i=0;i<kf.length-1;i++){
    const a=kf[i], b=kf[i+1];
    if (ya<=a.t && ya>=b.t) {
      const f=(a.t-ya)/(a.t-b.t);
      const out={};
      for (const id of PLATE_IDS) {
        const ta=a.transforms[id], tb=b.transforms[id];
        out[id] = { dx:lerp(ta.dx,tb.dx,f), dy:lerp(ta.dy,tb.dy,f), rot:lerp(ta.rot,tb.rot,f) };
      }
      return out;
    }
  }
  return kf[kf.length-1].transforms;
}

// Libellé de l'époque géographique la plus proche de `ya` (pour affichage).
export function eraLabelAt(ya) {
  let best = KEYFRAMES[0];
  for (const k of KEYFRAMES) if (Math.abs(k.t-ya) < Math.abs(best.t-ya)) best = k;
  return best.label;
}

function applyTransform(x, y, pivot, t) {
  const rad = t.rot * Math.PI/180, cos=Math.cos(rad), sin=Math.sin(rad);
  const lx = x-pivot.x, ly = y-pivot.y;
  const rx = lx*cos - ly*sin, ry = lx*sin + ly*cos;
  return { x: pivot.x+rx+t.dx, y: pivot.y+ry+t.dy };
}

// Chemin SVG (attribut `d`) d'une plaque à l'instant donné (transforms = résultat
// de transformsAt). Concatène tous les anneaux (continent + îles) en un seul
// chemin multi-sous-tracés, chacun subissant la même transformation rigide.
export function platePathAt(plateId, transforms) {
  const plate = PLATES[plateId];
  const t = transforms[plateId];
  return plate.projectedRings.map(ring => {
    const pts = ring.map(p => applyTransform(p.x, p.y, plate.pivot, t));
    return "M" + pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L") + "Z";
  }).join(" ");
}

// Position projetée d'un point (lon,lat moderne) porté par une plaque, à l'instant donné.
export function projectPointAt(plateId, lon, lat, transforms) {
  const plate = PLATES[plateId];
  const t = transforms[plateId];
  const p = project(lon, lat);
  return applyTransform(p.x, p.y, plate.pivot, t);
}
