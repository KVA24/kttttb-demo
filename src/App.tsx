import { useState } from 'react';
import { VerificationFlow } from './components/VerificationFlow';
import { ApiDocs } from './components/ApiDocs';
import './App.css';

function App() {
  const [view, setView] = useState<'demo' | 'docs'>('demo');

  return (
    <div className="app">
      <div className="view-toggle">
        <button
          className={`toggle-btn ${view === 'demo' ? 'active' : ''}`}
          onClick={() => setView('demo')}
        >
          🎮 Demo
        </button>
        <button
          className={`toggle-btn ${view === 'docs' ? 'active' : ''}`}
          onClick={() => setView('docs')}
        >
          📚 API Docs
        </button>
      </div>

      {view === 'demo' ? <VerificationFlow /> : <ApiDocs />}
    </div>
  );
}

export default App;
