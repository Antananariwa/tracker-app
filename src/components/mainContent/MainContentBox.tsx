import type { ReactNode } from 'react';
import './MainContentBox.css'

type MainContentBoxProps = {
  children: ReactNode
  className?: string
}

const MainContentBox = ({ children, className }: MainContentBoxProps) => {
  return (
    <div className={className ? `MainContentBoxDiv ${className}` : 'MainContentBoxDiv'}>
      {children}
    </div>
  )
}

export default MainContentBox

