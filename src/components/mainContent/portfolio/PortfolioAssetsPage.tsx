import './PortfolioPage.css'; 
import MainContentBox from "../MainContentBox";
import { useFullPortfolio } from "../../../hooks/usePortfolio";
import { preparePortfolioAssets, mergeFullAssetsWithStockQuotes } from "../../../utils/stockData";
import usePortfolioStockQuotes from '../../../hooks/usePortfolioStockQuotes';
import { formatCurrency, formatPercentChange } from '../../../utils/format';

const PortfolioAssetsPage = () => {
  const { data, loading, error } = useFullPortfolio();
  const assets = data ? preparePortfolioAssets(data) : [];

  let assetArray: string[] = [];
  for (let i = 0; i < assets.length; i++){
    assetArray.push(assets[i].symbol)
  };

  const { data: quotePrices, loading: quotePricesLoading, error: quotePricesError } = usePortfolioStockQuotes(assetArray);

  const mergedAssets = data && quotePrices ? mergeFullAssetsWithStockQuotes(quotePrices, data) : [];

  let content;

  if (loading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (quotePricesLoading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox>{`An error occurred: ${error}`}</MainContentBox>
    )
  } else if (quotePricesError) {
    content = (
      <MainContentBox>{`An error occurred: ${quotePricesError}`}</MainContentBox>
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
                <th className="portfolioNum">Current Price</th>
                <th className="portfolioNum">Current Value</th>
                <th className="portfolioNum">Gain/Loss</th>
                <th className="portfolioNum">Gain/Loss percent</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {mergedAssets.map(asset => (
                <tr key={asset.symbol}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td className="portfolioNum">{asset.quantity}</td>
                  <td className="portfolioNum">{formatCurrency(asset.avgBuyPrice, 'USD')}</td>
                  <td className="portfolioNum">{formatCurrency(asset.purchaseCost, 'USD')}</td>
                  <td>{asset.status}</td>
                  <td>{asset.acquiredAt}</td>
                  <td className="portfolioNum">{asset.currentPrice ? formatCurrency(asset.currentPrice, 'USD') : 'N/A'}</td>
                  <td className="portfolioNum">{asset.currentValue ? formatCurrency(asset.currentValue, 'USD') : 'N/A'}</td>
                  <td className="portfolioNum">{asset.gainLoss ? (asset.gainLoss > 0 ? '+' : '') + formatCurrency(asset.gainLoss, 'USD') : 'N/A'}</td>
                  <td className="portfolioNum">{asset.gainLossRatio? formatPercentChange(asset.gainLossRatio) : 'N/A'}</td>
                  <td>{asset.category}</td>
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
