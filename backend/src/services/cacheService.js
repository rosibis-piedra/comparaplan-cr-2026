const supabase = require('../config/database');

class CacheService {
  async get(query) {
    try {
      const { data, error } = await supabase
        .from('cache_comparaciones')
        .select('*')
        .eq('query_original', query)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? JSON.parse(data.resultado) : null;
    } catch (error) {
      console.error('Error buscando en caché:', error);
      return null;
    }
  }

  async set(query, result, partidosIds) {
    try {
      await supabase
        .from('cache_comparaciones')
        .insert({
          query_original: query,
          query_hash: query.toLowerCase(),
          resultado: JSON.stringify(result),
          partidos_incluidos: partidosIds,
          hits: 0
        });
    } catch (error) {
      console.error('Error guardando en caché:', error);
    }
  }
}

module.exports = new CacheService();
