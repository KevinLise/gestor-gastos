// =============================================
// hooks/useGastos.js — Estado global de gastos
// =============================================
import { useState, useEffect, useCallback } from 'react';
import { gastosService } from '../services/api';

const useGastos = (filtros = {}) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGastos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await gastosService.getAll(filtros);
      setGastos(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filtros)]);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  const createGasto = async (data) => {
    const res = await gastosService.create(data);
    setGastos(prev => [res.data.data, ...prev]);
    return res.data.data;
  };

  const updateGasto = async (id, data) => {
    const res = await gastosService.update(id, data);
    setGastos(prev => prev.map(g => g._id === id ? res.data.data : g));
    return res.data.data;
  };

  const deleteGasto = async (id) => {
    await gastosService.delete(id);
    setGastos(prev => prev.filter(g => g._id !== id));
  };

  return {
    gastos,
    loading,
    error,
    refetch: fetchGastos,
    createGasto,
    updateGasto,
    deleteGasto,
  };
};

export default useGastos;
