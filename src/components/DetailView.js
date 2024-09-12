import React from 'react';
import './DetailView.css';

function DetailView({ row, gameweeks, onClose }) {
  // Generate random form data
  const formData = Array(5).fill().map(() => ({
    opponent: ['MUN', 'ARS', 'CHE', 'LIV', 'MCI'][Math.floor(Math.random() * 5)],
    result: ['W', 'D', 'L'][Math.floor(Math.random() * 3)],
    goalsScored: Math.floor(Math.random() * 4),
    goalsConceded: Math.floor(Math.random() * 4)
  }));

  const maxGoals = Math.max(...formData.map(game => Math.max(game.goalsScored, game.goalsConceded)), 1);

  return (
    <div className="detail-view">
      <div className="detail-content">
        <div className="team-info">
          <h2 className="team-name">{row.team}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="form-card">
          <span>Form (Last 5 games)</span>
          <div className="goals-chart">
            {formData.map((game, index) => (
              <div key={index} className="goals-column">
                <div className="opponent-name">{game.opponent}</div>
                <div className="goals-bars">
                  <div 
                    className="goals-scored" 
                    style={{ height: `${(game.goalsScored / maxGoals) * 50}%` }}
                  >
                    <span className="goals-label">{game.goalsScored}</span>
                  </div>
                  <div 
                    className="goals-conceded" 
                    style={{ height: `${(game.goalsConceded / maxGoals) * 50}%` }}
                  >
                    <span className="goals-label">{game.goalsConceded}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;