// ══════════════════════════════════════════════════════════════════════════
// GÉOGRAPHIE STYLISÉE — dérive des continents
// ──────────────────────────────────────────────────────────────────────────
// Approche : chaque plaque est un polygone unique (silhouette actuelle,
// simplifiée en basse résolution). Pour reconstituer une époque passée, on
// n'invente pas une nouvelle silhouette : on applique à la plaque une simple
// transformation rigide (translation + rotation autour de son propre centre)
// dont les paramètres sont interpolés entre quelques images-clés géologiques.
// Résultat : une animation toujours fluide (aucune déformation de contour),
// et un seul jeu de coordonnées par plaque à entretenir.
// Approximation pédagogique — pas une reconstruction scientifique exacte.
// ══════════════════════════════════════════════════════════════════════════

export const PROJ_W = 1000, PROJ_H = 500;

// Projection équirectangulaire simple : lon [-180,180] → x, lat [90,-90] → y
export function project(lon, lat) {
  return { x: (lon + 180) / 360 * PROJ_W, y: (90 - lat) / 180 * PROJ_H };
}

export const PLATE_IDS = ["africa","eurasia","north_america","south_america","india","australia","antarctica"];

const RAW_PLATES = {
  africa: { label:"Afrique", color:"#c2703d",
    outline:[[-17,15],[-16,25],[-8,32],[3,37],[11,37],[20,33],[32,31],[36,20],[41,11],[46,2],[51,10],[44,-2],[40,-16],[35,-25],[27,-34],[18,-35],[12,-25],[10,-10],[9,0],[-5,5],[-17,15]] },
  eurasia: { label:"Eurasie", color:"#7a8b6f",
    outline:[[-9,43],[0,38],[15,37],[30,32],[35,15],[45,12],[55,25],[65,25],[75,20],[85,22],[95,15],[105,10],[115,22],[125,35],[140,45],[155,55],[170,65],[150,65],[130,60],[110,55],[90,60],[70,65],[50,68],[30,68],[10,55],[-9,43]] },
  north_america: { label:"Amérique du Nord", color:"#4f7fa6",
    outline:[[-165,68],[-140,60],[-125,49],[-118,34],[-108,22],[-97,16],[-88,14],[-80,9],[-77,8],[-83,22],[-81,31],[-75,36],[-66,45],[-60,53],[-53,62],[-60,68],[-75,73],[-95,74],[-120,72],[-140,70],[-165,68]] },
  south_america: { label:"Amérique du Sud", color:"#b9822f",
    outline:[[-79,9],[-77,1],[-80,-4],[-81,-14],[-75,-20],[-70,-30],[-71,-40],[-73,-50],[-68,-55],[-63,-50],[-58,-38],[-53,-25],[-48,-15],[-38,-8],[-42,1],[-52,5],[-62,8],[-72,10],[-79,9]] },
  india: { label:"Inde", color:"#9a5b8f",
    outline:[[68,24],[70,20],[72,15],[75,9],[78,8],[81,10],[83,16],[87,21],[90,23],[92,26],[86,29],[78,31],[71,28],[68,24]] },
  australia: { label:"Australie", color:"#c8963c",
    outline:[[113,-22],[114,-30],[118,-35],[130,-38],[140,-38],[149,-37],[153,-27],[150,-19],[143,-14],[133,-12],[122,-16],[113,-22]] },
  antarctica: { label:"Antarctique", color:"#7d8a94",
    outline:[[-180,-63],[-135,-68],[-90,-74],[-45,-71],[0,-70],[45,-73],[90,-76],[135,-70],[180,-63],[180,-90],[-180,-90],[-180,-63]] },
};

function centroidOf(projPts) {
  let sx=0, sy=0;
  for (const p of projPts) { sx+=p.x; sy+=p.y; }
  return { x: sx/projPts.length, y: sy/projPts.length };
}

export const PLATES = {};
for (const id of PLATE_IDS) {
  const raw = RAW_PLATES[id];
  const projected = raw.outline.map(([lon,lat]) => project(lon,lat));
  PLATES[id] = { ...raw, projected, pivot: centroidOf(projected) };
}

// ── IMAGES-CLÉS ──────────────────────────────────────────────────────────
// Récit simplifié : dispersion précambrienne → assemblage de la Pangée
// (~300-252 Ma) → fragmentation progressive → configuration actuelle.
// Afrique sert de plaque de référence (quasi immobile) ; dx/dy en pixels
// de projection, rot en degrés, autour du centre propre de chaque plaque.
const IDENTITY = { dx:0, dy:0, rot:0 };

export const KEYFRAMES = [
  { t:540e6, label:"Cambrien — blocs dispersés",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:0, dy:-14, rot:0 },
      north_america: { dx:10, dy:28, rot:0 },
      south_america: { dx:14, dy:42, rot:0 },
      india: { dx:-15, dy:90, rot:8 },
      australia: { dx:-2, dy:40, rot:0 },
      antarctica: IDENTITY,
    }},
  { t:400e6, label:"Dévonien — Euramérica",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-8, dy:8, rot:-2 },
      north_america: { dx:40, dy:-5, rot:6 },
      south_america: { dx:15, dy:14, rot:-5 },
      india: { dx:-30, dy:100, rot:12 },
      australia: { dx:-8, dy:55, rot:3 },
      antarctica: { dx:3, dy:-6, rot:2 },
    }},
  { t:300e6, label:"Carbonifère — assemblage de la Pangée",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-30, dy:10, rot:-6 },
      north_america: { dx:95, dy:-24, rot:14 },
      south_america: { dx:55, dy:-30, rot:-18 },
      india: { dx:-58, dy:132, rot:17 },
      australia: { dx:-13, dy:78, rot:5 },
      antarctica: { dx:6, dy:-13, rot:4 },
    }},
  { t:252e6, label:"Permien — Pangée assemblée",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-32, dy:12, rot:-7 },
      north_america: { dx:100, dy:-26, rot:15 },
      south_america: { dx:58, dy:-33, rot:-19 },
      india: { dx:-60, dy:135, rot:18 },
      australia: { dx:-14, dy:80, rot:5 },
      antarctica: { dx:7, dy:-14, rot:4 },
    }},
  { t:200e6, label:"Jurassique — la Pangée se fissure",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-26, dy:9, rot:-6 },
      north_america: { dx:85, dy:-23, rot:13 },
      south_america: { dx:48, dy:-26, rot:-17 },
      india: { dx:-52, dy:128, rot:18 },
      australia: { dx:-12, dy:74, rot:5 },
      antarctica: { dx:6, dy:-12, rot:4 },
    }},
  { t:145e6, label:"Crétacé — Gondwana se fragmente",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-10, dy:4, rot:-3 },
      north_america: { dx:45, dy:-15, rot:8 },
      south_america: { dx:22, dy:-14, rot:-12 },
      india: { dx:-40, dy:110, rot:15 },
      australia: { dx:-10, dy:60, rot:4 },
      antarctica: { dx:5, dy:-10, rot:3 },
    }},
  { t:66e6, label:"Fin du Crétacé — Chicxulub",
    transforms:{
      africa: IDENTITY,
      eurasia: { dx:-6, dy:2, rot:-2 },
      north_america: { dx:22, dy:-8, rot:5 },
      south_america: { dx:12, dy:-6, rot:-8 },
      india: { dx:-25, dy:55, rot:10 },
      australia: { dx:-8, dy:45, rot:3 },
      antarctica: { dx:3, dy:-5, rot:2 },
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

// Chemin SVG (attribut `d`) d'une plaque à l'instant donné (transforms = résultat de transformsAt).
export function platePathAt(plateId, transforms) {
  const plate = PLATES[plateId];
  const t = transforms[plateId];
  const pts = plate.projected.map(p => applyTransform(p.x, p.y, plate.pivot, t));
  return "M" + pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L") + "Z";
}

// Position projetée d'un point (lon,lat moderne) porté par une plaque, à l'instant donné.
export function projectPointAt(plateId, lon, lat, transforms) {
  const plate = PLATES[plateId];
  const t = transforms[plateId];
  const p = project(lon, lat);
  return applyTransform(p.x, p.y, plate.pivot, t);
}
