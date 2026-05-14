import './App.css'
import Header from './components/headerSection/Header'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer'
import MainContentContainer from './components/mainContent/MainContentContainer'
import { MainPageProvider } from './context/MainPageContext';
import TopBar from './components/topBar/TopBar';


function App() {

  return (
    <MainPageProvider>
      <div className="bodyWrapper">
          <TopBar/>

          <LeftMenuContainer title="Left Container"/>

        <div className="contentDiv">
          <Header title="Investments Calculator" subtitle="Table with individual assets"/>
          <MainContentContainer/>
        </div>

      </div>
    </MainPageProvider>
  )
}

export default App
