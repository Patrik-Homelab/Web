/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely, sql } from 'kysely';
import { v4 as uuidv4 } from 'uuid';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('project')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('uuid', 'varchar(36)', (col) => col.notNull().unique())
    .addColumn('name', 'uuid', (col) => col.notNull())
    .addColumn('description', 'uuid', (col) => col.notNull())
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('preview', 'varchar(255)')
    .addColumn('images', 'text', (col) => col.notNull())
    .addColumn('tags', 'text', (col) => col.notNull())
    .addColumn('hidden', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await conn.schema
    .alterTable('project')
    .addForeignKeyConstraint('project_name_fk', ['name'], 'translations', ['key'])
    .execute();

  await conn.schema
    .alterTable('project')
    .addForeignKeyConstraint('project_description_fk', ['description'], 'translations', [
      'key'
    ])
    .execute();

  const projectsSeed = [
    /*
    // Uncomment after finishing Master's Thesis:
    {
      uuid: 'b9c1f2e0-5d4a-4c3b-8e2f-1a0b9c8d7e6f',
      name: {
        cs: 'Klasifikace astronomických fotografií',
        en: 'Astro-Photo Quality Sorter'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/patrick11514/MasterThesis)\n\nDesktopová aplikace vyvíjená v rámci Semestrálního projektu a Diplomové práce na VŠB-TUO. Analyzuje surové astronomické snímky (`.fits`, `.xisf`) z nočního pozorování pomocí vícevláknového výpočtu v **Rustu** (metriky FWHM, HFR, excentricita hvězd, kontrast pozadí a počet hvězd) a třídí je na základě normálního rozdělení a konvoluční neuronové sítě (CNN).',
        en: '[**GitHub Repository**](https://github.com/patrick11514/MasterThesis)\n\nDesktop application developed as part of my Semester Project and Master\'s Thesis at VŠB-TUO. It analyzes raw astronomical frames (`.fits`, `.xisf`) from night observations using multi-threaded **Rust** calculations (FWHM, HFR, star eccentricity, background contrast, and star count) and sorts them using normal distribution statistics and a Convolutional Neural Network (CNN).'
      },
      date: '2026-11-07',
      preview: null,
      images: [],
      tags: ['Rust', 'Tauri', 'SvelteKit', 'Python', 'TypeScript']
    },
    */
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc01',
      name: {
        cs: 'AgentManager (Homelab AI Agents)',
        en: 'AgentManager (Homelab AI Agents)'
      },
      description: {
        cs: 'Vlastní self-hosted platforma v **SvelteKit** a **TypeScriptu** pro správu a běh autonomních AI agentů na homelabu. Umožňuje agentům definovat vlastní API a kódové nástroje (tools), spouštět úlohy podle cron rozvrhu, udržovat stav, sledovat logy v reálném čase a ovládat agenty přes dedikovaný MCP server.',
        en: 'Self-hosted platform built with **SvelteKit** and **TypeScript** for managing and running autonomous AI agents in my homelab. It allows defining custom API and code tools, scheduling agent runs via cron, managing persistent agent state, inspecting real-time execution logs, and controlling agents through a dedicated MCP server.'
      },
      date: '2026-11-06',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript', 'AI', 'TailwindCSS']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc02',
      name: {
        cs: 'Stream Manager (StreamPlatform)',
        en: 'Stream Manager (StreamPlatform)'
      },
      description: {
        cs: 'Self-hosted multi-streamovací platforma pro **YouTube**, **Twitch** a **Kick**. Nabízí sjednocený real-time multi-chat se zachováním nativních odznaků a barev jednotlivých platforem, plnou podporu **7TV emotů**, moderaci napříč platformami (mazání zpráv, timeouty, bany, schvalování pozastavených zpráv), odesílání zpráv na všechny platformy najednou a transparentní OBS overlaye.',
        en: 'Self-hosted multi-streaming control platform for **YouTube**, **Twitch**, and **Kick**. Features a unified real-time multi-chat preserving native platform badges and colors, full **7TV emote** support, cross-platform moderation (message deletion, timeouts, bans, held message approval), multi-cast message sending, and transparent OBS overlays.'
      },
      date: '2026-11-02',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc03',
      name: {
        cs: 'Tonda AI Discord Bot',
        en: 'Tonda AI Discord Assistant'
      },
      description: {
        cs: 'Pokročilý Discord AI asistent postavený na `discord.js` a **Google Gemini** (`@google/genai`). Funguje nejen jako klasický serverový bot, ale i jako **User-Installable App**, kterou si uživatelé mohou nainstalovat na svůj účet a používat v DM, skupinách i na libovolných serverech. Podporuje vlastní API klíče, přepínání modelů s automatickým fallbackem, dlouhodobou paměť, analýzu snímků z GIFů a kontextové menu.',
        en: 'Advanced Discord AI assistant powered by `discord.js` and **Google Gemini** (`@google/genai`). Works both as a server bot and as a **User-Installable Application** usable across DMs, group chats, and external servers. Supports personal API keys, multi-model selection with automatic fallback, persistent user memory, GIF frame extraction, and message context menus.'
      },
      date: '2026-11-01',
      preview: null,
      images: [],
      tags: ['TypeScript', 'Discord.js', 'AI']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc04',
      name: {
        cs: 'Proxmox Homelab Dashboard',
        en: 'Proxmox Homelab Dashboard'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/patrick11514/local)\n\nModerní výchozí stránka do prohlížeče a monitorovací dashboard pro **Proxmox VE** infrastrukturu napsaný v **SvelteKit 5** a **Tailwind CSS**. Zobrazuje interaktivní grafy vytížení v reálném čase (CPU, RAM, síťový provoz, disk) přes Proxmox API a obsahuje rychlé záložky na self-hosted služby.',
        en: '[**GitHub Repository**](https://github.com/patrick11514/local)\n\nModern browser startpage and monitoring dashboard for **Proxmox VE** infrastructure built with **SvelteKit 5** and **Tailwind CSS**. Visualizes real-time RRD telemetry graphs (CPU, memory, network traffic, disk usage) via the Proxmox API alongside customizable homelab bookmarks.'
      },
      date: '2026-01-19',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc05',
      name: {
        cs: 'Factorio Updater',
        en: 'Factorio Updater'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/patrick11514/factorio-updater)\n\nTerminálová aplikace (TUI) napsaná v jazyce **Rust** pomocí knihovny **Ratatui** jako projekt do předmětu **PvR (Programování v Rustu)** na **VŠB-TUO**. Umožňuje přihlášení přes oficiální Factorio účet, stahování a správu více instalací hry Factorio a především jejich rychlé inkrementální aktualizování pomocí rozdílových patchů místo stahování celé hry znovu.',
        en: '[**GitHub Repository**](https://github.com/patrick11514/factorio-updater)\n\nTerminal UI (TUI) application written in **Rust** using **Ratatui** as a project for the **PvR (Programming in Rust)** course at **VŠB-TUO**. It authenticates with a Factorio account, manages multiple game installations across platforms, and performs fast incremental updates using binary patches instead of re-downloading full builds.'
      },
      date: '2026-01-03',
      preview: null,
      images: [],
      tags: ['Rust']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc06',
      name: {
        cs: 'WPlace Canvas Downloader',
        en: 'WPlace Canvas Downloader'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/patrick11514/WPlaceDownloader)\n\nNástroj a knihovna v **TypeScriptu** (Node.js) pro stahování, lokální cachování a skládání jednotlivých dlaždic (chunků) plátna ze stránky [wplace.live](https://wplace.live) do jednoho celistvého obrázku ve vysokém rozlišení.',
        en: '[**GitHub Repository**](https://github.com/patrick11514/WPlaceDownloader)\n\nTypeScript (Node.js) CLI tool and library for downloading, locally caching, and stitching canvas tile chunks from [wplace.live](https://wplace.live) into a single high-resolution composite image.'
      },
      date: '2026-01-02',
      preview: null,
      images: [],
      tags: ['TypeScript']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc07',
      name: {
        cs: 'FileManager',
        en: 'FileManager'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/Patrik-Homelab/FileManager)\n\nSelf-hosted webová aplikace v **SvelteKit 5**, **TypeScriptu**, **Tailwind CSS v4** a **Kysely** (MySQL) pro nahrávání, správu a rychlé sdílení souborů a obrázků.',
        en: '[**GitHub Repository**](https://github.com/Patrik-Homelab/FileManager)\n\nSelf-hosted web application built with **SvelteKit 5**, **TypeScript**, **Tailwind CSS v4**, and **Kysely** (MySQL) for uploading, organizing, and sharing files and images.'
      },
      date: '2025-12-16',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS']
    },
    {
      uuid: 'c1a2b3d4-e5f6-4789-8012-3456789abc08',
      name: {
        cs: 'FamilyAPP',
        en: 'FamilyAPP'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/Patrik-Homelab/FamilyAPP)\n\nProgresivní webová aplikace (PWA) v **SvelteKit** a **TypeScriptu** s MariaDB databází, kterou používáme v rodině. Obsahuje moduly **Dárkovník** (seznamy přání na Vánoce a narozeniny), **Dlužníček** (evidence společných výdajů a dluhů), **Datumovník** (rodinný kalendář propojený s Google Kalendářem) a sdílené poznámky.',
        en: '[**GitHub Repository**](https://github.com/Patrik-Homelab/FamilyAPP)\n\nProgressive Web App (PWA) built with **SvelteKit**, **TypeScript**, and MariaDB used by our family. Includes modules for birthday/Christmas wishlists (*Dárkovník*), shared expense and debt tracking (*Dlužníček*), a family event calendar synced with Google Calendar (*Datumovník*), and shared notes.'
      },
      date: '2024-12-30',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS']
    },
    {
      uuid: 'fd613755-c8f8-4bce-83b2-5b65e3d444ce',
      name: {
        cs: 'Tondík Web Server',
        en: 'Tondík Web Server'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/patrick11514/TondikWebServer)\n\nHTTP Web Server vytvořený jako projekt do předmětu **C++** na **VŠB-TUO**.\n\nMá dva módy:\n1. **Dev mód**: Servíruje jednu složku se statickými soubory a log vypisuje přímo do konzole.\n2. **Server mód**:\n   - Využívá konfigurační soubory\n   - Zvládá obsluhovat více hostname (domén/subdomén), kdy 1 hostname = 1 config soubor\n   - Podporuje servírování statických souborů i **Reverse Proxy (`proxy_pass`)**',
        en: '[**GitHub Repository**](https://github.com/patrick11514/TondikWebServer)\n\nHTTP Web Server created as a project for the **C++** course at **VŠB-TUO**.\n\nFeatures two modes:\n1. **Dev Mode**: Serves a single static directory and logs requests directly to the console.\n2. **Server Mode**:\n   - Driven by configuration files\n   - Supports multiple virtual hosts (domains/subdomains), with one config file per hostname\n   - Supports both static file serving and **Reverse Proxy (`proxy_pass`)**'
      },
      date: '2024-05-26',
      preview: null,
      images: [],
      tags: ['C++']
    },
    {
      uuid: 'a8efc879-7022-4241-8a8e-b743fcb7a324',
      name: {
        cs: 'Moje stránky',
        en: 'My Personal Website'
      },
      description: {
        cs: '[**Odkaz na GitHub**](https://github.com/Patrik-Homelab/Web)\n\nMoje osobní webové stránky a portfolio s astrofotografickou galerií, živou telemetrií z dalekohledu, přehledem projektů a administrací, na kterých se právě nacházíte.',
        en: '[**GitHub Repository**](https://github.com/Patrik-Homelab/Web)\n\nMy personal website and portfolio featuring my astrophotography gallery with interactive sky maps, live telescope telemetry, project showcase, and custom admin panel—the website you are currently browsing.'
      },
      date: '2024-02-24',
      preview: '/projects/patrick115/index.png',
      images: [
        '/projects/patrick115/image1.png',
        '/projects/patrick115/image2.png',
        '/projects/patrick115/image3.png',
        '/projects/patrick115/image4.png',
        '/projects/patrick115/image5.png',
        '/projects/patrick115/image6.png',
        '/projects/patrick115/image7.png',
        '/projects/patrick115/image8.png'
      ],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'HTML']
    },
    {
      uuid: 'd67411ac-8afe-4036-9613-92526f6c0ac5',
      name: {
        cs: 'Sveltekit API (@patrick115/sveltekitapi)',
        en: 'Sveltekit API (@patrick115/sveltekitapi)'
      },
      description: {
        cs: '[**Odkaz na npm**](https://www.npmjs.com/package/@patrick115/sveltekitapi) • [**Odkaz na GitHub**](https://github.com/patrick11514/SveltekitAPI)\n\nKnihovna, která umožňuje jednoduše vytvářet end-to-end typesafe API pro [SvelteKit](https://kit.svelte.dev). Využívá TypeScriptu pro automatické předávání typů ze serveru do klienta a umožňuje okamžitě pracovat s definicí API bez ručního psaní fetch volání.',
        en: '[**npm Package**](https://www.npmjs.com/package/@patrick115/sveltekitapi) • [**GitHub Repository**](https://github.com/patrick11514/SveltekitAPI)\n\nLibrary that makes it easy to build end-to-end type-safe APIs for [SvelteKit](https://kit.svelte.dev). Leverages TypeScript inference to pass types directly from server procedures to the client.'
      },
      date: '2024-02-19',
      preview: null,
      images: [],
      tags: ['SvelteKit', 'TypeScript']
    },
    {
      uuid: 'fec832e5-d78e-446a-b7d2-e29ed005e83d',
      name: {
        cs: 'NowPlaying for OBS',
        en: 'NowPlaying for OBS'
      },
      description: {
        cs: '[**Odkaz na stránku**](https://nowplaying.patrick115.eu)\n\nWidget do OBS, který zobrazuje aktuálně přehrávanou písničku na Spotify + obsahuje API pro získání aktuální skladby a playlistu, které lze využít například v [StreamElements](https://streamelements.com) botovi.\n\nStránka je funkční pouze pro přidané účty z důvodu development tokenu od Spotify.',
        en: '[**Live Website**](https://nowplaying.patrick115.eu)\n\nOBS browser source widget that displays the currently playing Spotify track, accompanied by an API for fetching the current song and playlist (usable in bots like [StreamElements](https://streamelements.com)).\n\nAccessible to whitelisted accounts due to Spotify development token restrictions.'
      },
      date: '2023-08-05',
      preview: '/projects/nowplaying/index.png',
      images: [
        '/projects/nowplaying/1.png',
        '/projects/nowplaying/2.png',
        '/projects/nowplaying/3.png',
        '/projects/nowplaying/4.png',
        '/projects/nowplaying/5.gif'
      ],
      tags: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'HTML']
    },
    {
      uuid: '740230bb-faf3-452b-86fb-d571182ca991',
      name: {
        cs: 'GameRealms.cz Wiki',
        en: 'GameRealms.cz Wiki'
      },
      description: {
        cs: '[**Odkaz na stránky**](https://wiki.gamerealms.cz)\n\nKompletní wiki systém pro Minecraft server [GameRealms.cz](https://gamerealms.cz), který umožňuje administrátorům spravovat kategorie a psát příspěvky v Markdownu rozšířeném o vlastní komponenty a tagy.',
        en: '[**Live Website**](https://wiki.gamerealms.cz)\n\nComplete wiki system for the [GameRealms.cz](https://gamerealms.cz) Minecraft server, allowing administrators to organize categories and write articles in Markdown extended with custom tags.'
      },
      date: '2023-06-22',
      preview: '/projects/gamerealms_wiki/index.png',
      images: [
        '/projects/gamerealms_wiki/image1.png',
        '/projects/gamerealms_wiki/image2.png',
        '/projects/gamerealms_wiki/image3.png',
        '/projects/gamerealms_wiki/image4.png',
        '/projects/gamerealms_wiki/image5.png',
        '/projects/gamerealms_wiki/image6.png',
        '/projects/gamerealms_wiki/image7.png',
        '/projects/gamerealms_wiki/image8.png',
        '/projects/gamerealms_wiki/image9.png',
        '/projects/gamerealms_wiki/image10.png',
        '/projects/gamerealms_wiki/image11.png',
        '/projects/gamerealms_wiki/image12.png',
        '/projects/gamerealms_wiki/image13.png',
        '/projects/gamerealms_wiki/image14.png',
        '/projects/gamerealms_wiki/image15.png'
      ],
      tags: ['SvelteKit', 'TypeScript', 'CSS', 'HTML']
    },
    {
      uuid: '840eef54-3302-40b4-a34d-82aad56c7b1a',
      name: {
        cs: 'Miňonka',
        en: 'Miňonka (LoL Discord Bot)'
      },
      description: {
        cs: '[**Odkaz na GitHub (v3)**](https://github.com/patrick11514/Minonka) • [**Odkaz na GitHub (v1/v2)**](https://github.com/patrick11514/MinonkaBot)\n\nDiscord bot primárně sloužící pro zobrazování statistik ze hry **League of Legends**. Dokáže vygenerovat grafický hráčský profil, statistiky v hodnocených hrách, mastery šampionů, historii zápasů nebo detaily živé hry.',
        en: '[**GitHub (v3)**](https://github.com/patrick11514/Minonka) • [**GitHub (v1/v2)**](https://github.com/patrick11514/MinonkaBot)\n\nDiscord bot designed primarily to display **League of Legends** statistics. Generates visual player profiles, ranked standings, champion mastery, match history, and live game details.'
      },
      date: '2023-01-21',
      preview: '/projects/minonka/index.png',
      images: [
        '/projects/minonka/image1.png',
        '/projects/minonka/image2.png',
        '/projects/minonka/image3.png',
        '/projects/minonka/image4.png',
        '/projects/minonka/image5.png',
        '/projects/minonka/image6.png',
        '/projects/minonka/image7.png',
        '/projects/minonka/image8.png',
        '/projects/minonka/image9.png',
        '/projects/minonka/image10.png',
        '/projects/minonka/image11.png'
      ],
      tags: ['TypeScript', 'Discord.js']
    },
    {
      uuid: '0618985a-a1e1-46f0-b758-1fc600173589',
      name: {
        cs: 'Arconix.eu Status Bot',
        en: 'Arconix.eu Status Bot'
      },
      description: {
        cs: 'Discord bot pro server Arconix.eu na zobrazování stavů jednotlivých částí projektu a jejich procentuálního dokončení. Bot obsahuje příkazy na přidání, odebrání a úpravu procent daného statusu, přičemž průběh je vizuálně reprezentován nastavitelnými emotikony.',
        en: 'Discord bot for the Arconix.eu server displaying development statuses and completion percentages. Includes commands for adding, removing, and updating progress bars rendered with customizable Discord emojis.'
      },
      date: '2023-01-19',
      preview: '/projects/arconix_status/index.png',
      images: [
        '/projects/arconix_status/image1.png',
        '/projects/arconix_status/image2.png'
      ],
      tags: ['TypeScript', 'Discord.js']
    },
    {
      uuid: 'd202dca4-185f-4562-8ef3-273de3991edc',
      name: {
        cs: 'Arconix.eu Bot na návrhy',
        en: 'Arconix.eu Suggestion Bot'
      },
      description: {
        cs: 'Discord bot pro server Arconix.eu umožňující hráčům podávat návrhy přes interaktivní tlačítka a formuláře. Ostatní hráči mohou o návrzích diskutovat a hlasovat pro jejich přijetí či zamítnutí, přičemž administrátoři mohou návrhy finálně schválit nebo zamítnout.',
        en: 'Discord bot for the Arconix.eu server allowing players to submit suggestions via interactive buttons and modals. Community members can comment and vote on proposals, while administrators can approve or reject them.'
      },
      date: '2023-01-06',
      preview: '/projects/arconix_suggest/index.png',
      images: [
        '/projects/arconix_suggest/image1.png',
        '/projects/arconix_suggest/image2.png',
        '/projects/arconix_suggest/image3.png',
        '/projects/arconix_suggest/image4.png'
      ],
      tags: ['TypeScript', 'Discord.js']
    },
    {
      uuid: '4e756e64-110a-421e-95d5-380495ca2849',
      name: {
        cs: 'Hostuj.eu',
        en: 'Hostuj.eu'
      },
      description: {
        cs: 'Webová platforma pro hosting herních serverů. Obsahuje kompletní systém od objednání až po zaplacení serveru, ovládání běžících instancí, správu souborů, správu uživatelů a ticket systém. Servery běží v Pterodactyl Panelu a jsou ovládány přes API.\n\nNa systému jsem spolupracoval společně s [Tomášem](https://skypad6000.eu).',
        en: 'Web platform for game server hosting. Features a complete workflow from ordering and payment to live server control, file management, user administration, and a support ticket system powered by the Pterodactyl Panel API.\n\nDeveloped in collaboration with [Tomáš](https://skypad6000.eu).'
      },
      date: '2022-11-05',
      preview: '/projects/hostuj/index.png',
      images: [
        '/projects/hostuj/image1.png',
        '/projects/hostuj/image2.png',
        '/projects/hostuj/image3.png',
        '/projects/hostuj/image4.png',
        '/projects/hostuj/image5.png',
        '/projects/hostuj/image6.png',
        '/projects/hostuj/image7.png',
        '/projects/hostuj/image8.png',
        '/projects/hostuj/image9.png'
      ],
      tags: ['Next.js', 'TypeScript', 'SCSS', 'HTML']
    },
    {
      uuid: 'e15443dd-5f22-4524-a6af-ded4fc5c3b30',
      name: {
        cs: 'GameRealms.cz Discord Bot',
        en: 'GameRealms.cz Discord Bot'
      },
      description: {
        cs: 'Multifunkční Discord bot pro Minecraft server GameRealms.cz. Umožňuje hráčům vytvářet tickety (včetně generování historie konverzace při uzavření), podávat návrhy, získávat levely za aktivitu v chatu, generovat changelogy, vypisovat nové boostery serveru a moderovat chat pomocí regulárních výrazů.',
        en: 'Multi-purpose Discord bot for the GameRealms.cz Minecraft server. Supports support tickets with transcript generation upon closure, player suggestions, XP/leveling based on chat activity, changelog generation, server booster announcements, and regex-based chat moderation.'
      },
      date: '2022-07-15',
      preview: '/projects/gamerealms/index.png',
      images: [
        '/projects/gamerealms/image1.png',
        '/projects/gamerealms/image2.png',
        '/projects/gamerealms/image3.png',
        '/projects/gamerealms/image4.png'
      ],
      tags: ['TypeScript', 'Discord.js']
    },
    {
      uuid: 'a761c190-6aad-4e45-9d3b-97f1b23a61a6',
      name: {
        cs: 'Rovnice z grafu',
        en: 'Equation from Graph'
      },
      description: {
        cs: '[**Odkaz na web**](https://sch.patrick115.eu/rovnice_z_grafu/) • [**Odkaz na GitHub**](https://github.com/patrick11514/Kalibracni-rovnice)\n\nJavaScript aplikace na výpočet kalibrační rovnice přímky z grafu, kde se zadá počet bodů a vyplní jednotlivé souřadnice na osách X a Y.',
        en: '[**Live Website**](https://sch.patrick115.eu/rovnice_z_grafu/) • [**GitHub Repository**](https://github.com/patrick11514/Kalibracni-rovnice)\n\nJavaScript web application for calculating the linear calibration equation from graph data points after entering coordinates on the X and Y axes.'
      },
      date: '2021-11-21',
      preview: '/projects/rovnice_z_grafu/index.png',
      images: [
        '/projects/rovnice_z_grafu/image1.png',
        '/projects/rovnice_z_grafu/image2.png',
        '/projects/rovnice_z_grafu/image3.png',
        '/projects/rovnice_z_grafu/image4.png'
      ],
      tags: ['JavaScript', 'SCSS', 'HTML']
    },
    {
      uuid: '0ceaf41e-70a4-40d7-81c5-9febe913997d',
      name: {
        cs: 'SuprisePlay.eu InfoPanel',
        en: 'SuprisePlay.eu InfoPanel'
      },
      description: {
        cs: '[**Odkaz na Web**](https://info.surpriseplay.cz)\n\nInformační panel pro Minecraft server SurprisePlay.eu. Umožňoval hráčům zakládat tickety s problémy, měnit si heslo a prohlížet herní statistiky. Admin tým zde mohl odpovídat na tickety, spravovat bany, upravovat prémiovou měnu, oprávnění a interní todo list.',
        en: '[**Live Website**](https://info.surpriseplay.cz)\n\nInformation and management panel for the SurprisePlay.eu Minecraft server. Allowed players to submit support tickets, change passwords, and view stats, while providing the admin team with tools for ticket responses, bans, premium currency, and permissions.'
      },
      date: '2020-05-17',
      preview: '/projects/sp-infopanel/index.png',
      images: ['/projects/sp-infopanel/image1.png'],
      tags: ['PHP', 'JavaScript', 'SCSS', 'HTML']
    },
    {
      uuid: 'ad3ad881-11a6-4d03-abbd-381376899253',
      name: {
        cs: 'Počítání Q-Testu',
        en: 'Q-Test Calculator'
      },
      description: {
        cs: '[**Odkaz na stránku**](https://sch.patrick115.eu/beta-prumer)\n\nPHP aplikace na statistické počítání Dean-Dixonova Q-Testu a Lordova testu pro odhalení odlehlých hodnot při laboratorních měřeních, kterou jsem vytvořil a využíval během studia na střední průmyslové škole chemické.',
        en: "[**Live Website**](https://sch.patrick115.eu/beta-prumer)\n\nPHP web calculator for performing the Dean-Dixon Q-Test and Lord's test to detect outliers in analytical chemistry measurements, built and used during my studies at the Chemistry High School."
      },
      date: '2019-11-20',
      preview: '/projects/qtest/index.png',
      images: [
        '/projects/qtest/image1.png',
        '/projects/qtest/image2.png',
        '/projects/qtest/image3.png',
        '/projects/qtest/image4.png'
      ],
      tags: ['PHP', 'CSS', 'HTML']
    }
  ];

  for (const p of projectsSeed) {
    const nameUuid = uuidv4();
    const descUuid = uuidv4();

    await conn
      .insertInto('translations')
      .values([
        { key: nameUuid, lang: 'cs', text: p.name.cs },
        { key: nameUuid, lang: 'en', text: p.name.en }
      ])
      .execute();

    await conn
      .insertInto('translations')
      .values([
        { key: descUuid, lang: 'cs', text: p.description.cs },
        { key: descUuid, lang: 'en', text: p.description.en }
      ])
      .execute();

    await conn
      .insertInto('project')
      .values({
        uuid: p.uuid,
        name: nameUuid,
        description: descUuid,
        date: p.date,
        preview: p.preview,
        images: JSON.stringify(p.images),
        tags: JSON.stringify(p.tags),
        hidden: (p as any).hidden ? 1 : 0
      })
      .execute();
  }
};

export const down = async (conn: Kysely<any>) => {
  await sql`ALTER TABLE project DROP FOREIGN KEY project_name_fk`.execute(conn);
  await sql`ALTER TABLE project DROP FOREIGN KEY project_description_fk`.execute(conn);
  await conn.schema.dropTable('project').execute();
};
