const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'ComparaPlan CR 2026 API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      compare: '/api/compare (POST)'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV}`);
});