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

export interface PlanetConfig {
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
