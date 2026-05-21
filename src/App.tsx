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
  const [showSecretKey, setShowSecretKey] = useState(false);
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
                  <div className="secret-key-wrapper">
                    <input
                      id="secretKey"
                      type={showSecretKey ? "text" : "password"}
                      value={config.secretKey}
                      onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                      placeholder="YOUR_SECRET_KEY"
                    />
                    <button
                      className="toggle-visibility-btn"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      title={showSecretKey ? "Hide Secret Key" : "Show Secret Key"}
                    >
                      {showSecretKey ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-eye-icon lucide-eye">
                          <path
                            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-eye-closed-icon lucide-eye-closed">
                          <path d="m15 18-.722-3.25"/>
                          <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
                          <path d="m20 15-1.726-2.05"/>
                          <path d="m4 15 1.726-2.05"/>
                          <path d="m9 18 .722-3.25"/>
                        </svg>
                      }
                    </button>
                  </div>
                </div>
                
                <button className="apply-btn" onClick={updateApiConfig}>
                  ✓ Apply Configuration
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {view === 'demo' ? <VerificationFlow/> : <ApiDocs/>}
    </div>
  );
}

export default App;
