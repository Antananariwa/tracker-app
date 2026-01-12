import { useState, useEffect } from 'react';

//taking shortcuts, not using function name etc. ONLY searching by symbol in my personal DB
function useMockPersonalDB(functionName, searchedSymbol, interval, outputsize = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timerId = null;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/data/stocks/weekly/${searchedSymbol}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (searchedSymbol) load();
    if (interval > 0) timerId = setInterval(load, interval);

    return () => {
      mounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, [searchedSymbol, interval, outputsize]);

  return { data, loading, error };
}

export default useMockPersonalDB;