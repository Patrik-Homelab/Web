import type { AboutStory } from './types';

const galleryImage = '/images/Image-800.webp';
const galleryPreview = '/images/Image-400.webp';
const profile = '/images/PFP.jpg';

const englishAboutStory: AboutStory = {
  title: 'Solar Story Map',
  subtitle:
    'Real planets, real motion, and my timeline as events orbiting through the system.',
  hint: 'Click any body to open its preview. Expand inside the popup for the full story.',
  entries: [
    {
      id: 'sun-origin',
      kind: 'sun',
      title: 'Sun',
      subtitle: '2016: Start of the story',
      preview:
        'Everything starts here: my first interest in web development and my move from drag-and-drop builders to real code.',
      full: 'In the 8th grade I experimented with WYSIWYG editors and bulky HTML exports, but quickly switched to clean HTML and CSS because I wanted to understand how websites really work. Soon after, I added simple PHP session-based authentication and learned the basics of server-side logic and user login flow.',
      images: [
        {
          src: profile,
          alt: 'Portrait image for story origin',
          caption: 'The first spark.'
        }
      ],
      visual: { orbit: 0, period: 0, size: 5.8, startAngle: 0, theme: 'sun' }
    },
    {
      id: 'mercury',
      kind: 'planet',
      title: 'Mercury',
      subtitle: 'Fast first experiments',
      preview:
        'Early learning period: fast iterations, curiosity, and many tiny prototype websites.',
      full: 'This phase captures the very early momentum where everything was new and moving quickly. I focused on understanding fundamentals and turning every small experiment into practical experience.',
      images: [{ src: galleryPreview, alt: 'Mercury placeholder image' }],
      visual: { orbit: 8, period: 9, size: 1.4, startAngle: 40, theme: 'mercury' }
    },
    {
      id: 'venus',
      kind: 'planet',
      title: 'Venus',
      subtitle: '2018-2020: PHP era',
      preview:
        'I built framework-free PHP systems including automation, ticketing, permissions, and server tools.',
      full: 'I regularly used PHP and built projects from scratch: administration systems, SSH-driven automation for bot deployment, and complex information panels for gaming communities. This period taught me pragmatic backend development and maintenance in real usage conditions.',
      images: [{ src: galleryImage, alt: 'Venus placeholder image' }],
      visual: { orbit: 12, period: 14, size: 2.1, startAngle: 120, theme: 'venus' }
    },
    {
      id: 'earth',
      kind: 'planet',
      title: 'Earth',
      subtitle: 'Education orbit',
      preview:
        'From high school to bachelor and master studies in computer science, image processing, and graphics.',
      full: 'I studied at chemistry-focused high school while learning programming independently. Then I moved to VSB-TUO for bachelor studies in computer science and learned low-level memory concepts, C/C++/C#/Python fundamentals, and database design. I now continue in master studies focused on digital image processing and computer graphics, including Rust and thesis work.',
      images: [
        {
          src: galleryImage,
          alt: 'Earth education image',
          caption: 'Education became a long stable orbit.'
        },
        { src: profile, alt: 'Second education image' }
      ],
      visual: { orbit: 16, period: 20, size: 2.3, startAngle: 200, theme: 'earth' }
    },
    {
      id: 'moon',
      parentId: 'earth',
      kind: 'moon',
      title: 'Moon',
      subtitle: 'School milestones',
      preview:
        'High school chemistry path, bachelor graduation, and current master + Astro Grader thesis track.',
      full: 'Key milestones include: chemistry high school in Ostrava (2018-2020), bachelor thesis about reactive frontend migration (Svelte 3 to Vue 3 in Kelvin, plus Django API updates), and current master project Astro Grader for FITS image quality filtering with future neural-network grading.',
      images: [
        { src: galleryPreview, alt: 'Moon milestone image' },
        { src: galleryImage, alt: 'Moon milestone image 2' }
      ],
      visual: { orbit: 3.6, period: 7.3, size: 1.05, startAngle: 20, theme: 'moon' }
    },
    {
      id: 'mars',
      kind: 'planet',
      title: 'Mars',
      subtitle: '2020-2022: JavaScript + NodeJS',
      preview:
        'I moved deeper into JavaScript, AJAX frontends, and NodeJS bots, including Discord projects.',
      full: 'I used jQuery and AJAX to build smoother no-reload interfaces for community systems. At the same time, I developed NodeJS Discord bots that started as private experiments and evolved toward public usage, while also building utility tools for chemistry calculations.',
      images: [{ src: galleryPreview, alt: 'Mars development image' }],
      visual: { orbit: 20, period: 26, size: 1.8, startAngle: 330, theme: 'mars' }
    },
    {
      id: 'phobos',
      parentId: 'mars',
      kind: 'moon',
      title: 'Phobos',
      subtitle: 'Fast iterations',
      preview: 'Small but fast-moving milestone for rapid frontend experiments.',
      full: 'Represents quick trial-and-error loops that improved implementation speed and confidence.',
      images: [{ src: profile, alt: 'Phobos moon image' }],
      visual: { orbit: 2.6, period: 4.6, size: 0.82, startAngle: 50, theme: 'moon' }
    },
    {
      id: 'deimos',
      parentId: 'mars',
      kind: 'moon',
      title: 'Deimos',
      subtitle: 'Backend script support',
      preview: 'Supportive moon for utility scripts and automation around projects.',
      full: 'Captures the parallel script tooling that continuously helped operations and productivity.',
      images: [{ src: galleryPreview, alt: 'Deimos moon image' }],
      visual: { orbit: 3.3, period: 6.4, size: 0.78, startAngle: 200, theme: 'moon' }
    },
    {
      id: 'jupiter',
      kind: 'planet',
      title: 'Jupiter',
      subtitle: '2022+: SvelteKit and full-stack expansion',
      preview:
        'The biggest shift: discovering SvelteKit and building most web projects with it.',
      full: 'After initial exposure to Next.js, I discovered SvelteKit and preferred its compile-time model and syntax. It became my main framework for personal and community projects, including my personal site and wiki tools.',
      images: [{ src: galleryImage, alt: 'Jupiter framework image' }],
      visual: { orbit: 26, period: 36, size: 3.7, startAngle: 145, theme: 'jupiter' }
    },
    {
      id: 'io',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Io',
      subtitle: 'SvelteKit discovery',
      preview: 'The point where SvelteKit became my default stack.',
      full: 'This moon marks the transition from copying framework patterns to fully understanding and enjoying how I build full-stack applications.',
      images: [{ src: profile, alt: 'Io moon image' }],
      visual: { orbit: 3.4, period: 6.1, size: 0.95, startAngle: 18, theme: 'moon' }
    },
    {
      id: 'europa',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Europa',
      subtitle: 'Bachelor thesis frontend migration',
      preview: 'Reactive frontend migration from Svelte 3 setup to Vue 3 architecture.',
      full: 'I worked on concurrent framework operation during transition, updated components, and expanded backend understanding through Django API endpoint changes.',
      images: [{ src: galleryPreview, alt: 'Europa moon image' }],
      visual: { orbit: 4.2, period: 7.2, size: 1.02, startAngle: 98, theme: 'moon' }
    },
    {
      id: 'ganymede',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Ganymede',
      subtitle: 'TRPC-like API and full-stack patterns',
      preview:
        'Growing architecture quality with typed APIs, reusable components, and stronger data models.',
      full: 'This milestone represents maturity in project structure: composable components, typed procedures, and better maintainability.',
      images: [{ src: galleryImage, alt: 'Ganymede moon image' }],
      visual: { orbit: 5, period: 8.8, size: 1.08, startAngle: 190, theme: 'moon' }
    },
    {
      id: 'callisto',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Callisto',
      subtitle: 'Utility projects and bots',
      preview:
        'Discord/Twitch automation and utility scripts stayed a parallel line across years.',
      full: 'From League and community stats bots to utility scripts, this thread kept improving my event-driven and integration skills.',
      images: [{ src: profile, alt: 'Callisto moon image' }],
      visual: { orbit: 5.8, period: 10.1, size: 1.05, startAngle: 285, theme: 'moon' }
    },
    {
      id: 'amalthea',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Amalthea',
      subtitle: 'Community tooling',
      preview: 'Extra orbit for practical side tools around larger projects.',
      full: 'Represents lightweight community and utility solutions delivered outside core milestones.',
      images: [{ src: galleryPreview, alt: 'Amalthea moon image' }],
      visual: { orbit: 6.4, period: 11.5, size: 0.88, startAngle: 340, theme: 'moon' }
    },
    {
      id: 'himalia',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Himalia',
      subtitle: 'Stack adaptation',
      preview: 'Ability to switch between stacks and still deliver.',
      full: 'Marks flexibility between frameworks and contexts when collaborating with different teams.',
      images: [{ src: profile, alt: 'Himalia moon image' }],
      visual: { orbit: 7.2, period: 12.8, size: 0.82, startAngle: 66, theme: 'moon' }
    },
    {
      id: 'saturn',
      kind: 'planet',
      title: 'Saturn',
      subtitle: '2025-present: Professional team experience',
      preview:
        'Internship to ongoing work at Profiq with React and NestJS in team projects.',
      full: 'I joined Profiq for a three-month internship, learned React and NestJS in practical team delivery, and stayed to continue helping on smaller projects while studying. This period strengthened collaboration and agile execution in real company context.',
      images: [{ src: galleryImage, alt: 'Saturn career image' }],
      visual: { orbit: 32, period: 48, size: 3.3, startAngle: 260, theme: 'saturn' }
    },
    {
      id: 'titan',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Titan',
      subtitle: 'Internship launch',
      preview: 'Starting point at Profiq and first internal project contributions.',
      full: 'I quickly adapted to the company workflow and delivered value in internal product efforts.',
      images: [{ src: profile, alt: 'Titan moon image' }],
      visual: { orbit: 3.8, period: 8.1, size: 1.08, startAngle: 45, theme: 'moon' }
    },
    {
      id: 'enceladus',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Enceladus',
      subtitle: 'React + NestJS growth',
      preview: 'Focused skill growth in modern frontend/backend frameworks.',
      full: 'This moon marks practical learning under production constraints: architecture clarity, task planning, and clean collaboration.',
      images: [{ src: galleryPreview, alt: 'Enceladus moon image' }],
      visual: { orbit: 4.7, period: 9.4, size: 0.95, startAngle: 180, theme: 'moon' }
    },
    {
      id: 'rhea',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Rhea',
      subtitle: 'Ongoing contribution',
      preview:
        'Continuous work alongside studies on smaller tasks and project improvements.',
      full: 'The path remains active: balancing academic progress with practical engineering output.',
      images: [{ src: galleryImage, alt: 'Rhea moon image' }],
      visual: { orbit: 5.7, period: 10.9, size: 1, startAngle: 300, theme: 'moon' }
    },
    {
      id: 'mimas',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Mimas',
      subtitle: 'Small production wins',
      preview: 'Small tasks that improve product quality over time.',
      full: 'Not every milestone is huge. This orbit represents the constant stream of smaller improvements.',
      images: [{ src: galleryPreview, alt: 'Mimas moon image' }],
      visual: { orbit: 6.4, period: 12.4, size: 0.84, startAngle: 128, theme: 'moon' }
    },
    {
      id: 'dione',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Dione',
      subtitle: 'Team process maturity',
      preview: 'Improved planning and communication in delivery.',
      full: 'Represents how structure and communication quality improved during team projects.',
      images: [{ src: profile, alt: 'Dione moon image' }],
      visual: { orbit: 7.3, period: 13.7, size: 0.9, startAngle: 212, theme: 'moon' }
    },
    {
      id: 'iapetus',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Iapetus',
      subtitle: 'Long-term continuity',
      preview: 'Maintaining momentum while balancing studies and work.',
      full: 'This orbit marks consistency: staying active in both academic and practical engineering tracks.',
      images: [{ src: galleryImage, alt: 'Iapetus moon image' }],
      visual: { orbit: 8.1, period: 15.2, size: 0.86, startAngle: 18, theme: 'moon' }
    },
    {
      id: 'uranus',
      kind: 'planet',
      title: 'Uranus',
      subtitle: 'Astro spark and first telescope',
      preview:
        'The astronomy path started with phone astro mode and moved to first real telescope captures.',
      full: 'In 2022, Pixel astro mode ignited strong curiosity about the night sky. In 2023 I received Celestron Astromaster 130EQ and captured my first proper moon and planet images.',
      images: [
        { src: galleryImage, alt: 'Uranus astrophotography image' },
        { src: galleryPreview, alt: 'Uranus second image' }
      ],
      visual: { orbit: 38, period: 62, size: 2.7, startAngle: 50, theme: 'uranus' }
    },
    {
      id: 'neptune',
      kind: 'planet',
      title: 'Neptune',
      subtitle: 'Deep-sky rig and future AI grading',
      preview:
        'Current deep-sky setup and long-term direction connected to Astro Grader.',
      full: 'My current rig includes Redcat 51 WIFD, ASI 585MC Pro, Uniguide 31mm, ASI678MC, Radgoll 17 Pro mount, and Gemini focuser. I focus on galaxies, nebulae, and clusters. This astrophotography pipeline directly feeds my thesis direction: replacing conventional frame metrics with a custom-trained neural network.',
      images: [
        { src: galleryImage, alt: 'Neptune deep sky setup image' },
        { src: profile, alt: 'Neptune supporting image' }
      ],
      visual: { orbit: 44, period: 78, size: 2.65, startAngle: 190, theme: 'neptune' }
    }
  ]
};

export default englishAboutStory;
