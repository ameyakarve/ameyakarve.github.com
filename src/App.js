import React from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Table from './components/Table';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container">
        <ControlPanel />
        <Table />
      </main>
    </div>
  );
}

export default App;