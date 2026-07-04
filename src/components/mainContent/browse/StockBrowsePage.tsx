import { useState } from 'react';
import PrimaryGraph from '../displays/groups/PrimaryGraph'
import MainContentBox from '../MainContentBox'
import { extractStockOverview, extractLatestStockPrice, adjustDataByTime, extractChartPriceByDateWeekly, type StockGraphTimeFrame } from '../../../utils/stockData';
import MetaDataDisplay from '../displays/MetaDataDisplay';
import StockSearchBar from '../searchBars/StockSearchBar';
import useBackendStock from '../../../hooks/useBackendStock';

const StockBrowsePage = () => {
  const [ selectedStock, setSelectedStock ] = useState('')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState<StockGraphTimeFrame>('3M')

  const {data, loading, error} = useBackendStock(selectedStock)
  const metaData = data ? extractStockOverview(data) : null
  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + "          $" + latestPriceData.close : "Current Price"
  const chartData = data ? extractChartPriceByDateWeekly(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)
  

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
          latestPriceData={latestPriceData}
          chartDataTimeFrame = {chartDataTimeFrame}
          setSelectedTimeFrame = {setSelectedTimeFrame}
          selectedTimeFrame={selectedTimeFrame}
          XAxisDataKey="date"
          areaDataKey="close"
        />
      </MainContentBox>

      <MainContentBox>
        <MetaDataDisplay metaData = {metaData} />
      </MainContentBox>

    </div>
  )
}

export default StockBrowsePage
