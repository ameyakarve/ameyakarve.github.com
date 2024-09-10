import React, { useMemo, useState } from 'react';
import GWCell from './GWCell';
import './Table.css';
import { START_GW } from '../constants';

function Table({ data, sortConfig, filterConfig, onRequestSort }) {
  const [startGW, setStartGW] = useState(START_GW);
  const gameweeks = Array.from({ length: 38 }, (_, i) => `GW${i + 1}`);
  const visibleGameweeks = gameweeks.slice(startGW - 1, startGW + 5);

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Apply filtering
    if (filterConfig.length > 0) {
      result = result.filter(row => filterConfig.includes(row.team));
    }

    // Apply sorting
    if (sortConfig.gws.length > 0) {
      result = [...result].sort((a, b) => {
        if (sortConfig.gws[0] === 'team') {
          // Sort by team name
          return sortConfig.order === 'ASC' 
            ? a.team.localeCompare(b.team)
            : b.team.localeCompare(a.team);
        } else {
          // Sort by gameweek average
          const aAvg = sortConfig.gws.reduce((sum, gw) => sum + a[gw].value, 0) / sortConfig.gws.length;
          const bAvg = sortConfig.gws.reduce((sum, gw) => sum + b[gw].value, 0) / sortConfig.gws.length;

          return sortConfig.order === 'ASC' ? aAvg - bAvg : bAvg - aAvg;
        }
      });
    }

    return result;
  }, [data, sortConfig, filterConfig]);

  // Calculate min and max values
  const allValues = data.flatMap(row => gameweeks.map(gw => row[gw]?.value ?? 0));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Function to calculate color based on value using a modified ColorBrewer PiYG scale
  const getColor = (value) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    
    // Modified ColorBrewer PiYG scale (11 colors)
    const colors = [
      [237, 180, 201],
      [212, 114, 158],
      [176, 60, 119],
      [136, 32, 92],
      [89, 13, 61],    // Darkest pink 
      [39, 39, 39],    // Middle (neutral, dark gray)
      [20, 69, 19],// Darkest green 
      [37, 95, 33],
      [65, 125, 59],
      [102, 155, 94],
      [144, 184, 138]
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

  const handleScrollLeft = () => {
    setStartGW(Math.max(1, startGW - 1));
  };

  const handleScrollRight = () => {
    setStartGW(Math.min(37, startGW + 1));
  };

  const renderSortingTriangle = (gw) => {
    if (sortConfig.gws.length === 1 && sortConfig.gws[0] === gw) {
      return sortConfig.order === 'ASC' ? ' ▲' : ' ▼';
    }
    return <span style={{ color: 'transparent' }}> ▲</span>;
  };

  return (
    <div className="table-container">
      <div className="scroll-buttons">
        <button onClick={handleScrollLeft} disabled={startGW === 1}>←</button>
        <button onClick={handleScrollRight} disabled={startGW === 33}>→</button>
      </div>
      <table className="fpl-table">
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick('team')}>
              Team
              {renderSortingTriangle('team')}
            </th>
            {visibleGameweeks.map(gw => (
              <th key={gw} onClick={() => handleHeaderClick(gw)}>
                {gw}
                {renderSortingTriangle(gw)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map(row => (
            <tr key={row.id}>
              <td>{row.team}</td>
              {visibleGameweeks.map(gw => (
                <td key={gw}>
                  {row[gw] ? (
                    <GWCell 
                      opponent={row[gw].opponent}
                      isHome={row[gw].isHome}
                      value={row[gw].value}
                      backgroundColor={getColor(row[gw].value)}
                    />
                  ) : null}
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