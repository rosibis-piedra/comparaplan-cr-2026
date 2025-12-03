const compareService = require('../services/compareService');

const compare = async (req, res) => {
  try {
    const { query } = req.body;

    // Validar input
    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'La consulta debe tener al menos 3 caracteres'
      });
    }

    // Realizar comparación (sin validar captcha por ahora)
    const result = await compareService.compare(query);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error en compare:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

module.exports = { compare };
