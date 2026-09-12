import type { StockOverview } from '../../../utils/stockData'

type MetaDataDisplayProps = {
  metaData: StockOverview | null
}

const MetaDataDisplay = ({ metaData }: MetaDataDisplayProps) => {
  if (!metaData) return <div>No meta data available</div>

  return (
      <div className="metaData">
        <p><strong>Symbol:</strong> {metaData.symbol}</p>
        <p><strong>Exchange:</strong> {metaData.exchange}</p>
        <p><strong>Type:</strong> {metaData.type}</p>
        <p><strong>Currency:</strong> {metaData.currency}</p>
        <p><strong>Time Zone:</strong> {metaData.timeZone}</p>
      </div>
  )
}

export default MetaDataDisplay