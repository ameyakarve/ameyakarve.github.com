import React, { useMemo } from 'react';
import GWCell from './GWCell';
import './Table.css';

function Table({ data, sortConfig, filterConfig }) {
  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Apply filtering
    if (filterConfig.length > 0) {
      result = result.filter(row => filterConfig.includes(row.team));
    }

    // Apply sorting
    if (sortConfig.gws.length > 0) {
      result = [...result].sort((a, b) => {
        const aAvg = sortConfig.gws.reduce((sum, gw) => sum + a[gw], 0) / sortConfig.gws.length;
        const bAvg = sortConfig.gws.reduce((sum, gw) => sum + b[gw], 0) / sortConfig.gws.length;

        if (sortConfig.order === 'ASC') {
          return aAvg - bAvg;
        } else {
          return bAvg - aAvg;
        }
      });
    }

    return result;
  }, [data, sortConfig, filterConfig]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const gameweeks = ['GW1', 'GW2', 'GW3', 'GW4', 'GW5', 'GW6'];

  return (
    <table className="fpl-table">
      <thead>
        <tr>
          <th>Team</th>
          {gameweeks.map(gw => <th key={gw}>{gw}</th>)}
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedData.map(row => (
          <tr key={row.id}>
            <td>{row.team}</td>
            {gameweeks.map(gw => (
              <td key={gw}>
                <GWCell value={row[gw]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;