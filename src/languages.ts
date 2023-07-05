export enum Locale {
  EN = 'en',
  FA = 'fa',
}

export enum LocaleName {
  EN = 'English',
  FA = 'فارسی',
}

export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
}

export type Language = {
  locale: Locale;
  localeName: LocaleName;
  dir: Direction;
};

export const languages: Language[] = [
  {
    locale: Locale.EN,
    localeName: LocaleName.EN,
    dir: Direction.LTR,
  },
  {
    locale: Locale.FA,
    localeName: LocaleName.FA,
    dir: Direction.RTL,
  },
];
