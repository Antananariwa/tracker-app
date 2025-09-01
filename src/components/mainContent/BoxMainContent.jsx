import React from 'react'
import './BoxMainContent.css'

const BoxMainContent = ({title="", textInput=""}) => {
  return (
    <div className = "BoxMainContentDiv">
      {title && <h2>{title}</h2>}
      {textInput && <p>{textInput}</p>}
    </div>
  )
}

export default BoxMainContent
