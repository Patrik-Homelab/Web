export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  image?: string;
}

export interface Movie {
  title: string;
  type: string;
  year: string;
  rating: string;
  review: string;
  image?: string;
}

export interface CardData {
  id: 'education' | 'programming' | 'astrophotography';
  planetClass: string;
  colors: {
    border: string;
    text: string;
    bg: string;
    glow: string;
    badge: string;
  };
  translations: {
    cs: {
      name: string;
      category: string;
      shortDesc: string;
      tags: string[];
      timeline: TimelineEvent[];
    };
    en: {
      name: string;
      category: string;
      shortDesc: string;
      tags: string[];
      timeline: TimelineEvent[];
    };
  };
}

export const aboutCards: CardData[] = [
  {
    id: 'education',
    planetClass: 'planet-saturn',
    colors: {
      border: 'border-amber-500/30 hover:border-amber-400/60',
      text: 'text-amber-400',
      bg: 'from-amber-600/10 to-orange-600/10',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    translations: {
      cs: {
        name: 'Academia',
        category: 'Vzdělání',
        shortDesc: 'Moje akademická cesta světem informatiky a technologií.',
        tags: ['VŠB-TUO', 'Informatika'],
        timeline: [
          {
            year: '2018 - 2022',
            title: 'Střední průmyslová škola chemická',
            desc: 'Po nástupu jsem zjistil, že většina spolužáků má mnohem lepší základy chemie než já. Postupem let mě laboratoře velmi chytly, i když organická chemie byla oříšek. Během distanční výuky při Covidu-19 se moje rutina zúžila na probuzení, připojení na Teams a hraní her. Školu jsem úspěšně zakončil maturitou a rozhodl se jít studovat informatiku na VŠB-TUO, abych se naučil věci, ke kterým bych sám doma nenašel motivaci.',
            image: ''
          },
          {
            year: '2022 - 2025',
            title: 'Bakalářské studium Informatiky',
            desc: 'Studoval jsem na Fakultě elektrotechniky a informatiky VŠB-TUO. Naučil jsem se nízkoúrovňové programování v C/C++, práci s pamětí, reprezentaci dat, základy C#, Pythonu a relačních databází. Své studium jsem úspěšně zakončil obhajobou bakalářské práce na téma „Reaktivní Frontend pro elearningový systém“ (přepis open-source systému Kelvin do Vue 3 a legacy frontendu ve Svelte 3) a získal titul Bc.',
            image: ''
          },
          {
            year: '2025 - Současnost',
            title: 'Magisterské studium Informatiky',
            desc: 'Pokračuji v navazujícím inženýrském studiu na VŠB-TUO se zaměřením na digitální zpracování obrazu a počítačovou grafiku. V prvním ročníku jsem úspěšně obhájil Semestrální projekt „Klasifikace Astronomických fotografií“, který analyzuje a hodnotí raw snímky z teleskopu. Na tuto práci plánuji navázat svou Diplomovou prací s využitím konvolučních neuronových sítí, která bude plně open-source.',
            image: ''
          }
        ]
      },
      en: {
        name: 'Academia',
        category: 'Education',
        shortDesc: 'My academic journey in computer science and technology.',
        tags: ['VŠB-TUO', 'IT'],
        timeline: [
          {
            year: '2018 - 2022',
            title: 'High School of Applied Chemistry',
            desc: 'Upon starting, I found out that most classmates had far better chemistry foundations than me. Over the years, I grew to love labs, although organic chemistry was a nightmare. When Covid-19 forced us into online classes, my routine shifted to waking up, connecting, and gaming. I successfully graduated with a maturity certificate and decided to head to university to study computer science, hoping to challenge myself with subjects I wouldn\'t motivate myself to study at home.',
            image: ''
          },
          {
            year: '2022 - 2025',
            title: "Bachelor's Degree in Computer Science",
            desc: 'Studied at the Faculty of Electrical Engineering and Computer Science, VŠB-TUO. I learned lower-level programming in C/C++, how programs handle memory, data representation, basic C# and Python, and relational databases. I defended my Bachelor\'s thesis, "Reactive Frontend for e-learning system" (which rewritten parts of the open-source Kelvin platform using Vue 3 and Svelte 3), and successfully graduated.',
            image: ''
          },
          {
            year: '2025 - Present',
            title: "Master's Degree in Computer Science",
            desc: 'Continuing my Master\'s studies at VŠB-TUO, specializing in Digital Image Processing and Computer Graphics. Although studies became somewhat tedious with the rise of AI, I completed my first-year project: "Classification of Astronomical Photographs," which analyzes telescope raw frames and grades them based on stars and clouds. I plan to expand this into my Master\'s Thesis using a convolutional neural network.',
            image: ''
          }
        ]
      }
    }
  },
  {
    id: 'programming',
    planetClass: 'planet-programming',
    colors: {
      border: 'border-cyan-500/30 hover:border-cyan-400/60',
      text: 'text-cyan-400',
      bg: 'from-cyan-600/10 to-teal-600/10',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    translations: {
      cs: {
        name: 'Codenus',
        category: 'Programování',
        shortDesc: 'Jak jsem se dostal k programování, moje oblíbené technologie a milníky.',
        tags: ['SvelteKit', 'Rust', 'Tauri', 'Node.js', 'React'],
        timeline: [
          {
            year: '2016',
            title: 'První krůčky v kódování',
            desc: 'V 8. třídě základní školy mě začala zajímat tvorba webu. Začínal jsem s WYSIWYG Web Builderem a MS Wordem (který generoval nepořádný HTML kód). Brzy jsem se začal sám učit HTML a CSS a analyzoval stažený PHP přihlašovací systém, což nastartovalo můj zájem o PHP a backend.',
            image: '/images/webBuilder.jpg'
          },
          {
            year: '2018 - 2020',
            title: 'PHP projekty a administrační panely',
            desc: 'Na střední škole jsem pravidelně vyvíjel v čistém PHP. Vytvořil jsem systém na administraci a SSH nasazení instancí SinusBotů. Později jsem naprogramoval rozsáhlý informační systém pro Minecraft portál SurprisePlay.eu, který spravoval tickety, úkoly pro admin tým, práva hráčů a prémiovou měnu.',
            image: ''
          },
          {
            year: '2020 - 2022',
            title: 'Plynulost s JS, Node.js a automatizace',
            desc: 'Učil jsem se pokročilý JavaScript s jQuery a AJAXem pro hladký chod webu. Vstoupil jsem do Node.js ekosystému a tvořil své první Discord boty pro statistiky ze hry League of Legends. Vytvořil jsem také PHP a JS webové kalkulačky pro výpočty v chemických laboratořích (Q-test a rovnice z grafu).',
            image: ''
          },
          {
            year: '2022',
            title: 'Fullstack, SvelteKit a DiscordJS',
            desc: 'Seznámil jsem se s Reactem/Next.js při pomoci kamarádovi s projektem hostingu, ale React mi k srdci nepřirostl. Narazil jsem však na framework SvelteKit. Zamiloval jsem si jeho kompilovaný a přehledný styl a začal v něm dělat všechny své projekty, jako je např. GameRealms Wiki. Dále jsem vyvinul LoL bota „Miňonka“ ve verzi 3.',
            image: ''
          },
          {
            year: '2025 - Současnost',
            title: 'Stáž Profiq, Rust & Tauri',
            desc: 'Po bakalářských státnicích jsem nastoupil na stáž do firmy Profiq.com, kde jsem pracoval s React.js, Firebase, Gitlabem a CI/CD pipelines. Během magisterského studia jsem se naučil programovat v jazyce Rust a v kombinaci se SvelteKitem a Tauri nyní vyvíjím desktopové a mobilní multiplatformní aplikace.',
            image: ''
          }
        ]
      },
      en: {
        name: 'Codenus',
        category: 'Programming',
        shortDesc: 'How I learned to code, my favorite stacks, and tech milestones.',
        tags: ['SvelteKit', 'Rust', 'Tauri', 'Node.js', 'React'],
        timeline: [
          {
            year: '2016',
            title: 'First Coding Steps',
            desc: 'In 8th grade, I started building websites using WYSIWYG Web Builder and even MS Word (which spit out messy HTML). I soon started manually learning HTML and CSS, and studied a basic PHP authentication template. This sparked my interest in PHP and backend development.',
            image: '/images/webBuilder.jpg'
          },
          {
            year: '2018 - 2020',
            title: 'PHP Projects & Minecraft System Panels',
            desc: 'In high school, I regularly coded in raw PHP without frameworks. I created a custom SSH panel to deploy and control multiple SinusBot instances. Later, I created a complex administrative info-panel for the Minecraft portal SurprisePlay.eu, enabling player tickets, todo lists, and premium currency management.',
            image: ''
          },
          {
            year: '2020 - 2022',
            title: 'Evolving JS, Node.js & Scripting',
            desc: 'Learned advanced JavaScript with jQuery and AJAX to make websites fluid. Dove into Node.js to create Discord self-bots and standard bots. I also made PHP/JS mini web calculators to help compute Q-tests and graph equations for chemistry class.',
            image: ''
          },
          {
            year: '2022',
            title: 'Fullstack Frameworks, SvelteKit & DiscordJS',
            desc: 'Discovered React/Next.js while helping a friend on a hosting project, but disliked React\'s syntax. Then I found SvelteKit, fell in love with its clean compiled design, and built my projects in it (including the GameRealms Wiki). I also developed a league-of-legends Discord bot named "Miňonka" and other automation scripts.',
            image: ''
          },
          {
            year: '2025 - Present',
            title: 'Profiq Internship, Rust & Tauri',
            desc: "Completed an internship at Profiq.com after my Bachelor finals, learning React.js, Firebase, team collaboration, Slack/GitLab, and CI/CD pipelines. During my Master's studies, I picked up Rust and now build cross-platform desktop and mobile apps using Tauri and SvelteKit.",
            image: ''
          }
        ]
      }
    }
  },
  {
    id: 'astrophotography',
    planetClass: 'planet-nebula',
    colors: {
      border: 'border-purple-500/30 hover:border-purple-400/60',
      text: 'text-purple-400',
      bg: 'from-purple-600/10 to-indigo-600/10',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    translations: {
      cs: {
        name: 'Nebula',
        category: 'Astrofotografie',
        shortDesc: 'Focení vesmíru: moje dobrodružství při zachycování hlubokého vesmíru.',
        tags: ['Vesmír', 'DSO', 'PixInsight', 'Mlhoviny'],
        timeline: [
          {
            year: '2023',
            title: 'Focení mobilem Google Pixel 7a',
            desc: 'V červnu 2023 jsem si pořídil Google Pixel 7a. Jeho oficiální Google fotoaparát obsahoval astrofotografický mód, čímž začala má cesta focení noční oblohy ze zahrady. Také jsem zkoušel fotit Měsíc a Saturn přes naši starou videokameru s 60x optickým zoomem.',
            image: ''
          },
          {
            year: '2023 - 2024',
            title: 'První dalekohled a rovníková montáž',
            desc: 'K 20. narozeninám jsem od rodičů dostal Celestron Astromaster 130EQ. Koupil jsem si k němu planetární kameru ZWO ASI678MC pro snímání Měsíce a Jupiteru. Brzy mě však začal lákat hluboký vesmír, a tak jsem pořídil pointovanou montáž SkyWatcher Star Adventurer GTI pro dlouhé expozice DSO.',
            image: ''
          },
          {
            year: '2024 - Současnost',
            title: 'DSO Setup, plná automatizace a PixInsight',
            desc: 'Sestavil jsem si pokročilý DSO setup: chlazenou kameru ZWO ASI585MC Pro, refraktor William Optics RedCat 51 a pointační dalekohled. V roce 2025 jsem pořídil montáž Proxisky Ragdoll 17 Pro, automatické ostření Gemini Astro EAF, mini PC a kompletně přešel na kalibraci a procesování snímků v PixInsightu. Postup můžete sledovat v mé astro-galerii.',
            image: ''
          }
        ]
      },
      en: {
        name: 'Nebula',
        category: 'Astrophotography',
        shortDesc: 'Capturing the cosmos: my deep sky imaging adventures.',
        tags: ['Universe', 'DSO', 'PixInsight', 'Nebulae'],
        timeline: [
          {
            year: '2023',
            title: 'Google Pixel 7a Astrophotography Mód',
            desc: 'In June 2023, I got a Google Pixel 7a. Its official Camera app had an Astrophotography mode, which kicked off my space journey. I took shots of the night sky in my garden and also tried using our old camcorder with 60x zoom to snap pictures of the Moon and Saturn.',
            image: ''
          },
          {
            year: '2023 - 2024',
            title: 'First Telescope & SkyWatcher Star Adventurer GTI',
            desc: 'For my 20th birthday, I received a Celestron Astromaster 130EQ telescope. I bought a ZWO ASI678MC planetary camera to capture Jupiter and the Moon. Seeking deep-sky objects (DSOs) instead of planetary ones, I upgraded to a SkyWatcher Star Adventurer GTI tracking mount for long exposure astrophotography.',
            image: ''
          },
          {
            year: '2024 - Present',
            title: 'DSO Rig, Automation & PixInsight Transition',
            desc: 'Built a specialized DSO setup: ZWO ASI585MC Pro cooled camera, William Optics RedCat 51 refractor, and a guiding telescope. In 2025, I upgraded to a Proxisky Ragdoll 17 Pro mount, Gemini Astro EAF autofocuser, mini PC control, and fully transitioned to processing my photos in PixInsight. You can check the progress in my astro-gallery.',
            image: ''
          }
        ]
      }
    }
  }
];

export const moviesPageData = {
  cs: {
    title: 'Filmy a Seriály',
    description: 'Zde najdeš seriály a filmy, které jsem zhlédl, a moje krátké recenze.',
    movies: [
      {
        title: 'Falcon a Winter Soldier',
        type: 'Seriál',
        year: '2021',
        rating: '4/5',
        review:
          'Akční seriál z MCU řešící odkaz štítu Kapitána Ameriky a partnerství mezi Samem a Buckym.',
        image: ''
      },
      {
        title: 'WandaVision',
        type: 'Seriál',
        year: '2021',
        rating: '4.5/5',
        review:
          'Krásně kreativní mysteriózní sitcom zkoumající zármutek, ohýbání reality a transformaci Wandy v Scarlet Witch.',
        image: ''
      },
      {
        title: 'Loki',
        type: 'Seriál',
        year: '2021',
        rating: '5/5',
        review:
          'Naprosté sci-fi mistrovské dílo zkoumající časové linie, organizaci TVA, osud a Lokiho hledání velkolepého poslání.',
        image: ''
      },
      {
        title: 'Hawkeye',
        type: 'Seriál',
        year: '2021',
        rating: '4/5',
        review:
          'Zábavná a sváteční akční série o předávání žezla Clintem Bartonem a debutu mladé Kate Bishop.',
        image: ''
      },
      {
        title: 'Moon Knight',
        type: 'Seriál',
        year: '2022',
        rating: '4.5/5',
        review:
          'Vynikající, temná psychologická cesta zkoumající egyptskou mytologii, disociativní poruchu identity a skvělý herecký výkon Oscara Isaaca.',
        image: ''
      },
      {
        title: 'Captain Marvel',
        type: 'Film',
        year: '2019',
        rating: '3.8/5',
        review:
          'Vesmírný origin Carol Danvers, zkoumající válku mezi rasami Kree a Skrull a její cestu za odemknutím plné síly.',
        image: ''
      },
      {
        title: 'Ms. Marvel',
        type: 'Seriál',
        year: '2022',
        rating: '4/5',
        review:
          'Barevný, energický a hřejivý příběh o Kamale Khan, dospívající fanynce superhrdinů, která objevuje vlastní kosmické dědictví.',
        image: ''
      },
      {
        title: 'Městečko záhad',
        type: 'Seriál',
        year: '2012',
        rating: '5/5',
        review:
          'Legendární animovaný seriál plný záhad, tajemství, nadpřirozených jevů a skvělého humoru.',
        image: ''
      },
      {
        title: 'Kouzelná Beruška a Černý kocour',
        type: 'Seriál',
        year: '2015',
        rating: '4.2/5',
        review:
          'Superhrdinský seriál odehrávající se v Paříži s dobrou akcí, sympatickými hrdiny a dlouhotrvající romantickou zápletkou.',
        image: ''
      },
      {
        title: 'Star proti silám zla',
        type: 'Seriál',
        year: '2015',
        rating: '4.3/5',
        review:
          'Magické a chaotické dobrodružství napříč dimenzemi, které se zpočátku tváří jednoduše, ale vyvine se ve skvělý ucelený příběh.',
        image: ''
      },
      {
        title: 'Milo Murphyho zákon',
        type: 'Seriál',
        year: '2016',
        rating: '4.2/5',
        review:
          'Od tvůrců Phinease a Ferba, neuvěřitelně vtipný seriál o optimismu tváří v tvář naprosté smůle a chaosu.',
        image: ''
      },
      {
        title: 'Stranger Things',
        type: 'Seriál',
        year: '2016',
        rating: '4.8/5',
        review:
          'Fenomenální sci-fi hororový thriller z 80. let s fantastickým obsazením, nadpřirozenými záhadami a skvělou atmosférou.',
        image: ''
      },
      {
        title: 'Wednesday',
        type: 'Seriál',
        year: '2022',
        rating: '4.5/5',
        review: 'Super seriál, doporučuju.',
        image: ''
      },
      {
        title: 'Soví dům',
        type: 'Seriál',
        year: '2020',
        rating: '5/5',
        review:
          'Musím říct, že poslední 3 epizody, zvláště ta poslední (S03E03) byla úžasná a všem doporučuji zkouknout tento seriál.',
        image: ''
      },
      {
        title: 'Anna mezi obojživelníky',
        type: 'Seriál',
        year: '2019',
        rating: '4.5/5',
        review:
          'K dokoukání první série se tak trochu musíte dokopat, ale když se přeženete přes první sérii, která je taková nudnější, tak se jedná o další z nejúžasnějších seriálů.',
        image: ''
      },
      {
        title: 'Můj malý Pony: Přátelství je magické',
        type: 'Seriál',
        year: '2010',
        rating: '4.2/5',
        review:
          '9 Sérií, 221 dílů dohromady. Přestože ne všechny díly byly vždy záživné, tak řadím tento seriál mezi další mé oblíbené a doporučuju.',
        image: ''
      },
      {
        title: 'Miraculous World: London, At the Edge of Time',
        type: 'Film',
        year: '2024',
        rating: '4.5/5',
        review:
          'Další menší filmík ze světa Kouzelné Berušky a Černého Kocoura, který navazuje na konec poslední série. Koukal jsem na to asi ve 4 ráno, takže moc objektivně nemůžu hodnotit, ale nenudil jsem se u toho, takže super 😄',
        image: ''
      },
      {
        title: 'LoliRock',
        type: 'Seriál',
        year: '2014',
        rating: '3.5/5',
        review:
          'Takový basic seriál podobný například WinxClub. Některé epizody jsou nudné, kdy se nic moc neděje, ale většina epizod přispívá k příběhu a je zajímavá.',
        image: ''
      },
      {
        title: 'The Amazing Digital Circus',
        type: 'Seriál',
        year: '2023',
        rating: '4.8/5',
        review:
          'Skvělý a originální indie animovaný seriál, který vás okamžitě vtáhne do svého digitálního šílenství.',
        image: ''
      }
    ]
  },
  en: {
    title: 'Movies & Series',
    description: 'Here you will find series and movies I have watched, along with my short reviews.',
    movies: [
      {
        title: 'The Falcon and the Winter Soldier',
        type: 'Series',
        year: '2021',
        rating: '4/5',
        review:
          "Action-packed MCU series that deals with the legacy of Captain America's shield and the partnership between Sam and Bucky.",
        image: ''
      },
      {
        title: 'WandaVision',
        type: 'Series',
        year: '2021',
        rating: '4.5/5',
        review:
          "A beautifully creative sitcom-style mystery exploring grief, reality-warping, and Wanda's transformation into the Scarlet Witch.",
        image: ''
      },
      {
        title: 'Loki',
        type: 'Series',
        year: '2021',
        rating: '5/5',
        review:
          "An absolute sci-fi masterpiece exploring timelines, the TVA, fate, and Loki's path to finding his glorious purpose.",
        image: ''
      },
      {
        title: 'Hawkeye',
        type: 'Series',
        year: '2021',
        rating: '4/5',
        review:
          "A fun and festive action-packed series about partnership, Clint Barton passing the torch, and Kate Bishop's debut.",
        image: ''
      },
      {
        title: 'Moon Knight',
        type: 'Series',
        year: '2022',
        rating: '4.5/5',
        review:
          'An excellent, dark psychological journey exploring Egyptian mythology, multiple personalities, and outstanding acting by Oscar Isaac.',
        image: ''
      },
      {
        title: 'Captain Marvel',
        type: 'Movie',
        year: '2019',
        rating: '3.8/5',
        review:
          'A cosmic origin story introducing Carol Danvers, exploring the Kree-Skrull war and her journey to unlock her true power.',
        image: ''
      },
      {
        title: 'Ms. Marvel',
        type: 'Series',
        year: '2022',
        rating: '4/5',
        review:
          'A colorful, energetic, and heartwarming story about Kamala Khan, a teenage superhero fan discovering her own cosmic heritage.',
        image: ''
      },
      {
        title: 'Gravity Falls',
        type: 'Series',
        year: '2012',
        rating: '5/5',
        review:
          'A legendary animated series packed with mysteries, secrets, paranormal elements, and fantastic humor.',
        image: ''
      },
      {
        title: 'Miraculous: Tales of Ladybug & Cat Noir',
        type: 'Series',
        year: '2015',
        rating: '4.2/5',
        review:
          'Super fun superhero series set in Paris, featuring great action, charming heroes, and a long-running romantic drama.',
        image: ''
      },
      {
        title: 'Star vs. the Forces of Evil',
        type: 'Series',
        year: '2015',
        rating: '4.3/5',
        review:
          'A magical and chaotic adventure through dimensions that evolves from lighthearted episodes into a grand storyline.',
        image: ''
      },
      {
        title: "Milo Murphy's Law",
        type: 'Series',
        year: '2016',
        rating: '4.2/5',
        review:
          'From the creators of Phineas and Ferb, an incredibly fun series about optimism in the face of absolute bad luck and chaos.',
        image: ''
      },
      {
        title: 'Stranger Things',
        type: 'Series',
        year: '2016',
        rating: '4.8/5',
        review:
          'A phenomenal 80s sci-fi horror thriller with a fantastic cast of characters, supernatural mysteries, and great atmosphere.',
        image: ''
      },
      {
        title: 'Wednesday',
        type: 'Series',
        year: '2022',
        rating: '4.5/5',
        review: 'Super series, highly recommended.',
        image: ''
      },
      {
        title: 'The Owl House',
        type: 'Series',
        year: '2020',
        rating: '5/5',
        review:
          'I must say that the last 3 episodes, especially the final one (S03E03) were amazing. I highly recommend watching this show.',
        image: ''
      },
      {
        title: 'Amphibia',
        type: 'Series',
        year: '2019',
        rating: '4.5/5',
        review:
          'You have to force yourself a bit to get through the first season, which is on the slower side, but once you get past it, it becomes one of the most wonderful shows.',
        image: ''
      },
      {
        title: 'My Little Pony: Friendship is Magic',
        type: 'Series',
        year: '2010',
        rating: '4.2/5',
        review:
          '9 seasons, 221 episodes total. Even though not every episode was exciting, I consider this show to be one of my favorites and highly recommend it.',
        image: ''
      },
      {
        title: 'Miraculous World: London, At the Edge of Time',
        type: 'Movie',
        year: '2024',
        rating: '4.5/5',
        review:
          "Another spin-off movie from the Miraculous Ladybug universe. I watched it at 4 AM, so I can't review it completely objectively, but I was fully entertained, so it's super 😄",
        image: ''
      },
      {
        title: 'LoliRock',
        type: 'Series',
        year: '2014',
        rating: '3.5/5',
        review:
          'A basic show similar to Winx Club. Some episodes are filler where nothing happens, but most contribute to the plot and are very interesting.',
        image: ''
      },
      {
        title: 'The Amazing Digital Circus',
        type: 'Series',
        year: '2023',
        rating: '4.8/5',
        review:
          'A fantastic and original indie animated series that immediately pulls you into its digital madness.',
        image: ''
      }
    ]
  }
};
