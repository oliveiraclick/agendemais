import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client safely handling the process.env check for browser environments
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateSalonDescription = async (salonName: string, services: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Escreva uma descrição curta, atraente e profissional para um salão de beleza chamado "${salonName}". 
    O salão oferece os seguintes serviços: ${services.join(', ')}. 
    A descrição deve ter no máximo 300 caracteres e focar na qualidade e experiência do cliente.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Venha conhecer nosso espaço e aproveitar nossos serviços de qualidade.";
  } catch (error) {
    console.error("Erro ao gerar descrição com Gemini:", error);
    return "Um espaço dedicado à sua beleza e bem-estar.";
  }
};

export const generateMarketingPost = async (salonName: string, goal: string, tone: string = 'divertido'): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Crie um post curto para Instagram/WhatsApp para o salão de beleza "${salonName}".
        Objetivo: ${goal}.
        Tom de voz: ${tone}.
        Use emojis. Máximo 200 caracteres.
        Não use hashtags.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || `Venha para o ${salonName}! Agende seu horário hoje mesmo. 💅`;
  } catch (error) {
    console.error("Erro ao gerar post de marketing:", error);
    return `Venha para o ${salonName}! Agende seu horário hoje mesmo. ✨`;
  }
};