import { useState } from 'react';
import MainContentBox from "../MainContentBox" 
import PriceAreaChart from '../displays/graphs/PriceAreaChart'
import CryptoSearchBar from "../searchBars/CryptoSearchBar"
import useBackendCrypto from '../../../hooks/useBackendCrypto';
import { extractCoinChartData, adjustDataByTime, extractLatestCryptoPrice, extractCoinInfo } from '../../../utils/cryptoData';
import TimeFrameOptions from '../TimeFrameOptions';
import type {CryptoGraphTimeFrame} from '../../../utils/cryptoData';
import ApiDataBox from '../displays/ApiDataBox';
import CoinInfoBox from '../displays/CoinInfoBox'
import useCoinInfo from '../../../hooks/useCoinInfo'
import { makeTickFormatter } from '../../../utils/chartFormat';


const CryptoBrowsePage = () => {
  const [ selectedCrypto, setSelectedCrypto ] = useState('')
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<CryptoGraphTimeFrame>('1Y')

  const {data, loading, error} = useBackendCrypto(selectedCrypto)
  const chartData = data ? extractCoinChartData(data) : []
  const chartDataTimeFrame = adjustDataByTime(chartData, selectedTimeFrame)
  const timeRange: CryptoGraphTimeFrame[] = ['1M', '3M', '6M', '1Y']

  const { data: infoRaw, loading: infoLoading, error: infoError } = useCoinInfo(selectedCrypto)
  const info = infoRaw ? extractCoinInfo(infoRaw) : null

  const latestCryptoPrice = data ? extractLatestCryptoPrice(data) : null
  const cryptoTitle = latestCryptoPrice
  ? `${info?.name ?? selectedCrypto}    $${latestCryptoPrice.price.toFixed(2)}`
  : 'Current Price'

  let content
  if (loading) {
    content = <MainContentBox>Please wait while we fetch the data...</MainContentBox>
  } else if (error) {
    content = <MainContentBox>{`An error occurred: ${error.message}`}</MainContentBox>
  } else {
    content = (
    <div>
       <MainContentBox>
        <ApiDataBox title={cryptoTitle} loading={loading} error={error}>
          <div>As of {latestCryptoPrice ? new Date(latestCryptoPrice.date).toLocaleDateString('en-GB') : ''}</div>
        </ApiDataBox>
        <PriceAreaChart 
        chartData = {chartDataTimeFrame} 
        XAxisDataKey = "date" 
        areaDataKey = "price"
        tickFormatter={makeTickFormatter(selectedTimeFrame)}
        />
        <TimeFrameOptions
          selectedTimeFrame={selectedTimeFrame}
          onOptionClick={(time) => {
            setSelectedTimeFrame(time);}}
          timeRange = {timeRange}
          />
      </MainContentBox>

      <MainContentBox>
        <ApiDataBox title={info?.name ?? 'Coin info'} loading={infoLoading} error={infoError}>
          <CoinInfoBox info={info} />
        </ApiDataBox>
      </MainContentBox>
    </div>
  )
  }

  return (
    <div>
      <MainContentBox>
        <CryptoSearchBar onCryptoSelect={setSelectedCrypto} />
      </MainContentBox>
      {content}
    </div>
  )
}

export default CryptoBrowsePage
