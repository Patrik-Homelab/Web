import type { AboutStory } from './types';

const galleryImage = '/images/Image-800.webp';
const galleryPreview = '/images/Image-400.webp';
const profile = '/images/PFP.jpg';

const englishAboutStory: AboutStory = {
  title: 'My Custom Story System',
  subtitle:
    'A personal orbit map where each planet is a life area and moons are milestones.',
  hint: 'Click any object to open a quick preview and then expand to full details.',
  entries: [
    {
      id: 'origin-core',
      kind: 'sun',
      title: 'Origin Core',
      subtitle: '2016: first spark',
      preview:
        'The center of everything: first curiosity about web development and the decision to learn real code.',
      full: 'I started with visual web tools, then moved quickly to plain HTML/CSS to understand how things actually work. Soon after, I experimented with simple PHP sessions and login logic. This moment built the base for everything else in my orbit.',
      images: [
        {
          src: profile,
          alt: 'Portrait representing the origin core',
          caption: 'Where the timeline starts.'
        }
      ],
      visual: { orbit: 0, period: 0, size: 5.8, startAngle: 0, theme: 'sun' }
    },
    {
      id: 'school-planet',
      kind: 'planet',
      title: 'School Planet',
      subtitle: 'Formal education path',
      preview:
        'This planet groups my educational journey from high school to current master studies.',
      full: 'I went through chemistry-focused high school, bachelor computer science studies, and now master studies focused on image processing and computer graphics. This is the structured learning orbit that gave me strong technical foundations.',
      images: [
        {
          src: galleryImage,
          alt: 'Education themed image',
          caption: 'A stable long-term orbit.'
        }
      ],
      visual: { orbit: 10, period: 18, size: 2.4, startAngle: 35, theme: 'earth' }
    },
    {
      id: 'school-high-school',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'High School Moon',
      subtitle: '2018-2020',
      preview:
        'Chemistry high school period while learning programming independently at home.',
      full: 'This moon represents a self-driven learning style: I studied chemistry at school but kept building software projects in parallel, which accelerated practical growth.',
      images: [{ src: profile, alt: 'High school milestone image' }],
      visual: { orbit: 3, period: 6.2, size: 1.05, startAngle: 20, theme: 'moon' }
    },
    {
      id: 'school-bachelor',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'Bachelor Moon',
      subtitle: '2022-2025',
      preview:
        'Bachelor studies at VSB-TUO, including C foundations, databases, and thesis migration work.',
      full: 'This milestone covers deep understanding of memory/data representation and core engineering topics. It also includes my bachelor thesis about reactive frontend migration in an e-learning system.',
      images: [{ src: galleryPreview, alt: 'Bachelor milestone image' }],
      visual: { orbit: 3.9, period: 7.8, size: 1.08, startAngle: 130, theme: 'moon' }
    },
    {
      id: 'school-master',
      parentId: 'school-planet',
      kind: 'moon',
      title: 'Master + Thesis Moon',
      subtitle: '2025-present',
      preview: 'Current master studies plus Astro Grader thesis direction.',
      full: 'Now I focus on digital image processing/computer graphics and develop Astro Grader, moving from conventional FITS frame metrics toward custom neural-network grading.',
      images: [
        { src: galleryImage, alt: 'Master and thesis milestone image' },
        { src: galleryPreview, alt: 'Second master milestone image' }
      ],
      visual: { orbit: 4.8, period: 9.2, size: 1.12, startAngle: 250, theme: 'moon' }
    },
    {
      id: 'code-planet',
      kind: 'planet',
      title: 'Code Planet',
      subtitle: 'Programming and career evolution',
      preview:
        'This planet tracks technical growth from PHP era to modern full-stack and team engineering.',
      full: 'From pure PHP projects to JavaScript/Node tooling and then SvelteKit-centric full-stack architecture, this orbit represents the practical build-and-ship line of my journey.',
      images: [{ src: galleryImage, alt: 'Programming and career themed image' }],
      visual: { orbit: 18, period: 30, size: 3, startAngle: 185, theme: 'jupiter' }
    },
    {
      id: 'code-php',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'PHP Moon',
      subtitle: '2018-2020',
      preview:
        'Framework-free systems: admin panels, ticket flows, permission tools, and automations.',
      full: 'This moon captures foundational backend craftsmanship learned by building complete systems manually and keeping them usable in real community environments.',
      images: [{ src: galleryPreview, alt: 'PHP milestone image' }],
      visual: { orbit: 3.3, period: 6.6, size: 1, startAngle: 35, theme: 'moon' }
    },
    {
      id: 'code-js-node',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'JS + Node Moon',
      subtitle: '2020-2022',
      preview: 'Dynamic frontend patterns, Discord bots, and utility tools in NodeJS.',
      full: 'I improved UX using jQuery/AJAX and built bot/tooling systems that merged community work with automation experience.',
      images: [{ src: galleryImage, alt: 'JS and Node milestone image' }],
      visual: { orbit: 4.3, period: 8.1, size: 1.08, startAngle: 148, theme: 'moon' }
    },
    {
      id: 'code-sveltekit',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'SvelteKit Moon',
      subtitle: '2022+',
      preview: 'Major framework shift to SvelteKit for most web work.',
      full: 'After early Next.js exposure, SvelteKit became my preferred stack because of cleaner compile-time behavior and more intuitive DX.',
      images: [{ src: profile, alt: 'SvelteKit milestone image' }],
      visual: { orbit: 5.1, period: 9.6, size: 1.06, startAngle: 250, theme: 'moon' }
    },
    {
      id: 'code-profiq',
      parentId: 'code-planet',
      kind: 'moon',
      title: 'Profiq Moon',
      subtitle: '2025-present',
      preview:
        'Internship-to-ongoing company contribution with React/NestJS and team workflows.',
      full: 'This milestone marks professional delivery in a team environment, stronger collaboration habits, and continued contribution while studying.',
      images: [{ src: galleryImage, alt: 'Professional growth milestone image' }],
      visual: { orbit: 6.1, period: 11.8, size: 1.1, startAngle: 330, theme: 'moon' }
    },
    {
      id: 'astro-planet',
      kind: 'planet',
      title: 'Astro Planet',
      subtitle: 'Astrophotography journey',
      preview:
        'A dedicated planet for space imaging growth: from phone astro mode to deep-sky rig.',
      full: 'This orbit tracks the visual side of my journey: curiosity from smartphone night sky shots, first telescope work, and current deep-sky capture setup.',
      images: [
        {
          src: galleryImage,
          alt: 'Astrophotography themed image',
          caption: 'Space became a second creative track.'
        }
      ],
      visual: { orbit: 29, period: 48, size: 3.4, startAngle: 300, theme: 'neptune' }
    },
    {
      id: 'astro-spark',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'Spark Moon',
      subtitle: 'August 2022',
      preview: 'Pixel astro mode triggered the first serious interest in space imaging.',
      full: 'Phone astrophotography showed what was possible from simple setups and pushed me toward deeper exploration.',
      images: [{ src: profile, alt: 'Astro spark milestone image' }],
      visual: { orbit: 3.8, period: 7.3, size: 1.02, startAngle: 60, theme: 'moon' }
    },
    {
      id: 'astro-telescope',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'First Telescope Moon',
      subtitle: 'May 2023',
      preview:
        'Celestron Astromaster 130EQ opened the door to first proper moon/planet captures.',
      full: 'This milestone marks the transition from mobile experiments to real optical workflow and better astronomical image quality.',
      images: [{ src: galleryPreview, alt: 'First telescope milestone image' }],
      visual: { orbit: 4.9, period: 8.8, size: 1.07, startAngle: 180, theme: 'moon' }
    },
    {
      id: 'astro-rig',
      parentId: 'astro-planet',
      kind: 'moon',
      title: 'Deep-Sky Rig Moon',
      subtitle: 'Present',
      preview:
        'Current setup includes Redcat 51 WIFD, ASI cameras, Radgoll mount, and Gemini focuser.',
      full: 'Now the focus is galaxies, nebulae, and clusters. This technical imaging pipeline also supports Astro Grader development and the thesis direction.',
      images: [
        { src: galleryImage, alt: 'Current deep sky setup image' },
        { src: galleryPreview, alt: 'Second deep sky setup image' }
      ],
      visual: { orbit: 6, period: 11.4, size: 1.12, startAngle: 292, theme: 'moon' }
    },
    {
      id: 'future-planet',
      kind: 'planet',
      title: 'Future Planet',
      subtitle: 'What comes next',
      preview:
        'A forward-looking planet for long-term direction: ML grading, stronger products, and deeper engineering.',
      full: 'This custom planet represents the roadmap: turning Astro Grader into a mature tool, expanding professional impact, and combining software engineering with imaging science.',
      images: [{ src: galleryImage, alt: 'Future direction themed image' }],
      visual: { orbit: 40, period: 66, size: 2.7, startAngle: 120, theme: 'uranus' }
    },
    {
      id: 'future-ml',
      parentId: 'future-planet',
      kind: 'moon',
      title: 'ML Moon',
      subtitle: 'Neural grading target',
      preview:
        'Replacing conventional image quality metrics with a custom-trained model.',
      full: 'This moon marks the thesis-level objective: robust learned grading of raw astro frames for practical workflow automation.',
      images: [{ src: profile, alt: 'Future ML milestone image' }],
      visual: { orbit: 4.1, period: 8.3, size: 1.02, startAngle: 95, theme: 'moon' }
    }
  ]
};

export default englishAboutStory;
