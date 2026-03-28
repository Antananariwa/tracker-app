import React from 'react';
import './LoginPage.css'
import MainContentBox from './MainContentBox';
import Button from '../ui/Button.jsx'
import { useMainPage } from '../../context/MainPageContext';

const LoginPage = () => {
  const {setSelectedMainPage} = useMainPage();
  
  return (
    <div className='loginPageWrapper'>
      <MainContentBox>
          <h4>Username</h4>
          <input></input>
          <br/>
          <br/>
          <h4>Password</h4>
          <input></input>
          <Button variant='secondary' className='forgotPasswordButton' >
            Forgot Password
          </Button>
      </MainContentBox>
      <Button variant='secondary' className='registerButton' onClick={()=>setSelectedMainPage('register')}>
        <h3>Register</h3>
      </Button>
    </div>
  )
}

export default LoginPage;