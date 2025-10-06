import React from 'react';
import './LeftMenuBox.css';

const LeftMenuBox = ({ optionName = [], groupName = '' }) => (
  <div className="LeftMenuBoxDiv">
    {groupName && <h2>{groupName}</h2>}
    {optionName.map((text, index) => (
      <p key={index}>{text}</p>
    ))}
  </div>
);

export default LeftMenuBox;