import React, { useState, useEffect } from 'react';
import { fdrData } from '../fdrData';
import './ControlPanel.css';

function FilterDrawer({ isOpen, onClose, onFilter, initialFilterConfig }) {
  const allTeams =fdrData.map(d => d['GW/Team']).sort();

  const [selectedTeams, setSelectedTeams] = useState(initialFilterConfig);

  useEffect(() => {
    setSelectedTeams(initialFilterConfig);
  }, [initialFilterConfig]);

  useEffect(() => {
    onFilter(selectedTeams);
  }, [selectedTeams, onFilter]);

  const handleTeamClick = (team) => {
    setSelectedTeams(prevSelected => {
      if (prevSelected.includes(team)) {
        return prevSelected.filter(t => t !== team);
      } else {
        return [...prevSelected, team];
      }
    });
  };

  const handleResetClick = () => {
    setSelectedTeams(allTeams);
  };

  if (!isOpen) return null;

  return (
    <div className="drawer filter-drawer">
      <div className="drawer-content">
        <div className="team-chips-grid">
          {allTeams.map(team => (
            <button
              key={team}
              className={`chip ${selectedTeams.includes(team) ? 'selected' : ''}`}
              onClick={() => handleTeamClick(team)}
            >
              {team}
            </button>
          ))}
        </div>
        <div className="reset-button-container">
          <button className="reset-button" onClick={handleResetClick}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;