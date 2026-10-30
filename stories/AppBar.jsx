import React from 'react';
import PropTypes from 'prop-types';

import './app-bar.css';

export const AppBar = ({
  configuration = 'small',
  style = 'light',
  leading = 'defaultBack',
  actions = 'single',
  title = 'Page Title',
  className = '',
}) => {
  const classes = [
    'si-app-bar',
    `si-app-bar--${configuration}`,
    `si-app-bar--${style}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const actionCount = actions === 'multiple' ? 2 : actions === 'single' ? 1 : 0;

  return (
    <header className={classes}>
      <div className="si-app-bar__row">
        {leading !== 'none' && (
          <button type="button" className="si-app-bar__icon" aria-label="Nazaj">
            {leading === 'custom' ? '☰' : '‹'}
          </button>
        )}
        <div className="si-app-bar__title">{title}</div>
        <div className="si-app-bar__actions">
          {Array.from({ length: actionCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="si-app-bar__icon"
              aria-label={`Dejanje ${i + 1}`}
            >
              ●
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

AppBar.propTypes = {
  configuration: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.oneOf(['light', 'primary']),
  leading: PropTypes.oneOf(['defaultBack', 'none', 'custom']),
  actions: PropTypes.oneOf(['single', 'multiple', 'none']),
  title: PropTypes.string,
  className: PropTypes.string,
};
