export abstract class ICardRepository {
  abstract createMany(deckId: string, createCardDto: string[]);
  abstract findByDeck(deckId: string, userId: string);
  abstract findById(id: string, userId: string);
}
