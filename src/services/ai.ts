import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import useStore from '../store';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const modelCache: { [key: string]: GenerativeModel } = {};

export const getModel = (modelName: string) => {
  if (!modelCache[modelName]) {
    modelCache[modelName] = genAI.getGenerativeModel({ model: modelName });
  }
  return modelCache[modelName];
};

export const generateResponse = async (
  prompt: string,
  temperature: number
) => {
  try {
    const { selectedModel } = useStore.getState();
    const model = getModel(selectedModel);
    
    // Pastikan temperature adalah angka
    const validTemperature = typeof temperature === 'number' ? temperature : 0.7;

    // Configure generation parameters
    const generationConfig = {
      temperature: parseFloat(validTemperature.toFixed(1)),
      maxOutputTokens: 2048,
      topP: 0.8,
      topK: 40,
    };

    // Generate content with proper configuration
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ 
          text: prompt 
        }]
      }],
      generationConfig,
    });

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error(error?.message || 'Failed to generate response');
  }
};