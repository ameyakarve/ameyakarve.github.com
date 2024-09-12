import React from 'react';
import './Header.css';

function Header({ title }) {
  return (
    <header className="header">
      <h1 className="header-title">{title.toUpperCase()}</h1>
    </header>
  );
}

export default Header;