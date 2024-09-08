import React, { useState } from 'react';
import './ControlPanel.css';

function ControlPanel() {
  const [selectedChip, setSelectedChip] = useState('FDR');

  const chips = ['FDR', 'xGS', 'xGC', 'xCC'];

  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  return (
    <div className="control-panel">
      <div className="values-section">
        <label>Values:</label>
        <div className="chips">
          {chips.map((chip) => (
            <button
              key={chip}
              className={`chip ${selectedChip === chip ? 'selected' : ''}`}
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      <div className="icons-section">
        {/* Add your icon buttons here */}
      </div>
    </div>
  );
}

export default ControlPanel;