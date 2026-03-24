import { Controller } from '@nestjs/common';

import { DeckService } from '@/modules/deck/application/deck.service';

@Controller('deck')
export class DeckController {
  constructor(private readonly _service: DeckService) {}
}
