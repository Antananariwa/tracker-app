import { createContext, useState, useContext } from 'react';


const MainPageContext = createContext();


export const MainPageProvider = ({ children }) => {
  const [selectedMainPage, setSelectedMainPage] = useState('stocks');
  
  const value = {
    selectedMainPage,
    setSelectedMainPage,
  };
  
  return (
    <MainPageContext.Provider value={value}>
      {children}
    </MainPageContext.Provider>
  );
};


export const useMainPage = () => {
  const context = useContext(MainPageContext);
  if (!context) {
    throw new Error('useMainPage must be used within MainPageProvider, you dumb.');
  }
  return context;
};
