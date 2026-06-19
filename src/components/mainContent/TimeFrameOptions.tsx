import './TimeFrameOptions.css';
import Button from '../ui/Button'

type TimeFrameOptionsProps<T extends string> = {
  selectedTimeFrame: T
  timeRange: T[]
  onOptionClick: (option: T) => void
}

function TimeFrameOptions<T extends string>({onOptionClick, selectedTimeFrame, timeRange}: TimeFrameOptionsProps<T>) {
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
