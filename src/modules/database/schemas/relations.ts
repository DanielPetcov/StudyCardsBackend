import { relations } from 'drizzle-orm';
import { card } from './card.schema';
import { cardOption } from './cardOption.schema';
import { deck } from './deck.schema';

import { user } from './user.schema';

export const decksRelations = relations(deck, ({ many, one }) => ({
  card: many(card),
  user: one(user, {
    fields: [deck.userId],
    references: [user.id],
  }),
}));

export const cardsRelations = relations(card, ({ many, one }) => ({
  options: many(cardOption),
  deck: one(deck, {
    fields: [card.deckId],
    references: [deck.id],
  }),
}));

export const cardOptionsRelations = relations(cardOption, ({ one }) => ({
  card: one(card, {
    fields: [cardOption.cardId],
    references: [card.id],
  }),
}));
