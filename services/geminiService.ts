import { GoogleGenAI, Type } from "@google/genai";
import { Product, Article } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. Gemini features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getAIRecommendations = async (query: string, products: Product[]): Promise<string[]> => {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const productNames = products.map(p => p.name).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Based on the user query "${query}", which of the following products are the most relevant? Products: [${productNames}].`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProducts: {
              type: Type.ARRAY,
              description: 'A list of product names that are relevant to the user query.',
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.recommendedProducts)) {
      return result.recommendedProducts;
    }
    
    return [];

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    throw new Error("Failed to get recommendations from AI.");
  }
};

export const generateProductDescription = async (product: Product): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `Buat deskripsi produk untuk "${product.name}" dari UMKM Karawang. Info awal: "${product.description}".
Berikan jawaban langsung ke inti. Gunakan bahasa alami seperti manusia berbicara. Batasi jawaban hanya 2 sampai 4 kalimat. Jangan pakai simbol atau tanda baca berlebihan, cukup yang perlu saja.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating AI product description:", error);
    throw new Error("Failed to generate product description from AI.");
  }
};

export const generateArticle = async (topic: string): Promise<Omit<Article, 'id'>> => {
  if (!ai) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `Anda adalah seorang jurnalis konten untuk KODIK, sebuah marketplace UMKM Karawang.
Tugas Anda adalah menulis artikel yang menarik dan informatif tentang UMKM, budaya, atau kisah sukses lokal di Karawang berdasarkan topik yang diberikan.

Topik: "${topic}"

Buatlah sebuah artikel lengkap dengan format JSON yang berisi:
1.  "title": Judul yang menarik dan relevan dengan topik.
2.  "summary": Ringkasan singkat (1-2 kalimat) yang memancing rasa ingin tahu pembaca.
3.  "content": Isi artikel yang lengkap (beberapa paragraf) yang membahas topik secara mendalam dengan gaya bahasa yang engaging dan positif.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Judul artikel.' },
            summary: { type: Type.STRING, description: 'Ringkasan singkat artikel.' },
            content: { type: Type.STRING, description: 'Isi konten lengkap dari artikel.' },
          },
          required: ['title', 'summary', 'content'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.title && result.summary && result.content) {
      return result as Omit<Article, 'id'>;
    }

    throw new Error("Invalid response format from AI.");

  } catch (error) {
    console.error("Error generating AI article:", error);
    throw new Error("Failed to generate article from AI.");
  }
};