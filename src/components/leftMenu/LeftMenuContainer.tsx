import './LeftMenuContainer.css'
import LeftMenuBox from './LeftMenuBox'
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

type LeftMenuContainerProps = {
  title?: string
}

const LeftMenuContainer = ({
  title = ""
  }: LeftMenuContainerProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="LeftMenuContainer">
      {title && <h2>{title}</h2>}

      <LeftMenuBox groupName="Portfolio" >

            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/portfolio/stocks')}
            >
              Stocks
            </Button>

            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/portfolio/crypto')}
            >
              Crypto
            </Button>

      </LeftMenuBox>

      <LeftMenuBox groupName="Browse">
            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/browse/stocks')}
            >
              Stocks
            </Button>

            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/browse/crypto')}
            >
              Crypto
            </Button>

      </LeftMenuBox>

      <LeftMenuBox groupName="Account">
            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/account/option1')}
            >
              Option1
            </Button>

            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              onClick={()=>navigate('/account/option2')}
            >
              Option2
            </Button>
      </LeftMenuBox>
    </div>
  )
}

export default LeftMenuContainer
