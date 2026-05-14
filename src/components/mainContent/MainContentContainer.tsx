import './MainContentContainer.css';
import { useMainPage } from '../../context/MainPageContext';
import StockMainPage from './StockMainPage';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import CryptoBrowsePage from './CryptoBrowsePage';
import PortfolioStocksPage from './PortfolioStocksPage'


const MainContentContainer = () => {
const { selectedMainPage } = useMainPage();

  return (
    <div className="MainContentConainerDiv">
        {/* Portfolio group */}
        {selectedMainPage === 'portfolioStocks' && <PortfolioStocksPage />}

        {/* Browse group */}
        {selectedMainPage === 'stocks' && <StockMainPage />}
        {selectedMainPage === 'crypto' && <CryptoBrowsePage />}

        {/* Account group */}
        {selectedMainPage === 'login' && <LoginPage/>}
        {selectedMainPage === 'register' && <RegisterPage/>}
    </div>
  )
}

export default MainContentContainer
