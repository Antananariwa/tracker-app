import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox'
import { useMainPage } from '../../context/MainPageContext';

type LeftMenuContainerProps = {
  title?: string
}

const LeftMenuContainer = ({
  title = ""
  }: LeftMenuContainerProps) => {
  const {setSelectedMainPage} = useMainPage();
  
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}

      <LeftMenuBox 
        groupName="Portfolio" 
        optionName={["Stocks", "Option2", "Option3", "Option4"]} 
        onOptionClick={()=>setSelectedMainPage('portfolioStocks')}
      />
      <LeftMenuBox 
        groupName="Browse" 
        optionName={["Stocks", "Commodities", "Crypto"]}
        onOptionClick={()=>setSelectedMainPage('stocks')}
        />
      <LeftMenuBox groupName="Account" optionName={["Option13", "Option14", "Option15", "Option16"]}/>
      <LeftMenuBox groupName="Settings" optionName={["Option17", "Option18", "Option19",]}/>
    </div>
  )
}

export default LeftMenuContainer
