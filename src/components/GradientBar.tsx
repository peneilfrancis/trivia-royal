import React from 'react';

interface GradientBarProps {
  height?: number;
  style?: React.CSSProperties;
}

export const GradientBar: React.FC<GradientBarProps> = ({ height = 40, style = {} }) => {
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        background: 'linear-gradient(to right, #F85A14 0%, #FFB900 33%, #7DBA00 66%, #00A3F5 100%)',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
