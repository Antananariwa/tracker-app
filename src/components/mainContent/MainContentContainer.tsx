import StockMainPage from './browse/StockBrowsePage';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import PortfolioAssetsPage from './portfolio/PortfolioAssetsPage';
import PortfolioStocksPage from './portfolio/PortfolioStocksPage'
import PortfolioCryptoPage from './portfolio/PortfolioCryptoPage';
import { Routes, Route, Navigate } from 'react-router-dom'
import CryptoBrowsePage from './browse/CryptoBrowsePage';
import NotFoundPage from './NotFoundPage';


const MainContentContainer = () => {

  return (
    <div className="pageWidthLimit">
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/portfolio/main" replace />} />

        {/* Portfolio group */}
        <Route path="/portfolio/main" element={<PortfolioAssetsPage />} />
        <Route path="/portfolio/stocks" element={<PortfolioStocksPage />} />
        <Route path="/portfolio/crypto" element={<PortfolioCryptoPage />} />

        {/* Browse group */}
        <Route path="/browse/stocks" element={<StockMainPage />} />
        <Route path="/browse/crypto" element={<CryptoBrowsePage />} />

        {/* Account group */}
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/register" element={<RegisterPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default MainContentContainer