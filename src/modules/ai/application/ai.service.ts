import { Injectable, Logger } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';
import { PDFParse } from 'pdf-parse';

import {
  DeckIconName,
  LanguageType,
  CardDifficulty,
  PlanType,
} from '@/common/enums';
import {
  CreateCardDto,
  CreateCardOptionDto,
} from '@/modules/card/domain/dto/create-card.dto';
import { getMaxCardsPerDeck } from '@/helpers';

interface AIDeckAnalysis {
  title: string;
  description: string;
  icon: DeckIconName;
  cards: CreateCardDto[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private readonly openrouter = new OpenRouter({
    apiKey: process.env.OPEN_ROUTER_KEY,
  });

  private readonly model = 'google/gemini-2.5-flash-lite';

  async analyzeDeck(
    userPlan: PlanType,
    buffer: Buffer,
    language: LanguageType,
  ): Promise<AIDeckAnalysis> {
    this.logger.log(
      `Deck analysis started | targetLanguage=${language} bufferSize=${buffer.length} model=${this.model}`,
    );

    try {
      const pdfText = await this.extractTextFromPDF(buffer);

      this.logger.log(`PDF text extracted | textLength=${pdfText.length}`);

      if (!pdfText || pdfText.trim().length < 100) {
        this.logger.warn(
          `PDF contains insufficient text | textLength=${pdfText?.trim().length ?? 0}`,
        );
        throw new Error('PDF contains insufficient text content');
      }

      const pdfLanguage = await this.detectLanguage(pdfText.substring(0, 1000));

      this.logger.log(
        `PDF language detected | detectedLanguage=${pdfLanguage} targetLanguage=${language}`,
      );

      const maximumCards = getMaxCardsPerDeck(userPlan);

      const prompt = this.buildAnalysisPrompt(
        pdfText,
        language,
        pdfLanguage,
        maximumCards,
      );

      this.logger.log(
        `Sending analysis request to AI | model=${this.model} promptLength=${prompt.length} maximumCards=${maximumCards}`,
      );

      const response = await this.openrouter.chat.send({
        chatGenerationParams: {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(maximumCards),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          responseFormat: { type: 'json_object' },
          temperature: 0.2,
          maxTokens: 12000,
        },
      });

      this.logger.log(`AI response received | model=${this.model}`);

      const rawContent = response.choices?.[0]?.message?.content;

      if (!rawContent || typeof rawContent !== 'string') {
        throw new Error('AI returned an empty response');
      }

      let aiResponse: any;
      try {
        aiResponse = JSON.parse(rawContent);
      } catch (error) {
        this.logger.error(
          `AI returned invalid JSON | contentLength=${rawContent.length}`,
          error instanceof Error ? error.stack : undefined,
        );
        throw new Error('AI returned invalid JSON');
      }

      const normalized = this.validateAndNormalizeResponse(
        aiResponse,
        maximumCards,
      );

      this.logger.log(
        `Deck analysis completed | title="${normalized.title}" icon=${normalized.icon} cards=${normalized.cards.length}`,
      );

      const shuffledResponse = {
        ...normalized,
        cards: normalized.cards.map((card) => ({
          ...card,
          options: this.shuffleOptions(card.options),
        })),
      };

      return shuffledResponse;
    } catch (error) {
      this.logger.error(
        `Deck analysis failed | targetLanguage=${language} model=${this.model}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new Error(
        `Failed to analyze deck: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    this.logger.log(`PDF extraction started | bufferSize=${buffer.length}`);

    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();

      this.logger.log(
        `PDF extraction completed | textLength=${textResult.text.length}`,
      );

      return textResult.text;
    } catch (error) {
      this.logger.error(
        `PDF extraction failed | bufferSize=${buffer.length}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async detectLanguage(sample: string): Promise<string> {
    const languagePatterns = {
      en: /\b(the|is|are|and|or|in|on|at|to|for)\b/gi,
      ro: /\b(și|sau|este|sunt|pentru|într|către|de|la)\b/gi,
      es: /\b(el|la|de|y|es|en|por|para|con)\b/gi,
      fr: /\b(le|la|de|et|est|dans|pour|avec|sur)\b/gi,
      de: /\b(der|die|das|und|ist|in|von|mit|zu)\b/gi,
    };

    let maxMatches = 0;
    let detectedLang = 'en';

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      const matches = sample.match(pattern);
      const count = matches ? matches.length : 0;

      if (count > maxMatches) {
        maxMatches = count;
        detectedLang = lang;
      }
    }

    this.logger.debug(
      `Language detection completed | detectedLanguage=${detectedLang} matchCount=${maxMatches}`,
    );

    return detectedLang;
  }

  private getSystemPrompt(maximumCards: number): string {
    return `You are an expert educational content analyzer and multiple-choice question creator. Your task is to:

1. Analyze educational PDF content thoroughly
2. Create high-quality multiple-choice study cards with clear questions and exactly 4 answer options
3. Organize cards in logical learning progression
4. Assign appropriate difficulty levels based on concept complexity
5. Choose the most relevant icon representing the main topic
6. Generate between 1 and ${maximumCards} cards, never more than ${maximumCards}

Guidelines for Questions:
- Questions should be clear, specific, and test understanding
- Each card must have exactly 4 answer options (A, B, C, D)
- Only ONE option should be correct
- Incorrect options should be plausible but clearly wrong (common misconceptions, related concepts)
- Avoid "all of the above" or "none of the above" options
- The correct answer should include a concise explanation (1-2 sentences)
- Incorrect answers can optionally include brief explanations of why they're wrong

Difficulty Levels:
- Easy: Basic definitions, simple facts, straightforward recall
- Medium: Application of concepts, relationships between ideas, understanding
- Hard: Complex analysis, synthesis, critical thinking, nuanced distinctions

Card Ordering:
- Order cards logically: foundational concepts first, advanced topics later
- Prefer fewer high-quality cards over many weak or repetitive ones

Available icons and their meanings:
- book-open: General knowledge, textbooks, reference material
- brain: Psychology, cognitive science, neuroscience, mental processes
- code: Programming, software development, coding
- flask: Chemistry, laboratory sciences, experiments
- dna: Biology, genetics, life sciences, organisms
- atom: Physics, quantum mechanics, atomic theory
- calculator: Mathematics, statistics, calculations
- globe: Geography, world studies, international topics
- landmark: History, historical events, civilizations
- scale: Law, justice, legal studies, ethics
- briefcase: Business, management, economics, finance
- palette: Art, design, creativity, visual arts
- music: Music theory, composition, musical concepts
- language: Linguistics, language learning, communication
- heart: Medicine, healthcare, anatomy, physiology
- cpu: Computer science, hardware, systems
- database: Data science, databases, information systems
- chart: Statistics, analytics, data visualization
- rocket: Space, astronomy, aerospace, exploration
- leaf: Environmental science, ecology, sustainability
- microscope: Research, scientific method, investigation
- book: Literature, reading, literary analysis
- theater: Drama, performing arts, theater studies
- gamepad: Game design, interactive media, gaming

Always respond with valid JSON only, no markdown formatting.`;
  }

  private buildAnalysisPrompt(
    pdfText: string,
    targetLanguage: LanguageType,
    pdfLanguage: string,
    maximumCards: number,
  ): string {
    const needsTranslation = targetLanguage !== pdfLanguage;
    const translationNote = needsTranslation
      ? `IMPORTANT: The PDF is in ${pdfLanguage}, but you must translate ALL questions, answer options, and explanations to ${targetLanguage}.`
      : `Generate cards in ${targetLanguage}, the same language as the PDF content.`;

    const maxTextLength = 40000;
    const truncatedText =
      pdfText.length > maxTextLength
        ? pdfText.substring(0, maxTextLength) +
          '\n\n[Content truncated due to length...]'
        : pdfText;

    this.logger.debug(
      `Analysis prompt built | targetLanguage=${targetLanguage} pdfLanguage=${pdfLanguage} needsTranslation=${needsTranslation} truncated=${pdfText.length > maxTextLength} maximumCards=${maximumCards}`,
    );

    return `${translationNote}

PDF Content:
${truncatedText}

Analyze this educational content and create a comprehensive deck of multiple-choice study cards.

Requirements:
1. Generate between 1 and ${maximumCards} cards, but never more than ${maximumCards}
2. Prefer fewer high-quality cards over many repetitive or weak cards
3. Create a clear, descriptive title (max 100 characters)
4. Write a brief description of what the deck covers (2-3 sentences)
5. Choose the most appropriate icon from the available list
6. Order cards in logical learning progression (foundational → advanced)
7. Assign difficulty based on concept complexity:
   - easy: Basic facts, definitions, simple recall
   - medium: Understanding, application, connections
   - hard: Analysis, synthesis, complex reasoning

Multiple-Choice Format:
- Each card must have exactly 4 answer options
- Only ONE option is correct (isCorrect: true)
- The correct option MUST include a concise explanation (1-2 sentences)
- Incorrect options should be plausible distractors (common mistakes, related concepts)
- Order options logically (don't always put correct answer first)
- Vary the position of correct answers across cards

Respond with JSON in this exact format:
{
  "title": "Deck title here",
  "description": "Brief description of deck content",
  "icon": "icon-name",
  "cards": [
    {
      "question": "What is a closure in JavaScript?",
      "difficulty": "medium",
      "order": 0,
      "options": [
        {
          "text": "A function that has access to variables in its outer scope",
          "isCorrect": true,
          "explanation": "A closure is formed when a function can still access variables from its outer lexical scope after that outer function has finished executing.",
          "order": 0
        },
        {
          "text": "A function that closes the browser window",
          "isCorrect": false,
          "explanation": null,
          "order": 1
        },
        {
          "text": "A method to close database connections",
          "isCorrect": false,
          "explanation": null,
          "order": 2
        },
        {
          "text": "A built-in JavaScript object for memory management",
          "isCorrect": false,
          "explanation": null,
          "order": 3
        }
      ]
    }
  ]
}

Remember:
- Questions in ${targetLanguage}
- All answer options in ${targetLanguage}
- Explanations in ${targetLanguage}
- Exactly 4 options per card
- Only ONE correct answer per card
- Correct answer must have explanation
- Logical order progression (card order: 0, 1, 2, ...)
- Option order: 0, 1, 2, 3
- Never return more than ${maximumCards} cards
- Valid JSON only, no markdown`;
  }

  private validateAndNormalizeResponse(
    aiResponse: any,
    maximumCards: number,
  ): AIDeckAnalysis {
    if (
      !aiResponse.title ||
      !aiResponse.description ||
      !aiResponse.icon ||
      !Array.isArray(aiResponse.cards)
    ) {
      this.logger.warn('AI response validation failed | invalid structure', {
        hasTitle: !!aiResponse.title,
        hasDescription: !!aiResponse.description,
        hasIcon: !!aiResponse.icon,
        hasCards: Array.isArray(aiResponse.cards),
      });
      throw new Error('Invalid AI response structure');
    }

    const validIcons = [
      'book-open',
      'brain',
      'code',
      'flask',
      'dna',
      'atom',
      'calculator',
      'globe',
      'landmark',
      'scale',
      'briefcase',
      'palette',
      'music',
      'language',
      'heart',
      'cpu',
      'database',
      'chart',
      'rocket',
      'leaf',
      'microscope',
      'book',
      'theater',
      'gamepad',
    ];

    if (!validIcons.includes(aiResponse.icon)) {
      this.logger.warn(
        `Invalid icon received | icon=${aiResponse.icon} fallback=book-open`,
      );
      aiResponse.icon = 'book-open';
    }

    const cards: CreateCardDto[] = aiResponse.cards
      .filter((card: any) => {
        if (!card.question || !Array.isArray(card.options)) {
          this.logger.debug('Card filtered out | missing question or options', {
            hasQuestion: !!card.question,
            hasOptions: Array.isArray(card.options),
          });
          return false;
        }

        if (card.options.length !== 4) {
          this.logger.debug(
            `Card filtered out | expected 4 options, got ${card.options.length}`,
          );
          return false;
        }

        const correctCount = card.options.filter(
          (opt: any) => opt.isCorrect,
        ).length;

        if (correctCount !== 1) {
          this.logger.debug(
            `Card filtered out | expected 1 correct option, got ${correctCount}`,
          );
          return false;
        }

        const correctOption = card.options.find((opt: any) => opt.isCorrect);

        if (!correctOption?.explanation) {
          this.logger.debug(
            'Card filtered out | correct option missing explanation',
          );
          return false;
        }

        return true;
      })
      .map((card: any, cardIndex: number) => ({
        question: card.question.trim(),
        difficulty: this.validateDifficulty(card.difficulty),
        order: cardIndex,
        options: card.options.map((option: any, optionIndex: number) => ({
          text: option.text?.trim() || '',
          isCorrect: option.isCorrect === true,
          explanation: option.explanation?.trim() || null,
          order: optionIndex,
        })),
      }));

    if (cards.length === 0) {
      this.logger.error(
        'AI response validation failed | no valid cards generated',
        {
          totalCardsInResponse: aiResponse.cards?.length || 0,
          sampleCard: aiResponse.cards?.[0] || null,
        },
      );
      throw new Error('AI generated no valid cards');
    }

    const trimmedCards = cards.slice(0, maximumCards);

    if (cards.length > maximumCards) {
      this.logger.warn(
        `AI returned too many valid cards | received=${cards.length} maximumCards=${maximumCards} trimmed=${trimmedCards.length}`,
      );
    }

    const lowCardWarningThreshold = Math.min(5, maximumCards);
    if (trimmedCards.length < lowCardWarningThreshold) {
      this.logger.warn(
        `Low card count generated | cards=${trimmedCards.length} maximumCards=${maximumCards}`,
      );
    }

    this.logger.log(
      `Deck analysis validated | cards=${trimmedCards.length} icon=${aiResponse.icon}`,
    );

    return {
      title: aiResponse.title.trim().substring(0, 255),
      description: aiResponse.description.trim(),
      icon: aiResponse.icon as DeckIconName,
      cards: trimmedCards,
    };
  }

  private validateDifficulty(difficulty: string): CardDifficulty {
    const validDifficulties = ['easy', 'medium', 'hard'];

    if (!validDifficulties.includes(difficulty?.toLowerCase())) {
      this.logger.debug(
        `Invalid difficulty received | difficulty=${difficulty} fallback=medium`,
      );
      return 'medium';
    }

    return difficulty.toLowerCase() as CardDifficulty;
  }

  private shuffleOptions(
    options: CreateCardOptionDto[],
  ): CreateCardOptionDto[] {
    const shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.map((option, index) => ({
      ...option,
      order: index,
    }));
  }
}
