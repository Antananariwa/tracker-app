import { useState } from 'react'
import './App.css'
import Header from './components/headerSection/Header.jsx'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer.jsx'
import MainContentContainer from './components/mainContent/MainContentContainer.jsx'
import { MainPageProvider } from './context/MainPageContext.jsx';
import TopBar from './components/topBar/TopBar.jsx';


function App() {
  const [currentPage, setCurrentPage] = useState('stocks')

  return (
    <MainPageProvider>
      <div className="bodyWrapper">
          <TopBar/>

          <LeftMenuContainer onPageChange={setCurrentPage} title="Left Container"/>

        <div className="contentDiv">
          <Header title="Investments Calculator" subtitle="Table with individual assets"/>
          <MainContentContainer currentPage={currentPage}/>
        </div>

      </div>
    </MainPageProvider>
  )
}

export default App
