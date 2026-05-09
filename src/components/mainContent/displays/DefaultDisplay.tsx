import React from 'react'

type DefaultDisplayProps = {
  title?: string
  children: React.ReactNode
  useMainContentBox?: boolean
}

const DefaultDisplay = ({ title, children, useMainContentBox = false}: DefaultDisplayProps) => {
  return (
      <>
        {title && <h2>{title}</h2>}
        <div className="DisplayChildren">
          {children}
        </div>
      </>
    )}


export default DefaultDisplay


