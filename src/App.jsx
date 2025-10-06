import { useState } from 'react'
import './App.css'
import Header from './components/headerSection/Header.jsx'
import LeftMenuContainer from './components/leftMenu/LeftMenuContainer.jsx'
import MainContentContainer from './components/mainContent/MainContentContainer.jsx'
import useAlphaVantage from './hooks/useAlphaVantage'


function App() {
  const [selectedStock, setSelectedStock] = useState('IBM')
  const [selectedFunction, setSelectedFunction] = useState('TIME_SERIES_DAILY')
  const { data, loading, error } = useAlphaVantage(selectedFunction, selectedStock)

  return (
    <>
      <div className="bodyDiv">
        <LeftMenuContainer title="Left Container"/>
        <div className="rightSideDiv">
          <Header title="Investments Calculator" subtitle="Table with individual assets"/>
          <MainContentContainer 
            data={data} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    </>
  )
}

export default App
