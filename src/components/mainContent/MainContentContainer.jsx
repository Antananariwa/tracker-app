import React from 'react';
import './MainContentContainer.css';
import MainContentBox from './MainContentBox.jsx';
import { useMainPage } from '../../context/MainPageContext.jsx';
import PrimaryGraph from './displays/groups/PrimaryGraph.jsx';
import StockMainPage from './StockMainPage.jsx';
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx';
import CryptoBrowsePage from './CryptoBrowsePage.jsx';


const MainContentContainer = () => {
const { selectedMainPage } = useMainPage();

  return (
    <div className="MainContentConainerDiv">
        {selectedMainPage === 'stocks' && <StockMainPage/>}
        {selectedMainPage === 'crypto' && <CryptoBrowsePage />}
        {selectedMainPage === 'commodities' && <CommoditiesMainPage />}
        {selectedMainPage === 'realEstate' && <RealEstateMainPage />}

        {selectedMainPage === 'login' && <LoginPage/>}
        {selectedMainPage === 'register' && <RegisterPage/>}
    </div>
  )
}

export default MainContentContainer
