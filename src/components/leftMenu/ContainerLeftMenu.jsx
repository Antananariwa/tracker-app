import React from 'react'
import './ContainerLeftMenu.css'
import BoxLeftMenu from './BoxLeftMenu.jsx'

const ContainerLeftMenu = ({title = ""}) => {
  return (
    <div className="containerLeftMenu">
      {title && <h2>{title}</h2>}
      <BoxLeftMenu groupName="Group 1" optionName={["Option1", "Option2", "Option3", "Option4"]}/>
      <BoxLeftMenu groupName="Group 2" optionName={["Option5", "Option8"]}/>
      <BoxLeftMenu groupName="Group 3" />
      <BoxLeftMenu groupName="Group 4" optionName={["Option13", "Option14", "Option15", "Option16"]}/>
      <BoxLeftMenu groupName="Group 5" optionName={["Option17", "Option18", "Option19",]}/>
    </div>
  )
}

export default ContainerLeftMenu
