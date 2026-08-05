import './PortfolioPage.css'; 
import MainContentBox from "../MainContentBox";
import { useFullPortfolio } from "../../../hooks/usePortfolio";
import { preparePortfolioAssets } from "../../../utils/stockData";
import usePortfolioStockAssetsPrices from '../../../hooks/usePortfolioAssetsPrices';

const PortfolioAssetsPage = () => {
  const { data, loading, error } = useFullPortfolio();
  const assets = data ? preparePortfolioAssets(data) : [];

  let assetArray: string[] = [];
  for (let i = 0; i < assets.length; i++){
    assetArray.push(assets[i].symbol)
  }

  const { data: quotePrices, loading: quotePricesLoading, error: quotePricesError } = usePortfolioStockAssetsPrices(assetArray);

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
        <div className = "portfolioTableScroll">
          <table className="portfolioHoldingsTable">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th className="portfolioNum">Quantity</th>
                <th className="portfolioNum">Avg Buy Price</th>
                <th className="portfolioNum">Purchase Cost</th>
                <th>status</th>
                <th>acquiredAt</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Gain/Loss</th>
                <th>Gain/Loss percent</th>
                <th>Category</th>
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
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
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
