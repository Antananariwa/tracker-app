import React from 'react'

const LatestPriceDisplay = ({ latestPriceData }) => {
  if (!latestPriceData) return <div>No price data available</div>

  return (
      <div className="latestPriceDisplay">
        <p><strong>Open:</strong> ${parseFloat(latestPriceData.open)}</p>
        <p><strong>High:</strong> ${parseFloat(latestPriceData.high)}</p>
        <p><strong>Low:</strong> ${parseFloat(latestPriceData.low)}</p>
      </div>
  )
}

export default LatestPriceDisplay