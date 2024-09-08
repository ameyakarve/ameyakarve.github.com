import React, { useMemo } from 'react';
import GWCell from './GWCell';
import './Table.css';

function Table({ data, sortConfig, filterConfig, onRequestSort }) {
  const gameweeks = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6'];

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Apply filtering
    if (filterConfig.length > 0) {
      result = result.filter(row => filterConfig.includes(row.team));
    }

    // Apply sorting
    if (sortConfig.gws.length > 0) {
      result = [...result].sort((a, b) => {
        const aAvg = sortConfig.gws.reduce((sum, gw) => sum + a[gw].value, 0) / sortConfig.gws.length;
        const bAvg = sortConfig.gws.reduce((sum, gw) => sum + b[gw].value, 0) / sortConfig.gws.length;

        if (sortConfig.order === 'ASC') {
          return aAvg - bAvg;
        } else {
          return bAvg - aAvg;
        }
      });
    }

    return result;
  }, [data, sortConfig, filterConfig]);

  // Calculate min and max values
  const allValues = data.flatMap(row => gameweeks.map(gw => row[gw].value));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Function to calculate color based on value using a modified ColorBrewer PiYG scale
  const getColor = (value) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    
    // Modified ColorBrewer PiYG scale (11 colors)
    const colors = [
      [89, 13, 61],    // Darkest pink (hardest fixture)
      [136, 32, 92],
      [176, 60, 119],
      [212, 114, 158],
      [237, 180, 201],
      [39, 39, 39],    // Middle (neutral, dark gray)
      [144, 184, 138],
      [102, 155, 94],
      [65, 125, 59],
      [37, 95, 33],
      [20, 69, 19]     // Darkest green (easiest fixture)
    ];

    const colorIndex = Math.min(Math.floor(ratio * 10), 9);
    const lowerColor = colors[colorIndex];
    const upperColor = colors[colorIndex + 1];
    const colorRatio = (ratio * 10) % 1;

    const r = Math.round(lowerColor[0] + colorRatio * (upperColor[0] - lowerColor[0]));
    const g = Math.round(lowerColor[1] + colorRatio * (upperColor[1] - lowerColor[1]));
    const b = Math.round(lowerColor[2] + colorRatio * (upperColor[2] - lowerColor[2]));

    return `rgb(${r}, ${g}, ${b})`;
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const handleHeaderClick = (gw) => {
    onRequestSort(gw);
  };

  return (
    <div className="table-container">
      <table className="fpl-table">
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick('team')}>
              Team
              {sortConfig.gws.length === 1 && sortConfig.gws[0] === 'team' && (sortConfig.order === 'ASC' ? ' ▲' : ' ▼')}
            </th>
            {gameweeks.map(gw => (
              <th key={gw} onClick={() => handleHeaderClick(gw)}>
                {gw}
                {sortConfig.gws.length === 1 && sortConfig.gws[0] === gw && (sortConfig.order === 'ASC' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map(row => (
            <tr key={row.id}>
              <td>{row.team}</td>
              {gameweeks.map(gw => (
                <td key={gw}>
                  <GWCell 
                    opponent={row[gw].opponent}
                    isHome={row[gw].isHome}
                    value={row[gw].value}
                    backgroundColor={getColor(row[gw].value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;