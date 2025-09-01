import React from 'react';
import './BoxLeftMenu.css';

const BoxLeftMenu = ({ optionName = [], groupName = '' }) => (
  <div className="BoxLeftMenuDiv">
    {groupName && <h2>{groupName}</h2>}
    {optionName.map((text, index) => (
      <p key={index}>{text}</p>
    ))}
  </div>
);

export default BoxLeftMenu;