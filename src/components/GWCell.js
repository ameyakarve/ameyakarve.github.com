import React from 'react';
import './Table.css';

function GWCell({ opponent, isHome, value, backgroundColor }) {
  // Function to determine if the background color is light
  const isColorLight = (color) => {
    const rgb = color.match(/\d+/g);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128;
  };

  const textColor = isColorLight(backgroundColor) ? '#000000' : '#ffffff';

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