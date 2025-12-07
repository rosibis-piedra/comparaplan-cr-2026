// backend/src/services/compareService.js
const { anthropic, CLAUDE_MODEL } = require('../config/claude');
const cacheService = require('./cacheService');

class CompareService {
  // Busca secciones relevantes en planes de gobierno
  async findRelevantSections(query) {
  const supabase = require('../config/database');
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  // Solo partidos principales según encuestas
const partidosPrincipales = [
  'Pueblo Soberano',
  'PLN',
  'Partido Liberación Nacional',
  'Frente Amplio',
  'PUSC',
  'Partido Unidad Social Cristiana',
  'Nueva Republica',
  'Agenda Ciudadana',
  'Progreso Social',
  'Unidos Podemos',
  'Liberal Progresista',
  'Nueva Generacion'
];
  const { data, error } = await supabase
    .from('plan_secciones')
    .select(`
      *,
      partidos:partido_id (
        id,
        nombre,
        siglas,
        plan_url
      )
    `)
    .or(keywords.map(k => `tema.ilike.%${k}%,contenido.ilike.%${k}%`).join(','))

  if (error) throw error;
// Filtrar solo partidos principales
const filtered = data.filter(row => 
  row.partidos && partidosPrincipales.includes(row.partidos.nombre)
);

// Diversificar: máximo 5 secciones por partido
const byPartido = {};
filtered.forEach(row => {  // ← Cambiar data por filtered
  const pid = row.partido_id;
  if (!byPartido[pid]) byPartido[pid] = [];
  if (byPartido[pid].length < 2) {
    byPartido[pid].push(row);
  }
});

const limited = Object.values(byPartido).flat();

return limited.map(row => ({
  ...row,
  partido_id: row.partido_id,
  partido_nombre: row.partidos.nombre,
  siglas: row.partidos.siglas,
  plan_url: row.partidos.plan_url
}));
}

  // Compara planes usando Claude
  async compare(query) {
    // 1. Buscar en caché primero
    const cached = await cacheService.get(query);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    // 2. Buscar secciones relevantes
    const sections = await this.findRelevantSections(query);
    
    if (sections.length === 0) {
      return {
        error: 'No se encontró información sobre este tema en los planes',
        suggestion: 'Intenta con otros términos como: pensiones, salud, educación, seguridad'
      };
    }

    // 3. Preparar prompt para Claude
    const prompt = this.buildPrompt(query, sections);

    // 4. Llamar a Claude
    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseTime = Date.now() - startTime;
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // 5. Parsear respuesta
    const result = {
      comparacion: message.content[0].text,
      partidos: this.extractPartidos(sections),
      metadata: {
        tokens_usados: tokensUsed,
        tiempo_ms: responseTime,
        secciones_analizadas: sections.length
      },
      fromCache: false
    };

    // 6. Guardar en caché
    const partidosIds = [...new Set(sections.map(s => s.partido_id))];
    await cacheService.set(query, result, partidosIds);

    // 7. Log
    await this.logQuery(query, tokensUsed, responseTime, false);

    return result;
  }

  buildPrompt(query, sections) {
    const partidosData = sections.reduce((acc, s) => {
      if (!acc[s.partido_nombre]) {
        acc[s.partido_nombre] = {
          siglas: s.siglas,
          contenido: []
        };
      }
      acc[s.partido_nombre].contenido.push({
        tema: s.tema,
        texto: s.contenido.substring(0, 600), // Limitar para tokens
        pagina: s.pagina_inicio
      });
      return acc;
    }, {});

    return `Eres un analista político neutral para las elecciones de Costa Rica 2026.

CONSULTA DEL USUARIO: "${query}"

A continuación están las secciones relevantes de los planes de gobierno oficiales:

${Object.entries(partidosData).map(([partido, data]) => `
PARTIDO: ${partido} (${data.siglas})
${data.contenido.map(c => `- ${c.tema} (pág. ${c.pagina}): ${c.texto}`).join('\n')}
`).join('\n---\n')}

INSTRUCCIONES:
1. Compara las propuestas de cada partido sobre "${query}"
2. Sé NEUTRAL - no favoreces ni criticas ningún partido
3. Cita la página del plan cuando sea relevante
4. Si un partido no menciona el tema, dilo claramente
5. Resalta diferencias concretas entre propuestas
6. Usa lenguaje claro y accesible

FORMATO DE RESPUESTA - Responde SOLO con JSON válido:
{
  "resumen": "Párrafo introductorio (2-3 líneas)",
  "partidos": [
    {
      "nombre": "Nombre del partido",
      "propuesta": "Descripción concisa de su propuesta (5-7 frases máximo)"
    }
  ],
  "conclusion": "Conclusión neutral (1-2 líneas)"
}

CRÍTICO: Tu respuesta debe ser ÚNICAMENTE JSON válido, sin texto adicional antes o después.`;
  }

  extractPartidos(sections) {
    const unique = {};
    sections.forEach(s => {
      if (!unique[s.partido_id]) {
        unique[s.partido_id] = {
          id: s.partido_id,
          nombre: s.partido_nombre,
          siglas: s.siglas,
          plan_url: 'https://www.tse.go.cr/2026/planesgobierno.html'
        };
      }
    });
    return Object.values(unique);
  }

  async logQuery(query, tokens, time, cacheHit) {
    try {
    const supabase = require('../config/database');
    const { error } = await supabase
  .from('logs_consultas')
  .insert({
    query: query,
    tokens_usados: tokens,
    tiempo_respuesta_ms: time,
    cache_hit: cacheHit
  });

if (error) throw error;
    } catch (error) {
      console.error('Error logging query:', error);
    }
  }
}

module.exports = new CompareService();