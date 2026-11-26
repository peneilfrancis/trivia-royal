import React, { useEffect, useState } from 'react';

interface StageProps {
  children: React.ReactNode;
}

export const Stage: React.FC<StageProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / 1280;
      const scaleY = windowHeight / 720;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        width: '1280px',
        height: '720px',
        position: 'relative',
        backgroundColor: 'var(--bg-page)',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};
