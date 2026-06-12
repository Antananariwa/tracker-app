import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph';
import LatestPriceDisplay from '../LatestPriceDisplay';
import TimeFrameOptions from '../../TimeFrameOptions';
import type { LatestStockPrice, GraphTimeFrame } from '../../../../utils/stockData'
import type { ExampleProps } from '../graphs/AreaResponsiveContainerGraph'

type PrimaryGraphProps = {
  latestPriceTitle: string
  loading: boolean
  error: Error | null
  latestPriceData: LatestStockPrice | null
  chartDataTimeFrame: ExampleProps['chartData']
  setSelectedTimeFrame: (value: GraphTimeFrame) => void
  selectedTimeFrame: GraphTimeFrame
  XAxisDataKey: ExampleProps['XAxisDataKey']
  areaDataKey: ExampleProps['areaDataKey']
}

const PrimaryGraph = ({latestPriceTitle, loading, error, latestPriceData, chartDataTimeFrame, setSelectedTimeFrame, selectedTimeFrame, XAxisDataKey, areaDataKey}: PrimaryGraphProps) => {
  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph chartData = {chartDataTimeFrame} XAxisDataKey = {XAxisDataKey} areaDataKey = {areaDataKey}/>
      <TimeFrameOptions
        selectedTimeFrame={selectedTimeFrame}
        onOptionClick={(time) => {
          setSelectedTimeFrame(time);
      }}/>
    </div>
  )
}

export default PrimaryGraph