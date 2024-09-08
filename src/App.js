import React from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Table from './components/Table';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <ControlPanel />
        <Table />
      </main>
    </div>
  );
}

export default App;