import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph';
import LatestPriceDisplay from '../LatestPriceDisplay';
import TimeFrameOptions from '../../TimeFrameOptions';
import type { LatestStockPrice, StockGraphTimeFrame } from '../../../../utils/stockData'
import type { ExampleProps } from '../graphs/AreaResponsiveContainerGraph'

type PrimaryGraphProps = {
  latestPriceTitle: string
  loading: boolean
  error: Error | null
  latestPriceData: LatestStockPrice | null
  chartDataTimeFrame: ExampleProps['chartData']
  setSelectedTimeFrame: (value: StockGraphTimeFrame) => void
  selectedTimeFrame: StockGraphTimeFrame
  XAxisDataKey: ExampleProps['XAxisDataKey']
  areaDataKey: ExampleProps['areaDataKey']
}

const PrimaryGraph = ({latestPriceTitle, loading, error, latestPriceData, chartDataTimeFrame, setSelectedTimeFrame, selectedTimeFrame, XAxisDataKey, areaDataKey}: PrimaryGraphProps) => {
  const timeRange: StockGraphTimeFrame[] = ["1M", "3M", "6M", "1Y", "3Y", "5Y", "10Y", "20Y"]
  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph 
      chartData = {chartDataTimeFrame} 
      XAxisDataKey = {XAxisDataKey} 
      areaDataKey = {areaDataKey}/>
      <TimeFrameOptions
        selectedTimeFrame={selectedTimeFrame}
        onOptionClick={(time) => {
          setSelectedTimeFrame(time);}}
        timeRange = {timeRange}
        />
    </div>
  )
}

export default PrimaryGraph