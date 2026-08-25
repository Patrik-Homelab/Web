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
        shortDesc: 'Moje akademická cesta světem informatiky a technologií.',
        tags: ['VŠB-TUO', 'Informatika'],
        timeline: [
          {
            year: 'Před rokem 2018',
            title: 'Rozcestí: Volba chemie vs. elektrotechnika',
            desc: 'Od základní školy mě velmi bavila matematika a chemie, což mě postavilo před těžké rozhodování, kterou střední školu zvolit. Můj děda mi tehdy dal zásadní radu: podat si přihlášku na obě školy, a pokud mě vezmou na obě, vybrat si tu náročnější. Podal jsem si tedy přihlášky na Střední školu chemickou akademika Heyrovského v Ostravě a na dvě elektrotechnické školy v Havířově. Když dorazily výsledky přijímacího řízení, na elektrotechnice jsem skončil na 13. místě z 30 přijímaných studentů. Na chemické škole jsem se umístil na 57. místě ze 60 – od čáry neúspěchu mě dělilo jen pár desetin bodu, takže jsem se dostal jen tak tak. Vybral jsem si chemii s vědomím, že pokročilé chemické laboratoře a pokusy si doma sám nezařídím, což z ní dělalo jedinečnou příležitost ke vzdělávání. Tím začal můj příběh na chemické střední škole.'
          },
          {
            year: '2018 - 2022',
            title: 'Střední škola: Chemie, laboratoře a covidová výzva',
            desc: 'Hned v prvním ročníku na střední škole jsem zjistil, že většina spolužáků má mnohem pokročilejší základy chemie než já, a byl jsem poměrně pozadu, přičemž největší obtíží pro mě byla organická chemie. Postupně jsem během let zjišťoval, že laboratoře mě sice baví, ale chemie jako celek není úplně to, co mě dlouhodobě naplňuje. Významný dopad na mé studium měla pandemie Covid-19, která zcela rozbila běžnou rutinu; online výuka většinou znamenala ráno se jen připojit k systému a jít buď dál spát, nebo hrát hry s kamarády. Školu jsem však úspěšně dokončil a získal maturitu. Rozhodl jsem se pokračovat na vysokou školu – hlavním důvodem kromě titulu bylo to, že mě akademické prostředí donutí naučit se komplexní věci, ke kterým bych doma sám nenašel dostatek vnitřní motivace. Podal jsem přihlášky na VUT v Brně (obor Informační technologie) a na VŠB v Ostravě (obor Informatika). Na VUT mě kvůli systému srovnávacích testů nepřijali, a přestože mě později kontaktovali ohledně účasti v dalším kole, rozhodl jsem se nastoupit na VŠB.'
          },
          {
            year: '2022 - 2025',
            title: 'Bakalářské studium: Informatika na VŠB-FEI a projekt Kelvin',
            desc: 'Nastoupil jsem na Fakultě elektrotechniky a informatiky (FEI) na VŠB v Ostravě ke studiu oboru Informatika. Své tříleté bakalářské studium jsem úspěšně zakončil obhajobou bakalářské práce na téma „Reaktivní Frontend pro elearningový systém“. V rámci této práce jsem se podílel na rozvoji školního informačního systému Kelvin. Pokrok byl v průběhu semestrů občas zpomalen specifickou povahou schvalovacích procesů v rámci akademického open-source projektu, kde se na revize odevzdané práce čekalo i několik týdnů. I přes tyto časové komplikace jsem bakalářskou práci úspěšně obhájil, prošel státní závěrečnou zkouškou a získal titul bakalář.'
          },
          {
            year: '2025 - Současnost',
            title: 'Magisterské studium: Počítačová grafika a akademické výzvy',
            desc: 'Magisterské studium na VŠB pro mě bylo logickým krokem – věděl jsem, že mi další dva roky studia rozšíří obzory a umožní mi získat inženýrský titul. Zvolil jsem si obor Informatika, který přímo navazuje na bakalářský program, a jako své užší zaměření jsem si vybral Digitální zpracování obrazu a počítačovou grafiku. S masivním nástupem moderních AI nástrojů do výuky však studium získalo novou dynamiku; AI sice mnoho akademických úkolů zjednodušuje, ale zároveň je kvůli ní těžší udržet si motivaci řešit složité problémy zcela samostatně a pronikat do nich hluboko pod povrch. První rok studia jsem úspěšně zvládl a zakončil ho Semestrálním projektem na téma „Klasifikace Astronomických fotografií“. Navrhl jsem v něm systém, který analyzuje surové snímky z nočního pozorování a na základě statistického vyhodnocení a normálního rozdělení dat je třídí, čímž pomáhá eliminovat nekvalitní snímky znehodnocené mraky, mlhou či atmosférickými vlivy.'
          },
          {
            year: 'Současnost - Budoucnost',
            title: 'Diplomová práce: Pokročilé zpracování dat v astrofotografii',
            desc: 'Na výsledky svého semestrálního projektu bezprostředně navazuji v rámci přípravy své magisterské Diplomové práce. Celý klasifikační systém plánuji posunout na vyšší úroveň integrací pokročilých metod rozpoznávání obrazu, které budou snímky noční oblohy třídit zcela autonomně. Výsledný akademický projekt propojí teoretické znalosti z oblasti počítačové grafiky s uživatelsky definovanými kvalitativními kritérii pro čistotu dat. Cílem je úspěšné dokončení inženýrského studia a vytvoření přínosné práce, která najde uplatnění při reálném zpracování astronomických dat.'
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
          'Jak jsem se dostal k programování, moje oblíbené technologie a milníky.',
        tags: ['SvelteKit', 'Rust', 'Tauri', 'Node.js', 'React'],
        timeline: [
          {
            year: '2016',
            title: 'První jiskra: Drag-and-Drop rozvržení',
            desc: 'Moje úplně první zkušenost s webovým vývojem začala ještě před nástupem na střední školu. Tehdy jsem začal experimentovat s jednoduchým webovým designem a strukturou stránek, přičemž jsem zkoušel klikat v drag-and-drop nástroji WYSIWYG Web Builder, abych vůbec dostal do ruky cit pro to, jak se jednotlivé prvky na obrazovce skládají k sobě.',
            thumbnail: '/images/webBuilder.jpg',
            image: '/images/webBuilder_hr.jpg'
          },
          {
            year: '2018 - 2022',
            title: 'Tajný programátor: Středoškolské laboratoře a samostudium',
            desc: 'Hned v prváku na chemické škole jsem zjistil, že většina spolužáků má mnohem pokročilejší základy než já a s chemií (hlavně s tou organickou) jsem docela bojoval. Postupně jsem zjišťoval, že laboratoře jsou sice fajn, ale chemie jako taková mě úplně nenaplňuje. Zlom přišel s pandemií Covid-19, která úplně rozbila běžnou rutinu – výuka se přesunula do online prostoru, což většinou znamenalo ráno se jen připojit a jít buď dál spát, nebo hrát hry s kamarády. Já jsem ale tento čas doma využil k tomu, že jsem se začal intenzivně a tvrdohlavě učit programovat. Mezi lety 2018 a 2020 jsem se zaměřil na tvorbu svých prvních osobních webů a v letech 2020 až 2022 se mi podařilo úspěšně upevnit své programátorské základy. Střední školu jsem sice úspěšně odmaturoval, ale věděl jsem, že chci jít dál cestou IT.',
            thumbnail: '/images/oldPage.png',
            image: '/images/oldPage_hr.png'
          },
          {
            year: '2022',
            title: 'Rozšiřování ekosystému: DiscordJS a SvelteKit',
            desc: 'Tento rok byl pro můj technologický stack klíčový, protože jsem se posunul od úplných základních stavebních bloků k modernímu javascriptovému ekosystému. Výrazně jsem rozšířil své obzory, když jsem kompletně pronikl do **SvelteKit** a začal vyvíjet vlastní automatizační boty pomocí **DiscordJS**.',
            thumbnail: '/images/djs.png',
            image: '/images/djs_hr.png'
          },
          {
            year: '2022 - 2025',
            title: 'Akademický hluboký ponor: Bakalářské studium Informatiky',
            desc: 'Abych se donutil studovat i komplexnější témata, ke kterým bych sám doma nenašel dostatek vnitřní motivace, rozhodl jsem se pro vysokou školu. Podal jsem si přihlášku na IT na VUT v Brně a na Informatiku na VŠB v Ostravě. Na VUT mě kvůli srovnávacím testům nevzali, a přestože mě později zvali do dalšího kola, zvolil jsem VŠB - FEI. Studium jsem zakončil bakalářskou prací na téma *„Reaktivní Frontend pro elearningový systém“*, kde bylo mým cílem přepsat open-source školní systém **Kelvin** do reaktivního frontendu. Konkrétně šlo o přepis komponent z legacy Svelte 3 do **Vue 3**. I když byl vývoj kvůli open-source povaze projektu pomalý – po vytvoření Pull Requestu jsem často čekal týden až dva na code review, než jsem mohl pokračovat dál – práci jsem úspěšně obhájil, složil státnice a získal titul bakalář.'
          },
          {
            year: '2025',
            title: 'Profesní skok: Stáž v Profiq a CI/CD pipeline',
            desc: 'Hned po státnicích na bakaláři jsem udělal svůj první velký krok do praxe a nastoupil jako stážista do firmy **Profiq.com**. Toto firemní prostředí mě obrovsky posunulo dopředu jak technicky, tak v oblasti týmové spolupráce. Získal jsem praktické zkušenosti s **React.JS** a **Google Firebase**, naučil se fungovat v agilním týmu za použití Slacku a GitLabu, a hlavně jsem se poprvé setkal s produkčním **CI/CD deployem**. Tento automatizovaný přístup se mi zalíbil natolik, že ho od té doby aplikuji na GitHubu u všech svých osobních projektů.'
          },
          {
            year: '2025 - Současnost',
            title: 'Cesta za vysokým výkonem: Magisterské studium, Rust a Tauri',
            desc: 'Pokračování na magisterském studiu Informatiky na VŠB pro mě bylo logickým krokem, přičemž jsem si jako zaměření vybral **Digitální zpracování obrazu a počítačovou grafiku**. Musím přiznat, že s masivním nástupem AI nástrojů začalo být studium trochu nudné, protože AI všechno až moc zjednodušuje a člověk pak ztrácí motivaci věci louskat sám a jít do hloubky. Abych si udržel ostrou mysl a posunul své technické hranice, naučil jsem se programovat v jazyce **Rust**. Kombinací Rustu se SvelteKitem v rámci frameworku **Tauri** jsem objevil možnost, jak vytvářet neuvěřitelně lehké a extrémně rychlé desktopové i mobilní aplikace.'
          },
          {
            year: '2025 - 2026',
            title: 'Spojení kódu s hvězdami: Projekt astronomické klasifikace',
            desc: 'Na konci prvního ročníku navazujícího studia jsem propojil své programátorské dovednosti se svou velkou vášní pro astrofotografii v rámci Semestrálního projektu: vytvořil jsem aplikaci pro **Klasifikaci astronomických fotografií**. Software automaticky načítá raw snímky z teleskopu, analyzuje je a na základě matematických metrik a normálního rozdělení jim uděluje body od 1 (nejlepší, nejblíže ke statistickému středu) do 0 (špatná data). Díky tomu dokáže aplikace automaticky vyfiltrovat snímky zničené mrakem, mlhou nebo rozmazanými hvězdami, i když samotný algoritmus vyžadoval hodně ručního ladění konstant pro konkrétní teleskop, kameru a dataset.'
          },
          {
            year: 'Současnost - Budoucnost',
            title: 'Open-Source vize: Deep Learning a hluboký vesmír',
            desc: 'Na svůj semestrální projekt momentálně navazuji ve své **Diplomové práci**, kde chci celý systém posunout na úplně novou úroveň. Trénuji **konvoluční neuronovou síť (CNN)**, která bude snímky klasifikovat zcela automaticky a sama rozpozná „dobrý“ a „špatný“ záběr. Výsledný systém propojí neuronovou siť s uživatelsky nastavitelnými metrikami, takže si astrofotografové budou moci určit přesné hranice pro přijetí snímků do finálního zpracování (např. FWHM < 2.8 && star_count > 1000). Celý projekt plánuji vydat jako open-source na svém GitHubu, aby ho mohl volně využívat jak já, tak kdokoliv další z astronomické komunity.'
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
          'Focení vesmíru: moje dobrodružství při zachycování hlubokého vesmíru.',
        tags: ['Vesmír', 'DSO', 'PixInsight', 'Mlhoviny'],
        timeline: [
          {
            year: 'Červen 2023',
            title: 'Mobilní jiskra: Objevování noční oblohy',
            desc: 'Moje cesta do hlubin vesmíru začala víceméně nečekaně, když jsem si v červnu 2023 pořídil nový telefon Google Pixel 7a. Výhodou telefonů řady Pixel je, že běžnou verzi Androidu doplňuje i oficiální aplikace Google Fotoaparát disponující specializovaným astrofotografickým módem. Fascinován touto funkcí jsem začal ze své zahrady zkoušet fotit noční oblohu na dlouhé expozice, abych zjistil, jaké skryté detaily dokáže mobilní senzor zachytit. Přibližně ve stejné době jsem se pokusil posunout své limity pomocí staré rodinné kamery, která nabízela obrovský 60násobný optický zoom (až 80násobný digitální). Pokusil jsem se s ní vyfotit Měsíc a aspoň trochu zachytit Saturn, ale výsledky byly poměrně slabé, což ve mně pouze probudilo touhu po skutečném astronomickém vybavení.',
            image: '/images/night_sky.jpg'
          },
          {
            year: 'Konec roku 2023',
            title: 'První skutečná optika: Teleskop k 20. narozeninám',
            desc: 'Rodiče si postupně všimli mé rostoucí fascinace vesmírem a hvězdnou oblohou, a proto mě k mým 20. narozeninám překvapili koupí mého úplně prvního teleskopu – Celestron Astromaster 130EQ. Vyzbrojen skutečnou optikou jsem začal trávit noci pozorováním oblohy, vyhledáváním Měsíce, planet a všeho, co se mi na obloze podařilo najít. Protože jsem chtěl vizuální zážitky také zdokumentovat, brzy jsem své možnosti rozšířil nákupem dedikované planetární kamery ZWO ASI678MC a začal zkoušet skutečné fotografování. S touto novou sestavou se mi podařilo úspěšně vyfotit Jupiter a pořídit detailní snímky Měsíce.',
            image:
              'https://patrick115.eu/image/0d7762d19c705f971526533e210edbc6.jpg?format=jpg'
          },
          {
            year: '2024',
            title: 'Vstup do hlubokého vesmíru: Montáž Star Adventurer',
            desc: 'Následující rok znamenal obrovský posun v mém přístupu, protože jsem přešel od pozorování planet k objektům hlubokého vesmíru (DSO). Pořídil jsem si svoji první motorizovanou rovníkovou montáž SkyWatcher Star Adventurer GTI, která mi konečně umožnila fotit dlouhé expozice nezbytné pro zachycení slabých a vzdálených objektů. Rychle jsem si uvědomil, že focení vzdálených mlhovin a galaxií mě fascinuje mnohem více než planety. Abych si vybudoval specializovaný DSO setup, postupně jsem kompletně obměnil výbavu: koupil jsem chlazenou astrofotografickou kameru ZWO ASI585MC Pro pro eliminaci tepelného šumu a starý teleskop nahradil prémiovým refraktorem William Optics RedCat 51 s naváděcím dalekohledem. S touto pokročilou sestavou jsem úspěšně vyfotit své první mlhoviny, galaxie a další objekty.',
            image:
              'https://patrick115.eu/image/217bf73bd3408cf93bcd671d4ee6880c.png?format=jpg'
          },
          {
            year: '2025',
            title:
              'Technická optimalizace a mistrovství ve zpracování: Budování vzdáleného setupu',
            desc: 'Jak moje vášeň rostla, rok 2025 se stal rokem těžké technické optimalizace mého DSO setupu. Výrazně jsem vylepšil přesnost navádění pořízením nové high-end montáže Proxisky Ragdoll 17 Pro a celý proces automatizoval přidáním elektronického ostření (Gemini Astro EAF) společně s dedikovaným mini PC, které celou sestavu v noci spolehlivě řídí. Ruku v ruce s hardwarem prošlo masivním vývojem i samotné softwarové zpracování dat. Začínal jsem se skládáním a úpravami v kombinaci programů Deep Sky Stacker a Siril, později jsem přešel na kombinaci Deep Sky Stacker a PixInsight, až jsem nakonec celý proces skládání a editace kompletně přesunul do PixInsightu, abych dosáhl špičkových výsledků.',
            image:
              'https://patrick115.eu/image/d64650ba622b88f6c1be201f0ec834f2.png?format=jpg'
          },

          {
            year: 'Červen 2026',
            title: 'Rozšiřování obzorů: 10palcový planetární upgrade',
            desc: "V červnu 2026 jsem se rozhodl vrátit ke svým kořenům v podobě focení planet a Měsíce a pořídil jsem si masivní hardwarový upgrade. Nově jsem si koupil výkonný planetární teleskop Skywatcher Flextube 10'' GoTo. Tento obrovský teleskop mi umožňuje precizně sledovat a pořizovat vysoce detailní snímky planet a měsíčního povrchu, což vytváří dokonalou rovnováhu k mému širokoúhlému setupu pro focení hlubokého vesmíru.",
            image:
              'https://patrick115.eu/image/40a0e0f84515a42f7516f52ec5d3a8ff.png?format=jpg'
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
            image:
              'https://patrick115.eu/image/0d7762d19c705f971526533e210edbc6.jpg?format=jpg'
          },
          {
            year: '2024',
            title: 'Entering Deep Space: The Star Adventurer Mount',
            desc: 'The following year marked a massive shift in my approach as I transitioned from planetary observation to Deep Sky Objects (DSO). I purchased my first motorized tracking mount, the SkyWatcher Star Adventurer GTI, which completely unlocked the ability to take the long exposures necessary to capture faint, distant objects. I quickly realized that imaging distant nebulae and galaxies fascinated me far more than planets. To build a dedicated DSO rig, I gradually overhauled my gear: I bought a cooled astrophotography camera (the ZWO ASI585MC Pro) to eliminate thermal noise and replaced my old telescope with a premium William Optics RedCat 51 refractor telescope, complete with a separate guide scope. With this advanced setup, I successfully captured my very first deep-space nebulae and galaxies.',
            image:
              'https://patrick115.eu/image/217bf73bd3408cf93bcd671d4ee6880c.png?format=jpg'
          },
          {
            year: '2025',
            title: 'Hardware Overhaul & Processing Mastery: Building a Remote Rig',
            desc: 'As my passion grew, 2025 became a year of heavy technical optimization for my DSO setup. I significantly upgraded my tracking capabilities by acquiring a new high-end mount, the Proxisky Ragdoll 17 Pro, and automated my workflows by adding an electronic auto-focuser (Gemini Astro EAF) alongside a dedicated mini PC to run the entire rig smoothly at night. Alongside the physical hardware, my post-processing workflow underwent a massive evolution. I initially started stacking and editing my images using a combination of Deep Sky Stacker and Siril. Later on, I shifted to Deep Sky Stacker combined with PixInsight, before ultimately migrating my entire stacking and processing pipeline completely into PixInsight to achieve publication-grade results.',
            image:
              'https://patrick115.eu/image/d64650ba622b88f6c1be201f0ec834f2.png?format=jpg'
          },

          {
            year: 'June 2026',
            title: 'Expanding Horizons: The 10-Inch Planetary Upgrade',
            desc: "In June 2026, I decided to revisit my roots in planetary and lunar imaging with a massive hardware addition. I newly purchased a powerful planetary telescope—the Skywatcher Flextube 10'' GoTo. This massive light bucket allows me to track and capture highly detailed planetary and lunar views with precision, creating a perfect balance alongside my dedicated wide-field deep-sky imaging setup.",
            image:
              'https://patrick115.eu/image/40a0e0f84515a42f7516f52ec5d3a8ff.png?format=jpg'
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
    description:
      'Here you will find series and movies I have watched, along with my short reviews.',
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
