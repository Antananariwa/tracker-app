import React from 'react';
import './LeftMenuBox.css';
import Button from '../ui/Button.jsx'

const LeftMenuBox = ({ optionName = [], groupName = '', onOptionClick}) => (
  <div className="LeftMenuBoxDiv">
    {groupName && (
      <details>
        <summary>{groupName}</summary>
        <div className="OptionDiv">
          {optionName.map((option) => (
            <Button 
              variant={'left-bar'}
              key={option} 
              onClick={() => onOptionClick(option)}
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