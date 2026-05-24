// =============================================
// server.js - Punto de entrada del backend
// =============================================
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const gastosRoutes = require('./routes/gastos.routes');
const currencyRoutes = require('./routes/currency.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Inicializar app
const app = express();

// Conectar a MongoDB
connectDB();

// ─── Middlewares ─────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Rutas ───────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: ' API Gestor de Gastos funcionando',
    version: '1.0.0',
    endpoints: ['/api/gastos', '/api/currency'],
  });
});

app.use('/api/gastos', gastosRoutes);
app.use('/api/currency', currencyRoutes);

// ─── Manejo de errores ────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Iniciar servidor ─────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
