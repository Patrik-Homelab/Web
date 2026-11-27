export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  image?: string;
  thumbnail?: string;
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
        shortDesc:
          'Moje studijní cesta od chemie až po informatiku a počítačovou grafiku.',
        tags: ['VŠB-TUO', 'Informatika'],
        timeline: [
          {
            year: 'Před rokem 2018',
            title: 'Volba střední školy – chemie, nebo elektrotechnika?',
            desc: 'Už na základní škole mě hodně bavila matematika a chemie, takže jsem stál před těžkým rozhodnutím, jakou střední školu zvolit. Děda mi tehdy dal zásadní radu: podat si přihlášku na oba obory, a pokud mě vezmou na oba, vybrat si ten náročnější. Podal jsem si tedy přihlášky na Střední průmyslovou školu chemickou akademika Heyrovského v Ostravě a na dvě elektrotechnické školy v Havířově. Na elektrotechnice jsem skončil na 13. místě ze 30 přijímaných uchazečů, zatímco na chemické škole na 57. místě ze 60 – od hranice nepřijetí mě dělilo jen pár desetin bodu, takže jsem se dostal jen tak tak. Nakonec jsem si vybral chemii s vědomím, že pokročilé chemické laboratoře a pokusy si doma sám nezařídím, což z ní dělalo jedinečnou příležitost. Tím začala moje cesta na chemické střední škole.'
          },
          {
            year: '2018 – 2022',
            title: 'Střední chemická škola a online výuka',
            desc: 'Hned v prvním ročníku jsem zjistil, že většina spolužáků má mnohem pokročilejší základy chemie než já, takže jsem byl dost pozadu – největší zabíračkou pro mě byla organická chemie. Postupně jsem si uvědomil, že laboratoře mě sice baví, ale chemie jako celek není to, co by mě dlouhodobě naplňovalo. Velký dopad na studium měla také pandemie covidu-19, která úplně rozbila běžnou rutinu; online výuka většinou znamenala ráno se jen připojit a jít buď dál spát, nebo hrát hry s kamarády. Školu jsem přesto úspěšně zakončil maturitou a rozhodl se pokračovat na vysokou školu – kromě samotného titulu hlavně proto, že mě akademické prostředí donutí naučit se komplexní věci, ke kterým bych doma sám nenašel dostatek motivace. Podal jsem si přihlášky na VUT v Brně (Informační technologie) a na VŠB-TUO v Ostravě (Informatika). Na VUT mě kvůli systému srovnávacích testů nepřijali, a přestože mě později kontaktovali s nabídkou dalšího kola, rozhodl jsem se nastoupit na VŠB-TUO.'
          },
          {
            year: '2022 – 2025',
            title: 'Bakalářské studium informatiky na VŠB-TUO',
            desc: 'Nastoupil jsem na Fakultu elektrotechniky a informatiky (FEI) VŠB-TUO v Ostravě, obor Informatika. Tříleté bakalářské studium jsem úspěšně zakončil obhajobou bakalářské práce na téma „Reaktivní frontend pro e-learningový systém“, v rámci které jsem se podílel na rozvoji školního informačního systému Kelvin. Postup během semestrů občas brzdily delší schvalovací procesy v rámci akademického open-source projektu, kde se na revizi odevzdané práce čekalo i několik týdnů. Navzdory těmto časovým komplikacím jsem práci úspěšně obhájil, složil státní závěrečnou zkoušku a získal titul Bc.'
          },
          {
            year: '2025 – současnost',
            title: 'Magisterské studium a počítačová grafika',
            desc: 'Navazující magisterské studium na VŠB-TUO pro mě bylo logickým krokem – věděl jsem, že mi další dva roky rozšíří obzory a umožní získat inženýrský titul. Zvolil jsem obor Informatika se zaměřením na Digitální zpracování obrazu a počítačovou grafiku. S rychlým nástupem moderních AI nástrojů do výuky ale studium dostalo novou dynamiku – AI sice řadu akademických úkolů výrazně zjednodušuje, zároveň je však těžší udržet si motivaci řešit složité problémy zcela samostatně a jít opravdu do hloubky. První ročník jsem úspěšně završil semestrálním projektem na téma „Klasifikace astronomických fotografií“, v němž jsem navrhl systém pro analýzu surových nočních snímků a jejich třídění pomocí statistického vyhodnocení a normálního rozdělení, díky čemuž lze automaticky vyřadit snímky znehodnocené mraky, mlhou či atmosférickými vlivy.'
          },
          {
            year: 'Současnost – budoucnost',
            title: 'Diplomová práce: Automatická klasifikace astrosnímků',
            desc: 'Na výsledky semestrálního projektu přímo navazuji ve své magisterské diplomové práci. Celý klasifikační systém chci posunout na vyšší úroveň pomocí pokročilých metod rozpoznávání obrazu, které budou snímky noční oblohy třídit zcela autonomně. Projekt propojí teoretické poznatky z počítačové grafiky s uživatelsky nastavitelnými kritérii kvality dat. Mým cílem je úspěšně dokončit inženýrské studium a vytvořit praktický nástroj využitelný při reálném zpracování astronomických dat.'
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
            year: 'Before 2018',
            title: 'The Fork in the Road: Choosing Chemistry vs. Electrical Engineering',
            desc: "Since elementary school, I was deeply drawn to mathematics and chemistry, which left me torn between which high school to choose. My grandfather gave me a pivotal piece of advice: apply to both schools, and if you get accepted to both, choose the more demanding one. Following this, I applied to the Chemistry High School in Ostrava (Střední škola chemická akademika Heyrovského) and two electrical engineering schools in Havířov. When the results of the admissions process came in, I ranked 13th out of 30 accepted students for electrical engineering. On the other hand, I placed 57th out of 60 for the chemistry school—barely making the cut by a few fractions of a point. I chose the chemistry school, knowing that while I couldn't easily replicate advanced chemistry labs and experiments at home, it made for a unique educational opportunity. That is how my story at the chemistry high school began."
          },
          {
            year: '2018 - 2022',
            title: 'High School: Chemistry, Laboratories, and the Covid Challenge',
            desc: "Upon entering my first year of high school, I quickly realized that most of my peers had much more advanced chemistry foundations than I did, and I found myself quite far behind, with organic chemistry being my biggest hurdle. Over the years, I gradually realized that while the laboratory sessions were fun, chemistry as a whole was not entirely what fulfilled me in the long run. The Covid-19 pandemic also had a significant impact on my studies, completely disrupting my routine; online learning usually meant waking up, logging into the system, and either going right back to sleep or playing games with friends. However, I successfully finished school and passed my graduation exam (maturita). I decided to continue on to university—the main reason, besides the degree, was that the academic environment would force me to learn complex topics for which I wouldn't find enough inner motivation to study alone at home. I submitted applications to VUT in Brno (Information Technology) and VŠB in Ostrava (Informatics). VUT rejected me based on their comparative entry exams system, and even though they later contacted me about participating in the next round, I decided to enroll at VŠB."
          },
          {
            year: '2022 - 2025',
            title: "Bachelor's Degree: Informatics at VŠB-FEI and the Kelvin Project",
            desc: "I enrolled at the Faculty of Electrical Engineering and Computer Science (FEI) at VŠB in Ostrava to study Informatics. I successfully completed my three-year bachelor's journey by defending my Bachelor's thesis titled \"Reactive Frontend for e-learning system\". As part of this thesis, I participated in the development of the school information system Kelvin. My progress throughout the semesters was occasionally slowed down by the specific nature of the approval processes within the academic open-source project, where it sometimes took several weeks to get reviews on the submitted work. Despite these time complications, I successfully defended my bachelor's thesis, passed my final state exams, and earned my Bachelor's degree."
          },
          {
            year: '2025 - Present',
            title: "Master's Degree: Computer Graphics and Academic Challenges",
            desc: "Continuing on to a Master's degree at VŠB was a logical step for me—I knew that another two years of study would broaden my horizons and allow me to earn an engineering degree (Ing.). I chose Informatics, which directly follows the bachelor's program, and picked Digital Image Processing and Computer Graphics as my narrow specialization. However, with the massive influx of modern AI tools into education, the studies gained a new dynamic; while AI simplifies many academic tasks, it also makes it harder to maintain the motivation to solve complex problems entirely on one's own and dive deep beneath the surface. Nonetheless, I successfully managed my first year of studies and concluded it with a Semester Project on the topic \"Classification of Astronomical Photographs\". I designed a system that analyzes raw frames from night observations and sorts them based on statistical evaluation and normal data distribution, which helps eliminate low-quality frames ruined by clouds, mist, or atmospheric influences."
          },
          {
            year: 'Present - Future',
            title: 'Diploma Thesis: Advanced Data Processing in Astrophotography',
            desc: "I am currently building directly on the results of my semester project as I prepare my Master's Diploma Thesis. I plan to elevate the entire classification system to a higher level by integrating advanced image recognition methods that will sort the night sky frames completely autonomously. The resulting academic project will bridge theoretical knowledge from the field of computer graphics with user-defined qualitative criteria for data purity. The goal is to successfully complete my engineering studies and create a beneficial piece of work that finds real-world application in the processing of astronomical data."
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
        shortDesc:
          'Jak jsem se dostal k programování, moje oblíbené technologie a důležité milníky.',
        tags: ['SvelteKit', 'Rust', 'Tauri', 'Node.js', 'React'],
        timeline: [
          {
            year: '2016',
            title: 'První pokusy s tvorbou webů',
            desc: 'Moje úplně první zkušenost s webovým vývojem začala ještě před nástupem na střední školu. Experimentoval jsem s jednoduchým designem a rozvržením stránek v drag-and-drop nástroji WYSIWYG Web Builder, abych vůbec získal cit pro to, jak se jednotlivé prvky na stránce skládají k sobě.',
            thumbnail: '/images/webBuilder.jpg',
            image: '/images/webBuilder_hr.jpg'
          },
          {
            year: '2018 – 2022',
            title: 'Samostudium programování při střední škole',
            desc: 'Hned v prváku na chemické škole jsem zjistil, že většina spolužáků má mnohem pokročilejší základy než já, a s chemií (hlavně organickou) jsem docela bojoval. Postupně jsem si uvědomil, že laboratoře jsou sice fajn, ale chemie jako taková mě úplně nenaplňuje. Zlom přišel s pandemií covidu-19, která rozbila běžnou rutinu – výuka se přesunula do online prostoru, což většinou znamenalo ráno se jen připojit a jít buď dál spát, nebo hrát hry s kamarády. Já jsem ale tento čas doma využil k tomu, abych se začal intenzivně a vytrvale učit programovat. Mezi lety 2018 a 2020 jsem se zaměřil na tvorbu prvních osobních webů a v letech 2020 až 2022 jsem upevnil své programátorské základy. Na střední škole jsem úspěšně odmaturoval, ale věděl jsem, že dál chci jít cestou IT.',
            thumbnail: '/images/oldPage.png',
            image: '/images/oldPage_hr.png'
          },
          {
            year: '2022',
            title: 'Přechod na SvelteKit a vývoj Discord botů',
            desc: 'Tento rok byl pro můj technologický stack zásadní – posunul jsem se od úplných základů k modernímu JavaScriptovému ekosystému. Výrazně jsem rozšířil své obzory, naplno pronikl do SvelteKitu a začal vyvíjet vlastní automatizační boty pomocí Discord.js.',
            thumbnail: '/images/djs.png',
            image: '/images/djs_hr.png'
          },
          {
            year: '2022 – 2025',
            title: 'Bakalářské studium a projekt Kelvin',
            desc: 'Abych se donutil studovat i komplexnější témata, ke kterým bych doma sám nenašel dostatek motivace, rozhodl jsem se pro vysokou školu. Podal jsem si přihlášku na IT na VUT v Brně a na Informatiku na VŠB-TUO v Ostravě. Na VUT mě kvůli srovnávacím testům nevzali, a přestože mě později zvali do dalšího kola, zvolil jsem VŠB-TUO (FEI). Studium jsem zakončil bakalářskou prací na téma „Reaktivní frontend pro e-learningový systém“, kde bylo mým cílem modernizovat open-source školní systém Kelvin přepisem komponent ze staršího Svelte 3 do Vue 3. I když vývoj brzdila pomalejší open-source revize – po vytvoření Pull Requestu jsem často čekal týden až dva na code review – práci jsem úspěšně obhájil, složil státnice a získal titul Bc.'
          },
          {
            year: '2025',
            title: 'Stáž ve firmě Profiq a první zkušenosti z praxe',
            desc: 'Hned po bakalářských státnicích jsem udělal první velký krok do praxe a nastoupil jako stážista do firmy Profiq.com. Firemní prostředí mě výrazně posunulo jak technicky, tak v oblasti týmové spolupráce. Získal jsem praktické zkušenosti s Reactem a Google Firebase, naučil se fungovat v agilním týmu se Slackem a GitLabem a hlavně jsem se poprvé setkal s produkčním CI/CD nasazováním. Tento automatizovaný přístup se mi zalíbil natolik, že ho od té doby používám na GitHubu u všech svých osobních projektů.'
          },
          {
            year: '2025 – současnost',
            title: 'Magisterské studium, Rust a Tauri',
            desc: 'Pokračování na magisterském studiu informatiky na VŠB-TUO pro mě bylo logickým krokem a jako zaměření jsem si vybral Digitální zpracování obrazu a počítačovou grafiku. Přiznávám, že s masivním nástupem AI nástrojů začalo být studium místy trochu nudné – AI řadu úkolů až moc zjednodušuje a člověk pak hůře hledá motivaci řešit věci sám do hloubky. Abych neustrnul a posunul své technické hranice, naučil jsem se programovat v jazyce Rust. Díky kombinaci Rustu se SvelteKitem ve frameworku Tauri jsem objevil možnost vytvářet neuvěřitelně lehké a rychlé desktopové i mobilní aplikace.'
          },
          {
            year: '2025 – 2026',
            title: 'Klasifikace astronomických fotografií',
            desc: 'Na konci prvního ročníku navazujícího studia jsem propojil programování se svou vášní pro astrofotografii v rámci semestrálního projektu a vytvořil aplikaci pro klasifikaci astronomických fotografií. Software automaticky načítá surové snímky z dalekohledu, analyzuje je a na základě matematických metrik a normálního rozdělení jim přiděluje skóre od 1 (nejlepší, nejblíže statistickému středu) po 0 (nekvalitní data). Aplikace tak dokáže automaticky vyfiltrovat snímky znehodnocené mraky, mlhou či rozmazanými hvězdami, i když samotný algoritmus vyžadoval hodně ručního ladění konstant pro konkrétní dalekohled, kameru a sadu dat.'
          },
          {
            year: 'Současnost – budoucnost',
            title: 'Diplomová práce a open-source nástroj s neuronovou sítí',
            desc: 'Na semestrální projekt momentálně navazuji ve své diplomové práci, kde chci celý systém posunout na úplně novou úroveň. Trénuji konvoluční neuronovou síť (CNN), která bude snímky klasifikovat zcela automaticky a sama rozpozná dobrý a špatný záběr. Výsledný systém propojí neuronovou síť s uživatelsky nastavitelnými metrikami, takže si astrofotografové budou moci určit přesné limity pro výběr snímků do finálního zpracování (např. FWHM < 2.8 && star_count > 1000). Celý projekt plánuji vydat jako open-source na svém GitHubu, abych ho mohl využívat nejen já, ale kdokoliv z astrofotografické komunity.'
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
            title: 'The Early Spark: Drag-and-Drop Layouts',
            desc: 'My very first exposure to web development actually began slightly before high school. I started experimenting with basic web design and layouts, tinkering with a drag-and-drop WYSIWYG Web Builder to get a feel for how elements came together on a screen.',
            image: '/images/webBuilder_hr.jpg',
            thumbnail: '/images/webBuilder.jpg'
          },
          {
            year: '2018 - 2022',
            title: 'The Secret Programmer: High School Labs & Self-Education',
            desc: 'Upon entering high school, I quickly realized my peers had much more advanced chemistry foundations than I did, and I found myself struggling to catch up, particularly with organic chemistry. When the Covid-19 pandemic hit, it completely disrupted my routine; school shifted to online learning, which usually meant waking up, logging into class, and either going right back to sleep or playing games with friends. However, I used my free time at home to relentlessly teach myself programming. Between 2018 and 2020, I focused on building early personal websites, and from 2020 to 2022, I successfully solidified my core coding foundations.',
            image: '/images/oldPage_hr.png',
            thumbnail: '/images/oldPage.png'
          },
          {
            year: '2022',
            title: 'Expanding the Ecosystem: DiscordJS & SvelteKit',
            desc: 'This was a massive breakout year for my self-taught development stack as I transitioned away from basic building blocks and dove headfirst into modern JavaScript ecosystems. I expanded my toolkit significantly by mastering **SvelteKit** and developing custom automation bots using **DiscordJS**.',
            image: '/images/djs_hr.png',
            thumbnail: '/images/djs.png'
          },
          {
            year: '2022 - 2025',
            title: 'The Academic Deep Dive: Bachelor’s Degree in Informatics',
            desc: 'To force myself to learn complex topics that I lacked the self-motivation to study alone at home, I decided to pursue a university degree. I applied to IT at VUT in Brno and Informatics at VŠB in Ostrava. Though VUT rejected me based on their comparative entry exams, I enrolled at VŠB - FEI to officially study Informatics. My undergraduate journey culminated in my Bachelor\'s thesis, "Reactive Frontend for e-learning system," where I worked on Kelvin, an open-source school platform. My goal was to modernize its legacy Svelte 3 codebase by rewriting key components into a reactive Vue 3 frontend. Despite navigating the slow open-source pipeline—where submitting a Pull Request meant waiting one to two weeks for a review before I could proceed—I successfully defended my thesis, passed my state exams, and earned my Bachelor\'s degree.'
          },
          {
            year: '2025',
            title: 'The Professional Leap: Profiq Internship & CI/CD Pipelines',
            desc: "Immediately after passing my Bachelor's state exams, I took a major step into the industry by joining Profiq.com as an intern. This professional environment drastically leveled up my technical and collaborative skills; I gained hands-on experience with React.JS and Google Firebase, while learning to operate smoothly within an agile team using Slack and GitLab. Crucially, this is where I was introduced to production-grade CI/CD deployment pipelines—a practice I valued so much that I now implement it across all of my personal GitHub repositories."
          },
          {
            year: '2025 - Present',
            title: 'High-Performance Code: Master’s Degree, Rust, & Tauri',
            desc: "Continuing my academic path, I enrolled in the Master's Informatics program at VŠB, choosing a specialization in Digital Image Processing and Computer Graphics. Admittedly, the sudden rise of mainstream AI tools has made university feel a bit tedious, as AI makes tasks too easy and dampens the motivation to struggle through and deeply understand concepts on your own. To keep myself sharp and push my technical boundaries, I taught myself Rust. By combining Rust with SvelteKit inside the Tauri framework, I unlocked the ability to build incredibly lightweight, high-performance desktop and mobile applications."
          },
          {
            year: '2025 - 2026',
            title: 'Merging Code with the Stars: The Astronomical Classification Project',
            desc: "For the conclusion of my first Master's year, I merged my programming skills with my passion for astrophotography for my Semester Project: building a custom desktop application for the Classification of Astronomical Photographs. The software automatically parses raw telescope frames from a night of shooting and scores them from 1 (optimal, closest to the statistical center) to 0 (poor data) using normal distribution metrics. This allowed me to automatically filter out frames ruined by mists, clouds, or trailed stars, though the algorithm required heavy manual tuning of constants depending on the specific telescope, camera, and dataset used."
          },
          {
            year: 'Present - Future',
            title: 'The Open-Source Vision: Deep Learning & Deep Space',
            desc: 'I am currently preparing to scale up my astronomical software for my upcoming Master\'s Diploma Thesis. I am training a Convolutional Neural Network (CNN) to fully automate the image classification process, teaching it to recognize "good" vs. "bad" frames on its own. The final system will combine this neural network with user-defined threshold metrics—allowing astrophotographers to set absolute quality baselines (such as FWHM < 2.8 && star_count > 1000). To give back to the community, the finished tool will be hosted completely open-source on my GitHub for anyone to use.'
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
        shortDesc:
          'Focení noční oblohy a moje cesta k zachycování objektů hlubokého vesmíru.',
        tags: ['Vesmír', 'DSO', 'PixInsight', 'Mlhoviny'],
        timeline: [
          {
            year: 'Červen 2023',
            title: 'První noční snímky mobilem',
            desc: 'Moje cesta k focení noční oblohy začala docela nečekaně v červnu 2023, kdy jsem si pořídil telefon Google Pixel 7a. Jeho oficiální aplikace Google Fotoaparát má speciální astrofotografický režim, který mě okamžitě nadchl. Začal jsem ze zahrady zkoušet dlouhé expozice, abych zjistil, jaké detaily dokáže mobilní senzor zachytit. Zhruba ve stejné době jsem zkusil posunout limity i pomocí staré rodinné kamery s 60násobným optickým (a až 80násobným digitálním) zoomem. Pokusil jsem se s ní vyfotit Měsíc a alespoň náznak Saturnu, ale výsledky byly dost slabé – a právě to ve mně probudilo chuť pořídit si skutečné astronomické vybavení.',
            image: '/images/night_sky.jpg'
          },
          {
            year: 'Konec roku 2023',
            title: 'První dalekohled k 20. narozeninám',
            desc: 'Rodiče si všimli mé rostoucí fascinace vesmírem a noční oblohou, a proto mě ke 20. narozeninám překvapili mým úplně prvním dalekohledem – Celestron AstroMaster 130EQ. Vyzbrojený skutečnou optikou jsem začal trávit noci pozorováním Měsíce, planet a všeho, co se mi na obloze podařilo najít. Protože jsem si zážitky chtěl také zaznamenat, brzy jsem sestavu rozšířil o dedikovanou planetární kameru ZWO ASI678MC a pustil se do opravdového focení. S touto výbavou se mi podařilo vyfotit Jupiter a pořídit detailní snímky Měsíce.',
            image: '/image/0d7762d19c705f971526533e210edbc6.jpg?format=jpg'
          },
          {
            year: '2024',
            title: 'Přechod na hluboký vesmír a nová sestava',
            desc: 'Následující rok přinesl zásadní posun – od pozorování planet jsem přešel k objektům hlubokého vesmíru (DSO). Pořídil jsem si první motorizovanou rovníkovou montáž Sky-Watcher Star Adventurer GTi, která mi konečně umožnila fotit dlouhé expozice nezbytné pro zachycení slabých a vzdálených objektů. Rychle jsem zjistil, že focení mlhovin a galaxií mě baví mnohem víc než planety. Postupně jsem proto kompletně obměnil výbavu pro DSO: koupil jsem chlazenou astrofotografickou kameru ZWO ASI585MC Pro kvůli eliminaci tepelného šumu a původní dalekohled nahradil refraktorem William Optics RedCat 51 s pointačním dalekohledem. S touto sestavou jsem úspěšně vyfotil své první mlhoviny, galaxie a další objekty.',
            image: '/image/217bf73bd3408cf93bcd671d4ee6880c.png?format=jpg'
          },
          {
            year: '2025',
            title: 'Automatizace sestavy a přechod na PixInsight',
            desc: 'S rostoucím nadšením se rok 2025 nesl ve znamení důkladné technické optimalizace mé DSO sestavy. Výrazně jsem zlepšil přesnost navádění pořízením montáže Proxisky Ragdoll 17 Pro a celý proces automatizoval přidáním elektronického ostření (Gemini Astro EAF) a dedikovaného mini PC, které celou sestavu v noci spolehlivě řídí. Společně s hardwarem prošlo velkým vývojem i softwarové zpracování dat – začínal jsem v kombinaci DeepSkyStacker a Siril, později přešel na DeepSkyStacker s PixInsightem a nakonec celý proces skládání i úprav přesunul výhradně do PixInsightu pro dosažení špičkových výsledků.',
            image: '/image/d64650ba622b88f6c1be201f0ec834f2.png?format=jpg'
          },

          {
            year: 'Červen 2026',
            title: 'Návrat k planetám s 10palcovým dalekohledem',
            desc: "V červnu 2026 jsem se rozhodl vrátit ke svým začátkům s focením planet a Měsíce a pořídil si pořádný hardwarový upgrade – výkonný planetární dalekohled Sky-Watcher Flextube 10'' GoTo. Tento velký dalekohled mi umožňuje přesně sledovat a zachycovat jemné detaily planet i měsíčního povrchu, takže skvěle doplňuje mou širokoúhlou sestavu pro hluboký vesmír.",
            image: '/image/40a0e0f84515a42f7516f52ec5d3a8ff.png?format=jpg'
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
            year: 'June 2023',
            title: 'The Smartphone Spark: Discovering the Night Sky',
            desc: 'My journey into the cosmos unexpectedly began when I bought a new phone, the Google Pixel 7a. Because Pixel phones run a "clean" version of Android, they come equipped with the official Google Camera app, which features a dedicated astrophotography mode. Fascinated by this feature, I began taking long-exposure pictures of the night sky right from my backyard just to see what hidden details the sensor could capture. Around the same time, I tried to push my limits by using an old family camera that featured a massive 60x optical zoom (up to 80x digital zoom). I used it to try and photograph the Moon and even get a glimpse of Saturn, but the results were quite poor, which only fueled my desire for proper equipment.',
            image: '/images/night_sky.jpg'
          },
          {
            year: 'Late 2023',
            title: 'First Real Optics: The 20th Birthday Telescope',
            desc: 'Noticing my growing fascination with outer space and the starry sky, my parents surprised me for my 20th birthday by buying me my very first telescope: a Celestron Astromaster 130EQ. Armed with proper optics, I spent my nights exploring the sky, tracking down the Moon, planets, and anything else I could find. Eager to capture what I was seeing visually, I soon upgraded my capabilities by purchasing a dedicated planetary camera—the ZWO ASI678MC. With this new setup, I successfully managed to take my first proper images of Jupiter and detailed close-ups of the Moon.',
            image: '/image/0d7762d19c705f971526533e210edbc6.jpg?format=jpg'
          },
          {
            year: '2024',
            title: 'Entering Deep Space: The Star Adventurer Mount',
            desc: 'The following year marked a massive shift in my approach as I transitioned from planetary observation to Deep Sky Objects (DSO). I purchased my first motorized tracking mount, the SkyWatcher Star Adventurer GTI, which completely unlocked the ability to take the long exposures necessary to capture faint, distant objects. I quickly realized that imaging distant nebulae and galaxies fascinated me far more than planets. To build a dedicated DSO rig, I gradually overhauled my gear: I bought a cooled astrophotography camera (the ZWO ASI585MC Pro) to eliminate thermal noise and replaced my old telescope with a premium William Optics RedCat 51 refractor telescope, complete with a separate guide scope. With this advanced setup, I successfully captured my very first deep-space nebulae and galaxies.',
            image: '/image/217bf73bd3408cf93bcd671d4ee6880c.png?format=jpg'
          },
          {
            year: '2025',
            title: 'Hardware Overhaul & Processing Mastery: Building a Remote Rig',
            desc: 'As my passion grew, 2025 became a year of heavy technical optimization for my DSO setup. I significantly upgraded my tracking capabilities by acquiring a new high-end mount, the Proxisky Ragdoll 17 Pro, and automated my workflows by adding an electronic auto-focuser (Gemini Astro EAF) alongside a dedicated mini PC to run the entire rig smoothly at night. Alongside the physical hardware, my post-processing workflow underwent a massive evolution. I initially started stacking and editing my images using a combination of Deep Sky Stacker and Siril. Later on, I shifted to Deep Sky Stacker combined with PixInsight, before ultimately migrating my entire stacking and processing pipeline completely into PixInsight to achieve publication-grade results.',
            image: '/image/d64650ba622b88f6c1be201f0ec834f2.png?format=jpg'
          },

          {
            year: 'June 2026',
            title: 'Expanding Horizons: The 10-Inch Planetary Upgrade',
            desc: "In June 2026, I decided to revisit my roots in planetary and lunar imaging with a massive hardware addition. I newly purchased a powerful planetary telescope—the Skywatcher Flextube 10'' GoTo. This massive light bucket allows me to track and capture highly detailed planetary and lunar views with precision, creating a perfect balance alongside my dedicated wide-field deep-sky imaging setup.",
            image: '/image/40a0e0f84515a42f7516f52ec5d3a8ff.png?format=jpg'
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
        title: 'The Amazing Digital Circus',
        type: 'Seriál',
        year: 2023,
        rating: 4.8,
        review:
          'Super seriál se super příběhem, na to že jsem se random uprostřed dne rozhodl zkouknout první epizodu a v jednom běhu stihl zkouknout všechny (kromě poslední co ješté neexistovala), tak musím říct, že to umí vtáhnout. Dokonce jsem byl na finále v kině, takže PEAK',
        added_at: '2026-06-07'
      },
      {
        title: 'Miraculous World: Tokio - Stellar Force',
        type: 'Film',
        year: 2025,
        rating: 4.9,
        review:
          'Opět další díl ze série Berušky a Černého Kocoura, mega se mi líbí anime style kresba <3',
        added_at: '2025-12-24'
      },
      {
        title: 'LoliRok',
        type: 'Seriál',
        year: 2014,
        rating: 4.2,
        review:
          'Takový basic seriál podobný WinxClubu. Některé epizody jsou nudné, kde se nic moc neděje, ale většina epizod přispívá k příběhu a je zajímavá.',
        added_at: '2025-05-07'
      },
      {
        title: 'Miraculous World: London, At the Edge of Time',
        type: 'Film',
        year: 2024,
        rating: 4.5,
        review:
          'Další menší filmík ze světa Kouzelné Berušky a Černého Kocoura, který navazuje na konec poslední série. Koukal jsem na to asi ve 4 ráno, takže moc objektivně nemůžu hodnotit, ale nenudil jsem se u toho, takže super 😄',
        added_at: '2024-10-06'
      },
      {
        title: 'Můj malý pony: Přátelství je magické',
        type: 'Seriál',
        year: 2010,
        rating: 4.5,
        review:
          '9 Sérií, 221 dílů dohromady, přestože ne všechny díly byly záživné, další jeden z mých oblíbených seriálů',
        added_at: '2024-03-30'
      },
      {
        title: 'Anna Mezi Obojživelníky',
        type: 'Seriál',
        year: 2019,
        rating: 4.6,
        review:
          'Další peak seriál, sice jsem se k dokoukání musel dokopat, ale když se člověk přežene přes nudnější epizody, tak se jedná o super seriál se super příběhem.',
        added_at: '2024-01-26'
      },
      {
        title: 'Soví dům',
        type: 'Seriál',
        year: 2020,
        rating: 4.9,
        review: 'Mega peak seriál <3. Poslední 3 epizody (zvláště S03E03) byly úžasné :)',
        added_at: '2023-04-21'
      },
      {
        title: 'Wednesday',
        type: 'Seriál',
        year: 2022,
        rating: 4.8,
        review: 'Jenna Ortega <3',
        added_at: '2022-12-02'
      },
      {
        title: 'Stranger Things',
        type: 'Seriál',
        year: 2016,
        rating: 4.8,
        review:
          'Super seriál :) libí se mi zpracování postavy, vibe atd.. škoda u poslední série, že dost věcí nedávalo hlavu a patu :/ ale když to opomenu, tak',
        added_at: '2022-09-10'
      },
      {
        title: 'Milo Murphyho zákon',
        type: 'Seriál',
        year: 2016,
        rating: 3.8,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Star Proti silám zla',
        type: 'Seriál',
        year: 2015,
        rating: 4.5,
        review:
          'Mega peak intro a celkový vibe seriálu je mega nice, škoda že finále bylo uspěchané (nesnáším tě Disney...)',
        added_at: '2022-09-10'
      },
      {
        title: 'Kouzelná Beruška a Černý kocour',
        type: 'Seriál',
        year: 2015,
        rating: 4.2,
        review: 'Gabiel Agreste = Ladybug',
        added_at: '2022-09-10'
      },
      {
        title: 'Městečko Záhad',
        type: 'Seriál',
        year: 2012,
        rating: 4.8,
        review: 'See you next summer',
        added_at: '2022-09-10'
      },
      {
        title: 'Ms.Marvel',
        type: 'Seriál',
        year: 2022,
        rating: 3.0,
        review: 'Líbí se mi schopnosti Ms.Marvel, příběh je průměrný',
        added_at: '2022-09-10'
      },
      {
        title: 'Captain Marvel',
        type: 'Film',
        year: 2019,
        rating: 4.0,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Moon Knight',
        type: 'Seriál',
        year: 2022,
        rating: 3.0,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Hawkeye',
        type: 'Seriál',
        year: 2021,
        rating: 4.0,
        review: 'Škoda že nemělo pokračování :/',
        added_at: '2022-09-10'
      },
      {
        title: 'Loki',
        type: 'Seriál',
        year: 2021,
        rating: 5.0,
        review: 'Peak',
        added_at: '2022-09-10'
      },
      {
        title: 'WandaVision',
        type: 'Seriál',
        year: 2021,
        rating: 4.5,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Falcon a Winter Soldier',
        type: 'Seriál',
        year: 2021,
        rating: 3.0,
        review: 'No comment',
        added_at: '2022-09-10'
      }
    ]
  },
  en: {
    title: 'Movies & Series',
    description:
      'Here you will find series and movies I have watched, along with my short reviews.',
    movies: [
      {
        title: 'The Amazing Digital Circus',
        type: 'Series',
        year: 2023,
        rating: 4.8,
        review:
          "Super series with a super story, considering I randomly decided to watch the first episode in the middle of the day and binge-watched all of them in one run (except the last one that didn't exist yet), I must say it really pulls you in. I even went to the cinema for the finale, so PEAK",
        added_at: '2026-06-07'
      },
      {
        title: 'Miraculous World: Tokyo - Stellar Force',
        type: 'Movie',
        year: 2025,
        rating: 4.9,
        review:
          'Yet another installment from the Ladybug and Cat Noir series, I love the anime-style drawing <3',
        added_at: '2025-12-24'
      },
      {
        title: 'LoliRock',
        type: 'Series',
        year: 2014,
        rating: 4.2,
        review:
          'A basic series similar to Winx Club. Some episodes are boring where not much happens, but most episodes contribute to the story and are interesting.',
        added_at: '2025-05-07'
      },
      {
        title: 'Miraculous World: London, At the Edge of Time',
        type: 'Movie',
        year: 2024,
        rating: 4.5,
        review:
          "Another short movie from the Miraculous Ladybug universe following the end of the last season. Watched it at around 4 AM so I can't review it very objectively, but wasn't bored at all, so super 😄",
        added_at: '2024-10-06'
      },
      {
        title: 'My Little Pony: Friendship is Magic',
        type: 'Series',
        year: 2010,
        rating: 4.5,
        review:
          '9 Seasons, 221 episodes total, although not all episodes were exciting, another one of my favorite series',
        added_at: '2024-03-30'
      },
      {
        title: 'Amphibia',
        type: 'Series',
        year: 2019,
        rating: 4.6,
        review:
          "Another peak series, though I had to push myself to finish it, but once you get through the slower episodes, it's a super series with a super story.",
        added_at: '2024-01-26'
      },
      {
        title: 'The Owl House',
        type: 'Series',
        year: 2020,
        rating: 4.9,
        review:
          'Mega peak series <3. The last 3 episodes (especially S03E03) were amazing :)',
        added_at: '2023-04-21'
      },
      {
        title: 'Wednesday',
        type: 'Series',
        year: 2022,
        rating: 4.8,
        review: 'Jenna Ortega <3',
        added_at: '2022-12-02'
      },
      {
        title: 'Stranger Things',
        type: 'Series',
        year: 2016,
        rating: 4.8,
        review:
          "Super series :) I like the character development, vibe etc.. pity about the last season, that quite a few things didn't make much sense :/ but leaving that aside, so",
        added_at: '2022-09-10'
      },
      {
        title: "Milo Murphy's Law",
        type: 'Series',
        year: 2016,
        rating: 3.8,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Star vs. the Forces of Evil',
        type: 'Series',
        year: 2015,
        rating: 4.5,
        review:
          'Mega peak intro and overall vibe of the series is mega nice, pity the finale was rushed (hate you Disney...)',
        added_at: '2022-09-10'
      },
      {
        title: 'Miraculous: Tales of Ladybug & Cat Noir',
        type: 'Series',
        year: 2015,
        rating: 4.2,
        review: 'Gabriel Agreste = Ladybug',
        added_at: '2022-09-10'
      },
      {
        title: 'Gravity Falls',
        type: 'Series',
        year: 2012,
        rating: 4.8,
        review: 'See you next summer',
        added_at: '2022-09-10'
      },
      {
        title: 'Ms. Marvel',
        type: 'Series',
        year: 2022,
        rating: 3.0,
        review: "I like Ms. Marvel's abilities, the story is average",
        added_at: '2022-09-10'
      },
      {
        title: 'Captain Marvel',
        type: 'Movie',
        year: 2019,
        rating: 4.0,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Moon Knight',
        type: 'Series',
        year: 2022,
        rating: 3.0,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'Hawkeye',
        type: 'Series',
        year: 2021,
        rating: 4.0,
        review: "Pity it didn't have a sequel :/",
        added_at: '2022-09-10'
      },
      {
        title: 'Loki',
        type: 'Series',
        year: 2021,
        rating: 5.0,
        review: 'Peak',
        added_at: '2022-09-10'
      },
      {
        title: 'WandaVision',
        type: 'Series',
        year: 2021,
        rating: 4.5,
        review: 'No comment',
        added_at: '2022-09-10'
      },
      {
        title: 'The Falcon and the Winter Soldier',
        type: 'Series',
        year: 2021,
        rating: 3.0,
        review: 'No comment',
        added_at: '2022-09-10'
      }
    ]
  }
};
