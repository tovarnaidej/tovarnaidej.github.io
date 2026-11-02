import React, { useId } from 'react';
import PropTypes from 'prop-types';

import checkVerified from './assets/mobile/popup/check-verified.svg';
import closeIcon from './assets/mobile/popup/close.svg';
import './popup.css';

export const Popup = ({
  style = 'outlined',
  showAction = true,
  heading = 'Sample Heading',
  message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  actionLabel = 'Example Button',
  className = '',
}) => {
  const headingId = useId();

  return (
    <div
      className={['si-popup', `si-popup--${style}`, className]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-labelledby={headingId}
    >
      <div className="si-popup__body">
        <span className="si-popup__icon" aria-hidden="true">
          <img src={checkVerified} alt="" width="36" height="36" />
        </span>
        <div className="si-popup__content">
          <div className="si-popup__text">
            <h2 id={headingId} className="si-popup__heading">
              {heading}
            </h2>
            <p className="si-popup__message">{message}</p>
          </div>
          {showAction && (
            <button type="button" className="si-popup__action">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
      <button type="button" className="si-popup__close" aria-label="Zapri">
        <img src={closeIcon} alt="" width="20" height="20" />
      </button>
    </div>
  );
};

Popup.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  showAction: PropTypes.bool,
  heading: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  className: PropTypes.string,
};
