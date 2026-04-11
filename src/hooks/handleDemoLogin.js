import React from 'react'
import { useMainPage } from '../../context/MainPageContext';

const handleDemoLogin = async () => {
  const {setSelectedMainPage} = useMainPage();

  const { error } = await supabase.auth.signInWithPassword({
    email: 'demo@yourapp.com',
    password: 'demo1234'
  })

  if (error) {
    console.error('Login failed: ', error.message)
    return
  }

  setSelectedMainPage('portfolioStocks')
}

export default handleDemoLogin
