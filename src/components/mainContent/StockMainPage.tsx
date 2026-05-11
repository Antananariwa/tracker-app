import { useState } from 'react';
import PrimaryGraph from './displays/groups/PrimaryGraph'
import MainContentBox from './MainContentBox'
import ApiDataBox from './displays/ApiDataBox';
import LatestPriceDisplay from './displays/LatestPriceDisplay';
import { extractStockOverview, extractLatestStockPrice, adjustDataByTime, extractChartPriceByDateWeekly, type GraphTimeFrame } from '../../utils/stockData';
import MetaDataDisplay from './displays/MetaDataDisplay';
import StockSearchBar from './StockSearchBar';
import useBackendStock from '../../hooks/useBackendStock';

const StockMainPage = () => {
  const [ selectedStock, setSelectedStock ] = useState('')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState<GraphTimeFrame>('3M')

  const {data, loading, error} = useBackendStock(selectedStock)
  const metaData = data ? extractStockOverview(data) : null
  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + "          $" + latestPriceData.close : "Current Price"
  const chartData = data ? extractChartPriceByDateWeekly(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame) : []
  

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
