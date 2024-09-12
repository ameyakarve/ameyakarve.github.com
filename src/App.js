import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Table from './components/Table';
import { fdrMap } from './generatedFdrMap'; // Import fdrMap from generatedFdrMap
import './App.css';
import { START_GW } from './constants';

function App() {
  const initialSortConfig = [0,1,2,3,4,5].map(t => t + START_GW).filter(u => u <= 38).map(v => `GW${v}`);
  const [sortConfig, setSortConfig] = useState({ gws: initialSortConfig, order: 'DESC' });
  const [filterConfig, setFilterConfig] = useState([]);
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('FDR'); // Add this line

  useEffect(() => {
    const processedData = Object.entries(fdrMap).map(([team, fixtures], index) => {
      const processedFixtures = {};
      fixtures.forEach((fixture, i) => {
        const gwKey = `GW${i + 1}`;
        processedFixtures[gwKey] = {
          opponent: fixture.opponent,
          isHome: fixture.home,
          fdr: fixture.fdr.toFixed(1),
          xgs: fixture.xgs.toFixed(1),
          xgc: fixture.xgc.toFixed(1),
          xcc: fixture.xcc.toFixed(1)
        };
      });

      return {
        id: index + 1,
        team: team,
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

  const handleMetricChange = (metric) => { // Add this function
    setSelectedMetric(metric);
  };

  return (
    <div className="app">
      <Header />
      <div className="banner-ad">
        <span>Advertisement</span>
      </div>
      <div className="content-wrapper">
        <main>
          <ControlPanel 
            onSort={handleSort} 
            onFilter={handleFilter} 
            initialFilterConfig={filterConfig}
            initialSortConfig={sortConfig}
            onMetricChange={handleMetricChange} // Add this prop
            selectedMetric={selectedMetric} // Add this prop
          />
          <Table 
            data={data} 
            sortConfig={sortConfig} 
            filterConfig={filterConfig} 
            onRequestSort={handleRequestSort}
            selectedMetric={selectedMetric} // Add this prop
          />
        </main>
        <aside className="sidebar-ad">
          <span>Sidebar Ad</span>
        </aside>
      </div>
    </div>
  );
}

export default App;