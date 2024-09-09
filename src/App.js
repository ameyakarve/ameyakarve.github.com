import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Table from './components/Table';
import { fdrData } from './fdrData';
import './App.css';
import { START_GW } from './constants';

function App() {
  const initialSortConfig = [0,1,2,3,4,5].map(t => t + START_GW).filter(u => u <= 38).map(v => `GW${v}`); // take GWs from start
  const [sortConfig, setSortConfig] = useState({ gws: initialSortConfig, order: 'DESC' });
  const [filterConfig, setFilterConfig] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const processedData = fdrData.map((team, index) => {
      const processedFixtures = {};
      Object.entries(team).forEach(([key, value]) => {
        if (key !== 'GW/Team') {
          const [opponent, location] = value.split(' ');
          processedFixtures[`GW${key}`] = {
            opponent:opponent,
            isHome: location === '(H)',
            value: Math.floor(Math.random() * 5) + 1 // Random value between 1 and 5 for FDR
          };
        }
      });

      return {
        id: index + 1,
        team: team['GW/Team'],
        ...processedFixtures
      };
    });

    console.log('Processed fixture data:', processedData);
    setData(processedData);
    setFilterConfig(processedData.map(item => item.team));
  }, []);

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleFilter = (selectedTeams) => {
    setFilterConfig(selectedTeams);
  };

  const handleRequestSort = (gw) => {
    setSortConfig(prevConfig => ({
      gws: [gw],
      order: prevConfig.gws[0] === gw && prevConfig.order === 'DESC' ? 'ASC' : 'DESC'
    }));
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
        <Table 
          data={data} 
          sortConfig={sortConfig} 
          filterConfig={filterConfig} 
          onRequestSort={handleRequestSort}
        />
      </main>
    </div>
  );
}

export default App;