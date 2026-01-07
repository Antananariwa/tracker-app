import React from 'react'
import './MainContentBox.css'




const MainContentBox = ({ children }) => {
  return (
    <div className="MainContentBoxDiv">
      {children}
    </div>
  )
}

export default MainContentBox

