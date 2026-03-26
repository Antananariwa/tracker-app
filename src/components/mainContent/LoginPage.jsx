import React from 'react';
import './LoginPage.css'
import MainContentBox from './MainContentBox';

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
      </MainContentBox>
    </div>
  )
}

export default LoginPage;