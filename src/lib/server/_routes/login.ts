import type { ErrorPath } from '$/lib/lang';
import { env } from '$/lib/server/env';
import type { ActionsResponse, Response } from '$/types/types';
import { FormDataInput } from '@patrick115/sveltekitapi';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { procedure } from '../api';
import { conn, jwt } from '../variables';

// Rate limiting: max 5 failed attempts per 5 minutes per IP
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    return true;
  }
  return entry.count < 5;
};

const recordFailedAttempt = (ip: string) => {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
};

const clearFailedAttempts = (ip: string) => {
  loginAttempts.delete(ip);
};

export default procedure.POST.input(FormDataInput).query(
  async ({ input, ev: { cookies, getClientAddress, request } }) => {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      getClientAddress?.() ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return fail(401, {
        status: false,
        message: 'login.form' satisfies ErrorPath
      } satisfies ActionsResponse);
    }

    const username = input.get('username') as string | null;
    const password = input.get('password') as string | null;
    const COOKIE_EXPIRE = env.COOKIE_EXPIRE;

    if (!username || !password) {
      return fail(401, {
        status: false,
        message: 'login.form' satisfies ErrorPath
      } satisfies ActionsResponse);
    }

    const data = await conn
      .selectFrom('account')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();

    const isPasswordValid = data ? await bcrypt.compare(password, data.password) : false;

    if (!data || !isPasswordValid) {
      recordFailedAttempt(ip);
      return fail(401, {
        status: false,
        message: 'login.form' satisfies ErrorPath
      } satisfies ActionsResponse);
    }

    clearFailedAttempts(ip);

    const userData = {
      ...data,
      password: undefined
    };

    const session = jwt.setCookie(userData, COOKIE_EXPIRE);

    cookies.set('session', session, {
      path: '/',
      maxAge: COOKIE_EXPIRE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return {
      status: true
    } satisfies Response;
  }
);
