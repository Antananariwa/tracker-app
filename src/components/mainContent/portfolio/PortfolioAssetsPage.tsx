import './PortfolioPage.css'; 
import './PortfolioAssetsPage.css'
import MainContentBox from "../MainContentBox";
import { useFullPortfolio } from "../../../hooks/usePortfolio";
import { preparePortfolioAssets, mergeFullAssetsWithStockQuotes, mergeFullAssetsWithCryptoQuotes } from "../../../utils/stockData";
import usePortfolioStockQuotes from '../../../hooks/usePortfolioStockQuotes';
import usePortfolioCryptoQuotes from '../../../hooks/usePortfolioCryptoQuotes';
import { formatCurrency, formatPercentChange } from '../../../utils/format';

const PortfolioAssetsPage = () => {
  const { data, loading, error } = useFullPortfolio();
  const assets = data ? preparePortfolioAssets(data) : [];


  let assetArraySymbol: string[] = [];
  for (let i = 0; i < assets.length; i++){
    data ? assetArraySymbol.push(assets[i].symbol): null
  };

  let assetArrayCoinId: string[] = [];
  for (let i = 0; i < assets.length; i++){
    if (assets[i].coinId != null){
    assetArrayCoinId.push(assets[i].coinId)
    }
  };


  const { data: quoteStockPrices, loading: quoteStockPricesLoading, error: quoteStockPricesError } = usePortfolioStockQuotes(assetArraySymbol);
  const {data: quoteCryptoPrices, loading: QuoteCryptoPricesLoading, error: quoteCryptopricesError } = usePortfolioCryptoQuotes(assetArrayCoinId);

  const mergedAssetsStocks = data && quoteStockPrices ? mergeFullAssetsWithStockQuotes(quoteStockPrices, data) : [];
  const mergedAssetsCrypto = data && quoteCryptoPrices ? mergeFullAssetsWithCryptoQuotes(quoteCryptoPrices, data) : [];
  const allAssets = [...mergedAssetsStocks, ...mergedAssetsCrypto]
  let accountValue = 0;
  if (allAssets){
    for (let i = 0; i < allAssets.length; i++){
      allAssets.currentValue ? accountValue += allAssets[i].currentValue : null;
    }
  }

  let accountReturnNumber = 0;
  let accountRetrunPercentage = '0%';

  let content;

  if (loading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (quoteStockPricesLoading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (QuoteCryptoPricesLoading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox>{`An error occurred: ${error}`}</MainContentBox>
    )
  } else if (quoteStockPricesError) {
    content = (
      <MainContentBox>{`An error occurred: ${quoteStockPricesError}`}</MainContentBox>
    )
  } else if (quoteCryptopricesError) {
    content = (
      <MainContentBox>{`An error occurred: ${quoteStockPricesError}`}</MainContentBox>
    )
  } else {
    content = (
      <MainContentBox className="tableWidth">
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
              {allAssets.map(asset => (
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
                  <td className="portfolioNum">
                    {asset.gainLoss ? (
                      <span className={`delta-shape ${asset.gainLoss > 0 ? 'up' : 'down'}`}>
                        {(asset.gainLoss > 0 ? '+' : '') + formatCurrency(asset.gainLoss, 'USD')}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="portfolioNum">
                    {asset.gainLossRatio ? (
                      <span className={`delta-shape ${asset.gainLossRatio > 0 ? 'up' : 'down'}`}>
                        {formatPercentChange(asset.gainLossRatio)}
                      </span>
                    ) : 'N/A'}
                  </td>
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
      <div className='summaryPanel tableWidth'>
        <MainContentBox className='summaryBigBox'>
          <div>
            Account Value
            {accountValue}
            All time return 
          </div>
        </MainContentBox>
        <MainContentBox className='summarySmallBox'>
          <div>
            'Avg Annual Return'
            your average return
            some index comparison
          </div>
        </MainContentBox>
        <MainContentBox className='summarySmallBox'>
          <div>
             'Allocation'
              Small pie chart of currentValue by category
              Footer line: 5 positions · 3 stocks · 2 crypto
          </div>
        </MainContentBox>
        <MainContentBox className='summarySmallBox'>
          <div>
            'Today change'
            number: +$311.22
            Percentage with perhaps arrow.
          </div>
        </MainContentBox>
      </div>
      {content}
    </div>
  )
}

export default PortfolioAssetsPage
