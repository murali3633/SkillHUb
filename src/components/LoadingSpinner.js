import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', overlay = false }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: '20px',
          height: '20px',
          borderWidth: '2px',
        };
      case 'large':
        return {
          width: '60px',
          height: '60px',
          borderWidth: '6px',
        };
      case 'medium':
      default:
        return {
          width: '40px',
          height: '40px',
          borderWidth: '4px',
        };
    }
  };

  const spinnerStyles = {
    ...getSizeStyles(),
    border: `${getSizeStyles().borderWidth} solid #f3f3f3`,
    borderTop: `${getSizeStyles().borderWidth} solid #667eea`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: overlay ? '2rem' : '1rem',
    ...(overlay && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9998,
    }),
  };

  const messageStyles = {
    color: '#666',
    fontSize: size === 'small' ? '0.8rem' : size === 'large' ? '1.2rem' : '1rem',
    fontWeight: '500',
    textAlign: 'center',
  };

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles}></div>
      {message && <div style={messageStyles}>{message}</div>}
    </div>
  );
};

export default LoadingSpinner;



