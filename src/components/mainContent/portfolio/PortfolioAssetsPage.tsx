import { useState } from 'react';
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
import { extractChartPriceByDateWeekly, mergeGraphStocksData, adjustDataByTime, buildCryptoWeeklySeries, type ChartPriceByDateWeekly, type StockGraphTimeFrame } from '../../../utils/stockData'
import useBackendPortfolioAssets from '../../../hooks/useBackendPortfolioAssets.ts';
import TimeFrameOptions from '../TimeFrameOptions'
import { pickDateLabel } from '../../../utils/chartFormat'
import useBackendPortfolioCrypto from '../../../hooks/useBackendPortfolioCrypto.ts';
import { extractCoinChartData } from '../../../utils/cryptoData'


const PortfolioAssetsPage = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<StockGraphTimeFrame>('20Y')
  const timeRange: StockGraphTimeFrame[] = ["1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "10Y", "20Y"]
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

  let avgRate = 0; // weighted average annual return as a decimal, e.g. 0.125
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

  sumPurchaseCost != 0 ? avgRate = sumCAGR_pur_cost / sumPurchaseCost : null
  const averageCAGR = avgRate * 100
  const avgCAGR_3Y = (((1 + avgRate) ** 3) - 1) * 100
  const avgCAGR_5Y = (((1 + avgRate) ** 5) - 1) * 100


  const pieData = allAssets
  .filter(a => a.currentValue != null)
  .map(a => ({ name: a.symbol, value: a.currentValue as number }))
  .sort((a, b) => b.value - a.value);

  const valueByCategory = allAssets.reduce((acc: { [category: string]: number }, asset) => {
    if (asset.currentValue != null) {
      acc[asset.category] = (acc[asset.category] || 0) + asset.currentValue
    }
    return acc
  }, {})

  const categoryData = Object.entries(valueByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const categoryLabels: { [category: string]: string } = {
    stock: 'Stocks',
    crypto: 'Crypto',
    real_estate: 'Real Estate',
  }

  const sliceColor = (index: number) => `hsl(${(index * 137.508) % 360}, 65%, 60%)`;

	// Summary portfolio graphs
  const allSymbols = mergedAssetsStocks.map(asset => asset.symbol)
	const {data: stockTradingData, loading: loadingStock, error: errorStock} = useBackendPortfolioAssets(allSymbols)
  const { data: cryptoTradingData } = useBackendPortfolioCrypto(assetArrayCoinId)


  const trimmedStockTradingData: { [symbol: string]: ChartPriceByDateWeekly[] | null } = {};
  for (let i=0; i < allSymbols.length; i++){
    const singleStock = stockTradingData ? stockTradingData[allSymbols[i]] : null
    const trimmedWeekly = singleStock ? extractChartPriceByDateWeekly(singleStock) : null
    trimmedStockTradingData[allSymbols[i]] = trimmedWeekly
  }

  const weeklyDateSet = new Set<string>()
  let cutoff = ''
  for (let i = 0; i < allSymbols.length; i++){
    const series = trimmedStockTradingData[allSymbols[i]]
    if (!series || series.length === 0) continue
    for (const point of series){
      weeklyDateSet.add(point.date)
    }
    const lastDate = series[series.length - 1].date
    if (cutoff === '' || lastDate < cutoff) cutoff = lastDate
  }
  const weeklyDates = Array.from(weeklyDateSet).sort((a, b) => a.localeCompare(b))

  const cryptoAssets = assets.filter(asset => asset.category === 'crypto')
  const cryptoWeeklyBySymbol: { [symbol: string]: ChartPriceByDateWeekly[] | null } = {}
  for (let i = 0; i < cryptoAssets.length; i++){
    const asset = cryptoAssets[i]
    const raw = cryptoTradingData ? cryptoTradingData[asset.coinId] : null
    const daily = raw ? extractCoinChartData(raw) : []
    cryptoWeeklyBySymbol[asset.symbol] = buildCryptoWeeklySeries(daily, weeklyDates, asset.acquiredAt, asset.avgBuyPrice)
  }

  const summaryGraphData = mergeGraphStocksData({ ...trimmedStockTradingData, ...cryptoWeeklyBySymbol }, allAssets).filter(point => point.date <= cutoff)

  const summaryGraphDataTimeFrame = adjustDataByTime(summaryGraphData, selectedTimeFrame)
  let todayChange = 0
  for (let i = 0; i < mergedAssetsStocks.length; i++){
    const asset = mergedAssetsStocks[i]
    const quote = quoteStockPrices ? quoteStockPrices[asset.symbol] : null
    if (quote) todayChange += quote.change * asset.quantity
  }

  const lastValue = summaryGraphData[summaryGraphData.length - 1]?.close ?? 0
  const monthAgoValue = summaryGraphData[summaryGraphData.length - 5]?.close ?? 0
  const monthChange = lastValue - monthAgoValue

  let content;

  if (loading) {
    content = (
      <MainContentBox className="padded">"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (quoteStockPricesLoading) {
    content = (
      <MainContentBox className="padded">"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (QuoteCryptoPricesLoading) {
    content = (
      <MainContentBox className="padded">"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox className="padded">{`An error occurred: ${error}`}</MainContentBox>
    )
  } else if (quoteStockPricesError) {
    content = (
      <MainContentBox className="padded">{`An error occurred: ${quoteStockPricesError}`}</MainContentBox>
    )
  } else if (quoteCryptopricesError) {
    content = (
      <MainContentBox className="padded">{`An error occurred: ${quoteStockPricesError}`}</MainContentBox>
    )
  } else {
    content = (
      <MainContentBox className="padded">
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
    <div className="portfolioLayout">
      <div className="portfolioMain">

        <div className="summaryRow">
          <MainContentBox className="padded summaryTile heroTile">
            <p className="tileLabel">Account Value</p>
            <p className="tileValue">{formatCurrency(accountValue, 'USD')}</p>
            <p className="tileDelta">
              <span className={`delta-shape ${accountReturnNumber >= 0 ? 'up' : 'down'}`}>
                {accountReturnNumber >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(accountReturnNumber), 'USD')} ({accountReturnNumber >= 0 ? '+' : ''}{accountRetrunPercentage.toFixed(2)}%)
              </span>
              <span className="tilePeriod">overall</span>
            </p>
          </MainContentBox>

          <MainContentBox className="padded summaryTile">
            <p className="tileLabel">Avg Annual Return</p>
            <p className={`tileValue ${averageCAGR >= 0 ? 'up' : 'down'}`}>{averageCAGR >= 0 ? '+' : ''}{averageCAGR.toFixed(2)}%</p>
            <p className="tileSub">3Y <span className={avgCAGR_3Y >= 0 ? 'up' : 'down'}>{avgCAGR_3Y >= 0 ? '+' : ''}{avgCAGR_3Y.toFixed(2)}%</span></p>
            <p className="tileSub">5Y <span className={avgCAGR_5Y >= 0 ? 'up' : 'down'}>{avgCAGR_5Y >= 0 ? '+' : ''}{avgCAGR_5Y.toFixed(2)}%</span></p>
          </MainContentBox>

          <MainContentBox className="padded summaryTile">
            <p className="tileLabel">Wealth Distribution</p>
            <div className="donutTileBody">
              <div className="donutMini">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="85%">
                      {categoryData.map((slice, index) => (
                        <Cell key={slice.name} fill={sliceColor(index)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="donutLegend">
                {categoryData.map((slice, index) => (
                  <li key={slice.name}>
                    <span className="legendDot" style={{ background: sliceColor(index) }} />
                    <span className="legendName">{categoryLabels[slice.name] ?? slice.name}</span>
                    <span className="legendValue">{formatCurrency(slice.value, 'USD')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MainContentBox>

          <MainContentBox className="padded summaryTile">
            <p className="tileLabel">Change</p>
            <p className="tileDelta">
              <span className={`delta-shape ${todayChange >= 0 ? 'up' : 'down'}`}>
                {todayChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(todayChange), 'USD')}
              </span>
              <span className="tilePeriod">today</span>
            </p>
            <p className="tileDelta">
              <span className={`delta-shape ${monthChange >= 0 ? 'up' : 'down'}`}>
                {monthChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(monthChange), 'USD')}
              </span>
              <span className="tilePeriod">month</span>
            </p>
          </MainContentBox>
        </div>

        <MainContentBox className="padded">
          <TimeFrameOptions
            selectedTimeFrame={selectedTimeFrame}
            onOptionClick={(time) => setSelectedTimeFrame(time)}
            timeRange={timeRange}
          />
          <PriceAreaChart
            chartData={summaryGraphDataTimeFrame}
            XAxisDataKey="date"
            areaDataKey="close"
            tickFormatter={pickDateLabel(selectedTimeFrame)}
          />
        </MainContentBox>

        {content}
      </div>

      <MainContentBox className="padded">
        <p className="tileLabel">Asset Allocation</p>
        <div className="wheelWrap">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="0%" outerRadius="90%">
                {pieData.map((slice, index) => (
                  <Cell key={slice.name} fill={sliceColor(index)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="wheelLegend">
          {pieData.map((slice, index) => (
            <li key={slice.name}>
              <span className="legendDot" style={{ background: sliceColor(index) }} />
              <span className="legendName">{slice.name}</span>
              <span className="legendPct">{((slice.value / accountValue) * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </MainContentBox>
    </div>
  )
}

export default PortfolioAssetsPage
