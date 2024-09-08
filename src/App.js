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
    // Dummy data with all 20 teams
    const dummyData = [
      { id: 1, team: 'ARS', GW1: { opponent: 'MUN', isHome: true, value: 10 }, GW2: { opponent: 'CHE', isHome: false, value: 15 }, GW3: { opponent: 'LIV', isHome: true, value: 12 }, GW4: { opponent: 'MCI', isHome: false, value: 8 }, GW5: { opponent: 'TOT', isHome: true, value: 14 }, GW6: { opponent: 'NEW', isHome: false, value: 11 } },
      { id: 2, team: 'AVL', GW1: { opponent: 'TOT', isHome: false, value: 8 }, GW2: { opponent: 'NEW', isHome: true, value: 12 }, GW3: { opponent: 'MUN', isHome: false, value: 15 }, GW4: { opponent: 'CHE', isHome: true, value: 10 }, GW5: { opponent: 'LIV', isHome: false, value: 9 }, GW6: { opponent: 'MCI', isHome: true, value: 13 } },
      { id: 3, team: 'BOU', GW1: { opponent: 'LIV', isHome: true, value: 7 }, GW2: { opponent: 'MCI', isHome: false, value: 6 }, GW3: { opponent: 'TOT', isHome: true, value: 9 }, GW4: { opponent: 'NEW', isHome: false, value: 11 }, GW5: { opponent: 'MUN', isHome: true, value: 8 }, GW6: { opponent: 'CHE', isHome: false, value: 7 } },
      { id: 4, team: 'BRE', GW1: { opponent: 'MCI', isHome: false, value: 5 }, GW2: { opponent: 'TOT', isHome: true, value: 8 }, GW3: { opponent: 'NEW', isHome: false, value: 10 }, GW4: { opponent: 'MUN', isHome: true, value: 9 }, GW5: { opponent: 'CHE', isHome: false, value: 7 }, GW6: { opponent: 'LIV', isHome: true, value: 6 } },
      { id: 5, team: 'BHA', GW1: { opponent: 'CHE', isHome: true, value: 11 }, GW2: { opponent: 'LIV', isHome: false, value: 9 }, GW3: { opponent: 'MCI', isHome: true, value: 7 }, GW4: { opponent: 'TOT', isHome: false, value: 8 }, GW5: { opponent: 'NEW', isHome: true, value: 12 }, GW6: { opponent: 'MUN', isHome: false, value: 10 } },
      { id: 6, team: 'BUR', GW1: { opponent: 'NEW', isHome: true, value: 9 }, GW2: { opponent: 'MUN', isHome: false, value: 7 }, GW3: { opponent: 'CHE', isHome: true, value: 8 }, GW4: { opponent: 'LIV', isHome: false, value: 6 }, GW5: { opponent: 'MCI', isHome: true, value: 5 }, GW6: { opponent: 'TOT', isHome: false, value: 7 } },
      { id: 7, team: 'CHE', GW1: { opponent: 'BHA', isHome: false, value: 10 }, GW2: { opponent: 'ARS', isHome: true, value: 12 }, GW3: { opponent: 'BUR', isHome: false, value: 14 }, GW4: { opponent: 'AVL', isHome: false, value: 11 }, GW5: { opponent: 'BRE', isHome: true, value: 13 }, GW6: { opponent: 'BOU', isHome: true, value: 15 } },
      { id: 8, team: 'CRY', GW1: { opponent: 'EVE', isHome: true, value: 11 }, GW2: { opponent: 'FUL', isHome: false, value: 10 }, GW3: { opponent: 'LUT', isHome: true, value: 13 }, GW4: { opponent: 'WHU', isHome: false, value: 9 }, GW5: { opponent: 'WOL', isHome: true, value: 12 }, GW6: { opponent: 'NFO', isHome: false, value: 11 } },
      { id: 9, team: 'EVE', GW1: { opponent: 'CRY', isHome: false, value: 9 }, GW2: { opponent: 'WHU', isHome: true, value: 11 }, GW3: { opponent: 'WOL', isHome: false, value: 10 }, GW4: { opponent: 'NFO', isHome: true, value: 12 }, GW5: { opponent: 'FUL', isHome: false, value: 8 }, GW6: { opponent: 'LUT', isHome: true, value: 14 } },
      { id: 10, team: 'FUL', GW1: { opponent: 'LUT', isHome: true, value: 13 }, GW2: { opponent: 'CRY', isHome: true, value: 11 }, GW3: { opponent: 'WHU', isHome: false, value: 9 }, GW4: { opponent: 'WOL', isHome: true, value: 12 }, GW5: { opponent: 'EVE', isHome: true, value: 10 }, GW6: { opponent: 'NFO', isHome: false, value: 11 } },
      { id: 11, team: 'LIV', GW1: { opponent: 'BOU', isHome: false, value: 15 }, GW2: { opponent: 'BHA', isHome: true, value: 13 }, GW3: { opponent: 'ARS', isHome: false, value: 11 }, GW4: { opponent: 'BUR', isHome: true, value: 16 }, GW5: { opponent: 'AVL', isHome: true, value: 14 }, GW6: { opponent: 'BRE', isHome: false, value: 12 } },
      { id: 12, team: 'LUT', GW1: { opponent: 'FUL', isHome: false, value: 7 }, GW2: { opponent: 'NFO', isHome: true, value: 9 }, GW3: { opponent: 'CRY', isHome: false, value: 8 }, GW4: { opponent: 'WHU', isHome: true, value: 7 }, GW5: { opponent: 'WOL', isHome: false, value: 6 }, GW6: { opponent: 'EVE', isHome: false, value: 8 } },
      { id: 13, team: 'MCI', GW1: { opponent: 'BRE', isHome: true, value: 17 }, GW2: { opponent: 'BOU', isHome: true, value: 18 }, GW3: { opponent: 'BHA', isHome: false, value: 15 }, GW4: { opponent: 'ARS', isHome: true, value: 16 }, GW5: { opponent: 'BUR', isHome: false, value: 17 }, GW6: { opponent: 'AVL', isHome: false, value: 14 } },
      { id: 14, team: 'MUN', GW1: { opponent: 'ARS', isHome: false, value: 11 }, GW2: { opponent: 'BUR', isHome: true, value: 14 }, GW3: { opponent: 'AVL', isHome: true, value: 13 }, GW4: { opponent: 'BRE', isHome: false, value: 12 }, GW5: { opponent: 'BOU', isHome: false, value: 15 }, GW6: { opponent: 'BHA', isHome: true, value: 11 } },
      { id: 15, team: 'NEW', GW1: { opponent: 'BUR', isHome: false, value: 12 }, GW2: { opponent: 'AVL', isHome: false, value: 11 }, GW3: { opponent: 'BRE', isHome: true, value: 14 }, GW4: { opponent: 'BOU', isHome: true, value: 13 }, GW5: { opponent: 'BHA', isHome: false, value: 10 }, GW6: { opponent: 'ARS', isHome: true, value: 12 } },
      { id: 16, team: 'NFO', GW1: { opponent: 'WHU', isHome: true, value: 9 }, GW2: { opponent: 'LUT', isHome: false, value: 11 }, GW3: { opponent: 'WOL', isHome: true, value: 10 }, GW4: { opponent: 'EVE', isHome: false, value: 8 }, GW5: { opponent: 'CRY', isHome: true, value: 12 }, GW6: { opponent: 'FUL', isHome: true, value: 9 } },
      { id: 17, team: 'SHU', GW1: { opponent: 'WOL', isHome: true, value: 10 }, GW2: { opponent: 'WHU', isHome: false, value: 8 }, GW3: { opponent: 'EVE', isHome: true, value: 11 }, GW4: { opponent: 'CRY', isHome: false, value: 9 }, GW5: { opponent: 'FUL', isHome: true, value: 10 }, GW6: { opponent: 'LUT', isHome: false, value: 12 } },
      { id: 18, team: 'TOT', GW1: { opponent: 'AVL', isHome: true, value: 13 }, GW2: { opponent: 'BRE', isHome: false, value: 11 }, GW3: { opponent: 'BOU', isHome: false, value: 14 }, GW4: { opponent: 'BHA', isHome: true, value: 12 }, GW5: { opponent: 'ARS', isHome: false, value: 10 }, GW6: { opponent: 'BUR', isHome: true, value: 15 } },
      { id: 19, team: 'WHU', GW1: { opponent: 'NFO', isHome: false, value: 11 }, GW2: { opponent: 'EVE', isHome: false, value: 10 }, GW3: { opponent: 'FUL', isHome: true, value: 12 }, GW4: { opponent: 'CRY', isHome: true, value: 13 }, GW5: { opponent: 'LUT', isHome: false, value: 14 }, GW6: { opponent: 'SHU', isHome: true, value: 11 } },
      { id: 20, team: 'WOL', GW1: { opponent: 'SHU', isHome: false, value: 10 }, GW2: { opponent: 'NFO', isHome: true, value: 12 }, GW3: { opponent: 'EVE', isHome: true, value: 11 }, GW4: { opponent: 'FUL', isHome: false, value: 9 }, GW5: { opponent: 'CRY', isHome: false, value: 10 }, GW6: { opponent: 'LUT', isHome: true, value: 13 } },
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