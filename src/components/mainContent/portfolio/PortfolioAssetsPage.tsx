import './PortfolioPage.css'; 
import './PortfolioAssetsPage.css'
import MainContentBox from "../MainContentBox";
import { useFullPortfolio } from "../../../hooks/usePortfolio";
import { preparePortfolioAssets, mergeFullAssetsWithStockQuotes, mergeFullAssetsWithCryptoQuotes } from "../../../utils/stockData";
import usePortfolioStockQuotes from '../../../hooks/usePortfolioStockQuotes';
import usePortfolioCryptoQuotes from '../../../hooks/usePortfolioCryptoQuotes';
import { formatCurrency, formatPercentChange } from '../../../utils/format';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PriceAreaChart from '../displays/graphs/PriceAreaChart';
import { extractChartPriceByDateWeekly } from '../../../utils/stockData';
import useBackendStock from '../../../hooks/useBackendStock';
import useBackendPortfolioAssets from '../../../hooks/useBackendPortfolioAssets.ts';

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

  sumPurchaseCost != 0 ? averageCAGR =  sumCAGR_pur_cost * 100 / sumPurchaseCost  : null
  const avgCAGR_3Y = (((1 + averageCAGR ) **  3) - 1) * 100
  const avgCAGR_5Y = (((1 + averageCAGR ) **  5) - 1) * 100


  const pieData = allAssets
  .filter(a => a.currentValue != null)
  .map(a => ({ name: a.symbol, value: a.currentValue as number }))
  .sort((a, b) => b.value - a.value);

  const sliceColor = (index: number) => `hsl(${(index * 137.508) % 360}, 65%, 60%)`;

	// Summary portfolio graphs
	const {data: dataStock, loading: loadingStock, error: errorStock} = useBackendPortfolioAssets(allStocks)
	const chartData = data ? extractChartPriceByDateWeekly(dataStock) : []

	// Biga problema - existing backend fetch operates on an individually selected positions
	// It is already looping over every position to fetch quotes, could use similar logic
	// If we are going to get all of historical data of all the assets, what was the point of using a separate quote fetch
	// It is possible to make a little ForcenCD. Since we are mostly operationg on the demo account, most of the heavy lifting can be done beforehand.
	// Concern about ForcenCD path - what about period between last comprehensive update of assets history and current fetch.
	// Could set up automatic fetches to keep demo account updated. Should be possible within free limits
	// Actually why not to try automatically updating as much of the cache as possible. We are worling within limits anyway, might as well use them to the max.
	// Would be enough to run scheduled refreshes during few night hours.
	// Otherwise how to make it usable in real world by unpredictible user?



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
            <p>Avg Annual Return</p>
            <p>1Y {averageCAGR.toFixed(2)}%</p>
            <p>3Y {avgCAGR_3Y.toFixed(2)}%</p>
            <p>5Y {avgCAGR_5Y.toFixed(2)}%</p>
          </div>
        </MainContentBox>
        <MainContentBox className='summarySmallBox'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 14, height: '100%' }}>
            <div style={{ width: 110, height: 110, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="82%">
                    {pieData.map((slice, index) => (
                      <Cell key={slice.name} fill={sliceColor(index)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {pieData.map((slice, index) => (
              <li key={slice.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: sliceColor(index) }} />
                <span>{((slice.value / accountValue) * 100).toFixed(1)}%</span>
                <span>{slice.name}</span>
              </li>
              ))}
            </ul>
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
      <div className='summaryGraph'>
				<MainContentBox>
          <PriceAreaChart
            chartData={data of the entire portfolio}
            XAxisDataKey="date"
            areaDataKey="close"
            tickFormatter={pickDateLabel(selectedTimeFrame)}
          />
				</MainContentBox>
      </div>
      {content}
    </div>
  )
}

export default PortfolioAssetsPage
