import { useState, useEffect } from 'react';
import mockCompact from '../data/mock_IBM_compact.json';
import mockFull from '../data/mock_IBM_full.json';

const useMockAlphaVantage = (functionName, symbol, interval, outputsize = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      const mockData = outputsize === 'full' ? mockFull : mockCompact;
      setData(mockData);
      setLoading(false);
    }, 300);
  }, [outputsize]);
  
  return { data, loading, error: null };
};

export default useMockAlphaVantage