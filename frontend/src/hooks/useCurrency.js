// =============================================
// hooks/useCurrency.js — Tasas de cambio COP
// =============================================
import { useState, useEffect } from 'react';
import { currencyService } from '../services/api';

const useCurrency = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await currencyService.getRates();
        setRates(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  // Convierte un monto COP a USD y EUR
  const convertCOP = (montoCOP) => {
    if (!rates) return { USD: null, EUR: null };
    return {
      USD: (montoCOP * rates.USD).toFixed(2),
      EUR: (montoCOP * rates.EUR).toFixed(2),
    };
  };

  return { rates, loading, error, convertCOP };
};

export default useCurrency;
