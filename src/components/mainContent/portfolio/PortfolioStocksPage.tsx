import './PortfolioPage.css';
import MainContentBox from '../MainContentBox';
import { preparePortfolioAssets } from '../../../utils/stockData'
import { usePortfolio } from '../../../hooks/usePortfolio'

// Does this page even make sense? simple filtering options make this kinda redundant
// If page stays there are 2 options:
// - stays as the separate component, with its own code, styling etc. Copied in spirit, but not connected to the main.
// - it is somehow conditionally rendered or connected to the main in other ways.
// second options seems more interesting, but how would it be differently than using a filter on a single page??
// category pages could trim those info boxes, just the graph and table of assets,
// but they would have to keep just the important return evaluation informations
// I am thinking more about not including filter in the main pages
// The separate dislays for all categories seems usefull. The filter on the main page can do 2 things:
// - show just some small area of the page filtered, like just a table with graph
// - if it does change everything on the page, perhaps a had separation would be better
// - those differences would be large enough to make navigation easier by switching pages

 

const PortfolioStocksPage = () => {
  const { data, loading, error } = usePortfolio('stock');
  const assets = data ? preparePortfolioAssets(data) : [];

  let content;

  if (loading) {
    content = (
      <MainContentBox>"Please wait while we fetch the data..."</MainContentBox>
    )
  } else if (error) {
    content = (
      <MainContentBox>{`An error occurred: ${error}`}</MainContentBox>
    )
  } else {
    content = (
      <MainContentBox>
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
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.symbol}>
                  <td>{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td className="portfolioNum">{asset.quantity}</td>
                  <td className="portfolioNum">{asset.avgBuyPrice}</td>
                  <td className="portfolioNum">{asset.purchaseCost}</td>
                  <td>{asset.status}</td>
                  <td>{asset.acquiredAt}</td>
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
      {content}
    </div>
  )
}

export default PortfolioStocksPage
