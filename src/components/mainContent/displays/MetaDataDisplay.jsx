import React from 'react'


const MetaDataDisplay = ({ metaData }) => {
  if (!metaData) return <div>No meta data available</div>

  return (
      <div className="metaData">
        <p><strong>Information:</strong> {metaData.information}</p>
        <p><strong>Symbol:</strong> {metaData.symbol}</p>
        <p><strong>Last Updated:</strong> {metaData.lastRefreshed}</p>
        <p><strong>Time Zone:</strong> {metaData.timeZone}</p>
      </div>
  )
}

export default MetaDataDisplay