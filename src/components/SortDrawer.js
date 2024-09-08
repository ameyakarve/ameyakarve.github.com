import React from 'react';
import './Drawer.css';

function SortDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="drawer sort-drawer">
      <div className="drawer-header">
        <h2>Sort</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="drawer-content">
        {/* Add sort options here */}
        <p>Sort options will go here</p>
      </div>
    </div>
  );
}

export default SortDrawer;