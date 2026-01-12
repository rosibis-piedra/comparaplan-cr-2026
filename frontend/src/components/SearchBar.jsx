import { useState } from 'react';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (query.trim().length < 3) return;

    // Llamar a la búsqueda sin captcha
    await onSearch(query.trim(), null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: pensiones, salud, educación, seguridad, impuestos, renta, cultura..."
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
      
      <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px' }}>
        Ingresa un tema de tu interés para comparar las propuestas de los partidos políticos
      </p>
      
      <button
        type="submit"
        disabled={loading || query.trim().length < 3}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: query.trim().length >= 3 && !loading ? '#6c757d' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: query.trim().length >= 3 && !loading ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Comparando...' : 'Comparar Planes'}
      </button>
    </form>
  );
}

export default SearchBar;