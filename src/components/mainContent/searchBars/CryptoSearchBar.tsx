import { useState } from 'react';
import './CryptoSearchBar.css';
import useSymbolCatalog, { type CryptoSymbol } from '../../../hooks/useSymbolCatalog'

type CryptoSearchBarProps = {
  onCryptoSelect: (symbol: string) => void
}

const CryptoSearchBar = ({ onCryptoSelect }: CryptoSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, loading, error } = useSymbolCatalog('crypto');
  const crypto = data as CryptoSymbol[] | null

  
  const filteredCrypto = crypto
  ? crypto.filter((coin) => coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || coin.name.toLowerCase().includes(searchTerm.toLowerCase()))
  : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleCryptoClick = (symbol: string) => {
    onCryptoSelect(symbol)
    setShowDropdown(false);
  };

  if (error) {
  return <div className="crypto-search-bar-div">Error loading crypto list.</div>
  } 
  
  return (
    <div className="crypto-search-bar-div">
      <input 
        type="text"
        placeholder={loading ? 'Loading crypto list...' : 'Type crypto name...'}
        disabled={loading}
        value={searchTerm}
        onChange={handleInputChange}
      />
      
      {showDropdown && searchTerm.length > 0 && filteredCrypto.length > 0 && (
        <div className="dropdown">
          {filteredCrypto.map(crypto => (
            <div 
              key={crypto.coin_id}
              onClick={() => handleCryptoClick(crypto.coin_id)}
              className="dropdown-item"
            >
              {crypto.symbol} - {crypto.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoSearchBar;