import type { CoinInfo } from '../../../utils/cryptoData'
import { formatBigCurrency } from '../../../utils/format'
import './InfoBox.css'

type CoinInfoBoxProps = {
  info: CoinInfo | null
}

const CoinInfoBox = ({ info }: CoinInfoBoxProps) => {
  if (!info) return <div>No coin info available.</div>

  const change = info.priceChange24h

  const rows = [
    { label: '24h change', value: <span className={`delta-shape ${change >= 0 ? 'up' : 'down'}`}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span> },
    { label: 'Market cap', value: formatBigCurrency(info.marketCap) },
    { label: '24h volume', value: formatBigCurrency(info.totalVolume) },
    { label: 'All-time high', value: '$' + info.ath.toLocaleString() },
    { label: 'Circulating supply', value: info.circulatingSupply.toLocaleString() },
    { label: 'Max supply', value: info.maxSupply !== null ? info.maxSupply.toLocaleString() : 'No cap' },
    { label: 'Genesis date', value: info.genesisDate ?? 'Unknown' },
  ]

  return (
    <div>
      <div className="infoBoxHead">
        <img className="infoBoxLogo" src={info.image} alt={info.name} />
        <div>
          <p className="infoBoxName">{info.name}</p>
          <p className="infoBoxSub">{info.symbol}{info.marketCapRank !== null ? ' · Rank #' + info.marketCapRank : ''}</p>
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

      <div className="infoTags">
        {info.categories.map(category => (
          <span key={category} className="infoTag">{category}</span>
        ))}
      </div>

      <div className="infoLinks">
        {info.homepage && <a href={info.homepage} target="_blank" rel="noopener noreferrer">Website</a>}
        {info.whitepaper && <a href={info.whitepaper} target="_blank" rel="noopener noreferrer">Whitepaper</a>}
        {info.github && <a href={info.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
      </div>
    </div>
  )
}

export default CoinInfoBox