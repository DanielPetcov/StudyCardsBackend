import { relations } from 'drizzle-orm';
import { card } from './card.schema';
import { cardOption } from './cardOption.schema';
import { deck } from './deck.schema';

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
