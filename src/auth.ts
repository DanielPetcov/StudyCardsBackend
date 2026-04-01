import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/modules/database/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.FRONTEND_URL!],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    updateAge: 24 * 60 * 60,
    expiresIn: 7 * 24 * 60 * 60,
  },
  user: {
    additionalFields: {
      language: {
        type: 'string',
        required: true,
        defaultValue: 'ro',
      },

      plan: {
        type: 'string',
        required: true,
        defaultValue: 'free',
        input: false,
      },
    },
  },
});
