import { useState } from 'react'
import './App.css'
import Header from './components/headerSection/Header.jsx'
import ContainerLeftMenu from './components/leftMenu/ContainerLeftMenu.jsx'
import ContainerMainContent from './components/mainContent/ContainerMainContent.jsx'

function App() {

  return (
    <>
    <div className="bodyDiv">
      <ContainerLeftMenu title="Left Container"/>
      <div className="rightSideDiv">
        <Header title="Investments Calculator" subtitle="Table with individual assets"/>
        <ContainerMainContent />
      </div>
    </div>
    </>
  )
}

export default App
