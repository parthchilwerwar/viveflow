declare module 'groq' {
  export default class Groq {
    constructor(apiKey: string);
    
    chat: {
      completions: {
        create(params: {
          messages: Array<{
            role: 'system' | 'user' | 'assistant';
            content: string;
          }>;
          model: string;
          temperature?: number;
          max_tokens?: number;
          response_format?: { type: string };
        }): Promise<{
          choices: Array<{
            message?: {
              content?: string;
            };
          }>;
        }>;
      };
    };
  }
} 