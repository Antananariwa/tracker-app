import React from 'react';
import './LoginPage.css'
import MainContentBox from './MainContentBox';
import Button from '../ui/Button.jsx'

const LoginPage = () => {
  return (
    <div className='loginPageWrapper'>
      <MainContentBox>
          <h4>Username</h4>
          <input></input>
          <br/>
          <br/>
          <h4>Password</h4>
          <input></input>
          <Button version='secondary' className='forgotPasswordButton'>
            Forgot Password
          </Button>
      </MainContentBox>
    </div>
  )
}

export default LoginPage;