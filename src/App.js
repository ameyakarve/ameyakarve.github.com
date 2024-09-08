import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Table from './components/Table';
import './App.css';

function App() {
  const [sortConfig, setSortConfig] = useState({ gws: ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6'], order: 'DESC' });
  const [filterConfig, setFilterConfig] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Dummy data with teams from the provided list
    const dummyData = [
      { id: 1, team: 'ARS', GW1: 10, GW2: 15, GW3: 12, GW4: 8, GW5: 14, GW6: 11 },
      { id: 2, team: 'AVL', GW1: 8, GW2: 12, GW3: 15, GW4: 10, GW5: 9, GW6: 13 },
      { id: 3, team: 'BOU', GW1: 11, GW2: 9, GW3: 13, GW4: 12, GW5: 10, GW6: 14 },
      { id: 4, team: 'BRE', GW1: 9, GW2: 11, GW3: 10, GW4: 14, GW5: 12, GW6: 8 },
      { id: 5, team: 'BHA', GW1: 13, GW2: 14, GW3: 11, GW4: 9, GW5: 15, GW6: 10 },
      { id: 6, team: 'BUR', GW1: 7, GW2: 10, GW3: 9, GW4: 11, GW5: 8, GW6: 12 },
      { id: 7, team: 'CHE', GW1: 12, GW2: 13, GW3: 14, GW4: 11, GW5: 10, GW6: 15 },
      { id: 8, team: 'CRY', GW1: 9, GW2: 11, GW3: 8, GW4: 13, GW5: 10, GW6: 9 },
      { id: 9, team: 'EVE', GW1: 8, GW2: 9, GW3: 11, GW4: 10, GW5: 12, GW6: 7 },
      { id: 10, team: 'FUL', GW1: 10, GW2: 12, GW3: 9, GW4: 11, GW5: 13, GW6: 10 },
      { id: 11, team: 'LIV', GW1: 15, GW2: 14, GW3: 16, GW4: 13, GW5: 17, GW6: 14 },
      { id: 12, team: 'LUT', GW1: 6, GW2: 8, GW3: 7, GW4: 9, GW5: 8, GW6: 10 },
      { id: 13, team: 'MCI', GW1: 16, GW2: 17, GW3: 15, GW4: 18, GW5: 16, GW6: 17 },
      { id: 14, team: 'MUN', GW1: 13, GW2: 15, GW3: 12, GW4: 14, GW5: 16, GW6: 13 },
      { id: 15, team: 'NEW', GW1: 11, GW2: 13, GW3: 14, GW4: 12, GW5: 15, GW6: 11 },
      { id: 16, team: 'NFO', GW1: 8, GW2: 10, GW3: 9, GW4: 11, GW5: 7, GW6: 10 },
      { id: 17, team: 'SHU', GW1: 7, GW2: 9, GW3: 8, GW4: 10, GW5: 9, GW6: 8 },
      { id: 18, team: 'TOT', GW1: 12, GW2: 14, GW3: 13, GW4: 15, GW5: 11, GW6: 14 },
      { id: 19, team: 'WHU', GW1: 10, GW2: 11, GW3: 12, GW4: 9, GW5: 13, GW6: 11 },
      { id: 20, team: 'WOL', GW1: 9, GW2: 10, GW3: 11, GW4: 8, GW5: 12, GW6: 9 },
    ];
    setData(dummyData);
    // Initialize filterConfig with all teams
    setFilterConfig(dummyData.map(item => item.team));
  }, []);

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleFilter = (selectedTeams) => {
    setFilterConfig(selectedTeams);
  };

  return (
    <div className="app">
      <Header />
      <main>
        <ControlPanel 
          onSort={handleSort} 
          onFilter={handleFilter} 
          initialFilterConfig={filterConfig}
          initialSortConfig={sortConfig}
        />
        <Table data={data} sortConfig={sortConfig} filterConfig={filterConfig} />
      </main>
    </div>
  );
}

export default App;