import React from 'react';
import './Table.css';

function GWCell({ opponent, isHome, value, backgroundColor }) {
  // Function to determine if the background color is light
  

  const textColor = '#ffffff';

  return (
    <div className="gw-cell" style={{ backgroundColor }}>
      <div className="opponent" style={{ color: textColor }}>
        {opponent} ({isHome ? 'H' : 'A'})
      </div>
      <div className="value" style={{ color: textColor }}>{value}</div>
    </div>
  );
}

export default GWCell;