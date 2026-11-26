import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { ScoreChip } from '../components/ScoreChip';
import { GradientBar } from '../components/GradientBar';
import { loadSession, saveSession, getGame } from '../utils/storage';
import { Session, Game } from '../types';

export const CardScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const { index: indexParam } = useParams<{ index: string }>();
  const cardIndex = parseInt(indexParam || '0', 10);

  const [session, setSession] = useState<Session | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      navigate('/games');
      return;
    }

    const g = getGame(s.gameId);
    if (!g) {
      navigate('/games');
      return;
    }

    const row = Math.floor(cardIndex / 4);
    const cardPoints = (row + 1) * 100;

    // Set step to card's point value when opened
    const updatedSession = { ...s, step: cardPoints };
    setSession(updatedSession);
    setGame(g);
    saveSession(updatedSession);
  }, [cardIndex, navigate]);

  if (!session || !game) return null;

  const card = game.cards[cardIndex];
  const row = Math.floor(cardIndex / 4);
  const col = cardIndex % 4;
  const category = game.categories[col];
  const points = (row + 1) * 100;

  // Reveal Answer & mark used
  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
    const updatedUsed = [...session.used];
    updatedUsed[cardIndex] = true;

    const updatedSession = { ...session, used: updatedUsed };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  // Score change
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

  const handleStepChange = (newStep: number) => {
    const updatedSession = { ...session, step: newStep };
    setSession(updatedSession);
    saveSession(updatedSession);
  };

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

  const handleBackToBoard = () => {
    // Return step to 100
    const updatedSession = { ...session, step: 100 };
    saveSession(updatedSession);
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
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        }}
      >
        <OrangeButton variant="secondary" size="small" onClick={handleBackToBoard}>
          ← Back to Board
        </OrangeButton>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: 'var(--title-gold)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {category} · {points} POINTS
        </h1>
        <div style={{ width: '120px' }} />
      </div>

      {/* Main Card View */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 48px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px 48px',
            width: '920px',
            maxWidth: '100%',
            boxShadow: 'var(--card-shadow)',
            border: '4px solid var(--card-yellow)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '20px',
          }}
        >
          {/* Optional Image */}
          {card?.image && (
            <div style={{ maxHeight: '200px', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src={card.image}
                alt="Card Clue"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Question Text */}
          <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#1F2937',
                lineHeight: 1.35,
              }}
            >
              {card?.question}
            </p>
          </div>

          {/* Answer Box or Show Answer Button */}
          {isAnswerRevealed ? (
            <div
              style={{
                width: '100%',
                backgroundColor: '#ECFDF5',
                border: '3px solid #10B981',
                borderRadius: '16px',
                padding: '20px 28px',
                animation: 'fadeIn 0.2s ease-in',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#065F46',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Correct Answer
              </span>
              <p
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#047857',
                }}
              >
                {card?.answer}
              </p>
            </div>
          ) : (
            <OrangeButton size="large" onClick={handleRevealAnswer}>
              Show Answer
            </OrangeButton>
          )}
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

      {/* Gradient Bar */}
      <GradientBar height={40} />
    </div>
  );
};
