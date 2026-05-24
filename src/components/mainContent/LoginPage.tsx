import './LoginPage.css'
import MainContentBox from './MainContentBox';
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  
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
      <Button variant='secondary' className='logInButton' onClick={()=>navigate('')}>
        <h3>Log In</h3>
      </Button>

    </div>
  )
}

export default LoginPage;