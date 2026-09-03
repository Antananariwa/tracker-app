import MainContentBox from '../MainContentBox';
import { preparePortfolioAssets } from '../../../utils/stockData'
import { usePortfolio } from '../../../hooks/usePortfolio'
import './PortfolioPage.css';

// pretty much same questions about this as with stock page
// look PortfolioStocksPage fore more comments

const PortfolioCryptoPage = () => {
  const { data, loading, error } = usePortfolio('crypto');
  const assets = data ? preparePortfolioAssets(data) : [];
  let content;

  if (loading) {
    content = (
      <MainContentBox className="padded">"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox className="padded">{`An error occurred: ${error}`}</MainContentBox>
    )
  } else {
    content = (
      <MainContentBox className="padded">
        <div className="portfolioTableScroll">
          <table className="portfolioHoldingsTable">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th className="portfolioNum">Quantity</th>
                <th className="portfolioNum">avgBuyPrice</th>
                <th className="portfolioNum">purchaseCost</th>
                <th>status</th>
                <th>acquiredAt</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.symbol}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td className="portfolioNum">{asset.quantity}</td>
                  <td className="portfolioNum">{asset.avgBuyPrice}</td>
                  <td className="portfolioNum">{asset.purchaseCost}</td>
                  <td>{asset.status}</td>
                  <td>{asset.acquiredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContentBox>
    )
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default PortfolioCryptoPage
