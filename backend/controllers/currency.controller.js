// =============================================
// controllers/currency.controller.js
// Conversión COP → USD, EUR usando ExchangeRate API
// =============================================
const axios = require('axios');

// Cache simple en memoria para reducir llamadas a la API
let cache = {
  rates: null,
  timestamp: null,
};
const CACHE_TTL = 60 * 60 * 1000; // 1 hora en milisegundos

// ─── Obtener tasas de cambio actuales ─────────
// GET /api/currency/rates
const getRates = async (req, res, next) => {
  try {
    // Verificar si hay datos en cache válidos
    const ahora = Date.now();
    if (cache.rates && cache.timestamp && (ahora - cache.timestamp) < CACHE_TTL) {
      return res.json({
        success: true,
        source: 'cache',
        data: cache.rates,
      });
    }

    const apiKey = process.env.EXCHANGERATE_API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/COP`;

    const response = await axios.get(url, { timeout: 10000 });

    if (response.data.result !== 'success') {
      return res.status(502).json({
        success: false,
        message: 'Error al obtener tasas de cambio',
      });
    }

    const rates = {
      base: 'COP',
      USD: response.data.conversion_rates.USD,
      EUR: response.data.conversion_rates.EUR,
      lastUpdate: response.data.time_last_update_utc,
      nextUpdate: response.data.time_next_update_utc,
    };

    // Guardar en cache
    cache = { rates, timestamp: ahora };

    res.json({
      success: true,
      source: 'api',
      data: rates,
    });
  } catch (error) {
    // Si falla la API, retornar tasas de respaldo aproximadas
    if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
      return res.json({
        success: true,
        source: 'fallback',
        data: {
          base: 'COP',
          USD: 0.000245,
          EUR: 0.000226,
          lastUpdate: 'Datos de respaldo — actualiza tu API Key',
          nextUpdate: null,
        },
      });
    }
    next(error);
  }
};

// ─── Convertir un monto específico ───────────
// GET /api/currency/convert?monto=50000
const convertAmount = async (req, res, next) => {
  try {
    const monto = parseFloat(req.query.monto);

    if (isNaN(monto) || monto < 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser un número positivo',
      });
    }

    // Obtener tasas (aprovecha el cache)
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    let rates;

    // Usar cache si es válido
    const ahora = Date.now();
    if (cache.rates && cache.timestamp && (ahora - cache.timestamp) < CACHE_TTL) {
      rates = cache.rates;
    } else {
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/COP`;
      const response = await axios.get(url, { timeout: 10000 });
      rates = {
        USD: response.data.conversion_rates.USD,
        EUR: response.data.conversion_rates.EUR,
        lastUpdate: response.data.time_last_update_utc,
      };
      cache = { rates: { ...rates, base: 'COP' }, timestamp: ahora };
    }

    res.json({
      success: true,
      data: {
        montoCOP: monto,
        montoUSD: parseFloat((monto * rates.USD).toFixed(2)),
        montoEUR: parseFloat((monto * rates.EUR).toFixed(2)),
        tasaUSD: rates.USD,
        tasaEUR: rates.EUR,
        lastUpdate: rates.lastUpdate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRates, convertAmount };
