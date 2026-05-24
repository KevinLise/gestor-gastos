// =============================================
// controllers/gastos.controller.js - Lógica CRUD
// =============================================
const { validationResult } = require('express-validator');
const Gasto = require('../models/Gasto');

// ─── Obtener todos los gastos ─────────────────
// GET /api/gastos
const getGastos = async (req, res, next) => {
  try {
    const { categoria, mes, año } = req.query;
    const filter = {};

    // Filtro por categoría
    if (categoria && categoria !== 'todas') {
      filter.categoria = categoria;
    }

    // Filtro por mes/año
    if (mes && año) {
      const inicio = new Date(Number(año), Number(mes) - 1, 1);
      const fin = new Date(Number(año), Number(mes), 1);
      filter.fecha = { $gte: inicio, $lt: fin };
    }

    const gastos = await Gasto.find(filter).sort({ fecha: -1 });

    res.json({
      success: true,
      count: gastos.length,
      data: gastos,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Obtener un gasto por ID ──────────────────
// GET /api/gastos/:id
const getGasto = async (req, res, next) => {
  try {
    const gasto = await Gasto.findById(req.params.id);

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }

    res.json({ success: true, data: gasto });
  } catch (error) {
    next(error);
  }
};

// ─── Crear un gasto ───────────────────────────
// POST /api/gastos
const createGasto = async (req, res, next) => {
  try {
    // Validar inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const gasto = new Gasto(req.body);
    await gasto.save();

    res.status(201).json({
      success: true,
      message: 'Gasto creado exitosamente',
      data: gasto,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Actualizar un gasto ──────────────────────
// PUT /api/gastos/:id
const updateGasto = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const gasto = await Gasto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Gasto actualizado exitosamente',
      data: gasto,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Eliminar un gasto ────────────────────────
// DELETE /api/gastos/:id
const deleteGasto = async (req, res, next) => {
  try {
    const gasto = await Gasto.findByIdAndDelete(req.params.id);

    if (!gasto) {
      return res.status(404).json({
        success: false,
        message: 'Gasto no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Gasto eliminado exitosamente',
      data: gasto,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Estadísticas para el dashboard ──────────
// GET /api/gastos/stats
const getStats = async (req, res, next) => {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);

    // Total general
    const totalResult = await Gasto.aggregate([
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]);

    // Total del mes actual
    const totalMesResult = await Gasto.aggregate([
      { $match: { fecha: { $gte: inicioMes, $lt: finMes } } },
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]);

    // Cantidad total de gastos
    const cantidad = await Gasto.countDocuments();

    // Gastos por categoría
    const porCategoria = await Gasto.aggregate([
      { $group: { _id: '$categoria', total: { $sum: '$monto' }, cantidad: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Gastos por mes (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
    seisMesesAtras.setDate(1);

    const porMes = await Gasto.aggregate([
      { $match: { fecha: { $gte: seisMesesAtras } } },
      {
        $group: {
          _id: {
            año: { $year: '$fecha' },
            mes: { $month: '$fecha' },
          },
          total: { $sum: '$monto' },
        },
      },
      { $sort: { '_id.año': 1, '_id.mes': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalGeneral: totalResult[0]?.total || 0,
        totalMes: totalMesResult[0]?.total || 0,
        cantidadGastos: cantidad,
        porCategoria,
        porMes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGastos,
  getGasto,
  createGasto,
  updateGasto,
  deleteGasto,
  getStats,
};
