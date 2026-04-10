import React from 'react';
import './MainContentContainer.css';
import MainContentBox from './MainContentBox.jsx';
import { useMainPage } from '../../context/MainPageContext.jsx';
import PrimaryGraph from './displays/groups/PrimaryGraph.jsx';
import StockMainPage from './StockMainPage.jsx';
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx';
import CryptoBrowsePage from './CryptoBrowsePage.jsx';
import PortfolioStocksPage from './PortfolioStocksPage.jsx'


const MainContentContainer = () => {
const { selectedMainPage } = useMainPage();

  return (
    <div className="MainContentConainerDiv">
        {/* Portfolio group */}
        {selectedMainPage === 'portfolioStocks' && <PortfolioStocksPage />}

        {/* Browse group */}
        {selectedMainPage === 'stocks' && <StockMainPage />}
        {selectedMainPage === 'crypto' && <CryptoBrowsePage />}
        {selectedMainPage === 'commodities' && <CommoditiesMainPage />}
        {selectedMainPage === 'realEstate' && <RealEstateMainPage />}

        {/* Account group */}
        {selectedMainPage === 'login' && <LoginPage/>}
        {selectedMainPage === 'register' && <RegisterPage/>}
    </div>
  )
}

export default MainContentContainer
