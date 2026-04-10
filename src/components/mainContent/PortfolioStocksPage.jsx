import React from 'react';
import './PortfolioStocksPage.css';
import MainContentBox from './MainContentBox';
import { preparePortfolioAssets } from '../../utils/stockData.js'

const PortfolioStocksPage = () => {
  const data = [];
  const assets = preparePortfolioAssets(data);

  return (
    <div>
      <MainContentBox>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>avgBuyPrice</th>
              <th>purchaseCost</th>
              <th>status</th>
              <th>acquiredAt</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.symbol}>
                <td>{asset.symbol}</td>
                <td>{asset.name}</td>
                <td>{asset.quantity}</td>
                <td>{asset.avgBuyPrice}</td>
                <td>{asset.purchaseCost}</td>
                <td>{asset.status}</td>
                <td>{asset.acquiredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MainContentBox>
      
    </div>
  )
}

export default PortfolioStocksPage
