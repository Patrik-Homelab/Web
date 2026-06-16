import { languages } from '$/lib/lang';
import { z } from 'zod';

const articleImage = z.object({
  alt_text: z.string().min(1, 'article.noAltText'),
  article_id: z.string(),
  id: z.number().optional(),
  name: z.string()
});
const articleExposure = z.object({
  article_id: z.string(),
  count: z.number(),
  date: z.coerce.date(),
  exposure_time_s: z.number(),
  id: z.number().optional(),
  type: z.string()
});

export const articleSchema = (lang: keyof typeof languages) =>
  z.object({
    id: z.string().optional(),
    title: z.string().min(1, languages[lang].t.errors.article.noTitle),
    description: z.string().min(1, languages[lang].t.errors.article.noDescrption),
    content_md: z.string().min(1, languages[lang].t.errors.article.noContent),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
    images: z.array(articleImage),
    exposures: z.array(articleExposure),
    equipment: z.array(z.number()),
    object_id: z
      .preprocess(
        (val) =>
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
            ? null
            : String(val),
        z.string().nullable()
      )
      .optional(),
    ra: z
      .preprocess((val) => {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
        ) {
          return null;
        }
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .optional(),
    dec: z
      .preprocess((val) => {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
        ) {
          return null;
        }
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .optional(),
    fov_width: z
      .preprocess((val) => {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
        ) {
          return null;
        }
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .optional(),
    fov_height: z
      .preprocess((val) => {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
        ) {
          return null;
        }
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .optional(),
    fov_rotation: z
      .preprocess((val) => {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          val === 'null' ||
          val === 'undefined'
        ) {
          return null;
        }
        const num = Number(val);
        return isNaN(num) ? null : num;
      }, z.number().nullable())
      .optional()
  });
