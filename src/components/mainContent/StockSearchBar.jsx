import { useState } from 'react';
import './StockSearchBar.css';
import stock_list from '../../data/stocks/stockList.json'


const STOCK_LIST = [
  { symbol: 'IBM', name: 'International Business Machines' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'TSLA', name: 'Tesla Inc.' }
];


const StockSearchBar = ({ onStockSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const filteredStocks = stock_list.filter((company) => company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || company.name.toLowerCase().includes(searchTerm.toLowerCase()) )

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleStockClick = (symbol) => {
    onStockSelect(symbol)
    setShowDropdown(false);
  };

  return (
    <div className="stock-search-bar-div">
      <input 
        type="text"
        placeholder="Type stock name..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      
      {showDropdown && searchTerm.length > 0 && filteredStocks.length > 0 && (
        <div className="dropdown">
          {filteredStocks.map(stock => (
            <div 
              key={stock.symbol}
              onClick={() => handleStockClick(stock.symbol)}
              className="dropdown-item"
            >
              {stock.symbol} - {stock.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearchBar;