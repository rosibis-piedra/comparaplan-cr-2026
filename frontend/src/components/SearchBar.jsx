import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length < 3) return;
    if (!captchaToken) {
      alert('Por favor completa el captcha');
      return;
    }
    setLoading(true);
    onSearch(query.trim(), captchaToken);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: pensiones, salud, educación, seguridad..."
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          marginBottom: '15px'
        }}
      />
      
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={(token) => setCaptchaToken(token)}
        />
      </div>

      <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px' }}>
        Ingresa un tema de tu interés para comparar las propuestas de los partidos
      </p>

      <button
        type="submit"
        disabled={loading || query.trim().length < 3 || !captchaToken}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: query.trim().length >= 3 && captchaToken ? '#6c757d' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: query.trim().length >= 3 && captchaToken ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Comparando...' : 'Comparar Planes'}
      </button>
    </form>
  );
}

export default SearchBar;