import React from 'react';
import PropTypes from 'prop-types';

import alertIcon from './assets/mobile/alert/alert.svg';
import closeIcon from './assets/mobile/alert/close.svg';
import listItemChevron from './assets/mobile/alert/list-item-chevron.svg';
import './alert.css';

const joinClasses = (...names) => names.filter(Boolean).join(' ');

const AlertBody = ({ showIcon, showDismiss, title, message }) => (
  <>
    {showIcon && (
      <span className="si-alert__icon" aria-hidden="true">
        <img src={alertIcon} alt="" width="24" height="24" />
      </span>
    )}
    <div className="si-alert__text">
      <p className="si-alert__title">{title}</p>
      <p className="si-alert__message">{message}</p>
    </div>
    {showDismiss && (
      <button type="button" className="si-alert__dismiss" aria-label="Zapri">
        <img src={closeIcon} alt="" width="20" height="20" />
      </button>
    )}
  </>
);

AlertBody.propTypes = {
  showIcon: PropTypes.bool,
  showDismiss: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
};

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
  listTitle = 'List Item',
  supportingLines = 2,
  supportingText = 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  className = '',
}) => {
  if (mode === 'list') {
    const isCompact = !showSupporting || supportingLines === 1;

    return (
      <button
        type="button"
        className={joinClasses(
          'si-list-item',
          `si-list-item--${listStyle}`,
          isCompact ? 'si-list-item--compact' : 'si-list-item--multiline',
          showSupporting ? 'si-list-item--has-supporting' : '',
          showAvatar ? 'si-list-item--has-avatar' : '',
          showChevron ? 'si-list-item--has-chevron' : '',
          className,
        )}
      >
        {showAvatar && (
          <span className="si-list-item__avatar" aria-hidden="true">
            A
          </span>
        )}
        <span className="si-list-item__text">
          <span className="si-list-item__title">{listTitle}</span>
          {showSupporting && (
            <span className="si-list-item__supporting">{supportingText}</span>
          )}
        </span>
        {showChevron && (
          <span
            className="si-list-item__chevron"
            style={{ '--si-icon': `url(${JSON.stringify(listItemChevron)})` }}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <div
      className={joinClasses('si-alert', `si-alert--${style}`, className)}
      role="alert"
    >
      <div className="si-alert__content">
        <AlertBody
          showIcon={showIcon}
          showDismiss={showDismiss}
          title={title}
          message={message}
        />
      </div>
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
