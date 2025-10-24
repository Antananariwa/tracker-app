import React from 'react';
import './LeftMenuBox.css';

const LeftMenuBox = ({ optionName = [], groupName = '', onOptionClick}) => (
  <div className="LeftMenuBoxDiv">
    {groupName && (
      <details>
        <summary>{groupName}</summary>
        <div className="OptionDiv">
          {optionName.map((option) => (
            <button 
              key={option} 
              onClick={() => onOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </details>
    )}
  </div>
);

export default LeftMenuBox;