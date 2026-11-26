import React from 'react';
import { useNavigate } from 'react-router-dom';
import { YellowCard } from '../components/YellowCard';
import { OrangeButton } from '../components/OrangeButton';
import { GradientBar } from '../components/GradientBar';

export const PlayOptionsPage: React.FC = () => {
  const navigate = useNavigate();

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
          padding: '28px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <OrangeButton variant="secondary" size="small" onClick={() => navigate('/')}>
          ← Back
        </OrangeButton>
        <h1
          style={{
            fontSize: '44px',
            fontWeight: 800,
            color: 'var(--title-gold)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '1px',
          }}
        >
          TRIVIA ROYALE
        </h1>
        <div style={{ width: '80px' }} /> {/* Spacer */}
      </div>

      {/* Main Options */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '64px',
          padding: '0 48px',
          flex: 1,
        }}
      >
        {/* Create New Game Option */}
        <YellowCard
          clickable
          onClick={() => navigate('/create/setup')}
          style={{
            width: '380px',
            height: '320px',
            padding: '36px',
            textAlign: 'center',
            justifyContent: 'space-between',
            border: '4px solid #F5B922',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{ fontSize: '56px', marginTop: '12px' }}>➕</div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              CREATE NEW GAME
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#5A4200' }}>
              Build a custom 4-category quiz board with 20 cards and your own questions.
            </p>
          </div>
          <OrangeButton style={{ width: '100%', fontSize: '18px' }}>
            Get Started
          </OrangeButton>
        </YellowCard>

        {/* Saved Games Option */}
        <YellowCard
          clickable
          onClick={() => navigate('/games')}
          style={{
            width: '380px',
            height: '320px',
            padding: '36px',
            textAlign: 'center',
            justifyContent: 'space-between',
            border: '4px solid #F5B922',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
        >
          <div style={{ fontSize: '56px', marginTop: '12px' }}>📁</div>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              SAVED GAMES
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#5A4200' }}>
              Choose from your saved games or test out the pre-loaded Campus Quiz Night!
            </p>
          </div>
          <OrangeButton style={{ width: '100%', fontSize: '18px' }}>
            View Games
          </OrangeButton>
        </YellowCard>
      </div>

      {/* Bottom Gradient Bar */}
      <GradientBar height={30} />
    </div>
  );
};
