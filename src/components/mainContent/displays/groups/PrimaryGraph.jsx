import { useState } from 'react';
import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox.jsx';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph.jsx';
import LatestPriceDisplay from '../LatestPriceDisplay';
import useAlphaVantage from '../../../../hooks/useAlphaVantage.js';
import { extractStockOverview, extractLatestStockPrice, extractChartPriceByDate, adjustDataByTime } from '../../../../utils/stockData';
import TimeFrameOptions from '../../TimeFrameOptions.jsx';
import useMockAlphaVantage from '../../../../hooks/useMockAlphaVantage.js';


const PrimaryGraph = () => {
  const [selectedStock, setSelectedStock] = useState('IBM');
  const [selectedFunction, setSelectedFunction] = useState('TIME_SERIES_DAILY');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('3M')
  const [selectedOutputSize, setSelectedOutputSize] = useState()

  // const {data, loading, error} = useAlphaVantage(selectedFunction, selectedStock, null, selectedOutputSize)
  const {data, loading, error} = useMockAlphaVantage(selectedFunction, selectedStock, null, selectedOutputSize) 
  const metaData = data ? extractStockOverview(data) : null
  const latestPriceData = data ? extractLatestStockPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + " Latest Price: $" + latestPriceData.close : "Current Price"
  const chartData = data ? extractChartPriceByDate(data) : []
  const chartDataTimeFrame = chartData ? adjustDataByTime(chartData, selectedTimeFrame) : []




  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph chartData = {chartDataTimeFrame}/>
      <TimeFrameOptions onOptionClick={(time, OutputSize) => {
        setSelectedTimeFrame(time);
        setSelectedOutputSize(OutputSize || null);
      }}/>
    </div>
  )
}

export default PrimaryGraph