import { useState } from 'react';
import MainContentBox from "../MainContentBox" 
import DemoGraph from
import CryptoSearchBar from "../searchBars/CryptoSearchBar"
import useBackendCrypto from '../../../hooks/useBackendCrypto';
import { extractCoinChartData } from '../../../utils/cryptoData';


const CryptoBrowsePage = () => {
  const [ selectedCrypto, setSelectedCrypto ] = useState('')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState<GraphTimeFrame>('')

  const {data, loading, error} = useBackendCrypto(selectedCrypto)

  const chartData = data ? extractCoinChartData(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)

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
