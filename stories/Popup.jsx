import React from 'react';
import PropTypes from 'prop-types';

import './popup.css';

export const Popup = ({
  style = 'outlined',
  showAction = true,
  heading = 'Sample Heading',
  message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  className = '',
}) => (
  <div
    className={['si-popup', `si-popup--${style}`, className]
      .filter(Boolean)
      .join(' ')}
    role="dialog"
    aria-labelledby="si-popup-heading"
  >
    <button type="button" className="si-popup__close" aria-label="Zapri">
      ×
    </button>
    <div className="si-popup__icon" aria-hidden="true">
      ✓
    </div>
    <h2 id="si-popup-heading" className="si-popup__heading">
      {heading}
    </h2>
    <p className="si-popup__message">{message}</p>
    {showAction && (
      <button type="button" className="si-popup__action">
        Continue
      </button>
    )}
  </div>
);

Popup.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  showAction: PropTypes.bool,
  heading: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
};
