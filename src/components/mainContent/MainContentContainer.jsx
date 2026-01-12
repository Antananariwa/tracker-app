import React from 'react';
import './MainContentContainer.css';
import MainContentBox from './MainContentBox.jsx';
import { useMainPage } from '../../context/MainPageContext.jsx';
import PrimaryGraph from './displays/groups/PrimaryGraph.jsx';
import StockMainPage from './StockMainPage.jsx';


const MainContentContainer = () => {
const { selectedMainPage } = useMainPage();

  return (
    <div className="MainContentConainerDiv">
        {selectedMainPage === 'stocks' && <StockMainPage/>}
        {selectedMainPage === 'crypto' && <CryptoMainPage />}
        {selectedMainPage === 'commodities' && <CommoditiesMainPage />}
        {selectedMainPage === 'realEstate' && <RealEstateMainPage />}
    </div>
  )
}

export default MainContentContainer
