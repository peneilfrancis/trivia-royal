import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YellowCard } from '../components/YellowCard';
import { OrangeButton } from '../components/OrangeButton';
import { ScoreChip } from '../components/ScoreChip';
import { Modal } from '../components/Modal';
import { GradientBar } from '../components/GradientBar';
import { loadSession, saveSession, getGame } from '../utils/storage';
import { Session, Game } from '../types';

export const GameBoardPage: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      navigate('/games');
      return;
    }
    setSession(s);

    const g = getGame(s.gameId);
    if (!g) {
      navigate('/games');
      return;
    }
    setGame(g);
  }, [navigate]);

  if (!session || !game) return null;

  // Score chip handler
  const handleScoreChange = (teamId: string, newScore: number, delta: number) => {
    const updatedTeams = session.teams.map((t) =>
      t.id === teamId ? { ...t, score: newScore } : t
    );
    const updatedSession: Session = {
      ...session,
      teams: updatedTeams,
      undo: [...session.undo, { teamId, delta }],
    };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  // Step change handler
  const handleStepChange = (newStep: number) => {
    const updatedSession = { ...session, step: newStep };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  // Undo handler
  const handleUndo = () => {
    if (session.undo.length === 0) return;
    const lastAction = session.undo[session.undo.length - 1];
    const updatedUndo = session.undo.slice(0, -1);

    const updatedTeams = session.teams.map((t) =>
      t.id === lastAction.teamId ? { ...t, score: t.score - lastAction.delta } : t
    );

    const updatedSession: Session = {
      ...session,
      teams: updatedTeams,
      undo: updatedUndo,
    };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  // Cell click
  const handleCellClick = (index: number) => {
    if (session.used[index]) return;
    navigate(`/card/${index}`);
  };

  // Check if all 20 cards are used
  const usedCount = session.used.filter(Boolean).length;
  if (usedCount === 20) {
    navigate('/ranking');
    return null;
  }

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
      {/* Top Header */}
      <div
        style={{
          padding: '12px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--title-gold)' }}>
            TRIVIA ROYALE
          </span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#6B7280' }}>
            · {game.name}
          </span>
        </div>

        <OrangeButton
          variant="danger"
          size="small"
          onClick={() => setIsEndGameModalOpen(true)}
        >
          End Game
        </OrangeButton>
      </div>

      {/* Board 4x5 Grid */}
      <div
        style={{
          flex: 1,
          padding: '12px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {game.categories.map((cat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--title-gold)',
                color: '#2B2000',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '18px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* 5 Rows */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: '8px',
          }}
        >
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
              }}
            >
              {[0, 1, 2, 3].map((col) => {
                const index = row * 4 + col;
                const isUsed = session.used[index];
                const points = (row + 1) * 100;

                return (
                  <YellowCard
                    key={col}
                    clickable={!isUsed}
                    dimmed={isUsed}
                    onClick={() => handleCellClick(index)}
                    style={{
                      height: '100%',
                      borderRadius: '14px',
                      fontSize: '32px',
                      fontWeight: 900,
                    }}
                  >
                    {isUsed ? '' : points}
                  </YellowCard>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Score Bar */}
      <div
        style={{
          backgroundColor: 'var(--score-bar-bg)',
          padding: '10px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid #C4C4C4',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto' }}>
          {session.teams.map((t) => (
            <ScoreChip
              key={t.id}
              team={t}
              step={session.step}
              onScoreChange={handleScoreChange}
              onStepChange={handleStepChange}
            />
          ))}
        </div>

        <div style={{ marginLeft: '16px' }}>
          <OrangeButton
            variant="secondary"
            size="small"
            disabled={session.undo.length === 0}
            onClick={handleUndo}
            title="Undo last score change"
          >
            ↺ Undo
          </OrangeButton>
        </div>
      </div>

      {/* 40px Gradient Strip */}
      <GradientBar height={40} />

      {/* End Game Modal */}
      <Modal
        isOpen={isEndGameModalOpen}
        onClose={() => setIsEndGameModalOpen(false)}
        title="End Game"
        width="460px"
      >
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#4B5563', marginBottom: '20px' }}>
          Are you sure you want to end this game now and see the final standings?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <OrangeButton variant="secondary" onClick={() => setIsEndGameModalOpen(false)}>
            Resume Play
          </OrangeButton>
          <OrangeButton variant="danger" onClick={() => navigate('/ranking')}>
            Confirm End Game
          </OrangeButton>
        </div>
      </Modal>
    </div>
  );
};
