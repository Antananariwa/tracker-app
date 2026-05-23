import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox'
import { useMainPage } from '../../context/MainPageContext';
import { useNavigate } from 'react-router-dom';

type LeftMenuContainerProps = {
  title?: string
}

const LeftMenuContainer = ({
  title = ""
  }: LeftMenuContainerProps) => {
  const {setSelectedMainPage} = useMainPage();
  const navigate = useNavigate();
  
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}

      <LeftMenuBox 
        groupName="Portfolio" 
        optionName={["Stocks", "Option2", "Option3", "Option4"]} 
        onOptionClick={()=>navigate('/portfolio/stocks')}
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
