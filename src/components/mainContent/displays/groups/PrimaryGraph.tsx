import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph';
import LatestPriceDisplay from '../LatestPriceDisplay';
import TimeFrameOptions from '../../TimeFrameOptions';
import type { LatestStockPrice, ChartPriceByDateWeekly, GraphTimeFrame } from '../../../../utils/stockData'

type PrimaryGraphProps = {
  latestPriceTitle: string
  loading: boolean
  error: Error | null
  latestPriceData: LatestStockPrice | null
  chartDataTimeFrame: ChartPriceByDateWeekly
  setSelectedTimeFrame: (value: GraphTimeFrame) => void
  selectedTimeFrame: GraphTimeFrame
}

const PrimaryGraph = ({latestPriceTitle, loading, error, latestPriceData, chartDataTimeFrame, setSelectedTimeFrame, selectedTimeFrame}: PrimaryGraphProps) => {
  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph chartData = {chartDataTimeFrame}/>
      <TimeFrameOptions
        selectedTimeFrame={selectedTimeFrame}
        onOptionClick={(time) => {
          setSelectedTimeFrame(time);
      }}/>
    </div>
  )
}

export default PrimaryGraph