import { GoogleGenAI, Type } from "@google/genai";
import { Word, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getWordOfTheDay(): Promise<Word> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a 'Word of the Day' for learning English. Provide an advanced yet useful word with its phonetic spelling, part of speech, definition in English, translation in Indonesian, an example sentence, and its difficulty level.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          definition: { type: Type.STRING },
          translation: { type: Type.STRING },
          example: { type: Type.STRING },
          difficulty: { type: Type.STRING }
        },
        required: ["term", "phonetic", "partOfSpeech", "definition", "translation", "example", "difficulty"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...data
  };
}

export async function generateQuizzes(difficulty: string = 'Intermediate'): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 English vocabulary quiz questions of ${difficulty} difficulty. Include: 1 multiple-choice, 1 short-answer (one word), and 1 that could be used for matching (provide the question text and answer).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING }, // 'multiple-choice', 'short-answer'
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["type", "question", "correctAnswer", "difficulty"]
        }
      }
    }
  });

  const data = JSON.parse(response.text || '[]');
  return data.map((q: any) => ({
    id: Math.random().toString(36).substr(2, 9),
    ...q
  }));
}
