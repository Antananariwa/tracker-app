import './MainContentContainer.css';
import { useMainPage } from '../../context/MainPageContext';
import StockMainPage from './StockMainPage';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import PortfolioStocksPage from './PortfolioStocksPage'
import { Routes, Route } from 'react-router-dom'


const MainContentContainer = () => {
const { selectedMainPage } = useMainPage();

  return (
    <div className="MainContentConainerDiv">
        {/* Portfolio group */}
        {selectedMainPage === 'portfolioStocks' && <PortfolioStocksPage />}

        {/* Browse group */}
        {selectedMainPage === 'stocks' && <StockMainPage />}

        {/* Account group */}
        {selectedMainPage === 'login' && <LoginPage/>}
        {selectedMainPage === 'register' && <RegisterPage/>}
    </div>
  )
}

export default MainContentContainer
