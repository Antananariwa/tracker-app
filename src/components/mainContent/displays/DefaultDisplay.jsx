import React from 'react'


const DefaultDisplay = ({ title, children, useMainContentBox = false}) => {
  return (
      <>
        {title && <h2>{title}</h2>}
        <div className="DisplayChildren">
          {children}
        </div>
      </>
    )}


export default DefaultDisplay


