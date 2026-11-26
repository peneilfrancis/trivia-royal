import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { GradientBar } from '../components/GradientBar';
import { getGame, saveSession } from '../utils/storage';
import { Game, Team, Session, TEAM_COLORS } from '../types';

export const TeamSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const [game, setGame] = useState<Game | null>(null);
  const [teamCount, setTeamCount] = useState<number>(4);
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      navigate('/games');
      return;
    }
    const found = getGame(gameId);
    if (!found) {
      navigate('/games');
      return;
    }
    setGame(found);
  }, [gameId, navigate]);

  if (!game) return null;

  const handleTeamNameChange = (index: number, val: string) => {
    const updated = [...teamNames];
    updated[index] = val;
    setTeamNames(updated);
  };

  const handleStartGame = () => {
    setError(null);

    // Compute effective names: if blank, default to color name
    const finalTeams: Team[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < teamCount; i++) {
      const colorObj = TEAM_COLORS[i];
      let name = teamNames[i].trim();
      if (!name) {
        name = colorObj.name;
      }

      if (usedNames.has(name.toLowerCase())) {
        setError(`Team names must be unique. "${name}" is used more than once.`);
        return;
      }

      usedNames.add(name.toLowerCase());
      finalTeams.push({
        id: `team-${i + 1}`,
        name,
        color: colorObj.hex,
        score: 0,
      });
    }

    const newSession: Session = {
      gameId: game.id,
      teams: finalTeams,
      used: Array(20).fill(false),
      step: 100,
      undo: [],
    };

    saveSession(newSession);
    navigate('/game');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <OrangeButton variant="secondary" size="small" onClick={() => navigate('/games')}>
          ← Back
        </OrangeButton>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--title-gold)' }}>
          TEAM SETUP
        </h1>
        <div style={{ width: '80px' }} />
      </div>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px 48px',
            width: '840px',
            boxShadow: 'var(--card-shadow)',
            border: '3px solid var(--card-yellow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                color: '#B91C1C',
                padding: '12px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Number of teams selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: 800 }}>Number of Teams (2 to 6):</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTeamCount(num)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    fontWeight: 800,
                    backgroundColor: teamCount === num ? 'var(--btn-orange)' : '#F3F4F6',
                    color: teamCount === num ? '#FFFFFF' : '#374151',
                    boxShadow: teamCount === num ? '0 4px 10px rgba(248, 90, 20, 0.3)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Teams Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: teamCount > 3 ? '1fr 1fr' : '1fr',
              gap: '16px',
            }}
          >
            {Array.from({ length: teamCount }).map((_, idx) => {
              const colorObj = TEAM_COLORS[idx];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: `2px solid ${colorObj.hex}`,
                    borderRadius: '14px',
                    padding: '10px 16px',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: colorObj.hex,
                      flexShrink: 0,
                    }}
                  />
                  <input
                    type="text"
                    placeholder={`Team ${colorObj.name}`}
                    value={teamNames[idx]}
                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'none',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1F2937',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <OrangeButton size="large" onClick={handleStartGame}>
              Start Game →
            </OrangeButton>
          </div>
        </div>
      </div>

      <GradientBar height={30} />
    </div>
  );
};
