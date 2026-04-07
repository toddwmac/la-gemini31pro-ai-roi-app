import { useState, useEffect } from 'react';
import Wizard from './components/Wizard';
import { AppState } from './types';
import { BrainCircuit, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'ai-roi-coach-state';

const initialState: AppState = {
  profile: {
    name: '',
    role: '',
    hourlyRate: 150
  },
  tasks: [],
  currentStep: 0
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const resetState = () => {
    if (window.confirm('Are you sure you want to start over? All data will be lost.')) {
      setState(initialState);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!loaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header (hidden in print) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 print-hide shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg shadow-inner">
              <BrainCircuit className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 tracking-tight">
                Applied AI Labs <span className="text-gray-400 font-medium">|</span> AI ROI Coach
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://centerforappliedai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors hidden sm:block"
            >
              Center for Applied AI
            </a>
            <button 
              onClick={resetState}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
              title="Reset all data"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Wizard state={state} setState={setState} />
      </main>

      {/* Footer (hidden in print) */}
      <footer className="border-t border-gray-200 mt-12 py-8 bg-white print-hide">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Powered by Center for Applied AI. The AI Mindset focuses on how we think about AI as an accelerator of learning.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
