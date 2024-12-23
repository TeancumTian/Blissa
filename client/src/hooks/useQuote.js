import { useState, useEffect } from "react";

export const useQuote = (interval = 300000) => {
  // 默认5分钟更新一次
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quotes/random");
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    const timer = setInterval(fetchQuote, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { quote, loading, error, refresh: fetchQuote };
};
