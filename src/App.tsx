import './App.css'
import Header from './components/headerSection/Header'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer'
import MainContentContainer from './components/mainContent/MainContentContainer'
import TopBar from './components/topBar/TopBar';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';


function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
          <div className="bodyWrapper">
              <TopBar/>

              <LeftMenuContainer/>

            <div className="contentDiv">
              <Header title="Investments Calculator" subtitle="Table with individual assets"/>
              <MainContentContainer/>
            </div>

          </div>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
