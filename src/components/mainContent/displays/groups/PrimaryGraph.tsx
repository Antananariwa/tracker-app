import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph';
import LatestPriceDisplay from '../LatestPriceDisplay';
import TimeFrameOptions from '../../TimeFrameOptions';
import type { LatestStockPrice, ChartPriceByDateWeekly } from '../../../../utils/stockData'

type PrimaryGraphProps = {
  latestPriceTitle: string
  loading: boolean
  error: Error | null
  latestPriceData: LatestStockPrice | null
  chartDataTimeFrame: ChartPriceByDateWeekly
}

const PrimaryGraph = ({latestPriceTitle, loading, error, latestPriceData, chartDataTimeFrame, setSelectedTimeFrame, setSelectedOutputSize, selectedTimeFrame}: PrimaryGraphProps) => {
  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph chartData = {chartDataTimeFrame}/>
      <TimeFrameOptions
        selectedTimeFrame={selectedTimeFrame}
        onOptionClick={(time, OutputSize) => {
          setSelectedTimeFrame(time);
          setSelectedOutputSize(OutputSize || null);
      }}/>
    </div>
  )
}

export default PrimaryGraph