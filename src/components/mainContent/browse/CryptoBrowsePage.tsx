import { useState } from 'react';
import MainContentBox from "../MainContentBox" 
import PrimaryGraph from "../displays/groups/PrimaryGraph"
import CryptoSearchBar from "../searchBars/CryptoSearchBar"
import useBackendCrypto from '../../../hooks/useBackendCrypto';
import { extractLatestCryptoPrice } from '../../../utils/cryptoData';


const CryptoBrowsePage = () => {
  const [ selectedCrypto, setSelectedCrypto ] = useState('')
  const [ selectedTimeFrame, setSelectedTimeFrame ] = useState<GraphTimeFrame>('')

  const {data, loading, error} = useBackendCrypto(selectedCrypto)

  const latestPriceData = data ? extractLatestCryptoPrice(data) : null
  const latestPriceTitle = latestPriceData && metaData ? metaData.symbol + "          $" + latestPriceData.price : "Current Price"
  const chartData = data ? extractChartPriceByDateWeekly(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)

  return (
    <div>
      <MainContentBox>
        <CryptoSearchBar onCryptoSelect = {setSelectedCrypto}/>
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
