import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/modules/database/db';

import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';

import { getAppContext } from './app-context';
import { UserService } from './modules/user/application/user.service';

function getUserService() {
  return getAppContext().get(UserService);
}

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'sandbox',
});

export const auth = betterAuth({
  basePath: '/api/auth',
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
        type: ['free', 'pro'],
        required: true,
        defaultValue: 'free',
        input: false,
      },
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          successUrl: 'http://localhost:3000/dashboard',
          authenticatedUsersOnly: true,
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onPayload: async (payload) => {
            console.log('POLAR WEBHOOK RECEIVED');
            console.log(JSON.stringify(payload, null, 2));
          },
          onSubscriptionActive: async (payload) => {
            console.log('onSubscriptionActive called');

            if (!payload.data.customer.externalId) {
              console.log('user not found');
              return;
            }
            try {
              const userService = getUserService();
              await userService.updatePlan(
                payload.data.customer.externalId,
                'pro',
              );
            } catch (error) {
              console.error(error);
            }
          },
          onSubscriptionCanceled: async (payload) => {
            console.log('onSubscriptionCanceled called');

            if (!payload.data.customer.externalId) {
              console.log('user not found');
              return;
            }
            try {
              const userService = getUserService();
              await userService.updatePlan(
                payload.data.customer.externalId,
                'free',
              );
            } catch (error) {
              console.error(error);
            }
          },
          onSubscriptionRevoked: async (payload) => {
            console.log('onSubscriptionRevoked called');

            if (!payload.data.customer.externalId) {
              console.log('user not found');
              return;
            }
            try {
              const userService = getUserService();
              await userService.updatePlan(
                payload.data.customer.externalId,
                'free',
              );
            } catch (error) {
              console.error(error);
            }
          },
        }),
      ],
    }),
  ],
});
