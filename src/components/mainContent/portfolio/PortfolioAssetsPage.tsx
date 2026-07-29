import MainContentBox from "../MainContentBox";
import { usePortfolio } from "../../../hooks/usePortfolio";
import { preparePortfolioAssets } from "../../../utils/stockData";

const PortfolioAssetsPage = () => {
  const { data, loading, error } = usePortfolio('*');
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
        <div className = "assetTableScroll">
          <table className="assetHoldingsTable">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th className="stockNum">Quantity</th>
                <th className="stockNum">Avg Buy Price</th>
                <th className="stockNum">Purchase Cost</th>
                <th>status</th>
                <th>acquiredAt</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Gain/Loss</th>
                <th>Gain/Loss percent</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.symbol}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td className="stockNum">{asset.quantity}</td>
                  <td className="stockNum">{asset.avgBuyPrice}</td>
                  <td className="stockNum">{asset.purchaseCost}</td>
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

export default PortfolioAssetsPage
