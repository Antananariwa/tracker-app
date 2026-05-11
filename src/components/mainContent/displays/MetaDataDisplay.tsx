import type { StockOverview } from '../../../utils/stockData'

type MetaDataDisplayProps = {
  metaData: StockOverview | null
}

const MetaDataDisplay = ({ metaData }: MetaDataDisplayProps) => {
  if (!metaData) return <div>No meta data available</div>

  return (
      <div className="metaData">
        <p><strong>Information:</strong> {metaData.information}</p>
        <p><strong>Symbol:</strong> {metaData.symbol}</p>
        <p><strong>Last Updated:</strong> {metaData.lastRefreshed}</p>
        <p><strong>Time Zone:</strong> {metaData.timeZone}</p>
      </div>
  )
}

export default MetaDataDisplay