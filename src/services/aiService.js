import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
    } catch {
      console.warn(`Model failed: ${modelName}`);
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