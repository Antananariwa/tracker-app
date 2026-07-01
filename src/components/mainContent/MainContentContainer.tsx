import './MainContentContainer.css';
import StockMainPage from './browse/StockBrowsePage';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import PortfolioStocksPage from './portfolio/PortfolioStocksPage'
import PortfolioCryptoPage from './portfolio/PortfolioCryptoPage';
import { Routes, Route } from 'react-router-dom'
import CryptoBrowsePage from './browse/CryptoBrowsePage';


const MainContentContainer = () => {

  return (
    <Routes>
      {/* Portfolio group */}
      <Route path="/portfolio/stocks" element={<PortfolioStocksPage />} />
      <Route path="/portfolio/crypto" element={<PortfolioCryptoPage />} />

      {/* Browse group */}
      <Route path="/browse/stocks" element={<StockMainPage />} />
      <Route path="/browse/crypto" element={<CryptoBrowsePage />} />

      {/* Account group */}
      <Route path="/account/login" element={<LoginPage />} />
      <Route path="/account/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default MainContentContainer
