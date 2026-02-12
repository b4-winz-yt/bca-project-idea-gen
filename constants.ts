
import { ProjectIdea } from './types';

export const DOMAINS = [
  { id: 'all', label: 'Surprise Me (All)', icon: 'fa-wand-magic-sparkles' },
  { id: 'web', label: 'Web Development', icon: 'fa-globe' },
  { id: 'app', label: 'Mobile App', icon: 'fa-mobile-screen' },
  { id: 'ai', label: 'AI & Data Science', icon: 'fa-brain' },
  { id: 'iot', label: 'IoT & Hardware', icon: 'fa-microchip' },
  { id: 'blockchain', label: 'Blockchain', icon: 'fa-link' },
  { id: 'cybersecurity', label: 'Cyber Security', icon: 'fa-shield-halved' },
];

export const LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Foundational concepts & simple CRUD', color: 'green' },
  { id: 'intermediate', label: 'Intermediate', description: 'Core skills & API integrations', color: 'blue' },
  { id: 'professional', label: 'Professional', description: 'Industry-ready complex systems', color: 'purple' },
];

export const STATIC_PROJECTS: ProjectIdea[] = [
  {
    id: '1',
    level: 'beginner',
    domain: 'web',
    title: "Hyper-Local Service Finder",
    description: "A directory website connecting users with local electricians, plumbers, and mechanics in specific neighborhoods.",
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    usp: "Focuses on 'Micro-locations' (specific apartment complexes or streets) rather than whole cities.",
    modules: ["Admin Panel to verify workers", "User Search by Pin Code", "Review/Rating System"],
    roadmap: [
      { phase: "Requirements", tasks: ["Identify target neighborhoods", "List service categories"] },
      { phase: "Design", tasks: ["DB Schema for workers", "UI mockups"] },
      { phase: "Dev", tasks: ["Search API", "Admin CRUD"] }
    ],
    timestamp: Date.now()
  },
  {
    id: '2',
    level: 'intermediate',
    domain: 'ai',
    title: "Smart Resume Screener",
    description: "AI-driven system that extracts text from PDF resumes and compares them against job descriptions to provide a relevance score.",
    techStack: ["Python", "Spacy", "Flask", "React"],
    usp: "Highlights missing keywords in red and suggests actionable improvements.",
    modules: ["PDF Text Extraction", "Keyword Matching Algorithm", "Scoring Logic Dashboard"],
    roadmap: [
      { phase: "Setup", tasks: ["Environment setup", "Library installs"] },
      { phase: "NLP", tasks: ["Parser logic", "Matching engine"] },
      { phase: "Frontend", tasks: ["File upload component", "Score visualization"] }
    ],
    timestamp: Date.now()
  }
];
