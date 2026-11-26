import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundImage: 'url("./assets/start opt 4.png")',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <h1
        className="sr-only"
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        Trivia Royale
      </h1>

      {/* Clickable button overlay placed directly on top of the graphic's PLAY button */}
      <button
        type="button"
        onClick={() => navigate('/play')}
        aria-label="Play Game"
        title="Play Trivia Royale"
        style={{
          position: 'absolute',
          left: '288px',
          top: '416px',
          width: '268px',
          height: '114px',
          borderRadius: '26px',
          backgroundColor: 'transparent',
          border: '3px solid transparent',
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
          e.currentTarget.style.boxShadow = '0 0 24px rgba(248, 90, 20, 0.7)';
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#FFFFFF';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 90, 20, 0.9)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};
