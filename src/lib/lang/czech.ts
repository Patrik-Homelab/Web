import type { z } from 'zod';
import lang, { _extensions } from './_template';

export default lang.parse({
  default_desc:
    'Ahoj, jsem Patrik, student a programátor, který se ve volném čase věnuje astrofotografii. Tvořím především webové stránky a aplikace ve frameworku SvelteKit, ale nebráním se ani dalším technologiím – například Node.js, Vue.js nebo Reactu.',
  yes: 'Ano',
  no: 'Ne',
  cancel: 'Zrušit',
  language: 'Jazyk',
  navigation: {
    home: 'Domů',
    gallery: 'Galerie',
    admin: 'Administrace',
    login: 'Přihlášení',
    contact: 'Kontakt',
    about: 'O mně',
    live: 'Astro okénko',
    movies: 'Filmy',
    projects: 'Projekty'
  },
  adminNavigation: {
    home: 'Panel',
    equipment: 'Vybavení',
    articles: 'Články',
    movies: 'Filmy',
    projects: 'Projekty'
  },
  error: {
    title: 'Chyba',
    message: 'Oops!',
    sub_message: 'Tuto stránku neznáme :(',
    go_home: 'Zpátky domů',
    invalid_type_number: 'Zadej platné číslo.'
  },
  live_photo: {
    title: 'Astro okénko',
    description:
      'Pokud právě probíhá focení, najdeš zde aktuální snímek z kamery a živé statistiky mého vybavení.',
    loading_description: 'Chvíli vyčkej, než se data načtou, občas to trvá :)',
    inactive: 'Focení neprobíhá',
    stats: 'Statistiky',
    current_status: 'Aktuální stav',
    mount: 'Montáž',
    image: 'Poslední snímek',
    guide: 'Navádění',
    labels: {
      temp: 'Teplota',
      exposure: 'Expozice',
      ra: 'RA',
      dec: 'DEC',
      gain: 'Gain',
      target: 'Cíl',
      focal_length: 'Ohnisková vzdálenost',
      telescope: 'Dalekohled',
      camera: 'Kamera',
      date: 'Datum',
      error: 'Chyba',
      total: 'Celková'
    },
    last_frame:
      '*poslední snímek (například z předchozí expozice, automatického ostření či centrování, proto nemusí být vždy ostrý a kvalitní)',
    guiding_chart: {
      title: 'Průběh navádění PHD2 (RMS)',
      empty: 'Graf navádění se zobrazí, jakmile začne aktivní focení s PHD2.',
      ra: 'RA chyba',
      dec: 'DEC chyba',
      total: 'Celková RMS'
    },
    observatory_stats: {
      title: 'Statistiky publikovaných pozorování',
      subtitle: 'Souhrnná data nasbíraná ze všech publikovaných článků v astro galerii.',
      light_time: 'Celkový čas Light expozic',
      total_frames: 'Počet snímků',
      sessions: 'Publikovaných nocí',
      unique_objects: 'Vyfocených objektů',
      frames_breakdown: 'Rozdělení podle typu snímků',
      top_targets: 'Nejčastěji focené objekty',
      top_equipment: 'Nejpoužívanější technika',
      session_count: {
        '1': 'článek',
        '2': 'články',
        other: 'článků'
      }
    }
  },
  main: {
    age: 'Věk',
    text: [
      '🎓 Aktuálně studuji v inženýrském programu na ',
      {
        text: 'Vysoké škole báňské – Technické univerzitě Ostrava',
        link: 'https://www.vsb.cz/'
      },
      ', obor Informatika na ',
      {
        text: 'Fakultě elektrotechniky a informatiky',
        link: 'https://www.fei.vsb.cz/'
      },
      '.',
      '%%SPACE%%',
      ' 💻 Ve volném čase se nejvíce věnuji vývoji webových aplikací pomocí ',
      {
        text: 'SvelteKitu',
        link: 'https://kit.svelte.dev/'
      },
      ', ',
      {
        text: 'Tailwind CSS',
        link: 'https://tailwindcss.com/'
      },
      ' a ',
      {
        text: 'TypeScriptu',
        link: 'https://www.typescriptlang.org/'
      },
      '. Mám zkušenosti jak s frontendem, tak s backendem, a občas zabrousím i do designu.',
      '%%SPACE%%',
      ' 🧠 Kromě SvelteKitu zvládám i práci s dalšími frameworky, jako je ',
      {
        text: 'Vue.js',
        link: 'https://vuejs.org/'
      },
      ' nebo ',
      {
        text: 'React',
        link: 'https://react.dev/'
      },
      ', takže se umím přizpůsobit různým technologiím.',
      '%%SPACE%%',
      ' 🛠️ V Node.js tvořím i různé aplikace, jako jsou Discord a Twitch boti nebo skripty pro usnadnění každodenních úkolů.',
      '%%SPACE%%',
      ' 🌌 Kromě programování se věnuji také astrofotografii – moje snímky najdeš v ',
      {
        text: 'galerii',
        link: '/cs/gallery',
        blank: false
      },
      '!'
    ]
  },
  admin: {
    login: {
      title: 'Přihlášení',
      username: 'Jméno',
      password: 'Heslo',
      submit: 'Přihlásit se'
    },
    main: {
      stats: 'Statistiky',
      today: 'Dnes',
      week: 'Tento týden'
    },
    equipment: {
      actions: 'Akce',
      types: {
        title: 'Typy vybavení',
        addTitle: 'Přidání nového typu',
        translateKey: 'Překlad',
        priority: 'Priorita',
        placeholder: 'Název typu vybavení',
        button: 'Přidat',
        success: 'Nový typ vybavení byl přidán!',
        empty: 'Žádné typy vybavení nebyly přidány.',
        editSuccess: 'Název typu vybavení byl úspěšně upraven!',
        deleteSuccess: 'Typ vybavení byl úspěšně smazán!',
        edit: {
          title: 'Úprava typu vybavení s id %1',
          button: 'Upravit'
        },
        delete: {
          question: 'Opravdu chceš smazat tento typ?'
        }
      },
      equipment: {
        title: 'Vybavení',
        addTitle: 'Přidání nového vybavení',
        type: 'Typ',
        name: 'Název',
        link: 'Odkaz',
        button: 'Přidat',
        success: 'Nové vybavení bylo přidáno!',
        empty: 'Žádné vybavení nebylo přidáno.',
        editSuccess: 'Vybavení bylo úspěšně upraveno!',
        deleteSuccess: 'Vybavení bylo úspěšně smazáno!',
        edit: {
          title: 'Úprava vybavení s id %1',
          button: 'Upravit'
        },
        delete: {
          question: 'Opravdu chceš smazat toto vybavení?'
        },
        focalLength: 'Ohnisková vzdálenost (mm)',
        aperture: 'Apertura (mm)',
        pixelSize: 'Velikost pixelu (µm)',
        sensorWidth: 'Šířka senzoru (px)',
        sensorHeight: 'Výška senzoru (px)'
      }
    },
    article: {
      title: 'Články',
      create: 'Vytvořit článek',
      empty: 'Žádné články nebyly vytvořeny.',
      articleTitle: 'Název článku',
      description: 'Popisek',
      image: 'Obrázek',
      lastEdit: 'Poslední úprava',
      published: 'Publikováno',
      actions: 'Akce',
      form: {
        back: 'Zpátky k článkům',
        editTitle: 'Upravit článek',
        createTitle: 'Vytvořit článek',
        details: {
          title: 'Detaily článku',
          titleInput: 'Název článku',
          titlePlaceholder: 'Zadej název článku',
          description: 'Popis článku',
          descriptionPlaceholder: 'Zadej krátký popis článku',
          content: 'Obsah článku (Markdown)',
          editContent: 'Úprava',
          previewContent: 'Náhled',
          contentPlaceholder: 'Zadej obsah článku v markdownu...',
          optionalHint:
            'Popis i Markdown obsah jsou volitelné – pro rychlý snímek je můžeš nechat prázdné.'
        },
        equipment: {
          title: 'Vybavení',
          select: 'Vyber vybavení',
          empty: 'Nevybral jsi žádné vybavení.'
        },
        images: {
          title: 'Obrázky',
          upload: 'Nahrát obrázek',
          descriptionPlaceholder: 'Zadej popis obrázku',
          browse: 'Procházet',
          button: 'Přidat obrázek',
          alt: 'Zadej prosím popisek obrázku',
          empty: 'Zatím nebyl přidán žádný obrázek.',
          noImage: 'Vyber prosím obrázek',
          multiple: 'Vyber prosím pouze jeden obrázek',
          confirmDelete: 'Opravdu chceš smazat tento obrázek?'
        },
        exposures: {
          title: 'Expozice',
          date: 'Datum',
          type: 'Typ',
          count: 'Počet',
          seconds: 'Sekundy',
          button: 'Přidat expozici',
          time: 'Čas (s)',
          total: 'Celkový čas (s)',
          empty: 'Zatím jsi nepřidal žádnou expozici.',
          frames: 'Snímky'
        },
        cancel: 'Zrušit',
        save: 'Uložit článek',
        create: 'Vytvořit článek',
        created: 'Článek byl úspěšně vytvořen!',
        updated: 'Článek byl úspěšně upraven!',
        target: {
          title: 'Cíl a souřadnice (FOV)',
          object: 'Astronomický objekt',
          select: 'Vyber objekt',
          none: 'Žádný',
          newCs: 'Nový objekt (CZ)',
          newEn: 'Nový objekt (EN)',
          add: 'Přidat objekt',
          ra: 'Rektascenze (RA ve stupních)',
          dec: 'Deklinace (DEC ve stupních)',
          width: 'Šířka zorného pole (ve stupních)',
          height: 'Výška zorného pole (ve stupních)',
          rotation: 'Rotace zorného pole (ve stupních)',
          searchAstroDb: 'Vyhledat souřadnice',
          calculateFov: 'Vypočítat FOV z techniky'
        }
      }
    },
    movies: {
      title: 'Filmy a seriály',
      addTitle: 'Přidat film / seriál',
      editTitle: {
        title: 'Úprava filmu / seriálu #%1',
        button: 'Upravit'
      },
      delete: {
        question: 'Opravdu chceš smazat tento film / seriál?'
      },
      success: 'Film / seriál byl úspěšně přidán!',
      editSuccess: 'Film / seriál byl úspěšně upraven!',
      deleteSuccess: 'Film / seriál byl úspěšně smazán!',
      empty: 'Žádné filmy ani seriály nebyly přidány.',
      fields: {
        titleCs: 'Název (CZ)',
        titleEn: 'Název (EN)',
        type: 'Typ',
        movie: 'Film',
        series: 'Seriál',
        releaseYear: 'Rok vydání',
        rating: 'Hodnocení (0 - 5)',
        addedAt: 'Datum přidání',
        reviewCs: 'Recenze (CZ)',
        reviewEn: 'Recenze (EN)',
        button: 'Uložit'
      }
    },
    projects: {
      title: 'Projekty',
      addTitle: 'Přidat projekt',
      editTitle: {
        title: 'Úprava projektu #%1',
        button: 'Uložit změny'
      },
      delete: {
        question: 'Opravdu chceš smazat tento projekt?'
      },
      success: 'Projekt byl úspěšně přidán!',
      editSuccess: 'Projekt byl úspěšně upraven!',
      deleteSuccess: 'Projekt byl úspěšně smazán!',
      empty: 'Žádné projekty nebyly přidány.',
      status: 'Stav',
      visible: 'Viditelný',
      hidden: 'Skrytý',
      toggleVisibility: 'Přepnout viditelnost',
      showAll: 'Zobrazit vše',
      hideAll: 'Skrýt vše',
      fields: {
        nameCs: 'Název projektu (CZ)',
        nameEn: 'Název projektu (EN)',
        date: 'Datum vytvoření',
        tags: 'Technologie / Tagy',
        tagsPlaceholder: 'SvelteKit, TypeScript, Rust...',
        preview: 'Náhledový obrázek',
        images: 'Obrázky v galerii',
        uploadPreview: 'Nahrát náhled',
        uploadImages: 'Přidat obrázky',
        descriptionCs: 'Popis v Markdownu (CZ)',
        descriptionEn: 'Popis v Markdownu (EN)',
        hidden: 'Skrýt projekt pro veřejnost (Draft)',
        button: 'Uložit'
      }
    }
  },
  projects: {
    title: 'Moje projekty',
    description:
      'Přehled webových aplikací, nástrojů, Discord botů a školních či open-source projektů, na kterých jsem pracoval.',
    searchPlaceholder: 'Hledat projekt podle názvu, popisu nebo technologie...',
    allTags: 'Všechny technologie',
    allYears: 'Všechny roky',
    sortBy: 'Řadit podle',
    sortDateDesc: 'Od nejnovějších',
    sortDateAsc: 'Od nejstarších',
    sortNameAsc: 'Název (A–Z)',
    resetFilters: 'Resetovat filtry',
    emptySearch: 'Nebyly nalezeny žádné projekty odpovídající vybraným filtrům.',
    viewDetails: 'Detail projektu',
    screenshots: 'Ukázky a screenshoty',
    close: 'Zavřít',
    moreProjectsGithub:
      'Další moje projekty a open-source repozitáře najdeš na mém GitHubu.',
    visitGithub: 'Prozkoumat GitHub',
    projectDescription: 'Popis projektu',
    noScreenshots: 'K tomuto projektu nejsou přiloženy žádné snímky obrazovky.',
    clickTagToFilter: 'Kliknutím na technologii vyfiltruješ projekty',
    draftBadge: 'Skrytý'
  },
  movies: {
    title: 'Filmy a seriály',
    description: 'Zde najdeš seriály a filmy, které jsem zhlédl, a moje krátké recenze.',
    searchPlaceholder: 'Hledat film, seriál nebo text v recenzi...',
    allTypes: 'Všechny typy',
    series: 'Seriály',
    movie: 'Filmy',
    seriesSingle: 'Seriál',
    movieSingle: 'Film',
    allRatings: 'Všechna hodnocení',
    allYears: 'Všechny roky',
    sortBy: 'Řadit podle',
    sortAddedDesc: 'Nejnověji přidané',
    sortAddedAsc: 'Nejdříve přidané',
    sortRatingDesc: 'Nejvyšší hodnocení',
    sortRatingAsc: 'Nejnižší hodnocení',
    sortYearDesc: 'Rok vydání (nejnovější)',
    sortYearAsc: 'Rok vydání (nejstarší)',
    sortTitleAsc: 'Název (A–Z)',
    filterStars: 'Hvězdičky',
    filterYear: 'Rok vydání',
    filterType: 'Typ',
    resetFilters: 'Resetovat filtry',
    emptySearch: 'Nebyly nalezeny žádné filmy ani seriály odpovídající filtrům.',
    addedOn: 'Přidáno'
  },
  gallery: {
    title: 'Astro galerie',
    description:
      'Zde najdeš mé astrofotografie společně s popisy a technickými detaily jednotlivých expozic.',
    updated: 'Aktualizováno',
    created: 'Vytvořeno',
    readMore: 'Čti dále',
    more: 'více',
    back: 'Zpět na galerii',
    totalExposure: 'Celkový čas expozice',
    article: 'Článek',
    details: 'Technické detaily',
    equipment: 'Použité vybavení',
    exposureSummary: 'Souhrn expozic',
    framesCount: {
      '1': 'snímek',
      '2': 'snímky',
      other: 'snímků'
    },
    exposureDetails: 'Detaily expozic',
    equipmentDetails: 'Detaily vybavení',
    images: 'Obrázky',
    object: 'Objekt',
    objects: 'Objekty',
    all: 'Všechny příspěvky',
    byObject: 'Podle objektu',
    skyMap: 'Mapa oblohy',
    skyMapCta: 'Prohlédni si vše, co jsem vyfotil na reálné obloze :)',
    skyMapTitle: 'Moje vyfocená obloha',
    skyMapSubtitle:
      'Interaktivní celooblohová mapa všech mých plate-solvnutých snímků se skutečným zorným polem.',
    skyMapSearch: 'Hledat objekt nebo článek...',
    skyMapReset: 'Celá obloha',
    skyMapTargets: 'Snímky na mapě',
    skyMapNoTargets: 'Žádné snímky neodpovídají hledání.',
    skyMapOpenArticle: 'Otevřít článek',
    skyMapSurvey: 'Průzkum oblohy',
    skyMapPrev: 'Předchozí',
    skyMapNext: 'Další',
    fov: 'Zorné pole (FOV)',
    postsCount: {
      '1': 'příspěvek',
      '2': 'příspěvky',
      other: 'příspěvků'
    },
    older: 'Starší',
    moreCaptures: 'Další snímky tohoto objektu'
  },
  contact: {
    title: 'Spoj se se mnou',
    visit: 'Navštívit',
    send: 'Napsat',
    descriptions: {
      github: 'Koukni na můj GitHub, kde najdeš repozitáře s mými projekty',
      email: 'Napiš mi e-mail, pokud máš nějaké dotazy nebo zájem o spolupráci',
      linkedin:
        'Spoj se se mnou na LinkedInu, kde najdeš mé profesní zkušenosti a dovednosti',
      instagram:
        'Sleduj mě na Instagramu, kde sdílím své astrofotografie a další zajímavosti',
      twitch: 'Sleduj mě na Twitchi, kde streamuji programování nebo hraní her',
      discord:
        'Přidej si mě na Discordu – tam jsem nejaktivnější a odpovím ti nejrychleji',
      discordServer:
        'Pokud tě zajímá dění kolem mě, určitě se připoj na můj Discord server'
    }
  },
  about: {
    title: 'Něco málo o mně',
    clickToExplore: 'Klikni pro prozkoumání'
  },
  errors: {
    internal: 'Něco se nepovedlo, zkus to prosím za chvíli znovu.',
    login: {
      form: 'Vyplň prosím všechny údaje.',
      username: 'Špatné uživatelské jméno.',
      password: 'Špatné heslo.'
    },
    types: {
      form: 'Vyplň prosím název typu vybavení.',
      empty: 'Překladový klíč nesmí být prázdný.',
      priority: 'Priorita musí být číslo >=0.'
    },
    equipment: {
      form: 'Vyplň prosím všechny údaje.',
      url: 'Zadej platný odkaz.'
    },
    upload: {
      missing: 'Vyber prosím soubor k nahrání.',
      error: 'Nepodařilo se nahrát soubor, zkus to prosím znovu.',
      invalidFile: 'Nahraj prosím platný soubor',
      extension: 'Nahraj prosím platný obrázek s příponou ' + _extensions,
      notFound: 'Soubor s tímto jménem neexistuje.'
    },
    article: {
      notFound: 'Článek s tímto id neexistuje.',
      noImages: 'Článek musí obsahovat alespoň jeden obrázek.',
      noTitle: 'Musíš zadat název článku.',
      noDescrption: 'Musíš zadat popisek článku.',
      noContent: 'Musíš zadat obsah článku.',
      noAltText: 'Musíš zadat popisek obrázku.'
    },
    movies: {
      form: 'Vyplň prosím všechna povinná pole správně.',
      notFound: 'Film / seriál nebyl nalezen.'
    },
    projects: {
      form: 'Vyplň prosím všechna povinná pole projektu.',
      notFound: 'Projekt nebyl nalezen.'
    }
  },
  equipmentType: {
    camera: 'Kamera',
    mount: 'Montáž',
    telescope: 'Dalekohled',
    filter: 'Filtr',
    barlow: 'Barlow',
    reducer: 'Reduktor',
    guidescope: 'Guidescope',
    phone: 'Telefon',
    focuser: 'Zaostřovač'
  },
  frames: {
    light: 'Light',
    dark: 'Dark',
    flat: 'Flat',
    bias: 'Bias'
  }
} satisfies z.infer<typeof lang>);
