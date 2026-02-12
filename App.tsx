
import React, { useState, useEffect } from 'react';
import { Difficulty, Domain, ProjectIdea, GenerationConfig } from './types.ts';
import { DOMAINS, LEVELS, STATIC_PROJECTS } from './constants.ts';
import { generateAIProject } from './services/gemini.ts';
import Button from './components/Button.tsx';
import ProjectCard from './components/ProjectCard.tsx';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    level: 'intermediate',
    domain: 'all',
    useAI: true
  });
  const [currentProject, setCurrentProject] = useState<ProjectIdea | null>(null);
  const [history, setHistory] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('project_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('project_history', JSON.stringify(history.slice(0, 10)));
    }
  }, [history]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (config.useAI) {
        const aiProject = await generateAIProject(config.level, config.domain);
        setCurrentProject(aiProject);
        setHistory(prev => [aiProject, ...prev]);
      } else {
        let pool = STATIC_PROJECTS.filter(p => p.level === config.level);
        if (config.domain !== 'all') {
          pool = pool.filter(p => p.domain === config.domain);
        }
        
        if (pool.length === 0) {
          throw new Error(`No manual projects found for ${config.domain} at ${config.level} level. Try AI mode!`);
        }
        
        const randomProject = pool[Math.floor(Math.random() * pool.length)];
        const clonedProject = { ...randomProject, id: Date.now().toString(), timestamp: Date.now() };
        setCurrentProject(clonedProject);
        setHistory(prev => [clonedProject, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating the idea.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <i className="fas fa-lightbulb text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              BCA Gen<span className="text-blue-600">Ideas</span> Pro
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-500"></i> AI Powered</span>
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-green-500"></i> Full Roadmaps</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fas fa-sliders text-blue-600"></i>
              Configure Idea
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Difficulty Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setConfig(prev => ({ ...prev, level: level.id as Difficulty }))}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group
                        ${config.level === level.id 
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/10' 
                          : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{level.label}</div>
                        <div className="text-xs text-slate-500">{level.description}</div>
                      </div>
                      {config.level === level.id && <i className="fas fa-check-circle text-blue-600"></i>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Industry Domain</label>
                <div className="grid grid-cols-2 gap-2">
                  {DOMAINS.map(domain => (
                    <button
                      key={domain.id}
                      onClick={() => setConfig(prev => ({ ...prev, domain: domain.id as Domain }))}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3
                        ${config.domain === domain.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <i className={`fas ${domain.icon} ${config.domain === domain.id ? 'text-blue-600' : 'text-slate-400'}`}></i>
                      <span className={`text-xs font-bold ${config.domain === domain.id ? 'text-blue-600' : 'text-slate-600'}`}>
                        {domain.id === 'all' ? 'All' : domain.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-robot text-purple-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">AI Powered</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Dynamic Generation</div>
                  </div>
                </div>
                <button 
                  onClick={() => setConfig(prev => ({ ...prev, useAI: !prev.useAI }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.useAI ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.useAI ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <Button 
                onClick={handleGenerate} 
                isLoading={isLoading}
                className="w-full"
              >
                <i className="fas fa-wand-magic-sparkles mr-2"></i>
                Generate Idea
              </Button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="hidden lg:block">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Previous Ideas</h3>
              <div className="space-y-3">
                {history.slice(1, 6).map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setCurrentProject(item)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 transition-all group"
                  >
                    <div className="text-xs font-bold text-blue-600 mb-1">{item.level}</div>
                    <div className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">{item.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="lg:col-span-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-center gap-4 mb-8">
              <i className="fas fa-circle-exclamation text-2xl"></i>
              <div>
                <div className="font-bold">Generation Failed</div>
                <div className="text-sm opacity-80">{error}</div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-500 font-medium animate-pulse">Gemini is thinking of something brilliant...</p>
            </div>
          ) : currentProject ? (
            <ProjectCard project={currentProject} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-rocket text-4xl text-slate-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Start?</h3>
              <p className="text-slate-500 max-w-sm">
                Select your preferences on the left and click generate to find your perfect final year project idea.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-40 grayscale">
            <i className="fas fa-code"></i>
            <span className="font-bold">BCA GRADUATES</span>
            <i className="fas fa-heart text-red-500"></i>
            <span className="font-bold">CS STUDENTS</span>
          </div>
          <p className="text-slate-400 text-sm">&copy; 2024 BCA GenIdeas Pro. Powered by Gemini Flash 3.0.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
