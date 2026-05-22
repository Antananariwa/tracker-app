import './App.css'
import Header from './components/headerSection/Header'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer'
import MainContentContainer from './components/mainContent/MainContentContainer'
import { MainPageProvider } from './context/MainPageContext';
import TopBar from './components/topBar/TopBar';
import { BrowserRouter } from 'react-router-dom';


function App() {

  return (

    <MainPageProvider>
      <BrowserRouter>
        <div className="bodyWrapper">
            <TopBar/>

            <LeftMenuContainer title="Left Container"/>

          <div className="contentDiv">
            <Header title="Investments Calculator" subtitle="Table with individual assets"/>
            <MainContentContainer/>
          </div>

        </div>
      </BrowserRouter>
    </MainPageProvider>
  )
}

export default App
