const languages = ['ro', 'ru', 'en'] as const;
export type LanguagesEnumType = (typeof languages)[number];
export enum LanguagesEnum {
  RO = 'ro',
  RU = 'ru',
  EN = 'en',
}
