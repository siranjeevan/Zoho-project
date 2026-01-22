import { GoogleGenerativeAI } from "@google/generative-ai";

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENV_FALLBACK_API_KEY = import.meta.env.VITE_GEMINI_FALLBACK_API_KEY;

export const getStoredApiKey = () => localStorage.getItem("GEMINI_API_KEY");
export const setStoredApiKey = (key) => {
  localStorage.setItem("GEMINI_API_KEY", key);
  // Re-initialize the instance
  initGenAI();
};

export const hasApiKey = () => {
  const key = getStoredApiKey() || ENV_API_KEY;
  return key && key !== "ID_OF_THE_GEMINI_API_KEY";
};

let genAI = null;

const initGenAI = () => {
  const key = getStoredApiKey() || ENV_API_KEY;
  if (key && key !== "ID_OF_THE_GEMINI_API_KEY") {
    genAI = new GoogleGenerativeAI(key);
  } else if (ENV_FALLBACK_API_KEY) {
     genAI = new GoogleGenerativeAI(ENV_FALLBACK_API_KEY);
  }
};

// Initial setup
initGenAI();

export const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro", 
  "gemini-1.5-flash",
];

export async function getWorkingModel(candidates = MODEL_CANDIDATES) {
  if (!genAI) {
      initGenAI();
      if (!genAI) {
          throw new Error("MISSING_API_KEY");
      }
  }

  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "text/plain",
        },
      });
      // Lightweight test to verify model access
      await model.generateContent("test");
      return model;
    } catch (error) {
      console.warn(`Model failed: ${modelName}`, error);
      // If 403 (Permission denied) or 400 (Bad Request - often key related), 
      // it might be an invalid key, but we iterate through models first.
    }
  }
  throw new Error("No working Gemini model found. Please check your API key.");
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
    if (error.message === "MISSING_API_KEY" || error.message.includes("API key")) {
        return "MISSING_API_KEY"; // Special signal to UI
    }
    return "I'm having trouble connecting right now. Please try again in a moment. (" + error.message + ")";
  }
}