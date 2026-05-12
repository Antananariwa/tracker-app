import { createContext, useState, useContext } from 'react';

type MainPageContextType = {
  selectedMainPage: string
  setSelectedMainPage: (page: string) => void
}

type MainPageContextProps = {
  children: React.ReactNode
}

const MainPageContext = createContext<MainPageContextType | null>(null);


export const MainPageProvider = ({ children }: MainPageContextProps) => {
  const [selectedMainPage, setSelectedMainPage] = useState('crypto');
  
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
