import type { StockInfo } from '../../../utils/stockData'
import { formatCurrency, formatBigCurrency } from '../../../utils/format'
import './InfoBox.css'

type StockInfoBoxProps = {
  info: StockInfo | null
}

const StockInfoBox = ({ info }: StockInfoBoxProps) => {
  if (!info) return <div>No company info available.</div>

  const rows = [
    { label: 'Industry', value: info.industry ?? 'N/A' },
    { label: 'Market cap', value: info.marketCap !== null ? formatBigCurrency(info.marketCap) : 'N/A' },
    { label: 'P/E (TTM)', value: info.peRatio !== null ? info.peRatio.toFixed(2) : 'N/A' },
    { label: 'EPS (TTM)', value: info.eps !== null ? formatCurrency(info.eps, 'USD') : 'N/A' },
    { label: '52W high', value: info.weekHigh52 !== null ? formatCurrency(info.weekHigh52, 'USD') : 'N/A' },
    { label: '52W low', value: info.weekLow52 !== null ? formatCurrency(info.weekLow52, 'USD') : 'N/A' },
    { label: 'Dividend yield', value: info.dividendYield !== null ? info.dividendYield.toFixed(2) + '%' : 'N/A' },
    { label: 'Beta', value: info.beta !== null ? info.beta.toFixed(2) : 'N/A' },
    { label: 'Country', value: info.country ?? 'N/A' },
    { label: 'IPO', value: info.ipo ?? 'N/A' },
  ]

  return (
    <div>
      <div className="infoBoxHead">
        {info.logo && <img className="infoBoxLogo" src={info.logo} alt={info.name} />}
        <div>
          <p className="infoBoxName">{info.name}</p>
          <p className="infoBoxSub">{info.ticker}</p>
        </div>
      </div>

      <ul className="infoList">
        {rows.map(row => (
          <li key={row.label}>
            <span className="infoLabel">{row.label}</span>
            <span className="infoValue">{row.value}</span>
          </li>
        ))}
      </ul>

      {info.website && (
        <div className="infoLinks">
          <a href={info.website} target="_blank" rel="noopener noreferrer">Website</a>
        </div>
      )}
    </div>
  )
}

export default StockInfoBox