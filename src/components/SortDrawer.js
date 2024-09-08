import React, { useState, useEffect } from 'react';
import './ControlPanel.css';

function SortDrawer({ isOpen, onClose, onSort, initialSortConfig }) {
  const [selectedGWs, setSelectedGWs] = useState(initialSortConfig.gws);
  const [sortOrder, setSortOrder] = useState(initialSortConfig.order);

  const gameweeks = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6'];

  useEffect(() => {
    if (selectedGWs.length > 0) {
      onSort(selectedGWs, sortOrder);
    }
  }, [selectedGWs, sortOrder, onSort]);

  const handleGWClick = (gw) => {
    setSelectedGWs(prevSelected => {
      const newSelected = prevSelected.includes(gw)
        ? prevSelected.filter(item => item !== gw)
        : [...prevSelected, gw];
      
      return newSelected;
    });
  };

  const handleSortOrderClick = (order) => {
    setSortOrder(order);
  };

  if (!isOpen) return null;

  return (
    <div className="drawer sort-drawer">
      <div className="drawer-content">
        <label className="sort-label">Sort on average value of selected GWs:</label>
        <div className="sort-chips-container">
          <div className="sort-chips-grid">
            {gameweeks.map(gw => (
              <button
                key={gw}
                className={`chip ${selectedGWs.includes(gw) ? 'selected' : ''}`}
                onClick={() => handleGWClick(gw)}
              >
                {gw}
              </button>
            ))}
          </div>
          <div className="order-chips">
            <button
              className={`chip order-chip ${sortOrder === 'ASC' ? 'selected' : ''}`}
              onClick={() => handleSortOrderClick('ASC')}
            >
              ASC
            </button>
            <button
              className={`chip order-chip ${sortOrder === 'DESC' ? 'selected' : ''}`}
              onClick={() => handleSortOrderClick('DESC')}
            >
              DESC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortDrawer;