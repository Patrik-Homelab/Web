import type { ErrorPath } from '$/lib/lang';
import { env } from '$/lib/server/env';
import type { Response, ResponseWithData } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import fs from 'node:fs/promises';
import Path from 'node:path';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { cleanupImageCache, isFile, uploadFile } from '../functions';

const FILE_FOLDER = env.FILE_FOLDER;

export default [
  loggedProcedure.POST.input(FormDataInput).query(async ({ input }) => {
    const file = input.get('file');

    if (file === null) {
      return {
        status: false,
        code: 400,
        message: 'upload.missing' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }

    if (!(file instanceof File)) {
      return {
        status: false,
        code: 400,
        message: 'upload.invalidFile' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }

    try {
      const imageName = await uploadFile(file);

      if (!imageName) {
        return {
          status: false,
          code: 400,
          message: 'upload.invalidFile' satisfies ErrorPath
        } satisfies ErrorApiResponse;
      }

      return {
        status: true,
        data: imageName
      } satisfies ResponseWithData<string>;
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: 500,
        message: 'upload.error' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }
  }),
  loggedProcedure.DELETE.input(z.string()).query(async ({ input }) => {
    const safeBaseName = Path.basename(input);
    const resolvedFolder = Path.resolve(FILE_FOLDER);
    const targetPath = Path.resolve(FILE_FOLDER, safeBaseName);

    if (safeBaseName !== input || !targetPath.startsWith(resolvedFolder + Path.sep)) {
      return {
        status: false,
        code: 400,
        message: 'upload.invalidFile' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }

    if (!(await isFile(targetPath))) {
      return {
        status: false,
        code: 404,
        message: 'upload.notFound' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }

    await fs.unlink(targetPath);
    await cleanupImageCache(input);

    return {
      status: true
    } satisfies Response;
  })
];
