export const languages = ['ro', 'ru', 'en'] as const;

export type LanguageType = (typeof languages)[number];
