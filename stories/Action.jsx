import React from 'react';
import PropTypes from 'prop-types';

import './action.css';

export const Action = ({
  style = 'elevated',
  maxLines = 'two',
  showAction = true,
  showDismiss = true,
  message = 'This is a notification',
  className = '',
}) => {
  const lineClass =
    maxLines === 'one'
      ? 'si-action--lines-1'
      : maxLines === 'two'
        ? 'si-action--lines-2'
        : 'si-action--lines-unlimited';

  return (
    <div
      className={[
        'si-action',
        `si-action--${style}`,
        lineClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      <p className="si-action__message">{message}</p>
      <div className="si-action__actions">
        {showAction && (
          <button type="button" className="si-action__btn">
            Undo
          </button>
        )}
        {showDismiss && (
          <button type="button" className="si-action__dismiss" aria-label="Zapri">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

Action.propTypes = {
  style: PropTypes.oneOf(['elevated', 'outlined', 'filled']),
  maxLines: PropTypes.oneOf(['one', 'two', 'unlimited']),
  showAction: PropTypes.bool,
  showDismiss: PropTypes.bool,
  message: PropTypes.string,
  className: PropTypes.string,
};
