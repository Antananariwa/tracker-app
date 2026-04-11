import React from 'react';
import './TopBar.css';
import Button from '../ui/Button.jsx';
import { useMainPage } from '../../context/MainPageContext';

const TopBar = () => {
  const {setSelectedMainPage} = useMainPage();
  
  return (
    <div className = "topBarDiv">

      <div className='leftGroup'>
        <Button variant='secondary'>
          <img className="homeImage" src='../../public/home.svg' alt='Home' width="35" height="35" />
        </Button>
      </div>

      <div className='centerGroup'></div>

      <div className='rightGroup'>
        <Button variant='secondary' className='demo-account-btn-topbar'>
          Demo Account
        </Button>
        <Button variant='secondary' className='login-btn-topbar' onClick={()=>setSelectedMainPage('login')}>
          Log In
        </Button>
        <Button variant='secondary' className='login-btn-topbar' onClick={()=>setSelectedMainPage('register')}>
          Register
        </Button>
        <Button variant='secondary'>
          <img className="settingsImage" src='../../public/gear.svg' alt='Settings' width="40" height="40" />
        </Button>
        <Button variant='secondary'>
          <img className="profileImage" src='../../public/file-person.svg' alt='Profile' width="40" height="40" />
        </Button>
      </div>

    </div>
  )
}

export default TopBar
