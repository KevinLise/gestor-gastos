// =============================================
// models/Gasto.js - Modelo de datos para gastos
// =============================================
const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del gasto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
      default: '',
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: ['comida', 'transporte', 'estudio', 'entretenimiento', 'salud', 'otros'],
        message: 'Categoría no válida: {VALUE}',
      },
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    versionKey: false,
  }
);

// Índices para optimizar consultas frecuentes
gastoSchema.index({ categoria: 1 });
gastoSchema.index({ fecha: -1 });

module.exports = mongoose.model('Gasto', gastoSchema);
