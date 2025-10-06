import React from 'react'
import './MainContentContainer.css'
import MainContentBox from './MainContentBox'
import ApiDataBox from './ApiDataBox'
import { extractStockOverview, extractLatestStockPrice } from '../../utils/stockData'
import MetaDataDisplay from '../dataDisplays/MetaDataDisplay'
import LatestPriceDisplay from '../dataDisplays/LatestPriceDisplay'


const MainContentContainer = ({ data, loading, error }) => {
  const metaData = data ? extractStockOverview(data) : null
  const metaDataTitle = metaData ? metaData.symbol + " - Overview" : "Stock Overview"

  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + " Latest Price: $" + latestPriceData.close : "Current Price"
  
  return (
    <div className="ConainerMainContentDiv">
      <ApiDataBox 
        title= {metaDataTitle} 
        loading={loading} 
        error={error}
      >
        <MetaDataDisplay metaData={metaData} />
      </ApiDataBox>

      <ApiDataBox 
        title= {latestPriceTitle} 
        loading={loading} 
        error={error}
      >
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox>
      
      <MainContentBox title="Investment Overview" >
        Your portfolio performance summary...
      </MainContentBox>
      
      <MainContentBox title="Recent Activity">
        "Your recent transactions and updates..."
      </MainContentBox>
      
    </div>
  )
}

export default MainContentContainer