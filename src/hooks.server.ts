import type { Handle } from '@sveltejs/kit';
import { getClientIp } from './lib/server/network';
import { logVisitor } from './lib/server/visitorLogger';

export const handle = (async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  const disallowedPaths = ['/api'];
  const UA = event.request.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|slurp/i.test(UA);

  if (
    !isBot &&
    response.status === 200 &&
    !event.locals.is404 &&
    !disallowedPaths.some((p) => path.startsWith(p))
  ) {
    logVisitor({
      ip: getClientIp(event.request, () => event.getClientAddress()),
      page: path,
      user_agent: UA
    });
  }

  return response;
}) satisfies Handle;
