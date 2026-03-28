const plans = ['free', 'pro'] as const;
export type PlansEnumType = (typeof plans)[number];
export enum PlansEnum {
  FREE = 'free',
  PRO = 'pro',
}
