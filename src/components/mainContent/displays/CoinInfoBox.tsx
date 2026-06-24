import type { CoinInfo } from '../../../utils/cryptoData'

type CoinInfoBoxProps = {
  info: CoinInfo | null
}

const CoinInfoBox = ({ info }: CoinInfoBoxProps) => {
  if (!info) return <div>No coin info available.</div>

  return (
    <div className="CoinInfoBox-div">
      <div className="CoinInfoBox-header">
        <img src={info.image} alt={info.name} width="48" height="48" />
        <h2>{info.name} ({info.symbol})</h2>
        {info.marketCapRank !== null && <span>Rank #{info.marketCapRank}</span>}
      </div>

      <p>{info.description}</p>

      <ul>
        {/* <li>Current price: ${info.currentPrice.toLocaleString()}</li> */}
        <li>24h change: {info.priceChange24h.toFixed(2)}%</li>
        <li>Market cap: ${info.marketCap.toLocaleString()}</li>
        <li>24h volume: ${info.totalVolume.toLocaleString()}</li>
        <li>All-time high: ${info.ath.toLocaleString()}</li>
        <li>Circulating supply: {info.circulatingSupply.toLocaleString()}</li>
        <li>Max supply: {info.maxSupply !== null ? info.maxSupply.toLocaleString() : 'No cap'}</li>
        <li>Genesis date: {info.genesisDate ?? 'Unknown'}</li>
        <li>Categories: {info.categories.join(', ')}</li>
      </ul>

      <div className="CoinInfoBox-links">
        {info.homepage && <a href={info.homepage} target="_blank" rel="noopener noreferrer">Website</a>}
        {info.whitepaper && <a href={info.whitepaper} target="_blank" rel="noopener noreferrer">Whitepaper</a>}
        {info.github && <a href={info.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
      </div>
    </div>
  )
}

export default CoinInfoBox