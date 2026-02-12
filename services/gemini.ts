
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectIdea, Difficulty, Domain } from "../types.ts";

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in .env.local");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const PROJECT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, academic-friendly project title" },
    description: { type: Type.STRING, description: "Clear summary of the project goals" },
    techStack: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Appropriate technologies for the given difficulty level"
    },
    usp: { type: Type.STRING, description: "The unique selling point or 'twist' that makes it better than generic projects" },
    modules: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-5 core functional modules to implement"
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING, description: "Name of the development phase (e.g., Requirement Analysis)" },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tasks for this phase" }
        },
        required: ["phase", "tasks"]
      },
      description: "A 4-5 step implementation roadmap"
    }
  },
  required: ["title", "description", "techStack", "usp", "modules", "roadmap"],
};

export async function generateAIProject(level: Difficulty, domain: Domain): Promise<ProjectIdea> {
  const prompt = `Generate a unique, innovative, and practical final year BCA project idea for a ${level} level student specializing in ${domain === 'all' ? 'Computer Science' : domain}. 
  The project should be based on current 2024-2025 industry trends.
  Include a full implementation roadmap.
  Make the tech stack appropriate for the ${level} level. 
  For ${level} level, use technologies like ${level === 'beginner' ? 'Basic HTML/CSS/JS or Python Flask' : level === 'intermediate' ? 'MERN Stack, Django, or Flutter' : 'Deep Learning, Blockchain, or Microservices'}.`;

  const response = await getAIClient().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: PROJECT_SCHEMA,
      tools: [{ googleSearch: {} }],
    },
  });

  if (!response.text) {
    throw new Error("No response text from Gemini API");
  }

  const rawData = JSON.parse(response.text);
  
  const sources: any[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const processedSources = sources
    .filter(s => s.web && s.web.uri)
    .map(s => ({ title: s.web.title || 'Source', uri: s.web.uri }));

  return {
    ...rawData,
    id: Math.random().toString(36).substring(7),
    level,
    domain,
    sources: processedSources.length > 0 ? processedSources : undefined,
    timestamp: Date.now(),
  };
}
