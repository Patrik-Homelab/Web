const TRUSTED_PROXIES = new Set([
  '10.10.10.224',
  '::ffff:10.10.10.224',
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1'
]);

export function getClientIp(request: Request, getClientAddress?: () => string): string {
  let directIp = '';
  if (getClientAddress) {
    try {
      directIp = getClientAddress();
    } catch {
      directIp = '';
    }
  }

  const isTrusted =
    TRUSTED_PROXIES.has(directIp) ||
    directIp.startsWith('127.') ||
    directIp === 'localhost';

  if (isTrusted) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      const firstIp = forwardedFor.split(',')[0]?.trim();
      if (firstIp) return firstIp;
    }
    const realIp = request.headers.get('x-real-ip')?.trim();
    if (realIp) return realIp;
  }

  return directIp || '127.0.0.1';
}
