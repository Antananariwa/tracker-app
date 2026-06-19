import { useState } from 'react';
import MainContentBox from "../MainContentBox" 
import DemoGraph from '../displays/graphs/AreaResponsiveContainerGraph'
import CryptoSearchBar from "../searchBars/CryptoSearchBar"
import useBackendCrypto from '../../../hooks/useBackendCrypto';
import { extractCoinChartData, adjustDataByTime } from '../../../utils/cryptoData';
import TimeFrameOptions from '../TimeFrameOptions';
import type {CryptoGraphTimeFrame} from '../../../utils/cryptoData';


const CryptoBrowsePage = () => {
  const [ selectedCrypto, setSelectedCrypto ] = useState('')
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<CryptoGraphTimeFrame>('1Y')

  const {data, loading, error} = useBackendCrypto(selectedCrypto)

  const chartData = data ? extractCoinChartData(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)

  const timeRange: CryptoGraphTimeFrame[] = ['1M', '3M', '6M', '1Y']

  return (
    <div>
      <MainContentBox>
        <CryptoSearchBar onCryptoSelect = {setSelectedCrypto}/>
      </MainContentBox>

       <MainContentBox>
        <DemoGraph 
        chartData = {chartDataTimeFrame} 
        XAxisDataKey = "date" 
        areaDataKey = "price"
        />
        <TimeFrameOptions
          selectedTimeFrame={selectedTimeFrame}
          onOptionClick={(time) => {
            setSelectedTimeFrame(time);}}
          timeRange = {timeRange}
          />
       </MainContentBox>
    </div>

    //   <MainContentBox>
    //     <Example coin info component />
    //   </MainContentBox>

    //   <MainContentBox>
    //     <Example coin info component />
    //   </MainContentBox>

    // </div>
  )
}

export default CryptoBrowsePage
