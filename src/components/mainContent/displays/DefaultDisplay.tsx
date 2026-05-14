import React from 'react'

type DefaultDisplayProps = {
  title?: string
  children: React.ReactNode
}

const DefaultDisplay = ({ title, children }: DefaultDisplayProps) => {
  return (
      <>
        {title && <h2>{title}</h2>}
        <div className="DisplayChildren">
          {children}
        </div>
      </>
    )}


export default DefaultDisplay


