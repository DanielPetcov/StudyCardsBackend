import { relations } from 'drizzle-orm';
import { cardsTable } from './card.schema';
import { cardOptionsTable } from './cardOption.schema';
import { decksTable } from './deck.schema';

export const cardsRelations = relations(cardsTable, ({ many, one }) => ({
  options: many(cardOptionsTable),
  deck: one(decksTable, {
    fields: [cardsTable.deckId],
    references: [decksTable.id],
  }),
}));

export const cardOptionsRelations = relations(cardOptionsTable, ({ one }) => ({
  card: one(cardsTable, {
    fields: [cardOptionsTable.cardId],
    references: [cardsTable.id],
  }),
}));
