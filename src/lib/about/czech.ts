import type { AboutStory } from './types';

const galleryImage = '/images/Image-800.webp';
const galleryPreview = '/images/Image-400.webp';
const profile = '/images/PFP.jpg';

const czechContentMap = import.meta.glob('./content/cs/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

const fullContent = (id: string) => czechContentMap[`./content/cs/${id}.md`] ?? '';

const czechAboutStory: AboutStory = {
  title: 'Můj vlastní příběhový systém',
  subtitle: 'Osobní orbita, kde planety jsou oblasti života a měsíce jsou milníky.',
  hint: 'Klikni na objekt pro rychlý náhled a potom rozbal celý detail.',
  entries: [
    {
      id: 'origin-core',
      kind: 'sun',
      title: 'Jádro začátku',
      subtitle: '2016: první jiskra',
      preview: 'Centrum všeho: první zájem o weby a rozhodnutí učit se skutečný kód.',
      full: fullContent('origin-core'),
      images: [
        {
          src: profile,
          alt: 'Portrét reprezentující počátek',
          caption: 'Bod, odkud vše vychází.'
        }
      ],
      visual: { orbit: 0, period: 0, size: 5.8, startAngle: 0, theme: 'sun' }
    },
    {
      id: 'school-planet',
      kind: 'planet',
      title: 'Planeta školy',
      subtitle: 'Formální vzdělávací dráha',
      preview:
        'Tato planeta shrnuje cestu od střední školy přes bakaláře po současné navazující studium.',
      full: fullContent('school-planet'),
      images: [
        {
          src: galleryImage,
          alt: 'Obrázek pro vzdělávací planetu',
          caption: 'Stabilní dlouhodobá orbita.'
        }
      ],
      visual: { orbit: 10, period: 18, size: 2.4, startAngle: 35, theme: 'earth' }
    },
    {
      id: 'school-high-school',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'Měsíc střední školy',
      subtitle: '2018-2020',
      preview: 'Chemická střední škola a paralelní samostudium programování doma.',
      full: fullContent('school-high-school'),
      images: [{ src: profile, alt: 'Milník střední školy' }],
      visual: { orbit: 3, period: 6.2, size: 1.05, startAngle: 20, theme: 'moon' }
    },
    {
      id: 'school-bachelor',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'Měsíc bakaláře',
      subtitle: '2022-2025',
      preview: 'Bakalář na VSB-TUO, základy C, databází a migrační bakalářská práce.',
      full: fullContent('school-bachelor'),
      images: [{ src: galleryPreview, alt: 'Milník bakalářského studia' }],
      visual: { orbit: 3.9, period: 7.8, size: 1.08, startAngle: 130, theme: 'moon' }
    },
    {
      id: 'school-master',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'Měsíc navazujícího studia',
      subtitle: '2025-současnost',
      preview: 'Současné navazující studium a směr diplomky Astro Grader.',
      full: fullContent('school-master'),
      images: [
        { src: galleryImage, alt: 'Milník navazujícího studia' },
        { src: galleryPreview, alt: 'Druhý obrázek milníku navazujícího studia' }
      ],
      visual: { orbit: 4.8, period: 9.2, size: 1.12, startAngle: 250, theme: 'moon' }
    },
    {
      id: 'code-planet',
      kind: 'planet',
      title: 'Planeta kódu',
      subtitle: 'Vývoj programování a kariéry',
      preview: 'Od PHP éry přes JS/Node až po moderní full-stack a týmovou praxi.',
      full: fullContent('code-planet'),
      images: [{ src: galleryImage, alt: 'Obrázek pro planetu kódu' }],
      visual: { orbit: 18, period: 30, size: 3, startAngle: 185, theme: 'jupiter' }
    },
    {
      id: 'code-php',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'PHP měsíc',
      subtitle: '2018-2020',
      preview: 'Ruční systémy bez frameworku: admin, tickety, práva a automatizace.',
      full: fullContent('code-php'),
      images: [{ src: galleryPreview, alt: 'Milník PHP' }],
      visual: { orbit: 3.3, period: 6.6, size: 1, startAngle: 35, theme: 'moon' }
    },
    {
      id: 'code-js-node',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'JS + Node měsíc',
      subtitle: '2020-2022',
      preview: 'Dynamičtější frontend, Discord boti a utility nástroje.',
      full: fullContent('code-js-node'),
      images: [{ src: galleryImage, alt: 'Milník JS a Node' }],
      visual: { orbit: 4.3, period: 8.1, size: 1.08, startAngle: 148, theme: 'moon' }
    },
    {
      id: 'code-sveltekit',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'SvelteKit měsíc',
      subtitle: '2022+',
      preview: 'Velký frameworkový posun na SvelteKit pro většinu webových projektů.',
      full: fullContent('code-sveltekit'),
      images: [{ src: profile, alt: 'Milník SvelteKitu' }],
      visual: { orbit: 5.1, period: 9.6, size: 1.06, startAngle: 250, theme: 'moon' }
    },
    {
      id: 'code-profiq',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'Profiq měsíc',
      subtitle: '2025-současnost',
      preview: 'Stáž a následná firemní spolupráce s React/NestJS.',
      full: fullContent('code-profiq'),
      images: [{ src: galleryImage, alt: 'Milník profesního růstu' }],
      visual: { orbit: 6.1, period: 11.8, size: 1.1, startAngle: 330, theme: 'moon' }
    },
    {
      id: 'astro-planet',
      kind: 'planet',
      title: 'Astro planeta',
      subtitle: 'Cesta astrofotografie',
      preview: 'Samostatná planeta pro růst od mobilního astro módu po deep-sky rig.',
      full: fullContent('astro-planet'),
      images: [
        {
          src: galleryImage,
          alt: 'Obrázek pro astro planetu',
          caption: 'Vesmír jako druhá kreativní osa.'
        }
      ],
      visual: { orbit: 29, period: 48, size: 3.4, startAngle: 300, theme: 'neptune' }
    },
    {
      id: 'astro-spark',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'Měsíc jiskry',
      subtitle: 'Srpen 2022',
      preview: 'Pixel astro mód spustil první vážný zájem o noční oblohu.',
      full: fullContent('astro-spark'),
      images: [{ src: profile, alt: 'Milník astro jiskry' }],
      visual: { orbit: 3.8, period: 7.3, size: 1.02, startAngle: 60, theme: 'moon' }
    },
    {
      id: 'astro-telescope',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'Měsíc prvního teleskopu',
      subtitle: 'Květen 2023',
      preview: 'Celestron Astromaster 130EQ a první lepší snímky Měsíce/planet.',
      full: fullContent('astro-telescope'),
      images: [{ src: galleryPreview, alt: 'Milník prvního teleskopu' }],
      visual: { orbit: 4.9, period: 8.8, size: 1.07, startAngle: 180, theme: 'moon' }
    },
    {
      id: 'astro-rig',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'Měsíc deep-sky rigu',
      subtitle: 'Současnost',
      preview: 'Redcat 51 WIFD, ASI kamery, Radgoll montáž a Gemini focuser.',
      full: fullContent('astro-rig'),
      images: [
        { src: galleryImage, alt: 'Současný deep-sky setup' },
        { src: galleryPreview, alt: 'Druhý obrázek deep-sky setupu' }
      ],
      visual: { orbit: 6, period: 11.4, size: 1.12, startAngle: 292, theme: 'moon' }
    },
    {
      id: 'future-planet',
      kind: 'planet',
      title: 'Planeta budoucnosti',
      subtitle: 'Další směr',
      preview: 'Výhledová planeta pro ML grading, produktový růst a hlubší engineering.',
      full: fullContent('future-planet'),
      images: [{ src: galleryImage, alt: 'Obrázek pro budoucí směr' }],
      visual: { orbit: 40, period: 66, size: 2.7, startAngle: 120, theme: 'uranus' }
    },
    {
      id: 'future-ml',
      parentId: 'future-planet',
      kind: 'moon',
      title: 'ML měsíc',
      subtitle: 'Cíl neuronového hodnocení',
      preview: 'Nahrazení klasických metrik kvality vlastním učeným modelem.',
      full: fullContent('future-ml'),
      images: [{ src: profile, alt: 'Milník budoucího ML směru' }],
      visual: { orbit: 4.1, period: 8.3, size: 1.02, startAngle: 95, theme: 'moon' }
    }
  ]
};

export default czechAboutStory;
