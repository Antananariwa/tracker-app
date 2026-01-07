import React from 'react'
import './Header.css'
import SettingsContainer from './settings/SettingsContainer.jsx'

const Header = ({title = "", subtitle = ""}) => {
  return (
    <header className="header">
      {/*<img src={logo} alt="Logo Name" /> --------- In case I want to add a logo*/}
      {title && <h1>{title}</h1>}
      {subtitle && <h2>{subtitle}</h2>}
      <div className="headerSettingsDiv">
        <SettingsContainer />
      </div>
    </header>
  )
}

export default Header