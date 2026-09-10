import Header from '../ui/Header'
import MainContentBox from './MainContentBox'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header title="Page not found" subtitle="There is nothing at this address." />
      <MainContentBox className="padded">
        <Button variant="primary" onClick={() => navigate('/portfolio/main')}>
          Go to portfolio
        </Button>
      </MainContentBox>
    </div>
  )
}

export default NotFoundPage