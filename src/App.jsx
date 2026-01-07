import { useState } from 'react'
import './App.css'
import Header from './components/headerSection/Header.jsx'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer.jsx'
import MainContentContainer from './components/mainContent/MainContentContainer.jsx'
import { StockProvider } from './context/StockContext';


function App() {
  const [currentPage, setCurrentPage] = useState('stocks')

  return (
    <StockProvider>
      <div className="bodyDiv">
        <LeftMenuContainer onPageChange={setCurrentPage} title="Left Container"/>
        <div className="rightSideDiv">
          <Header title="Investments Calculator" subtitle="Table with individual assets"/>
          <MainContentContainer currentPage={currentPage}/>
        </div>
      </div>
    </StockProvider>
  )
}

export default App
