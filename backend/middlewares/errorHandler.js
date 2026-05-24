// =============================================
// middlewares/errorHandler.js
// =============================================
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Error de ID de MongoDB inválido
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID de recurso no válido',
    });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Recurso duplicado',
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
