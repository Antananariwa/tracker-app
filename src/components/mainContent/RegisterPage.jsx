import React from 'react'
import './RegisterPage.css'
import MainContentBox from './MainContentBox'
import Button from '../ui/Button.jsx'

const RegisterPage = () => {
  return (
    <div className='registerPageWrapper'>
      <MainContentBox>
        <h4>Username</h4>
        <input></input>
        <br/>
        <br/>
        <h4>Email</h4>
        <input></input>
        <h4>Confirm Email</h4>
        <input></input>
        <br/>
        <br/>
        <h4>Password</h4>
        <input></input>
        <br/>
        <h4>Confirm Password</h4>
        <input></input>
      </MainContentBox>

      <Button varian='secondary' className='createAccountButton'>
        <h3>Create Account</h3>
      </Button>
    </div>
  )
}

export default RegisterPage
