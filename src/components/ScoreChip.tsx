import React, { useState } from 'react';
import { Team } from '../types';

interface ScoreChipProps {
  team: Team;
  step: number;
  onScoreChange: (teamId: string, newScore: number, delta: number) => void;
  onStepChange?: (newStep: number) => void;
}

export const ScoreChip: React.FC<ScoreChipProps> = ({
  team,
  step,
  onScoreChange,
  onStepChange,
}) => {
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [scoreText, setScoreText] = useState(team.score.toString());

  const [isEditingStep, setIsEditingStep] = useState(false);
  const [stepText, setStepText] = useState(step.toString());

  const handleScoreSubmit = () => {
    const parsed = parseInt(scoreText, 10);
    if (!isNaN(parsed)) {
      const delta = parsed - team.score;
      onScoreChange(team.id, parsed, delta);
    }
    setIsEditingScore(false);
  };

  const handleStepSubmit = () => {
    const parsed = parseInt(stepText, 10);
    if (!isNaN(parsed) && parsed > 0 && onStepChange) {
      onStepChange(parsed);
    }
    setIsEditingStep(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '150px',
      }}
    >
      {/* Team Name in its color */}
      <span
        style={{
          color: team.color,
          fontSize: '18px',
          fontWeight: 800,
          marginBottom: '4px',
          maxWidth: '160px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        {team.name}
      </span>

      {/* Chip Box */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: `3px solid ${team.color}`,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          height: '52px',
        }}
      >
        {/* Minus Button */}
        <button
          onClick={() => onScoreChange(team.id, team.score - step, -step)}
          title={`Subtract ${step}`}
          style={{
            width: '38px',
            height: '100%',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontSize: '22px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.1s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
        >
          −
        </button>

        {/* Center: Score & Step */}
        <div
          style={{
            padding: '0 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '70px',
          }}
        >
          {isEditingScore ? (
            <input
              autoFocus
              type="number"
              value={scoreText}
              onChange={(e) => setScoreText(e.target.value)}
              onBlur={handleScoreSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScoreSubmit();
                if (e.key === 'Escape') setIsEditingScore(false);
              }}
              style={{
                width: '64px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 800,
                border: '1px solid #F85A14',
                borderRadius: '4px',
              }}
            />
          ) : (
            <span
              onClick={() => {
                setScoreText(team.score.toString());
                setIsEditingScore(true);
              }}
              title="Click to edit score"
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#1F2937',
                cursor: 'pointer',
                lineHeight: 1.1,
              }}
            >
              {team.score}
            </span>
          )}

          {/* Step modifier */}
          {isEditingStep ? (
            <input
              autoFocus
              type="number"
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              onBlur={handleStepSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStepSubmit();
                if (e.key === 'Escape') setIsEditingStep(false);
              }}
              style={{
                width: '45px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid #F85A14',
                borderRadius: '2px',
              }}
            />
          ) : (
            <span
              onClick={() => {
                if (onStepChange) {
                  setStepText(step.toString());
                  setIsEditingStep(true);
                }
              }}
              title="Click to edit step adjustment"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#6B7280',
                cursor: onStepChange ? 'pointer' : 'default',
              }}
            >
              ±{step}
            </span>
          )}
        </div>

        {/* Plus Button */}
        <button
          onClick={() => onScoreChange(team.id, team.score + step, step)}
          title={`Add ${step}`}
          style={{
            width: '38px',
            height: '100%',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontSize: '22px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.1s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
        >
          +
        </button>
      </div>
    </div>
  );
};
