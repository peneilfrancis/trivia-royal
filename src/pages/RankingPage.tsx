import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { GradientBar } from '../components/GradientBar';
import { loadSession, saveSession, clearSession } from '../utils/storage';
import { Session, Team } from '../types';

interface RankedTeam extends Team {
  rank: number;
}

export const RankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      navigate('/games');
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  // Sort teams from highest to lowest score
  const sorted = [...session.teams].sort((a, b) => b.score - a.score);

  // Compute ranks with ties: 1, 1, 3, etc.
  const rankedTeams: RankedTeam[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].score < sorted[i - 1].score) {
      currentRank = i + 1;
    }
    rankedTeams.push({
      ...sorted[i],
      rank: currentRank,
    });
  }

  // Check if first place is tied
  const isFirstTied = rankedTeams.filter((t) => t.rank === 1).length > 1;

  // Podium top 3 (if available)
  const topTeams = rankedTeams.slice(0, 3);
  const remainingTeams = rankedTeams.slice(3);

  // Play Again: restart same game with same teams, all cards reset, scores at 0
  const handlePlayAgain = () => {
    const resetTeams = session.teams.map((t) => ({ ...t, score: 0 }));
    const newSession: Session = {
      gameId: session.gameId,
      teams: resetTeams,
      used: Array(20).fill(false),
      step: 100,
      undo: [],
    };
    saveSession(newSession);
    navigate('/game');
  };

  const handleBackToHome = () => {
    clearSession();
    navigate('/');
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
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            fontSize: '38px',
            fontWeight: 900,
            color: 'var(--title-gold)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          FINAL STANDINGS
        </h1>

        <div style={{ display: 'flex', gap: '14px' }}>
          <OrangeButton variant="secondary" size="small" onClick={handlePlayAgain}>
            🔄 Play Again
          </OrangeButton>
          <OrangeButton size="small" onClick={handleBackToHome}>
            🏠 Back to Home
          </OrangeButton>
        </div>
      </div>

      {/* Main Content: Podium & List */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 48px',
          gap: '24px',
        }}
      >
        {isFirstTied && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '8px 24px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            🏆 IT'S A TIE FOR 1ST PLACE! 🏆
          </div>
        )}

        {/* Podium Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '740px',
            height: '240px',
          }}
        >
          {/* 2nd Place (Left) */}
          {topTeams.length > 1 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: topTeams[1].color,
                  fontWeight: 800,
                  fontSize: '18px',
                  marginBottom: '4px',
                }}
              >
                {topTeams[1].name}
              </span>
              <span style={{ fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>
                {topTeams[1].score} pts
              </span>
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  backgroundColor: '#E5E7EB',
                  borderTop: `6px solid ${topTeams[1].color}`,
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#4B5563',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                🥈 2
              </div>
            </div>
          )}

          {/* 1st Place (Center - Tallest) */}
          {topTeams.length > 0 && (
            <div
              style={{
                flex: 1.2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: topTeams[0].color,
                  fontWeight: 900,
                  fontSize: '22px',
                  marginBottom: '4px',
                }}
              >
                {topTeams[0].name}
              </span>
              <span style={{ fontWeight: 900, fontSize: '24px', marginBottom: '8px' }}>
                {topTeams[0].score} pts
              </span>
              <div
                style={{
                  width: '100%',
                  height: '190px',
                  backgroundColor: 'var(--card-yellow)',
                  borderTop: `6px solid ${topTeams[0].color}`,
                  borderRadius: '18px 18px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '44px',
                  fontWeight: 900,
                  color: 'var(--card-text)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
              >
                🥇 1
              </div>
            </div>
          )}

          {/* 3rd Place (Right) */}
          {topTeams.length > 2 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: topTeams[2].color,
                  fontWeight: 800,
                  fontSize: '18px',
                  marginBottom: '4px',
                }}
              >
                {topTeams[2].name}
              </span>
              <span style={{ fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>
                {topTeams[2].score} pts
              </span>
              <div
                style={{
                  width: '100%',
                  height: '100px',
                  backgroundColor: '#F3F4F6',
                  borderTop: `6px solid ${topTeams[2].color}`,
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#6B7280',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                🥉 3
              </div>
            </div>
          )}
        </div>

        {/* Remaining Teams (4th to 6th) */}
        {remainingTeams.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {remainingTeams.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  border: `2px solid ${t.color}`,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#6B7280' }}>
                  #{t.rank}
                </span>
                <span style={{ fontWeight: 800, fontSize: '16px', color: t.color }}>
                  {t.name}
                </span>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#1F2937' }}>
                  {t.score} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gradient Bar */}
      <GradientBar height={36} />
    </div>
  );
};
