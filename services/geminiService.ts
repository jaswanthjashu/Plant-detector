import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantInfo } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const MODEL_NAME = 'gemini-3-pro-preview';

const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING, description: "Common name of the plant" },
    scientificName: { type: Type.STRING, description: "Scientific name of the plant" },
    description: { type: Type.STRING, description: "A brief, engaging description of the plant" },
    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"], description: "Care difficulty level" },
    care: {
      type: Type.OBJECT,
      properties: {
        light: { type: Type.STRING, description: "Light requirements (e.g., Bright indirect)" },
        water: { type: Type.STRING, description: "Watering frequency and tips" },
        soil: { type: Type.STRING, description: "Soil type preferences" },
        humidity: { type: Type.STRING, description: "Humidity requirements" },
        temperature: { type: Type.STRING, description: "Ideal temperature range" },
      },
      required: ["light", "water", "soil", "humidity", "temperature"]
    },
    funFact: { type: Type.STRING, description: "An interesting fact about this plant" }
  },
  required: ["commonName", "scientificName", "description", "difficulty", "care", "funFact"]
};

export const identifyPlant = async (base64Image: string): Promise<PlantInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Identify this plant and provide detailed care instructions. Be specific and helpful for a home gardener."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: plantSchema,
        systemInstruction: "You are an expert botanist and gardening assistant. Your goal is to accurately identify plants from images and provide precise, actionable care advice."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as PlantInfo;
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
};

export const createChatSession = (plantContext: PlantInfo) => {
    const systemContext = `
    You are a friendly gardening expert assisting a user with their plant: ${plantContext.commonName} (${plantContext.scientificName}).
    
    Context about the plant:
    Description: ${plantContext.description}
    Care Info:
    - Light: ${plantContext.care.light}
    - Water: ${plantContext.care.water}
    - Soil: ${plantContext.care.soil}
    
    Answer the user's follow-up questions specifically about this plant. Keep answers concise, helpful, and encouraging.
    `;

    return ai.chats.create({
        model: MODEL_NAME,
        config: {
            systemInstruction: systemContext,
        }
    });
};