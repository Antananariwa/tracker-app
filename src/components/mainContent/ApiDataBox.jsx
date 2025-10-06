import React from 'react'
import MainContentBox from './MainContentBox'

const ApiDataBox = ({ title, loading, error, children }) => {
  if (loading) {
    return (
      <MainContentBox title="Loading">
        "Please wait while we fetch the data..."
      </MainContentBox>
    )
  }

  if (error) {
    return (
      <MainContentBox title="Error">
        {`An error occurred: ${error}`}
      </MainContentBox>
    )
  }

  return (
    <MainContentBox title={title}>
      {children}
    </MainContentBox>
  )
}

export default ApiDataBox