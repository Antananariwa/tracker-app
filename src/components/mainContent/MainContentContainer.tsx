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
    <Routes>
      {/* Portfolio group */}
      <Route path="/portfolio/stocks" element={<PortfolioStocksPage />} />

      {/* Browse group */}
      <Route path="/browse/stocks" element={<StockMainPage />} />

      {/* Account group */}
      <Route path="/account/login" element={<LoginPage />} />
      <Route path="/account/login" element={<RegisterPage />} />
    </Routes>
  )
}

export default MainContentContainer
