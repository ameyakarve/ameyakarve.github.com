import React from 'react';
import './Table.css';

function GWCell({ opponent, isHome, value }) {
  return (
    <div className="gw-cell">
      <div className="opponent">
        {opponent} ({isHome ? 'H' : 'A'})
      </div>
      <div className="value">{value}</div>
    </div>
  );
}

export default GWCell;