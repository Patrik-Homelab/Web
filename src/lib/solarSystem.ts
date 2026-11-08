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
  widthPx: number;
  heightPx: number;
  tiltDeg: number;
  borderColor: string;
  innerBorderColor?: string;
}

export interface PlanetConfig {
  id: PlanetId;
  /** Orbit diameter as percentage of the solar system stage (0 - 100) */
  orbitPct: number;
  /** Planet visual diameter in px */
  sizePx: number;
  /** Semi-major axis in Astronomical Units (AU) */
  au: number;
  /** Sidereal orbital period in Earth days */
  periodDays: number;
  /** Mean ecliptic longitude at J2000.0 epoch (degrees) */
  L0: number;
  /** Mean daily motion (degrees / day) */
  LRate: number;
  /** CSS background (radial/linear gradient) for realistic planetary shading */
  gradient: string;
  /** Outer atmospheric/orbital glow color */
  glowColor: string;
  /** Optional planetary ring system */
  rings?: RingConfig;
  /** Optional natural satellites */
  moons?: MoonConfig[];
}

export interface AsteroidParticle {
  angleDeg: number;
  radiusPct: number;
  sizePx: number;
  opacity: number;
  speedFactor: number;
}

/** J2000.0 Epoch: 2000-01-01 12:00:00 TT/UTC in milliseconds */
export const J2000_EPOCH_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
const MS_PER_DAY = 86_400_000;

/**
 * NASA / JPL J2000.0 mean heliocentric orbital elements & visual styling
 * Orbits are spaced outside the central profile image (which occupies ~52% of the stage)
 */
export const PLANETS: PlanetConfig[] = [
  {
    id: 'mercury',
    orbitPct: 58,
    sizePx: 7,
    au: 0.39,
    periodDays: 87.97,
    L0: 252.25084,
    LRate: 4.09233445,
    gradient: 'radial-gradient(circle at 32% 30%, #f1f5f9 0%, #94a3b8 55%, #475569 100%)',
    glowColor: 'rgba(148, 163, 184, 0.55)'
  },
  {
    id: 'venus',
    orbitPct: 63.5,
    sizePx: 9.5,
    au: 0.72,
    periodDays: 224.7,
    L0: 181.97973,
    LRate: 1.60213034,
    gradient: 'radial-gradient(circle at 30% 30%, #fef9c3 0%, #fbbf24 52%, #b45309 100%)',
    glowColor: 'rgba(251, 191, 36, 0.65)'
  },
  {
    id: 'earth',
    orbitPct: 69.5,
    sizePx: 10.5,
    au: 1.0,
    periodDays: 365.26,
    L0: 100.46435,
    LRate: 0.98560912,
    gradient:
      'radial-gradient(circle at 30% 28%, #bae6fd 0%, #2563eb 48%, #10b981 68%, #0f172a 100%)',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    moons: [
      {
        id: 'moon',
        radiusPx: 11,
        sizePx: 3,
        periodDays: 27.32,
        initialPhaseDeg: 45,
        color: '#e2e8f0'
      }
    ]
  },
  {
    id: 'mars',
    orbitPct: 75,
    sizePx: 8.5,
    au: 1.52,
    periodDays: 686.98,
    L0: 355.45332,
    LRate: 0.52403304,
    gradient: 'radial-gradient(circle at 32% 30%, #fed7aa 0%, #ea580c 55%, #7c2d12 100%)',
    glowColor: 'rgba(234, 88, 12, 0.65)'
  },
  {
    id: 'jupiter',
    orbitPct: 83.5,
    sizePx: 15,
    au: 5.2,
    periodDays: 4332.59,
    L0: 34.40438,
    LRate: 0.08308677,
    gradient:
      'linear-gradient(160deg, #fde68a 0%, #d97706 25%, #fed7aa 45%, #b45309 62%, #f59e0b 80%, #78350f 100%)',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    moons: [
      {
        id: 'io',
        radiusPx: 12.5,
        sizePx: 2.8,
        periodDays: 1.77,
        initialPhaseDeg: 20,
        color: '#fde047'
      },
      {
        id: 'europa',
        radiusPx: 16,
        sizePx: 2.5,
        periodDays: 3.55,
        initialPhaseDeg: 195,
        color: '#bae6fd'
      }
    ]
  },
  {
    id: 'saturn',
    orbitPct: 90,
    sizePx: 12.5,
    au: 9.58,
    periodDays: 10759.22,
    L0: 49.94432,
    LRate: 0.03346063,
    gradient: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #eab308 55%, #854d0e 100%)',
    glowColor: 'rgba(234, 179, 8, 0.55)',
    rings: {
      widthPx: 30,
      heightPx: 10,
      tiltDeg: -24,
      borderColor: 'rgba(253, 224, 71, 0.75)',
      innerBorderColor: 'rgba(202, 138, 4, 0.45)'
    }
  },
  {
    id: 'uranus',
    orbitPct: 95,
    sizePx: 10,
    au: 19.22,
    periodDays: 30685.4,
    L0: 313.23218,
    LRate: 0.01173129,
    gradient: 'radial-gradient(circle at 30% 30%, #ecfeff 0%, #22d3ee 55%, #0e7490 100%)',
    glowColor: 'rgba(34, 211, 238, 0.6)',
    rings: {
      widthPx: 19,
      heightPx: 6,
      tiltDeg: 78,
      borderColor: 'rgba(165, 243, 252, 0.35)'
    }
  },
  {
    id: 'neptune',
    orbitPct: 99.5,
    sizePx: 9.5,
    au: 30.11,
    periodDays: 60189.0,
    L0: 304.88003,
    LRate: 0.00598103,
    gradient: 'radial-gradient(circle at 30% 30%, #93c5fd 0%, #3b82f6 52%, #1e3a8a 100%)',
    glowColor: 'rgba(59, 130, 246, 0.65)'
  }
];

/**
 * Deterministic asteroid belt particles between Mars (75%) and Jupiter (83.5%)
 */
export const ASTEROID_BELT: AsteroidParticle[] = Array.from({ length: 64 }, (_, i) => {
  // Golden-angle distribution for natural spacing
  const seed = (i * 137.507764) % 360;
  const pseudoRand = Math.sin(i * 12.9898) * 43758.5453;
  const frac = pseudoRand - Math.floor(pseudoRand);
  return {
    angleDeg: seed,
    radiusPct: 78.2 + (frac - 0.5) * 2.2,
    sizePx: 1 + (i % 3) * 0.55,
    opacity: 0.22 + frac * 0.45,
    speedFactor: 0.85 + frac * 0.3
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
 * Compute a planet's heliocentric ecliptic longitude (degrees [0, 360))
 * at a given J2000 day count, plus an optional visual ambient drift (in degrees)
 */
export function getPlanetLongitudeDeg(
  planet: PlanetConfig,
  daysSinceJ2000: number,
  ambientElapsedSec = 0
): number {
  // Real astronomical longitude at `daysSinceJ2000`
  const realLongitude = planet.L0 + planet.LRate * daysSinceJ2000;
  // Gentle Keplerian-scaled visual drift so even in "Live J2000" mode the orbits feel alive
  const gentleVisualDegPerSec = Math.pow(365.26 / planet.periodDays, 0.55) * 1.4;
  return normalizeDegrees(realLongitude + ambientElapsedSec * gentleVisualDegPerSec);
}
