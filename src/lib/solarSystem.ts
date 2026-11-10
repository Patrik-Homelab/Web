export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface MoonConfig {
  id: string;
  radiusPx: number;
  sizePx: number;
  periodDays: number;
  initialPhaseDeg: number;
  color: string;
}

export interface RingConfig {
  rx: number;
  ry: number;
  tiltDeg: number;
  outerColor: string;
  innerColor?: string;
}

export interface PlanetColors {
  light: string;
  mid: string;
  dark: string;
}

export interface CelestialBodyInfo {
  id: string;
  name: { cs: string; en: string };
  symbol?: string;
  type: { cs: string; en: string };
  orbitPeriod: { cs: string; en: string };
  distanceAu: string;
  moonsCount: number;
  description: { cs: string; en: string };
}

export interface PlanetConfig extends CelestialBodyInfo {
  id: PlanetId;
  /** Horizontal orbit diameter as percentage of stage width (0 - 100) */
  orbitPct: number;
  /** Base planet diameter in px (at mid-depth) */
  sizePx: number;
  /** Sidereal orbital period in Earth days */
  periodDays: number;
  /** Mean ecliptic longitude at J2000.0 epoch (degrees) */
  L0: number;
  /** Mean daily motion (degrees / day) */
  LRate: number;
  /** Colors for radial sphere shading (specular highlight, mid-tone, shadow) */
  colors: PlanetColors;
  /** Outer atmospheric glow color */
  glowColor: string;
  /** Optional true elliptical planetary ring system */
  rings?: RingConfig;
  /** Optional natural satellites */
  moons?: MoonConfig[];
}

export const SUN_CONFIG: CelestialBodyInfo = {
  id: 'sun',
  name: { cs: 'Slunce', en: 'The Sun' },
  symbol: '☉',
  type: { cs: 'Žlutý trpaslík (hvězda třídy G2V)', en: 'Yellow Dwarf (G2V Star)' },
  orbitPeriod: {
    cs: 'Střed soustavy (obíhá Mléčnou dráhu za ~230 mil. let)',
    en: 'Center of system (orbits Milky Way in ~230M yrs)'
  },
  distanceAu: '0 AU (0 km)',
  moonsCount: 8,
  description: {
    cs: 'Hvězda v centru naší sluneční soustavy, která tvoří 99,86 % celkové hmotnosti systému.',
    en: 'The star at the center of the Solar System, comprising 99.86% of the system’s total mass.'
  }
};

export interface AsteroidParticle {
  angleDeg: number;
  radiusPct: number;
  sizePx: number;
  opacity: number;
  speedDegPerSec: number;
}

/** J2000.0 Epoch: 2000-01-01 12:00:00 TT/UTC in milliseconds */
export const J2000_EPOCH_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
const MS_PER_DAY = 86_400_000;

/**
 * 8 planets configured for 2.5D foreshortened elliptical orbits around the central Sun portrait.
 * Wide spacing ensures all orbits (from Mercury to Neptune) sweep gracefully outside the Sun.
 */
export const PLANETS: PlanetConfig[] = [
  {
    id: 'mercury',
    name: { cs: 'Merkur', en: 'Mercury' },
    symbol: '☿',
    type: { cs: 'Terestrická planeta', en: 'Terrestrial planet' },
    orbitPeriod: { cs: '87.97 dní', en: '87.97 days' },
    distanceAu: '0.39 AU (58 mil. km)',
    moonsCount: 0,
    description: {
      cs: 'Nejmenší planeta a nejbližší ke Slunci s extrémními teplotními výkyvy.',
      en: 'Smallest planet and closest to the Sun, with extreme surface temperature variations.'
    },
    orbitPct: 36,
    sizePx: 6.5,
    periodDays: 87.97,
    L0: 252.25084,
    LRate: 4.09233445,
    colors: {
      light: '#f1f5f9',
      mid: '#94a3b8',
      dark: '#334155'
    },
    glowColor: 'rgba(148, 163, 184, 0.45)'
  },
  {
    id: 'venus',
    name: { cs: 'Venuše', en: 'Venus' },
    symbol: '♀',
    type: { cs: 'Terestrická planeta', en: 'Terrestrial planet' },
    orbitPeriod: { cs: '224.7 dní', en: '224.7 days' },
    distanceAu: '0.72 AU (108 mil. km)',
    moonsCount: 0,
    description: {
      cs: 'Nejteplejší planeta sluneční soustavy s hustou skleníkovou atmosférou.',
      en: 'The hottest planet in the Solar System, blanketed in a crushing CO₂ atmosphere.'
    },
    orbitPct: 45,
    sizePx: 9.5,
    periodDays: 224.7,
    L0: 181.97973,
    LRate: 1.60213034,
    colors: {
      light: '#fef9c3',
      mid: '#fbbf24',
      dark: '#b45309'
    },
    glowColor: 'rgba(251, 191, 36, 0.55)'
  },
  {
    id: 'earth',
    name: { cs: 'Země', en: 'Earth' },
    symbol: '♁',
    type: { cs: 'Terestrická planeta', en: 'Terrestrial planet' },
    orbitPeriod: { cs: '365.26 dní', en: '365.26 days' },
    distanceAu: '1.00 AU (149.6 mil. km)',
    moonsCount: 1,
    description: {
      cs: 'Náš domovský svět a jediné známé těleso v kosmu hostící kapalnou vodu a život.',
      en: 'Our home world, the only known celestial body harboring oceans and life.'
    },
    orbitPct: 54,
    sizePx: 11,
    periodDays: 365.26,
    L0: 100.46435,
    LRate: 0.98560912,
    colors: {
      light: '#bae6fd',
      mid: '#2563eb',
      dark: '#0f172a'
    },
    glowColor: 'rgba(56, 189, 248, 0.6)'
  },
  {
    id: 'mars',
    name: { cs: 'Mars', en: 'Mars' },
    symbol: '♂',
    type: { cs: 'Terestrická planeta', en: 'Terrestrial planet' },
    orbitPeriod: { cs: '686.98 dní (1.88 roku)', en: '686.98 days (1.88 years)' },
    distanceAu: '1.52 AU (228 mil. km)',
    moonsCount: 2,
    description: {
      cs: 'Rudá planeta pokrytá oxidem železitým s největší sopkou Olympus Mons a tenkou atmosférou.',
      en: 'The Red Planet, home to the massive Olympus Mons volcano and Valles Marineris.'
    },
    orbitPct: 63,
    sizePx: 8.5,
    periodDays: 686.98,
    L0: 355.45332,
    LRate: 0.52403304,
    colors: {
      light: '#fed7aa',
      mid: '#ea580c',
      dark: '#7c2d12'
    },
    glowColor: 'rgba(234, 88, 12, 0.55)'
  },
  {
    id: 'jupiter',
    name: { cs: 'Jupiter', en: 'Jupiter' },
    symbol: '♃',
    type: { cs: 'Plynný obr', en: 'Gas Giant' },
    orbitPeriod: { cs: '11.86 let', en: '11.86 years' },
    distanceAu: '5.20 AU (778 mil. km)',
    moonsCount: 95,
    description: {
      cs: 'Největší a nejhmotnější planeta sluneční soustavy s ikonickou Velkou rudou skvrnou.',
      en: 'The largest and most massive planet in the Solar System, featuring the Great Red Spot.'
    },
    orbitPct: 78,
    sizePx: 16.5,
    periodDays: 4332.59,
    L0: 34.40438,
    LRate: 0.08308677,
    colors: {
      light: '#fef08a',
      mid: '#d97706',
      dark: '#78350f'
    },
    glowColor: 'rgba(245, 158, 11, 0.5)',
    moons: [
      {
        id: 'io',
        radiusPx: 13,
        sizePx: 2.8,
        periodDays: 1.77,
        initialPhaseDeg: 25,
        color: '#fef08a'
      },
      {
        id: 'europa',
        radiusPx: 17,
        sizePx: 2.4,
        periodDays: 3.55,
        initialPhaseDeg: 195,
        color: '#e0f2fe'
      }
    ]
  },
  {
    id: 'saturn',
    name: { cs: 'Saturn', en: 'Saturn' },
    symbol: '♄',
    type: { cs: 'Plynný obr', en: 'Gas Giant' },
    orbitPeriod: { cs: '29.46 let', en: '29.46 years' },
    distanceAu: '9.58 AU (1.43 mld. km)',
    moonsCount: 146,
    description: {
      cs: 'Klenot sluneční soustavy proslulý rozsáhlým a zářivým systémem prstenců z ledu.',
      en: 'Jewel of the Solar System, famous for its magnificent and brilliant icy ring system.'
    },
    orbitPct: 86,
    sizePx: 13,
    periodDays: 10759.22,
    L0: 49.94432,
    LRate: 0.03346063,
    colors: {
      light: '#fef9c3',
      mid: '#eab308',
      dark: '#713f12'
    },
    glowColor: 'rgba(234, 179, 8, 0.5)',
    rings: {
      rx: 16.5,
      ry: 5.8,
      tiltDeg: -22,
      outerColor: 'rgba(253, 224, 71, 0.85)',
      innerColor: 'rgba(202, 138, 4, 0.6)'
    }
  },
  {
    id: 'uranus',
    name: { cs: 'Uran', en: 'Uranus' },
    symbol: '♅',
    type: { cs: 'Ledový obr', en: 'Ice Giant' },
    orbitPeriod: { cs: '84.01 let', en: '84.01 years' },
    distanceAu: '19.22 AU (2.87 mld. km)',
    moonsCount: 28,
    description: {
      cs: 'Azurový ledový obr s retrográdní rotací a extrémním sklonem osy rotace 98°.',
      en: 'Cyan ice giant with an extreme 98° axial tilt, rolling on its side around the Sun.'
    },
    orbitPct: 93,
    sizePx: 10,
    periodDays: 30685.4,
    L0: 313.23218,
    LRate: 0.01173129,
    colors: {
      light: '#ecfeff',
      mid: '#22d3ee',
      dark: '#0e7490'
    },
    glowColor: 'rgba(34, 211, 238, 0.55)',
    rings: {
      rx: 11,
      ry: 3.8,
      tiltDeg: 72,
      outerColor: 'rgba(165, 243, 252, 0.65)'
    }
  },
  {
    id: 'neptune',
    name: { cs: 'Neptun', en: 'Neptune' },
    symbol: '♆',
    type: { cs: 'Ledový obr', en: 'Ice Giant' },
    orbitPeriod: { cs: '164.8 let', en: '164.8 years' },
    distanceAu: '30.07 AU (4.5 mld. km)',
    moonsCount: 16,
    description: {
      cs: 'Temně modrá nejvzdálenější planeta bičovaná nadzvukovými větry o rychlosti přes 2 000 km/h.',
      en: 'Deep-blue outermost planet, swept by supersonic winds exceeding 2,000 km/h.'
    },
    orbitPct: 99,
    sizePx: 9.5,
    periodDays: 60189.0,
    L0: 304.88003,
    LRate: 0.00598103,
    colors: {
      light: '#bfdbfe',
      mid: '#3b82f6',
      dark: '#1e3a8a'
    },
    glowColor: 'rgba(59, 130, 246, 0.6)'
  }
];

/**
 * Deterministic asteroid belt particles between Mars (63%) and Jupiter (78%)
 */
export const ASTEROID_BELT: AsteroidParticle[] = Array.from({ length: 68 }, (_, i) => {
  const seed = (i * 137.507764) % 360;
  const pseudoRand = Math.sin(i * 12.9898) * 43758.5453;
  const frac = pseudoRand - Math.floor(pseudoRand);
  return {
    angleDeg: seed,
    radiusPct: 70.5 + (frac - 0.5) * 2.8,
    sizePx: 1.1 + (i % 3) * 0.45,
    opacity: 0.3 + frac * 0.45,
    speedDegPerSec: 0.5 + frac * 0.25
  };
});

/**
 * Normalize any angle in degrees to [0, 360)
 */
export function normalizeDegrees(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Convert timestamp in ms to days elapsed since J2000.0 epoch
 */
export function getDaysSinceJ2000(timestampMs: number): number {
  return (timestampMs - J2000_EPOCH_MS) / MS_PER_DAY;
}

/**
 * Compute a planet's orbital angle (degrees [0, 360)) seeded from real J2000 longitude
 * with calm, serene, majestic Keplerian visual motion.
 */
export function getPlanetLongitudeDeg(
  planet: PlanetConfig,
  daysSinceJ2000: number,
  ambientElapsedSec = 0
): number {
  const realLongitude = planet.L0 + planet.LRate * daysSinceJ2000;
  // Scaled to a tranquil, cinematic speed (~4x slower) so motion is smooth and calm
  const visualDegPerSec = Math.pow(365.26 / planet.periodDays, 0.45) * 1.6;
  return normalizeDegrees(realLongitude + ambientElapsedSec * visualDegPerSec);
}
