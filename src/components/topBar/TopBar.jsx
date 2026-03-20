import React from 'react';
import './TopBar.css';
import Button from '../ui/Button.jsx';

const TopBar = () => {
  return (
    <div className = "topBarDiv">

      <div className='leftGroup'></div>

      <div className='centerGroup'></div>

      <div className='rightGroup'>
        <Button variant='secondary' className='login-btn-topbar'>
          Log In
        </Button>
        <Button variant='secondary' className='login-btn-topbar'>
          Register
        </Button>
        <Button variant='secondary'>
          <img src='../../public/file-person.svg' alt='Profile' width="42" height="42"></img>
        </Button>
      </div>

    </div>
  )
}

export default TopBar
