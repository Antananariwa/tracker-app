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
  for (let i = 0; i < allAssets.length; i++){
    const a = allAssets[i]
    a.currentValue != null ? accountValue += a.currentValue : null;
  }
  accountValue = Number(accountValue.toFixed(2));

  let accountReturnNumber = 0;
  for (let i=0; i<allAssets.length; i++){
    const b = allAssets[i];
    b.gainLoss != null ? accountReturnNumber += b.gainLoss : null;
  }
  accountReturnNumber = Number(accountReturnNumber.toFixed(2));

  let assetsTotalCost = 0;
  for (let i=0; i<allAssets.length; i++){
    const c = allAssets[i];
    c.purchaseCost ? assetsTotalCost += c.purchaseCost : null;
  }

  let accountRetrunPercentage = 0;
  assetsTotalCost ? accountRetrunPercentage = accountReturnNumber/assetsTotalCost * 100 : 0;

  let averageCAGR = 0; // Σ(CAGR_i × purchaseCost_i) / Σ(purchaseCost_i)
  let sumCAGR_pur_cost = 0;
  let sumPurchaseCost = 0;

  for (let i = 0; i < allAssets.length; i++){
    const asset = allAssets[i]
    const acquiredDateMs = new Date(asset.acquiredAt).getTime();
    const nowMs = Date.now();
    const years = (nowMs - acquiredDateMs) / (1000 * 60 * 60 * 24 * 365.25);

    let CAGR = 0;
    if ( asset.currentValue ){
    asset.purchaseCost ?  CAGR = ((asset.currentValue / asset.purchaseCost) ** (1/years)) - 1 : null
    }

    if(asset.currentValue && asset.purchaseCost && years > 0){
    sumCAGR_pur_cost += CAGR * asset.purchaseCost
    sumPurchaseCost += asset.purchaseCost     
    }
  }

  sumPurchaseCost != 0 ? averageCAGR =  sumCAGR_pur_cost / sumPurchaseCost  : null
  const avgCAGR_3Y = (((1 + averageCAGR ) **  3) - 1) * 100
  const avgCAGR_5Y = (((1 + averageCAGR ) **  5) - 1) * 100


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
            <p>Account Value</p>
            <p>Total ${accountValue}</p>
            <p>Return ${accountReturnNumber} {accountRetrunPercentage.toFixed(2)}% </p>
          </div>
        </MainContentBox>
        <MainContentBox className='summarySmallBox'>
          <div>
            <p>Avg Return</p>
            <p>1Y {(averageCAGR*100).toFixed(2)}%</p>
            <p>3Y {avgCAGR_3Y.toFixed(2)}%</p>
            <p>5Y {avgCAGR_5Y.toFixed(2)}%</p>
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
