import type { AboutStory } from './types';

const galleryImage = '/images/Image-800.webp';
const galleryPreview = '/images/Image-400.webp';
const profile = '/images/PFP.jpg';

const czechAboutStory: AboutStory = {
  title: 'Sluneční soustava příběhu',
  subtitle: 'Reálné planety, pohyb a moje časová osa jako události na orbitách.',
  hint: 'Klikni na těleso, otevři náhled a v popupu rozbal celý text.',
  entries: [
    {
      id: 'sun-origin',
      kind: 'sun',
      title: 'Slunce',
      subtitle: '2016: Start příběhu',
      preview:
        'Tady všechno začíná: první zájem o weby a přechod od editorů k reálnému kódu.',
      full: 'V 8. třídě jsem zkoušel WYSIWYG editory a nehezké exporty HTML, ale rychle jsem přešel na čisté HTML a CSS, protože jsem chtěl chápat, jak web skutečně funguje. Následně jsem si hrál i se základní PHP session autentizací a pochopil základy serverové logiky přihlášení.',
      images: [
        { src: profile, alt: 'Portrét pro začátek příběhu', caption: 'První jiskra.' }
      ],
      visual: { orbit: 0, period: 0, size: 5.8, startAngle: 0, theme: 'sun' }
    },
    {
      id: 'mercury',
      kind: 'planet',
      title: 'Merkur',
      subtitle: 'Rychlé první experimenty',
      preview: 'Úplný začátek: rychlé iterace, zvědavost a malé prototypy webů.',
      full: 'Tato fáze je o prvním tempu, kdy bylo všechno nové. Každý malý experiment mě posouval v porozumění základům i praktickém psaní kódu.',
      images: [{ src: galleryPreview, alt: 'Ilustrační obrázek Merkuru' }],
      visual: { orbit: 8, period: 9, size: 1.4, startAngle: 40, theme: 'mercury' }
    },
    {
      id: 'venus',
      kind: 'planet',
      title: 'Venuše',
      subtitle: '2018-2020: Éra PHP',
      preview:
        'Framework-free PHP systémy: automatizace, tickety, práva a komunitní nástroje.',
      full: 'S PHP jsem stavěl vše ručně: administrační systémy, SSH automatizaci nasazení botů i informační panely pro komunity. Tahle etapa mě naučila praktický backend a provozní uvažování.',
      images: [{ src: galleryImage, alt: 'Ilustrační obrázek Venuše' }],
      visual: { orbit: 12, period: 14, size: 2.1, startAngle: 120, theme: 'venus' }
    },
    {
      id: 'earth',
      kind: 'planet',
      title: 'Země',
      subtitle: 'Vzdělávací orbita',
      preview:
        'Cesta od střední školy přes bakaláře až po navazující magisterské studium.',
      full: 'Studoval jsem chemickou průmyslovku a programování se učil hlavně sám. Poté jsem přešel na VSB-TUO, kde jsem dokončil bakaláře z informatiky a prohloubil znalosti low-level konceptů, C/C++/C#/Python základů a databází. Aktuálně pokračuji v navazujícím magisterském studiu se zaměřením na zpracování obrazu a grafiku.',
      images: [
        {
          src: galleryImage,
          alt: 'Obrázek Země pro vzdělání',
          caption: 'Vzdělání jako dlouhá stabilní orbita.'
        },
        { src: profile, alt: 'Druhý obrázek Země' }
      ],
      visual: { orbit: 16, period: 20, size: 2.3, startAngle: 200, theme: 'earth' }
    },
    {
      id: 'moon',
      parentId: 'earth',
      kind: 'moon',
      title: 'Měsíc',
      subtitle: 'Školní milníky',
      preview:
        'Střední škola, bakalářská práce a současný master + Astro Grader diplomka.',
      full: 'Klíčové milníky: chemická průmyslovka v Ostravě (2018-2020), bakalářská práce na migraci frontendové architektury Kelvinu (Svelte 3 -> Vue 3 + úpravy Django API), a současný Astro Grader projekt pro třídění FITS snímků s cílem přejít na neuronovou síť.',
      images: [
        { src: galleryPreview, alt: 'Obrázek Měsíce pro milníky' },
        { src: galleryImage, alt: 'Druhý obrázek Měsíce' }
      ],
      visual: { orbit: 3.6, period: 7.3, size: 1.05, startAngle: 20, theme: 'moon' }
    },
    {
      id: 'mars',
      kind: 'planet',
      title: 'Mars',
      subtitle: '2020-2022: JavaScript + NodeJS',
      preview: 'Hlubší práce s JavaScriptem, AJAX frontendy a NodeJS boty.',
      full: 'S jQuery a AJAX jsem dělal plynulejší rozhraní bez reloadu. Paralelně jsem v NodeJS vyvíjel Discord boty a další utility skripty, včetně nástrojů usnadňujících chemické výpočty.',
      images: [{ src: galleryPreview, alt: 'Obrázek Marsu pro JS období' }],
      visual: { orbit: 20, period: 26, size: 1.8, startAngle: 330, theme: 'mars' }
    },
    {
      id: 'phobos',
      parentId: 'mars',
      kind: 'moon',
      title: 'Phobos',
      subtitle: 'Rychlé iterace',
      preview: 'Malý, ale rychlý milník pro svižné frontendové experimenty.',
      full: 'Reprezentuje rychlé cykly pokus-omyl, které zvyšovaly tempo implementace i jistotu.',
      images: [{ src: profile, alt: 'Obrázek měsíce Phobos' }],
      visual: { orbit: 2.6, period: 4.6, size: 0.82, startAngle: 50, theme: 'moon' }
    },
    {
      id: 'deimos',
      parentId: 'mars',
      kind: 'moon',
      title: 'Deimos',
      subtitle: 'Podpůrné skripty',
      preview: 'Vedlejší orbita pro utility skripty a automatizace kolem projektů.',
      full: 'Zachycuje paralelní tooling, který průběžně pomáhal provozu i produktivitě.',
      images: [{ src: galleryPreview, alt: 'Obrázek měsíce Deimos' }],
      visual: { orbit: 3.3, period: 6.4, size: 0.78, startAngle: 200, theme: 'moon' }
    },
    {
      id: 'jupiter',
      kind: 'planet',
      title: 'Jupiter',
      subtitle: '2022+: SvelteKit a full-stack růst',
      preview: 'Největší posun: objevení SvelteKitu a přechod většiny projektů na něj.',
      full: 'Po prvním kontaktu s Next.js jsem objevil SvelteKit, jehož compile-time přístup i syntaxe mi sedly výrazně více. Od té doby je to můj hlavní framework pro webové projekty.',
      images: [{ src: galleryImage, alt: 'Obrázek Jupiteru pro frameworkový milník' }],
      visual: { orbit: 26, period: 36, size: 3.7, startAngle: 145, theme: 'jupiter' }
    },
    {
      id: 'io',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Io',
      subtitle: 'Objev SvelteKitu',
      preview: 'Moment, kdy se SvelteKit stal mým default stackem.',
      full: 'Tento milník označuje přechod od kopírování cizích patternů k vlastním vědomým full-stack rozhodnutím.',
      images: [{ src: profile, alt: 'Obrázek měsíce Io' }],
      visual: { orbit: 3.4, period: 6.1, size: 0.95, startAngle: 18, theme: 'moon' }
    },
    {
      id: 'europa',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Europa',
      subtitle: 'Bakalářská migrace frontendu',
      preview: 'Reaktivní migrace univerzitního systému ze Svelte 3 na Vue 3.',
      full: 'Běžel současně starý i nový frontend, postupně se migrovaly komponenty a rozšiřoval backend v Django API.',
      images: [{ src: galleryPreview, alt: 'Obrázek měsíce Europa' }],
      visual: { orbit: 4.2, period: 7.2, size: 1.02, startAngle: 98, theme: 'moon' }
    },
    {
      id: 'ganymede',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Ganymed',
      subtitle: 'Typed API a architektura',
      preview:
        'Postupné zvyšování kvality architektury: typy, kompozice, opakovatelné patterny.',
      full: 'Milník symbolizuje zralejší strukturu projektů a lepší dlouhodobou udržitelnost.',
      images: [{ src: galleryImage, alt: 'Obrázek měsíce Ganymed' }],
      visual: { orbit: 5, period: 8.8, size: 1.08, startAngle: 190, theme: 'moon' }
    },
    {
      id: 'callisto',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Kallisto',
      subtitle: 'Boti a utility projekty',
      preview: 'Paralelní linka přes roky: Discord/Twitch boti a automatizační skripty.',
      full: 'Od komunitních statistik po vlastní utility nástroje, tato větev mi držela praxi v event-driven vývoji i integracích.',
      images: [{ src: profile, alt: 'Obrázek měsíce Kallisto' }],
      visual: { orbit: 5.8, period: 10.1, size: 1.05, startAngle: 285, theme: 'moon' }
    },
    {
      id: 'amalthea',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Amalthea',
      subtitle: 'Komunitní tooling',
      preview: 'Doplňková orbita pro praktické nástroje okolo hlavních projektů.',
      full: 'Reprezentuje lehčí komunitní a utility řešení mimo hlavní milníky.',
      images: [{ src: galleryPreview, alt: 'Obrázek měsíce Amalthea' }],
      visual: { orbit: 6.4, period: 11.5, size: 0.88, startAngle: 340, theme: 'moon' }
    },
    {
      id: 'himalia',
      parentId: 'jupiter',
      kind: 'moon',
      title: 'Himalia',
      subtitle: 'Adaptace mezi stacky',
      preview: 'Schopnost přepínat mezi technologiemi a stále doručovat.',
      full: 'Milník flexibility mezi frameworky a kontexty při týmové spolupráci.',
      images: [{ src: profile, alt: 'Obrázek měsíce Himalia' }],
      visual: { orbit: 7.2, period: 12.8, size: 0.82, startAngle: 66, theme: 'moon' }
    },
    {
      id: 'saturn',
      kind: 'planet',
      title: 'Saturn',
      subtitle: '2025-současnost: Profesní týmová zkušenost',
      preview: 'Od stáže po pokračující práci ve firmě Profiq s Reactem a NestJS.',
      full: 'Do Profiqu jsem šel na tříměsíční stáž, kde jsem pracoval na interních projektech, osvojil si nové postupy a po stáži ve firmě zůstal. Toto období výrazně posílilo týmovou spolupráci a delivery v reálném prostředí.',
      images: [{ src: galleryImage, alt: 'Obrázek Saturnu pro kariérní etapu' }],
      visual: { orbit: 32, period: 48, size: 3.3, startAngle: 260, theme: 'saturn' }
    },
    {
      id: 'titan',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Titan',
      subtitle: 'Start stáže',
      preview: 'Nástup do Profiqu a první konkrétní příspěvky.',
      full: 'Rychlá adaptace na firemní procesy a první praktický dopad v interních projektech.',
      images: [{ src: profile, alt: 'Obrázek měsíce Titan' }],
      visual: { orbit: 3.8, period: 8.1, size: 1.08, startAngle: 45, theme: 'moon' }
    },
    {
      id: 'enceladus',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Enceladus',
      subtitle: 'React + NestJS růst',
      preview: 'Zrychlené zlepšení ve frontend/backend stacku v týmovém režimu.',
      full: 'Milník reprezentuje učení pod reálným tlakem projektu: čistota architektury, plánování úkolů a týmová komunikace.',
      images: [{ src: galleryPreview, alt: 'Obrázek měsíce Enceladus' }],
      visual: { orbit: 4.7, period: 9.4, size: 0.95, startAngle: 180, theme: 'moon' }
    },
    {
      id: 'rhea',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Rhea',
      subtitle: 'Dlouhodobé pokračování',
      preview: 'Současné pokračování práce při studiu na menších projektech.',
      full: 'Tato fáze je o balancování akademické a profesní dráhy bez ztráty tempa.',
      images: [{ src: galleryImage, alt: 'Obrázek měsíce Rhea' }],
      visual: { orbit: 5.7, period: 10.9, size: 1, startAngle: 300, theme: 'moon' }
    },
    {
      id: 'mimas',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Mimas',
      subtitle: 'Menší produkční výhry',
      preview: 'Drobné úkoly, které dlouhodobě zvyšují kvalitu produktu.',
      full: 'Ne každý milník je velký. Tato orbita reprezentuje průběžné menší zlepšení.',
      images: [{ src: galleryPreview, alt: 'Obrázek měsíce Mimas' }],
      visual: { orbit: 6.4, period: 12.4, size: 0.84, startAngle: 128, theme: 'moon' }
    },
    {
      id: 'dione',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Dione',
      subtitle: 'Týmová procesní zralost',
      preview: 'Lepší plánování a komunikace při doručování.',
      full: 'Reprezentuje zlepšující se strukturu práce a týmové komunikace v projektech.',
      images: [{ src: profile, alt: 'Obrázek měsíce Dione' }],
      visual: { orbit: 7.3, period: 13.7, size: 0.9, startAngle: 212, theme: 'moon' }
    },
    {
      id: 'iapetus',
      parentId: 'saturn',
      kind: 'moon',
      title: 'Iapetus',
      subtitle: 'Dlouhodobá kontinuita',
      preview: 'Udržení tempa mezi studiem a prací.',
      full: 'Tato orbita reprezentuje konzistenci v akademické i praktické vývojové linii.',
      images: [{ src: galleryImage, alt: 'Obrázek měsíce Iapetus' }],
      visual: { orbit: 8.1, period: 15.2, size: 0.86, startAngle: 18, theme: 'moon' }
    },
    {
      id: 'uranus',
      kind: 'planet',
      title: 'Uran',
      subtitle: 'Astro jiskra a první teleskop',
      preview: 'Začátek astro cesty: mobilní astro mód a první teleskopické snímky.',
      full: 'V roce 2022 mě nadchnul astro mód v Pixelu. V roce 2023 jsem dostal Celestron Astromaster 130EQ a pořídil první kvalitnější snímky Měsíce a planet.',
      images: [
        { src: galleryImage, alt: 'Obrázek Uranu pro astro etapu' },
        { src: galleryPreview, alt: 'Druhý obrázek Uranu' }
      ],
      visual: { orbit: 38, period: 62, size: 2.7, startAngle: 50, theme: 'uranus' }
    },
    {
      id: 'neptune',
      kind: 'planet',
      title: 'Neptun',
      subtitle: 'Deep-sky rig a AI směr',
      preview: 'Současný deep-sky setup a dlouhodobý směr navázaný na Astro Grader.',
      full: 'Aktuálně fotím na setupu Redcat 51 WIFD, ASI 585MC Pro, Uniguide 31mm, ASI678MC, Radgoll 17 Pro a Gemini focuser. Zaměřuji se na DSO objekty a tento workflow přímo podporuje diplomový směr: nahradit klasické metriky hodnocení snímků vlastní neuronovou sítí.',
      images: [
        { src: galleryImage, alt: 'Obrázek Neptunu pro deep sky setup' },
        { src: profile, alt: 'Podpůrný obrázek Neptunu' }
      ],
      visual: { orbit: 44, period: 78, size: 2.65, startAngle: 190, theme: 'neptune' }
    }
  ]
};

export default czechAboutStory;
