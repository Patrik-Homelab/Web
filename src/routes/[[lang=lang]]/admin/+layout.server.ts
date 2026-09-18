import { getUserState, redirect } from '$/lib/server/functions';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url, params }) => {
  const userState = getUserState(cookies);

  if (!userState.logged) {
    redirect(302, `/login?next=${url.pathname}`, params.lang);
  }
}) satisfies LayoutServerLoad;
