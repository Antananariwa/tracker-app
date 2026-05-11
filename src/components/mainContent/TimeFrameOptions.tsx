import './TimeFrameOptions.css';
import Button from '../ui/Button'
import type { GraphTimeFrame } from '../../utils/stockData';

type TimeFrameOptionsProps = {
  onOptionClick: (option: GraphTimeFrame) => void
  selectedTimeFrame: GraphTimeFrame
}

const TimeFrameOptions = ({onOptionClick, selectedTimeFrame}: TimeFrameOptionsProps) => {
  const timeRange: GraphTimeFrame[] = ["1M", "3M", "1Y", "3Y", "5Y", "10Y", "20Y"]
  return (
    <div className="TimeFrameOptions-Div">
      {timeRange.map((time) => (
        <Button
          variant='secondary'
          className={time === selectedTimeFrame ? 'timeButton selectedButton' : 'timeButton'}
          key={time}
          onClick={() => onOptionClick(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  )
}

export default TimeFrameOptions
