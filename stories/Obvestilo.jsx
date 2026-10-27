import React, { useState } from 'react';
import PropTypes from 'prop-types';

import statusSuccess from './assets/obvestilo/status-success.svg';
import statusWarning from './assets/obvestilo/status-warning.svg';
import statusError from './assets/obvestilo/status-error.svg';
import statusInformation from './assets/obvestilo/status-information.svg';
import closeSuccess from './assets/obvestilo/close-success.svg';
import closeWarning from './assets/obvestilo/close-warning.svg';
import closeError from './assets/obvestilo/close-error.svg';
import closeInformation from './assets/obvestilo/close-information.svg';
import './obvestilo.css';

const statusIcons = {
  success: statusSuccess,
  warning: statusWarning,
  error: statusError,
  information: statusInformation,
};

const closeIcons = {
  success: closeSuccess,
  warning: closeWarning,
  error: closeError,
  information: closeInformation,
};

const alertRoles = {
  success: 'status',
  warning: 'alert',
  error: 'alert',
  information: 'status',
};

export const Obvestilo = ({
  type = 'success',
  title = 'Naslov obvestila',
  message = 'Kratek opis obvestila z jasnim naslednjim korakom za uporabnika.',
  showAction = true,
  actionLabel = 'Poglej podrobnosti',
  actionHref,
  onActionClick,
  dismissible = true,
  onDismiss,
  viewport = 'auto',
  className = '',
  ...props
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const classes = [
    'obvestilo',
    `obvestilo--${type}`,
    viewport !== 'auto' ? `obvestilo--viewport-${viewport}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleDismiss = (event) => {
    if (onDismiss) {
      onDismiss(event);
    } else {
      setDismissed(true);
    }
  };

  const actionProps = {
    className: 'obvestilo__action',
    onClick: onActionClick,
  };

  return (
    <div
      className={classes}
      role={alertRoles[type]}
      {...props}
    >
      <img
        className="obvestilo__icon"
        src={statusIcons[type]}
        width="24"
        height="24"
        alt=""
        aria-hidden="true"
      />
      <div className="obvestilo__content">
        {title ? <p className="obvestilo__title">{title}</p> : null}
        {message ? <p className="obvestilo__message">{message}</p> : null}
        {showAction && actionLabel
          ? actionHref
            ? (
              <a href={actionHref} {...actionProps}>
                {actionLabel}
              </a>
            )
            : (
              <button type="button" {...actionProps}>
                {actionLabel}
              </button>
            )
          : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          className="obvestilo__close"
          aria-label="Zapri"
          onClick={handleDismiss}
        >
          <img
            className="obvestilo__close-icon"
            src={closeIcons[type]}
            width="20"
            height="20"
            alt=""
            aria-hidden="true"
          />
        </button>
      ) : null}
    </div>
  );
};

Obvestilo.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'error', 'information']),
  title: PropTypes.string,
  message: PropTypes.string,
  showAction: PropTypes.bool,
  actionLabel: PropTypes.string,
  actionHref: PropTypes.string,
  onActionClick: PropTypes.func,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  viewport: PropTypes.oneOf(['auto', 'desktop', 'mobile']),
  className: PropTypes.string,
};
