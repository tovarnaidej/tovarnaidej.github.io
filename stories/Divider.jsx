import React from 'react';
import PropTypes from 'prop-types';

import './mobile-tokens.css';
import './divider.css';

/**
 * Twin of SIDivider (components/flutter/lib/src/components/divider/si_divider.dart):
 * 1px line, optional label below it (gap 9, Bold 15/21 gray700).
 */
export const Divider = ({
  type = 'fullWidth',
  platform = 'android',
  showLabel = false,
  label = 'Subheader',
  className = '',
}) => (
  <div
    className={['si-divider', `si-divider--${type}`, `si-divider--${platform}`, className]
      .filter(Boolean)
      .join(' ')}
    role="separator"
  >
    <span className="si-divider__line" />
    {showLabel && <span className="si-divider__label">{label}</span>}
  </div>
);

Divider.propTypes = {
  type: PropTypes.oneOf(['fullWidth', 'inset']),
  platform: PropTypes.oneOf(['ios', 'android']),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};
