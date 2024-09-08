import React from 'react';
import GWCell from './GWCell';
import './Table.css';

const Table = () => {
  const teams = [
    'ARS', 'AVL', 'BOU', 'BRE', 'BHA',
    'CHE', 'CRY', 'EVE', 'FUL', 'LIV',
    'MCI', 'MUN', 'NEW', 'NFO', 'TOT',
    'WHU', 'WOL', 'BUR', 'LUT', 'SHU'
  ];
  const gameWeeks = ['1', '2', '3', '4', '5', '6']; // Changed to just numbers

  // Function to get a random opponent
  const getRandomOpponent = (currentTeam) => {
    const opponents = teams.filter(team => team !== currentTeam);
    return opponents[Math.floor(Math.random() * opponents.length)];
  };

  return (
    <div className="table-container">
      <table className="fdr-table">
        <thead>
          <tr>
            <th className="fixed-column">Team</th>
            {gameWeeks.map(gw => (
              <th key={gw}>{gw}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team}>
              <td className="fixed-column">{team}</td>
              {gameWeeks.map(gw => (
                <GWCell 
                  key={`${team}-${gw}`} 
                  opponent={getRandomOpponent(team)}
                  isHome={Math.random() < 0.5}
                  value={Math.floor(Math.random() * 5) + 1} 
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;