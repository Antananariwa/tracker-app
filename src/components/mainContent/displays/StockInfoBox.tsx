import type { ReactNode } from 'react'
import type { StockInfo } from '../../../utils/stockData'
import { formatCurrency, formatBigCurrency } from '../../../utils/format'
import './InfoBox.css'

type StockInfoBoxProps = {
  info: StockInfo | null
  price: number | null
}

const StockInfoBox = ({ info, price }: StockInfoBoxProps) => {
  if (!info) return <div>No company info available.</div>

  const chip = (value: number) => (
    <span className={`delta-shape ${value >= 0 ? 'up' : 'down'}`}>{value >= 0 ? '+' : ''}{value.toFixed(2)}%</span>
  )

  const signed = (value: number) => (
    <span className={value >= 0 ? 'up' : 'down'}>{value >= 0 ? '+' : ''}{value.toFixed(2)}%</span>
  )

  let peValue: ReactNode = 'N/A'
  if (info.peRatio !== null) peValue = info.peRatio.toFixed(2)
  else if (info.eps !== null && info.eps <= 0) peValue = <span className="down">No profit</span>

  let rangePosition: number | null = null
  if (info.weekHigh52 !== null && info.weekLow52 !== null && price !== null && info.weekHigh52 > info.weekLow52) {
    const position = ((price - info.weekLow52) / (info.weekHigh52 - info.weekLow52)) * 100
    rangePosition = Math.min(100, Math.max(0, position))
  }

  const rows = [
    { label: '1Y return', value: info.priceReturn1Y !== null ? chip(info.priceReturn1Y) : 'N/A' },
    { label: 'YTD', value: info.priceReturnYTD !== null ? chip(info.priceReturnYTD) : 'N/A' },
    { label: 'vs S&P 500 (1Y)', value: info.vsSp500_1Y !== null ? signed(info.vsSp500_1Y) : 'N/A' },
    { label: 'Market cap', value: info.marketCap !== null ? formatBigCurrency(info.marketCap) : 'N/A' },
    { label: 'P/E (TTM)', value: peValue },
    { label: 'EPS (TTM)', value: info.eps !== null ? formatCurrency(info.eps, 'USD') : 'N/A' },
    { label: 'Revenue growth', value: info.revenueGrowth !== null ? signed(info.revenueGrowth) : 'N/A' },
    { label: 'EPS growth', value: info.epsGrowth !== null ? signed(info.epsGrowth) : 'N/A' },
    { label: 'Net margin', value: info.netMargin !== null ? <span className={info.netMargin >= 0 ? 'up' : 'down'}>{info.netMargin.toFixed(2)}%</span> : 'N/A' },
    { label: 'Dividend yield', value: info.dividendYield !== null ? info.dividendYield.toFixed(2) + '%' : 'N/A' },
    { label: 'Beta', value: info.beta !== null ? info.beta.toFixed(2) : 'N/A' },
    { label: 'Industry', value: info.industry ?? 'N/A' },
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

      {rangePosition !== null && info.weekLow52 !== null && info.weekHigh52 !== null && (
        <div className="rangeBar">
          <div className="rangeBarTrack">
            <span className="rangeBarMarker" style={{ left: rangePosition + '%' }} />
          </div>
          <div className="rangeBarLabels">
            <span>{formatCurrency(info.weekLow52, 'USD')}</span>
            <span>52 week range</span>
            <span>{formatCurrency(info.weekHigh52, 'USD')}</span>
          </div>
        </div>
      )}

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