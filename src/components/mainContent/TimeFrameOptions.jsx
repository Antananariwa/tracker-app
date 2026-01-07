import React from 'react'
import './TimeFrameOptions.css';
import Button from '../ui/Button.jsx'


const TimeFrameOptions = ({onOptionClick}) => {
  const timeRange = ["1M", "3M", "1Y", "3Y", "5Y", "10Y", "20Y"]
  return (
    <div className="TimeFrameOptions-Div">
      {timeRange.map((time) => (
        <Button
          variant={'secondary'}
          key={time}
          onClick={() => {
            if (time === "1M" || time === "3M") {
              onOptionClick(time);
            } else {
              onOptionClick(time, "full");
            }
          }}
        >
          {time}
        </Button>
      ))}
    </div>
  )
}

export default TimeFrameOptions
