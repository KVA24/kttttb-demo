import { useState } from 'react';
import { VerificationFlow } from './components/VerificationFlow';
import { ApiDocs } from './components/ApiDocs';
import { kttttbApi, DEFAULT_CONFIG } from './services/kttttbApi';
import './App.css';

interface ConfigState {
  tenantCode: string;
  businessCode: string;
  secretKey: string;
}

function App() {
  const [view, setView] = useState<'demo' | 'docs'>('demo');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ConfigState>({
    tenantCode: DEFAULT_CONFIG.tenantCode,
    businessCode: DEFAULT_CONFIG.businessCode,
    secretKey: DEFAULT_CONFIG.secretKey,
  });

  const updateApiConfig = () => {
    kttttbApi.updateConfig(config.tenantCode, config.businessCode, config.secretKey);
    setShowConfig(false);
  };

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
        <button
          className={`toggle-btn settings-btn ${showConfig ? 'active' : ''}`}
          onClick={() => setShowConfig(!showConfig)}
          title="Configuration"
        >
          ⚙️
        </button>

        {showConfig && (
          <>
            <div className="popover-backdrop" onClick={() => setShowConfig(false)} />
            <div className="config-popover">
              <div className="popover-header">
                <h3>⚙️ Configuration</h3>
                <button className="close-btn" onClick={() => setShowConfig(false)}>✕</button>
              </div>
              
              <div className="popover-content">
                <div className="config-field">
                  <label htmlFor="tenantCode">Tenant Code</label>
                  <input
                    id="tenantCode"
                    type="text"
                    value={config.tenantCode}
                    onChange={(e) => setConfig({ ...config, tenantCode: e.target.value })}
                    placeholder="YOUR_TENANT_CODE"
                  />
                </div>

                <div className="config-field">
                  <label htmlFor="businessCode">Business Code</label>
                  <input
                    id="businessCode"
                    type="text"
                    value={config.businessCode}
                    onChange={(e) => setConfig({ ...config, businessCode: e.target.value })}
                    placeholder="YOUR_BUSINESS_CODE"
                  />
                </div>

                <div className="config-field">
                  <label htmlFor="secretKey">Secret Key</label>
                  <input
                    id="secretKey"
                    type="text"
                    value={config.secretKey}
                    onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                    placeholder="YOUR_SECRET_KEY"
                  />
                </div>

                <button className="apply-btn" onClick={updateApiConfig}>
                  ✓ Apply Configuration
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {view === 'demo' ? <VerificationFlow /> : <ApiDocs />}
    </div>
  );
}

export default App;
