// frontend/src/App.jsx
import { useState } from 'react';
import Disclaimer from './components/Disclaimer';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import { compareService } from './services/api';
import './App.css';

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareService.compare(query);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!disclaimerAccepted && (
        <Disclaimer onAccept={() => setDisclaimerAccepted(true)} />
      )}

      <div className="container">
        <header>
          <h1>🇨🇷 ComparaPlan CR 2026</h1>
          <p className="subtitle">
            Compara planes de gobierno de forma inteligente
          </p>
        </header>

        <main>
          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analizando planes de gobierno...</p>
            </div>
          )}

          <ResultsDisplay result={result} />
        </main>

        <footer>
          <p>
            Herramienta ciudadana independiente • Datos de planes oficiales TSE 2026
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>
            Creado por Rosibis Piedra • Sin afiliación política
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;