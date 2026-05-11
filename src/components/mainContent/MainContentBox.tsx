import React from 'react'
import './MainContentBox.css'

type MainContentBoxProps = {
  children: React.ReactNode
}

const MainContentBox = ({ children }: MainContentBoxProps) => {
  return (
    <div className="MainContentBoxDiv">
      {children}
    </div>
  )
}

export default MainContentBox

