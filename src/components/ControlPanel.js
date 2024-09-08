import React, { useState } from 'react';
import './ControlPanel.css';
import SortDrawer from './SortDrawer';
import FilterDrawer from './FilterDrawer';

function ControlPanel() {
  const [selectedChip, setSelectedChip] = useState('FDR');
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const chips = ['FDR', 'xGS', 'xGC', 'xCC'];

  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const toggleSortDrawer = () => {
    setIsSortDrawerOpen(!isSortDrawerOpen);
    setIsFilterDrawerOpen(false);
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
    setIsSortDrawerOpen(false);
  };

  return (
    <div className="control-panel-container">
      <div className="control-panel">
        <div className="panel-content">
          <div className="chips-container">
            <span className="chips-label">VALUES</span>
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
          <div className="icons">
            <button className="icon-button" title="Sort" onClick={toggleSortDrawer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
              </svg>
            </button>
            <button className="icon-button" title="Filter" onClick={toggleFilterDrawer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {(isSortDrawerOpen || isFilterDrawerOpen) && (
        <div className="drawer-container">
          <SortDrawer isOpen={isSortDrawerOpen} onClose={() => setIsSortDrawerOpen(false)} />
          <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default ControlPanel;