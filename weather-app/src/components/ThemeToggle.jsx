import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="floating-add-btn"
      style={{
        top: '30px',
        left: '30px',
        width: '60px',
        height: '60px',
        fontSize: '1.8rem',
        background: isDark
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : 'linear-gradient(135deg, #FFD700, #FFED4E)',
        boxShadow: isDark
          ? '0 10px 30px rgba(0, 0, 0, 0.6)'
          : '0 10px 30px rgba(255, 215, 0, 0.4)',
      }}
      title={isDark ? 'تم روشن' : 'تم تاریک'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;

