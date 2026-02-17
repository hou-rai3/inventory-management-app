'use client';

import { useState } from 'react';

const DIALOG_TEXT = '部室をきれいにしよう';

export default function RobotBuddy() {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="robot-buddy"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`robot-bubble ${isHovering ? 'robot-bubble-hover' : ''}`}>
        {DIALOG_TEXT}
      </div>
      <div className={`robot-core ${isHovering ? 'robot-core-active' : ''}`}>
        <div className="robot-body">
          <div className="robot-face">
            <div className="robot-eyes">
              <div className="eye" />
              <div className="eye" />
            </div>
            <div className="robot-mouth" />
          </div>
        </div>
        <div className="robot-legs">
          <div className="robot-leg" />
          <div className="robot-leg" />
        </div>
        <div className="robot-wheels">
          <div className="wheel" />
          <div className="wheel" />
        </div>
      </div>
    </div>
  );
}
