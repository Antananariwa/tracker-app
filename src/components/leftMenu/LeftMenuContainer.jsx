import React from 'react'
import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox.jsx'
import { useMainPage } from '../../context/MainPageContext';

const LeftMenuContainer = ({title = "", onPageChange }) => {
  const {setSelectedMainPage} = useMainPage();
  
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}

      <LeftMenuBox 
        groupName="Portfolio" 
        optionName={["Stocks", "Option2", "Option3", "Option4"]} 
        onOptionClick={onPageChange}
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
