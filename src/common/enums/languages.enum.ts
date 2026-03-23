const languages = ['ro', 'ru', 'en'] as const;
export type LanguagesEnum = (typeof languages)[number];
