// backend/src/config/claude.js
// Configuración del cliente de Claude API

const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';

module.exports = {
  anthropic,
  CLAUDE_MODEL
};
