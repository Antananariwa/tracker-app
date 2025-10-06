import React from 'react'
import './MainContentBox.css'

const MainContentBox = ({ title = "", children }) => {
  return (
    <div className="MainContentBoxDiv">
      {title && <h2>{title}</h2>}
      <div className="boxContent">
        {children}
      </div>
    </div>
  )
}

export default MainContentBox