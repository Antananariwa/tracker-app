import './TopBar.css';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'

const TopBar = () => {
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@yourapp.com',
      password: 'demo1234'
    })
    if (error) {
      console.error('Login failed:', error.message)
      return
    }
    navigate('/portfolio/stocks')
  }
  
  return (
    <div className = "topBarDiv">

      <div className='leftGroup'>
        <Button variant='secondary'>
          <img className="homeImage" src='../../public/home.svg' alt='Home' width="35" height="35" />
        </Button>
      </div>

      <div className='centerGroup'></div>

      <div className='rightGroup'>
        <Button variant='secondary' className='demo-account-btn-topbar' onClick={()=>handleDemoLogin()}>
          Demo Account
        </Button>
        <Button variant='secondary' className='login-btn-topbar' onClick={()=>navigate('/account/login')}>
          Log In
        </Button>
        <Button variant='secondary' className='login-btn-topbar' onClick={()=>navigate('/account/register')}>
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
