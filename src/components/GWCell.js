import React from 'react';

const GWCell = ({ opponent, isHome, value }) => {
  const getColorClass = (value) => {
    if (value <= 2) return 'easy';
    if (value === 3) return 'medium';
    return 'hard';
  };

  return (
    <td className={`gw-cell ${getColorClass(value)}`}>
      <div className="opponent">{opponent} ({isHome ? 'H' : 'A'})</div>
      <div className="value">{value}</div>
    </td>
  );
};

export default GWCell;