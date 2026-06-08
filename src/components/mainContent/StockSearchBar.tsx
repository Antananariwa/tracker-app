import { useState } from 'react';
import './StockSearchBar.css';
import useSymbolCatalog, { type StockSymbol } from '../../hooks/useSymbolCatalog'

type StockSearchBarProps = {
  onStockSelect: (symbol: string) => void
}

const StockSearchBar = ({ onStockSelect }: StockSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, loading, error } = useSymbolCatalog('stocks');
  const stocks = data as StockSymbol[] | null

  
  const filteredStocks = stocks
  ? stocks.filter((company) => company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || company.name.toLowerCase().includes(searchTerm.toLowerCase()) )
  : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleStockClick = (symbol: string) => {
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