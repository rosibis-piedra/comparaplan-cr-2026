import { useState } from 'react';

export default function ResultsDisplay({ result }) {
  const [expandedParty, setExpandedParty] = useState(null);
  
  if (!result) return null;
  
  if (result.error) {
    return (
      <div style={{
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#721c24', marginTop: 0 }}>{result.error}</h3>
        {result.suggestion && (
          <p style={{ color: '#721c24', marginBottom: 0 }}>{result.suggestion}</p>
        )}
      </div>
    );
  }

  let parsedData = null;
  try {
    let jsonText = result.comparacion;
    if (typeof jsonText === 'string') {
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsedData = JSON.parse(jsonText);
    } else {
      parsedData = jsonText;
    }
  } catch (e) {
    console.log('Error parsing JSON:', e);
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#000', marginBottom: '1.5rem' }}>Comparación: {result.query}</h2>

      {parsedData ? (
        <div>
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#000', margin: 0, lineHeight: '1.6' }}>{parsedData.resumen}</p>
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
              ⚠️ <strong>Importante:</strong> Esta comparación analiza las secciones más relevantes de cada plan según el tema buscado. 
              Puede haber información adicional en los documentos completos. Te recomendamos revisar el plan oficial completo haciendo clic en cada partido o visitando el{' '}
              <a href="https://www.tse.go.cr/2026/planesgobierno.html" target="_blank" rel="noopener noreferrer" style={{ color: '#856404', textDecoration: 'underline' }}>
                sitio del TSE
              </a>.
            </p>
          </div>

          <h3 style={{ color: '#000', marginBottom: '1rem' }}>Propuestas por partido:</h3>

          {parsedData.partidos && parsedData.partidos.map((partido, index) => (
            <div key={index} style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              backgroundColor: 'white',
              overflow: 'hidden'
            }}>
              <button onClick={() => setExpandedParty(expandedParty === index ? null : index)} style={{
                width: '100%',
                padding: '1rem',
                textAlign: 'left',
                backgroundColor: expandedParty === index ? '#e9ecef' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{partido.nombre}</span>
                <span style={{ fontSize: '1.2rem' }}>{expandedParty === index ? '−' : '+'}</span>
              </button>
              
              {expandedParty === index && (
                <div style={{
                  padding: '1rem',
                  borderTop: '1px solid #dee2e6',
                  backgroundColor: '#f8f9fa'
                }}>
                  <p style={{ color: '#000', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {partido.propuesta}
                  </p>
                  <a 
                    href="https://www.tse.go.cr/2026/planesgobierno.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      color: '#007bff',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    📄 Ver plan completo de este partido en el TSE →
                  </a>
                </div>
              )}
            </div>
          ))}

          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <p style={{ color: '#004085', margin: 0, lineHeight: '1.6' }}>
              <strong>Conclusión:</strong> {parsedData.conclusion}
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="https://www.tse.go.cr/2026/planesgobierno.html" target="_blank" rel="noopener noreferrer" style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              Ver todos los planes completos en el TSE
            </a>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#000' }}>
            {result.comparacion}
          </div>
        </div>
      )}
    </div>
  );
}