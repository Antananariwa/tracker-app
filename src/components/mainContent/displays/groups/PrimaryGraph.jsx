import React from 'react';
import './PrimaryGraph.css';
import ApiDataBox from '../ApiDataBox.jsx';
import DemoGraph from '../graphs/AreaResponsiveContainerGraph.jsx';
import LatestPriceDisplay from '../LatestPriceDisplay';
import TimeFrameOptions from '../../TimeFrameOptions.jsx';


const PrimaryGraph = ({latestPriceTitle, loading, error, latestPriceData, chartDataTimeFrame, setSelectedTimeFrame, setSelectedOutputSize}) => {
  return (
    <div className='PrimaryGraph-div'>
      <ApiDataBox title = {latestPriceTitle} loading = {loading} error = {error}>
        <LatestPriceDisplay latestPriceData={latestPriceData} />
      </ApiDataBox> 
      <DemoGraph chartData = {chartDataTimeFrame}/>
      <TimeFrameOptions onOptionClick={(time, OutputSize) => {
        setSelectedTimeFrame(time);
        setSelectedOutputSize(OutputSize || null);
      }}/>
    </div>
  )
}

export default PrimaryGraph