import React from 'react';
import './Drawer.css';

function FilterDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="drawer filter-drawer">
      <div className="drawer-header">
        <h2>Filter</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="drawer-content">
        {/* Add filter options here */}
        <p>Filter options will go here</p>
      </div>
    </div>
  );
}

export default FilterDrawer;