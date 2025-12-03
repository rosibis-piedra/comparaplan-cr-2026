require('dotenv').config();

const checkRateLimit = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const maxRequests = parseInt(process.env.MAX_REQUESTS_PER_DAY) || 10;

    const supabase = require('../config/database');

    // Buscar registro de hoy
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .eq('fecha', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no encontrado
      throw error;
    }

    if (data) {
      // Ya existe registro
      if (data.consultas_hoy >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: `Límite diario alcanzado (${maxRequests} consultas/día)`,
          resetAt: new Date(data.fecha + 'T23:59:59').toISOString()
        });
      }

      // Incrementar contador
      await supabase
        .from('rate_limits')
        .update({ consultas_hoy: data.consultas_hoy + 1 })
        .eq('ip_address', ip)
        .eq('fecha', today);

      req.rateLimit = {
        remaining: maxRequests - data.consultas_hoy - 1
      };
    } else {
      // Crear nuevo registro
      await supabase
        .from('rate_limits')
        .insert({ ip_address: ip, fecha: today, consultas_hoy: 1 });

      req.rateLimit = {
        remaining: maxRequests - 1
      };
    }

    next();
  } catch (error) {
    console.error('Error en rate limiter:', error);
    next(); // Continuar sin bloquear
  }
};

module.exports = checkRateLimit;