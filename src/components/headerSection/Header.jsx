import React from 'react'
import './Header.css'

const Header = ({title = "", subtitle = ""}) => {
  return (
    <header className="header">
      {/*<img src={logo} alt="Logo Name" /> --------- In case I want to add a logo*/}
      {title && <h1>{title}</h1>}
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  )
}

export default Header