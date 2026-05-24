// =============================================
// routes/currency.routes.js
// =============================================
const express = require('express');
const { getRates, convertAmount } = require('../controllers/currency.controller');

const router = express.Router();

router.get('/rates', getRates);           // Tasas actuales COP→USD,EUR
router.get('/convert', convertAmount);    // Convertir monto: ?monto=50000

module.exports = router;
