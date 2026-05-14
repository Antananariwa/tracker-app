import type { LatestStockPrice } from "../../../utils/stockData"

type LatestPriceDisplayProps = {
  latestPriceData: LatestStockPrice | null
}

const LatestPriceDisplay = ({ latestPriceData }: LatestPriceDisplayProps) => {
  if (!latestPriceData) return <div></div>

  return (
      <div className="latestPriceDisplay">
        <p><strong>Open:</strong> {latestPriceData.open} </p>
        <p><strong>High:</strong> {latestPriceData.high} </p>
        <p><strong>Low:</strong> {latestPriceData.low} </p>
      </div>
  )
}

export default LatestPriceDisplay