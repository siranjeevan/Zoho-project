import { GoogleGenerativeAI } from "@google/generative-ai";

const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FALLBACK_API_KEY = import.meta.env.VITE_GEMINI_FALLBACK_API_KEY;

let genAI = new GoogleGenerativeAI(PRIMARY_API_KEY);
let usingFallback = false;

export const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro", 
  "gemini-1.5-flash",
];

export async function getWorkingModel(candidates = MODEL_CANDIDATES) {
  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "text/plain",
        },
      });
      await model.generateContent("test");
      return model;
    } catch (error) {
      console.warn(`Model failed: ${modelName}`);
      if (!usingFallback && error.status === 403) {
        console.log("Switching to fallback API key");
        genAI = new GoogleGenerativeAI(FALLBACK_API_KEY);
        usingFallback = true;
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "text/plain",
            },
          });
          await fallbackModel.generateContent("test");
          return fallbackModel;
        } catch {
          console.warn(`Fallback also failed for: ${modelName}`);
        }
      }
    }
  }
  throw new Error("No working Gemini model found");
}

export async function generateAIResponse(message, employees) {
  try {
    const model = await getWorkingModel();
    
    const context = `You are an AI assistant for employee management. Current employees: ${JSON.stringify(employees.map(emp => ({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      tasks: emp.tasks,
      availability: emp.availability,
      performance: emp.performance
    })))}`;
    
    const prompt = `${context}\n\nUser message: ${message}\n\nProvide a helpful response about employee management, task assignment, or team insights.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Error:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}