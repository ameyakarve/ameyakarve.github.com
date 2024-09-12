import React, { useMemo, useState, useRef, useEffect } from 'react';
import GWCell from './GWCell';
import './Table.css';
import { START_GW } from '../constants';

function Table({ data, sortConfig, filterConfig, onRequestSort, selectedMetric }) {
  const [startGW, setStartGW] = useState(START_GW);
  const tableRef = useRef(null);
  const gameweeks = Array.from({ length: 38 }, (_, i) => `GW${i + 1}`);
  const visibleGameweeks = gameweeks.slice(startGW - 1, startGW + 5);

  // Calculate min and max values for each metric
  const metricRanges = useMemo(() => {
    const ranges = {
      fdr: [],
      xgs: [],
      xgc: [],
      xcc: []
    };

    // Collect all values for each metric
    data.forEach(row => {
      gameweeks.forEach(gw => {
        if (row[gw]) {
          Object.keys(ranges).forEach(metric => {
            const value = parseFloat(row[gw][metric]);
            if (!isNaN(value)) {
              ranges[metric].push(value);
            }
          });
        }
      });
    });

    // Function to calculate percentile
    const percentile = (arr, p) => {
      const sorted = arr.slice().sort((a, b) => a - b);
      const position = (sorted.length - 1) * p;
      const base = Math.floor(position);
      const rest = position - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
        return sorted[base];
      }
    };

    // Calculate min (2nd percentile) and max (98th percentile) for each metric
    const result = Object.keys(ranges).reduce((acc, metric) => {
      acc[metric] = {
        min: percentile(ranges[metric], 0.02),
        max: percentile(ranges[metric], 0.98)
      };
      return acc;
    }, {});

    return result;
  }, [data, gameweeks]);

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
          const aAvg = sortConfig.gws.reduce((sum, gw) => sum + parseFloat(a[gw][selectedMetric.toLowerCase()]), 0) / sortConfig.gws.length;
          const bAvg = sortConfig.gws.reduce((sum, gw) => sum + parseFloat(b[gw][selectedMetric.toLowerCase()]), 0) / sortConfig.gws.length;

          return sortConfig.order === 'ASC' ? aAvg - bAvg : bAvg - aAvg;
        }
      });
    }

    return result;
  }, [data, sortConfig, filterConfig, selectedMetric]);

  // Function to calculate color based on value using a modified ColorBrewer PiYG scale
  const getColor = (value, metric) => {
    const { min, max } = metricRanges[metric.toLowerCase()];
    let ratio;
    
    // Check if min and max are the same (all values are identical)
    if (min === max) {
      // Return a neutral color (e.g., gray) for this case
      return `rgb(128, 128, 128)`;
    }
    
    // Adjust the ratio calculation based on the metric
    switch (metric.toLowerCase()) {
      case 'fdr':
        // For FDR, lower values are better (blue), higher values are worse (red). DO NOT CHANGE THIS
        ratio = (value - min) / (max - min);
        break;
      case 'xgc':
        // For xGC, higher values are better (blue), lower values are worse (red). DO NOT CHANGE THIS
        ratio = 1 - (value - min) / (max - min);
        break;
      case 'xgs':
        // For xGS, lower values are better (blue), higher values are worse (red). DO NOT CHANGE THIS
        ratio = (value - min) / (max - min);
        break;
      case 'xcc':
        // For xCC, higher values are better (blue), lower values are worse (red). DO NOT CHANGE THIS
        ratio = 1 - (value - min) / (max - min);
        break;
      default:
        ratio = (value - min) / (max - min);
    }
    
    // Ensure ratio is between 0 and 1
    ratio = Math.max(0, Math.min(1, ratio));
    
    // Modified ColorBrewer PiYG scale (11 colors)
    const colors = [
      [226, 117, 173],
      [152, 59, 110],
      [126, 50, 90],
      [105, 38, 73],
      [85, 22, 67],    // Darkest pink 
      [39, 39, 39],    // Middle (neutral, dark gray)
      [20, 61, 121],   // Darkest blue 
      [27, 74, 145],
      [66, 132, 228],
      [108, 182, 255],
      [198, 230, 255]
    ];

    const colorIndex = Math.min(Math.floor(ratio * (colors.length - 1)), colors.length - 2);
    const lowerColor = colors[colorIndex];
    const upperColor = colors[colorIndex + 1];
    const colorRatio = (ratio * (colors.length - 1)) % 1;

    const r = Math.round(lowerColor[0] + colorRatio * (upperColor[0] - lowerColor[0]));
    const g = Math.round(lowerColor[1] + colorRatio * (upperColor[1] - lowerColor[1]));
    const b = Math.round(lowerColor[2] + colorRatio * (upperColor[2] - lowerColor[2]));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleHeaderClick = (gw) => {
    onRequestSort(gw);
  };

  const handleScrollLeft = () => {
    console.log('Scrolling left');
    setStartGW(prevGW => Math.max(1, prevGW - 1));
  };

  const handleScrollRight = () => {
    console.log('Scrolling right');
    setStartGW(prevGW => Math.min(33, prevGW + 1));
  };

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50; // Minimum distance to trigger a swipe
      if (touchStartX - touchEndX > swipeThreshold) {
        console.log('Swiped left');
        handleScrollRight();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        console.log('Swiped right');
        handleScrollLeft();
      }
    };

    table.addEventListener('touchstart', handleTouchStart);
    table.addEventListener('touchend', handleTouchEnd);

    return () => {
      table.removeEventListener('touchstart', handleTouchStart);
      table.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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
      <table className="fpl-table" ref={tableRef}>
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
                      value={row[gw][selectedMetric.toLowerCase()]}
                      backgroundColor={getColor(parseFloat(row[gw][selectedMetric.toLowerCase()]), selectedMetric)}
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