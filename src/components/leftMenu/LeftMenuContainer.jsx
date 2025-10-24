import React from 'react'
import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox.jsx'

const LeftMenuContainer = ({title = "", onPageChange }) => {
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}

      <LeftMenuBox 
        groupName="Portfolio" 
        optionName={["Stocks", "Option2", "Option3", "Option4"]} 
        onOptionClick={onPageChange}
      />
      <LeftMenuBox groupName="Tools" optionName={["Option5", "Option8"]}/>
      <LeftMenuBox groupName="Account" optionName={["Option13", "Option14", "Option15", "Option16"]}/>
      <LeftMenuBox groupName="Settings" optionName={["Option17", "Option18", "Option19",]}/>
    </div>
  )
}

export default LeftMenuContainer
