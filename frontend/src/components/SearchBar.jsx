import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (query.trim().length < 3) return;
    if (!captchaToken) {
      alert('Por favor completa el captcha');
      return;
    }

    // Llamar a la búsqueda
    await onSearch(query.trim(), captchaToken);
    
    // Resetear después de la búsqueda
    setQuery('');
    setCaptchaToken(null);
    recaptchaRef.current?.reset();
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    alert('El captcha expiró. Por favor complétalo de nuevo.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: pensiones, salud, educación, seguridad..."
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          marginBottom: '15px',
          opacity: loading ? 0.6 : 1
        }}
      />
      
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          onExpired={handleCaptchaExpired}
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
          backgroundColor: query.trim().length >= 3 && captchaToken && !loading ? '#6c757d' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: query.trim().length >= 3 && captchaToken && !loading ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Comparando...' : 'Comparar Planes'}
      </button>
    </form>
  );
}

export default SearchBar;