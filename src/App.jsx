import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/headerSection/Header.jsx'
import ContainerLeftMenu from './components/leftMenu/ContainerLeftMenu.jsx'
import ContainerMainContent from './components/mainContent/ContainerMainContent.jsx'

function App() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
    .then(response => {
      if (!response){
        throw new Error('HTTP BLAH BLAH')
      }
      return response.json()
    }).then(result => {
      setData(result)
    }).catch(error=> {
      console.log(error)
    }).finally(()=> {
      setLoading(false)
    })
  }, [])
  return (
    <>
    <div className="bodyDiv">
      <ContainerLeftMenu title="Left Container"/>
      <div className="rightSideDiv">
        <Header title="Investments Calculator" subtitle="Table with individual assets"/>
        <ContainerMainContent />
        <p>{JSON.stringify(data)}</p>
      </div>
    </div>
    </>
  )
}

export default App
