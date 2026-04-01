import React from 'react'
import './CryptoBrowsePage.css'
import MainContentBox from './MainContentBox'
import useCryptoApiHook from '../../../scripts/fetchCryptoData.js'

const CryptoBrowsePage = () => {
  const { data, loading, error } = useCryptoApiHook();

  console.log('Crypto data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);

  return (
    <div>
      <MainContentBox>
        {/*search bar*/}
      </MainContentBox>

      <MainContentBox>
        {/*graph*/}
      </MainContentBox>
      
    </div>
  )
}

export default CryptoBrowsePage
