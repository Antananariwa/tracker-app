import './LeftMenuBox.css';
import type { ReactNode } from 'react';

type LeftMenuBoxProps = {
  groupName?: string
  children: ReactNode
}

const LeftMenuBox = ({
  groupName = '',
  children 
}: LeftMenuBoxProps) => (
  <div className="LeftMenuBoxDiv">
    {groupName && (
      <details>
        <summary>{groupName}</summary>
        <div className="OptionDiv">
          { children }
        </div>
      </details>
    )}
  </div>
);

export default LeftMenuBox;