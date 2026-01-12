import React from 'react'
import { useState } from 'react';
import PrimaryGraph from './displays/groups/PrimaryGraph'
import MainContentBox from './MainContentBox'
import ApiDataBox from './displays/ApiDataBox.jsx';
import LatestPriceDisplay from './displays/LatestPriceDisplay';
import useAlphaVantage from '../../hooks/useAlphaVantage.js';
import { extractStockOverview, extractLatestStockPrice, extractChartPriceByDate, adjustDataByTime, extractChartPriceByDateWeekly } from '../../utils/stockData';
import useMockAlphaVantage from '../../hooks/useMockAlphaVantage.js';
import MetaDataDisplay from './displays/MetaDataDisplay.jsx';
import StockSearchBar from './StockSearchBar.jsx';
import useMockPersonalDB from '../../hooks/useMockPersonalDB.js'

const StockMainPage = () => {
  const [ selectedStock, setSelectedStock ] = useState('')
  const [ selectedFunction, setSelectedFunction ] = useState('TIME_SERIES_DAILY')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState('3M')
  const [ selectedOutputSize, setSelectedOutputSize ] = useState()
  console.log(selectedStock)

  
  // use this line instead after testing - const {data, loading, error} = useAlphaVantage(selectedFunction, selectedStock, null, selectedOutputSize)
  // const {data, loading, error} = useMockAlphaVantage(selectedFunction, selectedStock, null, selectedOutputSize)
  const {data, loading, error} = useMockPersonalDB(selectedFunction, selectedStock)

  const metaData = data ? extractStockOverview(data) : null
  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + " Latest Price: $" + latestPriceData.close : "Current Price"
  // const chartData = data ? extractChartPriceByDate(data) : []
  const chartData = data ? extractChartPriceByDateWeekly(data) : []
  const chartDataTimeFrame = chartData ? adjustDataByTime(chartData, selectedTimeFrame) : []









  console.log(data)
  console.log("chartData" + chartData)
  console.log("chartDataTimeFrame" + chartDataTimeFrame)
  
  return (
    <div className="StockMainPage-Div">
      <MainContentBox>
        <StockSearchBar onStockSelect = {setSelectedStock}/>
      </MainContentBox>

      <MainContentBox>
        <PrimaryGraph
          latestPriceTitle = {latestPriceTitle}
          loading = {loading}
          error = {error}
          latestPriceData = {latestPriceData}
          chartDataTimeFrame = {chartDataTimeFrame}
          setSelectedTimeFrame = {setSelectedTimeFrame}
          setSelectedOutputSize = {setSelectedOutputSize}
        />
      </MainContentBox>

      <MainContentBox>
        <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
          <LatestPriceDisplay latestPriceData={latestPriceData} />
        </ApiDataBox> 
      </MainContentBox>

      <MainContentBox>
        <MetaDataDisplay metaData = {metaData} />
      </MainContentBox>

    </div>
  )
}

export default StockMainPage
