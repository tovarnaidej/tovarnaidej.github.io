import React from 'react';
import PropTypes from 'prop-types';

import './divider.css';

export const Divider = ({
  type = 'fullWidth',
  showLabel = false,
  label = 'Subheader',
  className = '',
}) => (
  <div
    className={[
      'si-divider',
      `si-divider--${type}`,
      showLabel ? 'si-divider--labeled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {showLabel && <span className="si-divider__label">{label}</span>}
    <hr className="si-divider__line" />
  </div>
);

Divider.propTypes = {
  type: PropTypes.oneOf(['fullWidth', 'inset']),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};
