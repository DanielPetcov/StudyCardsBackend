const plans = ['free', 'pro'] as const;

export type PlanType = (typeof plans)[number];
