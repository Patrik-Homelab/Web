/**
 * Compute rotated sky-coordinate polygon corners [RA, Dec] (in degrees)
 * for an imaging sensor footprint centered at (ra, dec).
 */
export function computeFovPolygon(
  ra: number,
  dec: number,
  fovWidth: number,
  fovHeight: number,
  fovRotation = 0
): [number, number][] {
  const rad = Math.PI / 180;
  const cosDec = Math.cos(dec * rad) || 1;
  const angleRad = -fovRotation * rad;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  const halfW = fovWidth / 2;
  const halfH = fovHeight / 2;

  return [
    [-halfW, -halfH],
    [halfW, -halfH],
    [halfW, halfH],
    [-halfW, halfH]
  ].map(([x, y]) => {
    const rx = x * cosAngle - y * sinAngle;
    const ry = x * sinAngle + y * cosAngle;
    return [ra + rx / cosDec, dec + ry];
  });
}

/**
 * Compute an adaptive horizontal Aladin FoV (degrees) so the rotated sensor frame
 * fits comfortably inside a viewport of the given aspect ratio.
 */
export function computeAdaptiveFov(
  fovWidth: number | null,
  fovHeight: number | null,
  fovRotation: number | null,
  aspect: number,
  margin = 1.58
): number {
  const safeAspect = aspect > 0 ? aspect : 1;

  if (fovWidth && fovHeight) {
    const rotRad = ((fovRotation || 0) * Math.PI) / 180;
    const spanX =
      fovWidth * Math.abs(Math.cos(rotRad)) + fovHeight * Math.abs(Math.sin(rotRad));
    const spanY =
      fovWidth * Math.abs(Math.sin(rotRad)) + fovHeight * Math.abs(Math.cos(rotRad));

    const minFovX = Math.max(spanX, spanY * safeAspect);
    return Number((minFovX * margin).toFixed(4));
  }

  if (fovWidth) {
    return Number((fovWidth * Math.max(1, safeAspect) * margin).toFixed(4));
  }

  return 2.0;
}

/**
 * Format Right Ascension in degrees [0, 360) as HHh MMm SS.Ss.
 */
export function formatRaHms(raDeg: number): string {
  const normalized = ((raDeg % 360) + 360) % 360;
  const totalHours = normalized / 15;
  const hours = Math.floor(totalHours);
  const remMin = (totalHours - hours) * 60;
  const minutes = Math.floor(remMin);
  const seconds = (remMin - minutes) * 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(1).padStart(4, '0')}s`;
}

/**
 * Format Declination in degrees [-90, +90] as ±DD° MM′ SS″.
 */
export function formatDecDms(decDeg: number): string {
  const sign = decDeg >= 0 ? '+' : '−';
  const abs = Math.abs(decDeg);
  const degrees = Math.floor(abs);
  const remMin = (abs - degrees) * 60;
  const minutes = Math.floor(remMin);
  const seconds = Math.round((remMin - minutes) * 60);
  return `${sign}${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}′ ${seconds.toString().padStart(2, '0')}″`;
}
