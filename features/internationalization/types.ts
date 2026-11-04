export type SupportedLocale = 'en' | 'ur' | 'ar' | 'fr' | 'es';
export type Direction = 'ltr' | 'rtl';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dir: Direction;
  fontClass: string;
}

export interface TranslationDictionary {
  nav: {
    brand: string;
    tagline: string;
    templates: string;
    howItWorks: string;
    features: string;
    faq: string;
    createResume: string;
    switchLanguage: string;
    selectLanguage: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustNoAccount: string;
    trustFreeForever: string;
    trustPrivate: string;
    trustAts: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  templates: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterAts: string;
    filterModern: string;
    filterProfessional: string;
    filterCreative: string;
    useTemplate: string;
    preview: string;
    atsScore: string;
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
    q6: string;
    a6: string;
  };
  ctaBanner: {
    title: string;
    subtitle: string;
    button: string;
    secondaryButton: string;
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterAts: string;
    filterModern: string;
    filterCorporate: string;
    filterCreative: string;
    filterAcademic: string;
    filterMinimal: string;
    filterAtsOnly: string;
    useThisTemplate: string;
    quickPreview: string;
    closePreview: string;
    recommendedFor: string;
    layoutType: string;
    allTemplatesCount: string;
  };
  builder: {
    title: string;
    subtitle: string;
    activeTemplate: string;
    changeTemplate: string;
    personalTab: string;
    experienceTab: string;
    skillsTab: string;
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    portfolio: string;
    summary: string;
    experienceRole: string;
    experienceCompany: string;
    experienceDates: string;
    experienceBullets: string;
    skillsList: string;
    skillsPlaceholder: string;
    livePreview: string;
    printDownload: string;
    paperA4: string;
    paperLetter: string;
    sampleNotice: string;
    backToTemplates: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
    navigation: string;
    legal: string;
    resources: string;
    privacyPolicy: string;
    termsOfService: string;
    aboutUs: string;
    contactUs: string;
    rightsReserved: string;
    zeroStorageNotice: string;
  };
}
