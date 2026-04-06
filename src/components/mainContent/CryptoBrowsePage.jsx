import React from 'react'
import './CryptoBrowsePage.css'
import MainContentBox from './MainContentBox'
import useCryptoApiHook from '../../../scripts/fetchCryptoData.js'

const CryptoBrowsePage = () => {
  const { data, loading, error } = useCryptoApiHook('bitcoin');

  console.log('Crypto data:', data);
  // console.log('Loading:', loading);
  // console.log('Error:', error);
  const latestCoinPrice = data?.bitcoin?.usd ?? 0;

  return (
    <div>
      <MainContentBox>
        <h2>Bitcoin Price: ${latestCoinPrice}</h2>
        {/*search bar*/}
      </MainContentBox>

      <MainContentBox>
        {/*graph*/}
      </MainContentBox>
      
    </div>
  )
}

export default CryptoBrowsePage
