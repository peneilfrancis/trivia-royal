import React from 'react';

interface OrangeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'large' | 'small';
}

export const OrangeButton: React.FC<OrangeButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  style = {},
  disabled,
  ...props
}) => {
  let bg = 'var(--btn-orange)';
  let color = '#FFFFFF';
  let hoverBg = 'var(--btn-orange-hover)';

  if (variant === 'secondary') {
    bg = '#E5E5E5';
    color = '#333333';
    hoverBg = '#D0D0D0';
  } else if (variant === 'danger') {
    bg = '#E81A08';
    color = '#FFFFFF';
    hoverBg = '#C21304';
  }

  let padding = '14px 28px';
  let fontSize = '20px';
  let borderRadius = '12px';

  if (size === 'large') {
    padding = '18px 44px';
    fontSize = '26px';
    borderRadius = '16px';
  } else if (size === 'small') {
    padding = '8px 16px';
    fontSize = '15px';
    borderRadius = '8px';
  }

  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#CCCCCC' : bg,
        color: disabled ? '#888888' : color,
        padding,
        fontSize,
        fontWeight: 800,
        borderRadius,
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(248, 90, 20, 0.25)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = bg;
      }}
      {...props}
    >
      {children}
    </button>
  );
};
