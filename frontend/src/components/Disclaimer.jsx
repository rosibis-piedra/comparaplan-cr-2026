// frontend/src/components/Disclaimer.jsx
import { useState } from 'react';

export default function Disclaimer({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  if (accepted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0 }}>Bienvenido a ComparaPlan CR 2026</h2>
        
        <p>
          Hola, mi nombre es <strong>Rosibis</strong> y soy costarricense. 
          Creé esta herramienta para facilitar la comparación de planes de 
          gobierno oficiales de las elecciones 2026.
        </p>

        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0 }}>⚠️ Importante:</h3>
          <ul style={{ marginBottom: 0 }}>
            <li>Este sistema analiza únicamente los documentos oficiales públicos</li>
            <li>No pretende influir en tu voto ni favorecer ningún partido</li>
            <li>La IA puede cometer errores - verifica siempre la fuente original</li>
            <li>El autor no se hace responsable por decisiones tomadas basándose en esta información</li>
            <li>Esta es una herramienta ciudadana independiente, sin afiliación política</li>
          </ul>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Al continuar, aceptas que usas esta información bajo tu propio criterio 
          y responsabilidad.
        </p>

        <button
          onClick={handleAccept}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Acepto y continuar
        </button>
      </div>
    </div>
  );
}