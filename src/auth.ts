import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/modules/database/db';

import { polar, checkout, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';

import { getAppContext } from './app-context';
import { UserService } from './modules/user/application/user.service';
import { SubscriptionService } from './modules/subscription/application/subscription.service';
import { mapPolarSubscriptionPayloadToDto } from './helpers';

import * as dotenv from 'dotenv';
dotenv.config();

function getUserService() {
  return getAppContext().get(UserService);
}

function getSubscriptionService() {
  return getAppContext().get(SubscriptionService);
}

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'production',
});

export const auth = betterAuth({
  basePath: '/api/auth',
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    'http://localhost:3000',
    'https://study-cards-amber.vercel.app',
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    updateAge: 24 * 60 * 60,
    expiresIn: 7 * 24 * 60 * 60,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true,
    },
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
          successUrl: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
          authenticatedUsersOnly: true,
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,

          onPayload: async (payload) => {
            console.log('POLAR WEBHOOK RECEIVED');
            console.log(JSON.stringify(payload, null, 2));
          },

          onCustomerCreated: async (payload) => {
            const externalId = payload.data.externalId;
            if (!externalId) return;

            try {
              const userService = getUserService();
              await userService.updatePolarCustomerId(
                externalId,
                payload.data.id,
              );
            } catch (error) {
              console.error('onCustomerCreated error:', error);
            }
          },

          onSubscriptionCreated: async (payload) => {
            const dto = mapPolarSubscriptionPayloadToDto(payload);
            if (!dto) return;

            try {
              const subscriptionService = getSubscriptionService();
              await subscriptionService.syncFromPolar(dto);
            } catch (error) {
              console.error('onSubscriptionCreated error:', error);
            }
          },

          onSubscriptionUpdated: async (payload) => {
            const dto = mapPolarSubscriptionPayloadToDto(payload);
            if (!dto) return;

            try {
              const subscriptionService = getSubscriptionService();
              await subscriptionService.syncFromPolar(dto);
            } catch (error) {
              console.error('onSubscriptionUpdated error:', error);
            }
          },

          onSubscriptionActive: async (payload) => {
            const dto = mapPolarSubscriptionPayloadToDto(payload);
            if (!dto) return;

            try {
              const subscriptionService = getSubscriptionService();
              await subscriptionService.syncFromPolar(dto);
            } catch (error) {
              console.error('onSubscriptionActive error:', error);
            }
          },

          onSubscriptionCanceled: async (payload) => {
            const dto = mapPolarSubscriptionPayloadToDto(payload);
            if (!dto) return;

            try {
              const subscriptionService = getSubscriptionService();
              await subscriptionService.syncFromPolar(dto);
            } catch (error) {
              console.error('onSubscriptionCanceled error:', error);
            }
          },

          onSubscriptionRevoked: async (payload) => {
            const dto = mapPolarSubscriptionPayloadToDto(payload);
            if (!dto) return;

            try {
              const subscriptionService = getSubscriptionService();
              await subscriptionService.syncFromPolar(dto);
            } catch (error) {
              console.error('onSubscriptionRevoked error:', error);
            }
          },
        }),
      ],
    }),
  ],
});
