const plans = ['free', 'pro'] as const;
export type PlansEnum = (typeof plans)[number];
