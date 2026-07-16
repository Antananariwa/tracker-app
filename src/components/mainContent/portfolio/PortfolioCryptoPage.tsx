import MainContentBox from '../MainContentBox';
import { preparePortfolioAssets } from '../../../utils/stockData'
import usePortfolio from '../../../hooks/usePortfolio'
import './PortfolioCryptoPage.css';

const PortfolioCryptoPage = () => {
  const { data, loading, error } = usePortfolio('crypto');
  const assets = data ? preparePortfolioAssets(data) : [];
  let content;

  if (loading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox>{`An error occurred: ${error}`}</MainContentBox>
    )
  } else {
    content = (
      <MainContentBox>
        <div className="cryptoTableScroll">
          <table className="cryptoHoldingsTable">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th className="cryptoNum">Quantity</th>
                <th className="cryptoNum">avgBuyPrice</th>
                <th className="cryptoNum">purchaseCost</th>
                <th>status</th>
                <th>acquiredAt</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.symbol}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td className="cryptoNum">{asset.quantity}</td>
                  <td className="cryptoNum">{asset.avgBuyPrice}</td>
                  <td className="cryptoNum">{asset.purchaseCost}</td>
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
