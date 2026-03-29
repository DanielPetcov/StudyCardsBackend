import { Injectable, Logger } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';
import { PDFParse } from 'pdf-parse';

import { DeckIconName, LanguageType, CardDifficulty } from '@/common/enums';
import { CreateCardDto } from '@/modules/card/domain/dto/create-card.dto';

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

      const prompt = this.buildAnalysisPrompt(pdfText, language, pdfLanguage);

      this.logger.log(
        `Sending analysis request to AI | model=${this.model} promptLength=${prompt.length}`,
      );

      const response = await this.openrouter.chat.send({
        chatGenerationParams: {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          responseFormat: { type: 'json_object' },
          temperature: 0.7,
          maxTokens: 16000,
        },
      });

      this.logger.log(`AI response received | model=${this.model}`);

      const aiResponse = JSON.parse(response.choices[0].message.content);

      const normalized = this.validateAndNormalizeResponse(aiResponse);

      this.logger.log(
        `Deck analysis completed | title="${normalized.title}" icon=${normalized.icon} cards=${normalized.cards.length}`,
      );

      return normalized;
    } catch (error) {
      this.logger.error(
        `Deck analysis failed | targetLanguage=${language} model=${this.model}`,
        error.stack,
      );
      throw new Error(`Failed to analyze deck: ${error.message}`);
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
        error.stack,
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

  private getSystemPrompt(): string {
    return `You are an expert educational content analyzer and flashcard creator. Your task is to:

1. Analyze educational PDF content thoroughly
2. Create high-quality study flashcards with clear questions and detailed explanations
3. Organize cards in logical learning progression
4. Assign appropriate difficulty levels based on concept complexity
5. Choose the most relevant icon representing the main topic
6. Generate between 15-50 cards depending on content depth

Guidelines:
- Questions should be clear, specific, and test understanding
- Explanations should be comprehensive but concise (2-4 sentences)
- Easy: Basic definitions, simple facts
- Medium: Application of concepts, relationships between ideas
- Hard: Complex analysis, synthesis, critical thinking
- Order cards logically: foundational concepts first, advanced topics later
- If content is limited, generate at least 1 card, up to 15 minimum when possible

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
  ): string {
    const needsTranslation = targetLanguage !== pdfLanguage;
    const translationNote = needsTranslation
      ? `IMPORTANT: The PDF is in ${pdfLanguage}, but you must translate ALL questions and explanations to ${targetLanguage}.`
      : `Generate cards in ${targetLanguage}, the same language as the PDF content.`;

    // Truncate PDF text if too long (keep first 80% of char limit for model)
    const maxTextLength = 100000; // Adjust based on model context window
    const truncatedText =
      pdfText.length > maxTextLength
        ? pdfText.substring(0, maxTextLength) +
          '\n\n[Content truncated due to length...]'
        : pdfText;

    this.logger.debug(
      `Analysis prompt built | targetLanguage=${targetLanguage} pdfLanguage=${pdfLanguage} needsTranslation=${needsTranslation} truncated=${pdfText.length > maxTextLength}`,
    );

    return `${translationNote}

PDF Content:
${truncatedText}

Analyze this educational content and create a comprehensive deck of study flashcards.

Requirements:
1. Generate 15-50 cards (more cards for longer/denser content)
2. Create a clear, descriptive title (max 100 characters)
3. Write a brief description of what the deck covers (2-3 sentences)
4. Choose the most appropriate icon from the available list
5. Order cards in logical learning progression (foundational → advanced)
6. Assign difficulty based on concept complexity:
   - easy: Basic facts, definitions, simple recall
   - medium: Understanding, application, connections
   - hard: Analysis, synthesis, complex reasoning

Respond with JSON in this exact format:
{
  "title": "Deck title here",
  "description": "Brief description of deck content",
  "icon": "icon-name",
  "cards": [
    {
      "question": "Clear, specific question",
      "explanation": "Detailed explanation (2-4 sentences)",
      "difficulty": "easy|medium|hard",
      "order": 0
    }
  ]
}

Remember:
- Questions in ${targetLanguage}
- Explanations in ${targetLanguage}
- Logical order progression (order: 0, 1, 2, ...)
- Valid JSON only, no markdown`;
  }

  private validateAndNormalizeResponse(aiResponse: any): AIDeckAnalysis {
    if (
      !aiResponse.title ||
      !aiResponse.description ||
      !aiResponse.icon ||
      !Array.isArray(aiResponse.cards)
    ) {
      this.logger.warn('AI response validation failed | invalid structure');
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
      .filter((card: any) => card.question && card.explanation)
      .map((card: any, index: number) => ({
        question: card.question.trim(),
        explanation: card.explanation.trim(),
        difficulty: this.validateDifficulty(card.difficulty),
        order: card.order ?? index,
      }))
      .slice(0, 50);

    if (cards.length === 0) {
      this.logger.warn(
        'AI response validation failed | no valid cards generated',
      );
      throw new Error('AI generated no valid cards');
    }

    if (cards.length < 15) {
      this.logger.warn(`Low card count generated | cards=${cards.length}`);
    }

    return {
      title: aiResponse.title.trim().substring(0, 255),
      description: aiResponse.description.trim(),
      icon: aiResponse.icon as DeckIconName,
      cards,
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
}
