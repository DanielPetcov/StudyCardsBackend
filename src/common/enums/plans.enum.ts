const plans = ['free', 'pro'] as const;

export type PlanType = (typeof plans)[number];
export enum PlanEnum {
  FREE = 'free',
  PRO = 'pro',
}
