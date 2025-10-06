import React from 'react'
import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox.jsx'

const LeftMenuContainer = ({title = ""}) => {
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}
      <LeftMenuBox groupName="Group 1" optionName={["Option1", "Option2", "Option3", "Option4"]}/>
      <LeftMenuBox groupName="Group 2" optionName={["Option5", "Option8"]}/>
      <LeftMenuBox groupName="Group 3" />
      <LeftMenuBox groupName="Group 4" optionName={["Option13", "Option14", "Option15", "Option16"]}/>
      <LeftMenuBox groupName="Group 5" optionName={["Option17", "Option18", "Option19",]}/>
    </div>
  )
}

export default LeftMenuContainer
