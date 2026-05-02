import './LeftMenuBox.css';
import Button from '../ui/Button'

type LeftMenuBoxProps = {
  optionName?: string[]
  groupName?: string
  onOptionClick?: (option: string) => void
}

const LeftMenuBox = ({ 
  optionName = [], 
  groupName = '', 
  onOptionClick
}: LeftMenuBoxProps) => (
  <div className="LeftMenuBoxDiv">
    {groupName && (
      <details>
        <summary>{groupName}</summary>
        <div className="OptionDiv">
          {optionName.map((option) => (
            <Button 
              variant={'secondary'}
              className={'optionButtons'}
              key={option} 
              onClick={() => onOptionClick?.(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </details>
    )}
  </div>
);

export default LeftMenuBox;