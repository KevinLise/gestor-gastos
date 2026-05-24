// =============================================
// routes/gastos.routes.js - Rutas del CRUD
// =============================================
const express = require('express');
const { body } = require('express-validator');
const {
  getGastos,
  getGasto,
  createGasto,
  updateGasto,
  deleteGasto,
  getStats,
} = require('../controllers/gastos.controller');

const router = express.Router();

// Validaciones reutilizables
const gastoValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Máximo 500 caracteres'),

  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isIn(['comida', 'transporte', 'estudio', 'entretenimiento', 'salud', 'otros'])
    .withMessage('Categoría no válida'),

  body('monto')
    .notEmpty().withMessage('El monto es obligatorio')
    .isNumeric().withMessage('El monto debe ser un número')
    .custom(val => val >= 0).withMessage('El monto no puede ser negativo'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (ISO 8601)'),
];

// ─── Rutas ────────────────────────────────────
router.get('/stats', getStats);        // Estadísticas del dashboard
router.get('/', getGastos);            // Listar todos (con filtros opcionales)
router.get('/:id', getGasto);          // Ver uno
router.post('/', gastoValidation, createGasto);         // Crear
router.put('/:id', gastoValidation, updateGasto);       // Actualizar
router.delete('/:id', deleteGasto);    // Eliminar

module.exports = router;
