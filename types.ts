
export type Difficulty = 'beginner' | 'intermediate' | 'professional';

export type Domain = 'all' | 'web' | 'app' | 'ai' | 'iot' | 'blockchain' | 'cybersecurity';

export interface RoadmapStep {
  phase: string;
  tasks: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  level: Difficulty;
  domain: Domain;
  techStack: string[];
  usp: string;
  modules: string[];
  roadmap: RoadmapStep[];
  sources?: GroundingSource[];
  timestamp: number;
}

export type AIProvider = 'gemini' | 'nvidia';

export interface GenerationConfig {
  level: Difficulty;
  domain: Domain;
  useAI: boolean;
  provider: AIProvider;
}
