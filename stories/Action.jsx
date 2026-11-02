import React from 'react';
import PropTypes from 'prop-types';

import closeIcon from './assets/mobile/shared/close.svg';
import './action.css';

const joinClasses = (...names) => names.filter(Boolean).join(' ');

const DismissButton = () => (
  <button type="button" className="si-action__dismiss" aria-label="Zapri">
    <span className="si-action__dismiss-icon" aria-hidden="true">
      <img src={closeIcon} alt="" width="20" height="20" />
    </span>
  </button>
);

export const Action = ({
  style = 'elevated',
  maxLines = 'two',
  showAction = true,
  showDismiss = true,
  message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
  actionLabel = 'Action',
  className = '',
}) => {
  // unlimited + action: message on top, buttons row below (right-aligned)
  const isStacked = maxLines === 'unlimited' && showAction;
  const hasButtons = showAction || showDismiss;

  const actions = (showAction || showDismiss) && (
    <div className="si-action__actions">
      {showAction && (
        <button type="button" className="si-action__btn">
          <span className="si-action__btn-label">{actionLabel}</span>
        </button>
      )}
      {showDismiss && <DismissButton />}
    </div>
  );

  return (
    <div
      className={joinClasses(
        'si-action',
        `si-action--${style}`,
        `si-action--lines-${maxLines}`,
        isStacked ? 'si-action--stacked' : '',
        showAction ? 'si-action--has-action' : '',
        showDismiss ? 'si-action--has-dismiss' : '',
        hasButtons ? 'si-action--has-buttons' : '',
        className,
      )}
      role="status"
    >
      <p className="si-action__message" dir="auto">
        {message}
      </p>
      {actions}
    </div>
  );
};

Action.propTypes = {
  style: PropTypes.oneOf(['elevated', 'outlined', 'filled']),
  maxLines: PropTypes.oneOf(['one', 'two', 'unlimited']),
  showAction: PropTypes.bool,
  showDismiss: PropTypes.bool,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  className: PropTypes.string,
};
