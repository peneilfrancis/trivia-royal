import React from 'react';

interface YellowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  dimmed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const YellowCard: React.FC<YellowCardProps> = ({
  children,
  onClick,
  clickable = false,
  dimmed = false,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={{
        backgroundColor: dimmed ? '#D2BD8A' : 'var(--card-yellow)',
        color: dimmed ? '#73613A' : 'var(--card-text)',
        borderRadius: 'var(--card-radius)',
        boxShadow: dimmed ? 'none' : 'var(--card-shadow)',
        cursor: clickable && !dimmed ? 'pointer' : 'default',
        opacity: dimmed ? 0.6 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontWeight: 800,
        ...style,
      }}
      className={`yellow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
