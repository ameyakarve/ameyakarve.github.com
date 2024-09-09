import React, { useState, useEffect, useRef } from 'react';
import './ControlPanel.css';
import SortDrawer from './SortDrawer';
import FilterDrawer from './FilterDrawer';

function ControlPanel({ onSort, onFilter, initialFilterConfig, initialSortConfig }) {
  const [selectedChip, setSelectedChip] = useState('FDR');
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState(initialFilterConfig);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const controlPanelRef = useRef(null);

  const chips = ['FDR', 'xGS', 'xGC', 'xCC'];

  useEffect(() => {
    setFilterConfig(initialFilterConfig);
  }, [initialFilterConfig]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (controlPanelRef.current && !controlPanelRef.current.contains(event.target)) {
        setIsSortDrawerOpen(false);
        setIsFilterDrawerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const toggleSortDrawer = () => {
    setIsSortDrawerOpen(prev => !prev);
    setIsFilterDrawerOpen(false);
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(prev => !prev);
    setIsSortDrawerOpen(false);
  };

  const handleSort = (selectedGWs, sortOrder) => {
    const newSortConfig = { gws: selectedGWs, order: sortOrder };
    setSortConfig(newSortConfig);
    onSort(newSortConfig);
  };

  const handleFilter = (selectedTeams) => {
    setFilterConfig(selectedTeams);
    onFilter(selectedTeams);
  };

  return (
    <div className="control-panel-container" ref={controlPanelRef}>
      <div className="control-panel">
        <div className="panel-content">
          <div className="chips-container">
            <span className="chips-label">METRIC</span>
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
            <button 
              className={`icon-button ${isSortDrawerOpen ? 'active' : ''}`}
              title="Sort" 
              onClick={toggleSortDrawer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
              </svg>
            </button>
            <button 
              className={`icon-button ${isFilterDrawerOpen ? 'active' : ''}`}
              title="Filter" 
              onClick={toggleFilterDrawer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {(isSortDrawerOpen || isFilterDrawerOpen) && (
        <div className="drawer-container">
          <SortDrawer 
            isOpen={isSortDrawerOpen} 
            onClose={() => setIsSortDrawerOpen(false)} 
            onSort={handleSort}
            initialSortConfig={sortConfig}
          />
          <FilterDrawer 
            isOpen={isFilterDrawerOpen} 
            onClose={() => setIsFilterDrawerOpen(false)} 
            onFilter={handleFilter}
            initialFilterConfig={filterConfig}
          />
        </div>
      )}
    </div>
  );
}

export default ControlPanel;