import { Server } from '$/lib/server/server';
import { type Actions, redirect as _redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserState, redirect } from '$/lib/server/functions';

export const load = (async ({ cookies, url }) => {
  const userState = getUserState(cookies);
  if (userState.logged) {
    const nextParam = url.searchParams.get('next');
    if (
      nextParam &&
      nextParam.startsWith('/') &&
      !nextParam.startsWith('//') &&
      !nextParam.includes('\\')
    ) {
      _redirect(302, nextParam);
    } else {
      redirect(302, '/admin');
    }
  }
}) satisfies PageServerLoad;

export const actions = {
  default: Server.actions.login
} satisfies Actions;
