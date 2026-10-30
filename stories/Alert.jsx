import React from 'react';
import PropTypes from 'prop-types';

import './alert.css';

export const Alert = ({
  mode = 'alert',
  style = 'filled',
  showIcon = true,
  showDismiss = true,
  title = 'Title',
  message = 'Message',
  listStyle = 'basic',
  showSupporting = true,
  showAvatar = false,
  showChevron = true,
  listTitle = 'List Item Title',
  supportingLines = 2,
  supportingText = 'Supporting text goes here',
  className = '',
}) => {
  if (mode === 'list') {
    return (
      <button
        type="button"
        className={[
          'si-list-item',
          `si-list-item--${listStyle}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {showAvatar && <span className="si-list-item__avatar" aria-hidden="true">A</span>}
        <span className="si-list-item__text">
          <span className="si-list-item__title">{listTitle}</span>
          {showSupporting && (
            <span
              className={[
                'si-list-item__supporting',
                supportingLines === 1 ? 'si-list-item__supporting--1' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {supportingText}
            </span>
          )}
        </span>
        {showChevron && <span className="si-list-item__chevron" aria-hidden="true">›</span>}
      </button>
    );
  }

  return (
    <div
      className={[
        'si-alert',
        `si-alert--${style}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
    >
      {showIcon && <span className="si-alert__icon" aria-hidden="true">!</span>}
      <div className="si-alert__body">
        <div className="si-alert__title">{title}</div>
        <div className="si-alert__message">{message}</div>
      </div>
      {showDismiss && (
        <button type="button" className="si-alert__dismiss" aria-label="Zapri">
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  mode: PropTypes.oneOf(['alert', 'list']),
  style: PropTypes.oneOf(['filled', 'stroke']),
  showIcon: PropTypes.bool,
  showDismiss: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  listStyle: PropTypes.oneOf(['basic', 'filled', 'outlined']),
  showSupporting: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showChevron: PropTypes.bool,
  listTitle: PropTypes.string,
  supportingLines: PropTypes.oneOf([1, 2]),
  supportingText: PropTypes.string,
  className: PropTypes.string,
};
