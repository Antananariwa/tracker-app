import { useState } from 'react';
import './StockSearchBar.css';
import useSymbolCatalog from '../../hooks/useSymbolCatalog.js'


const StockSearchBar = ({ onStockSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, loading, error } = useSymbolCatalog('stocks');
  
  const filteredStocks = data
  ? data.filter((company) => company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || company.name.toLowerCase().includes(searchTerm.toLowerCase()) )
  : []

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleStockClick = (symbol) => {
    onStockSelect(symbol)
    setShowDropdown(false);
  };

  if (error) {
  return <div className="stock-search-bar-div">Error loading stock list.</div>
  } 
  
  return (
    <div className="stock-search-bar-div">
      <input 
        type="text"
        placeholder={loading ? 'Loading stock list...' : 'Type stock name...'}
        disabled={loading}
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