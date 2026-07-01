import type { ReactNode } from 'react';
import './MainContentBox.css'

type MainContentBoxProps = {
  children: ReactNode
}

const MainContentBox = ({ children }: MainContentBoxProps) => {
  return (
    <div className="MainContentBoxDiv">
      {children}
    </div>
  )
}

export default MainContentBox

