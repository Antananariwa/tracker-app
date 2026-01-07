import { createContext, useState, useContext } from 'react';


const StockContext = createContext();


export const StockProvider = ({ children }) => {
  const [selectedStock, setSelectedStock] = useState('IBM');
  const [selectedFunction, setSelectedFunction] = useState('TIME_SERIES_DAILY');
  
  const value = {
    selectedStock,
    setSelectedStock,
    selectedFunction,
    setSelectedFunction,
  };
  
  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};


export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within StockProvider, you dumb.');
  }
  return context;
};
