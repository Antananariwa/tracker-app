import { useState } from 'react';
import ApiDataBox from '../displays/ApiDataBox';
import LatestPriceDisplay from '../displays/LatestPriceDisplay';
import PriceAreaChart from '../displays/graphs/PriceAreaChart';
import TimeFrameOptions from '../TimeFrameOptions';
import MainContentBox from '../MainContentBox'
import { extractStockOverview, extractLatestStockPrice, adjustDataByTime, extractChartPriceByDateWeekly, type StockGraphTimeFrame } from '../../../utils/stockData';
import MetaDataDisplay from '../displays/MetaDataDisplay';
import StockSearchBar from '../searchBars/StockSearchBar';
import useBackendStock from '../../../hooks/useBackendStock';
import { pickDateLabel } from '../../../utils/chartFormat';
import './StockBrowsePage.css';
import Header from '../../ui/Header';

const StockBrowsePage = () => {
  const [ selectedStock, setSelectedStock ] = useState('')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState<StockGraphTimeFrame>('3M')

  const {data, loading, error} = useBackendStock(selectedStock)
  const metaData = data ? extractStockOverview(data) : null
  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + "          $" + latestPriceData.close : "Current Price"
  const chartData = data ? extractChartPriceByDateWeekly(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)
  
  const timeRange: StockGraphTimeFrame[] = ["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "10Y", "20Y"]

  return (
    <div className="StockMainPage-Div">
      <Header title="Search Stocks" subtitle="Browse Stock Market"/>

      <MainContentBox>
        <StockSearchBar onStockSelect = {setSelectedStock}/>
      </MainContentBox>

      <MainContentBox>
        <div >
          <div className='stockTopPanel'>
            <ApiDataBox title={latestPriceTitle} loading={loading} error={error}>
              <LatestPriceDisplay latestPriceData={latestPriceData} />
            </ApiDataBox>

            <TimeFrameOptions
              selectedTimeFrame={selectedTimeFrame}
              onOptionClick={(time) => setSelectedTimeFrame(time)}
              timeRange={timeRange}
            />
          </div>

          <PriceAreaChart
            chartData={chartDataTimeFrame}
            XAxisDataKey="date"
            areaDataKey="close"
            tickFormatter={pickDateLabel(selectedTimeFrame)}
          />
        </div>
      </MainContentBox>

      <MainContentBox>
        <MetaDataDisplay metaData = {metaData} />
      </MainContentBox>

    </div>
  )
}

export default StockBrowsePage
