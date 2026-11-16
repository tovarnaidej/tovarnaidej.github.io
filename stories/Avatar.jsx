import React from 'react';
import PropTypes from 'prop-types';

import avatarPhoto from './assets/mobile/avatar/avatar-photo.jpg';
import './avatar.css';

export const Avatar = ({
  type = 'filled',
  size = 45,
  initials = 'SJ',
  className = '',
}) => {
  const classes = [
    'si-avatar',
    `si-avatar--${type}`,
    `si-avatar--s${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="img" aria-label={initials}>
      {type === 'photo' ? (
        <img className="si-avatar__photo" src={avatarPhoto} alt="" aria-hidden="true" />
      ) : (
        <span className="si-avatar__initials">{initials}</span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  type: PropTypes.oneOf(['photo', 'filled', 'outlined']),
  size: PropTypes.oneOf([45, 60, 100]),
  initials: PropTypes.string,
  className: PropTypes.string,
};
