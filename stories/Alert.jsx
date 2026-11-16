import React from 'react';
import PropTypes from 'prop-types';

import alertIcon from './assets/mobile/alert/alert.svg';
import closeIconIos from './assets/mobile/alert/close.svg';
import closeIconAndroid from './assets/mobile/alert/close-android.svg';
import { ListItem } from './ListItem';
import './mobile-tokens.css';
import './alert.css';

const joinClasses = (...names) => names.filter(Boolean).join(' ');

/**
 * Twin of SIAlert (components/flutter/lib/src/components/alert/si_alert.dart).
 * mode="list" renders the SIListItem twin, as in the Opozorila catalog screen.
 */
export const Alert = ({
  mode = 'alert',
  style = 'filled',
  platform = 'android',
  showIcon = true,
  showDismiss = true,
  title = 'Title',
  message = 'Message',
  listStyle = 'basic',
  showSupporting = true,
  showAvatar = false,
  showChevron = true,
  listTitle = 'Title',
  supportingLines = 2,
  supportingText = 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  className = '',
}) => {
  if (mode === 'list') {
    return (
      <ListItem
        style={listStyle}
        platform={platform}
        title={listTitle}
        supportingText={showSupporting ? supportingText : ''}
        supportingLineLimit={supportingLines}
        showAvatar={showAvatar}
        // Catalog: the chevron slot is always reserved; "Puščica" only hides the glyph.
        showChevron
        chevronHidden={!showChevron}
        className={className}
      />
    );
  }

  const closeIcon = platform === 'ios' ? closeIconIos : closeIconAndroid;

  return (
    <div
      className={joinClasses(
        'si-alert',
        `si-alert--${style}`,
        `si-alert--${platform}`,
        className,
      )}
      role="alert"
    >
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
          <img src={closeIcon} alt="" width="24" height="24" />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  mode: PropTypes.oneOf(['alert', 'list']),
  style: PropTypes.oneOf(['filled', 'stroke']),
  platform: PropTypes.oneOf(['ios', 'android']),
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
