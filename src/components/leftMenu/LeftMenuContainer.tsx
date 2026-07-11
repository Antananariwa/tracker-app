import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox'
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';


type LeftMenuContainerProps = {
  title?: string
}

const LeftMenuContainer = ({
  }: LeftMenuContainerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="LeftMenuContainer">
      <LeftMenuBox groupName="Portfolio" >

            <Button 
              variant={'secondary'}
              className={location.pathname === '/portfolio/stocks' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/portfolio/stocks')}
            >
              Stocks
            </Button>

            <Button 
              variant={'secondary'}
              className={location.pathname === '/portfolio/crypto' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/portfolio/crypto')}
            >
              Crypto
            </Button>

      </LeftMenuBox>

      <LeftMenuBox groupName="Browse">
            <Button 
              variant={'secondary'}
              className={location.pathname === '/browse/stocks' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/browse/stocks')}
            >
              Stocks
            </Button>

            <Button 
              variant={'secondary'}
              className={location.pathname === '/browse/crypto' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/browse/crypto')}
            >
              Crypto
            </Button>

      </LeftMenuBox>

      <LeftMenuBox groupName="Account">
            <Button 
              variant={'secondary'}
              className={location.pathname === '/account/option1' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/account/option1')}
            >
              Option1
            </Button>

            <Button 
              variant={'secondary'}
              className={location.pathname === '/account/option2' ? 'optionButtons is-active' : 'optionButtons'}
              onClick={()=>navigate('/account/option2')}
            >
              Option2
            </Button>
      </LeftMenuBox>
    </div>
  )
}

export default LeftMenuContainer
