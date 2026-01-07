import React from 'react';
import './MainContentContainer.css';
import { extractStockOverview, extractLatestStockPrice, extractChartPriceByDate } from '../../utils/stockData';
import MetaDataDisplay from './displays/MetaDataDisplay.jsx';
import LatestPriceDisplay from './displays/LatestPriceDisplay.jsx';
import DemoGraph from './displays/graphs/AreaResponsiveContainerGraph.jsx';
import DefaultDisplay from './displays/DefaultDisplay.jsx';
import ApiDataBox from './displays/ApiDataBox.jsx';
import MainContentBox from './MainContentBox.jsx';
import { useStock } from '../../context/StockContext';
import useAlphaVantage from '../../hooks/useAlphaVantage';
import PrimaryGraph from './displays/groups/PrimaryGraph.jsx';


const MainContentContainer = () => {
  // const { selectedStock, selectedFunction } = useStock();
  // const { data, loading, error } = useAlphaVantage(selectedFunction, selectedStock);
  // const metaData = data ? extractStockOverview(data) : null
  // const metaDataTitle = metaData ? metaData.symbol + " - Overview" : "Stock Overview"
  // const chartData = data ? extractChartPriceByDate(data) : []
  // const latestPriceData = data ? extractLatestStockPrice(data) : null
  // const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + " Latest Price: $" + latestPriceData.close : "Current Price"
  
  return (
    <div className="MainContentConainerDiv">
      {/*
      <MainContentBox> 
        <ApiDataBox title = {metaDataTitle} loading = {loading} error = {error}>
          <MetaDataDisplay metaData={metaData} />
        </ApiDataBox>
      </MainContentBox>

      <MainContentBox>
        <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
          <LatestPriceDisplay latestPriceData={latestPriceData} />
        </ApiDataBox> 
      </MainContentBox>
      
      <MainContentBox>
        <DefaultDisplay title = "Investment Overview">
          Your portfolio performance summary...
        </DefaultDisplay>
      </MainContentBox>

      <MainContentBox>
        <DefaultDisplay title = "Recent Activity">
          Your recent transactions and updates...
        </DefaultDisplay>
      </MainContentBox>

     <MainContentBox>
        <DemoGraph chartData = {chartData}>
        </DemoGraph>
      </MainContentBox> */}

      <MainContentBox>
        <PrimaryGraph/>
      </MainContentBox>

    </div>
  )
}

export default MainContentContainer
