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

  // SIAvatar: at most 2 letters (1 at 30 and below), upper case.
  const letters = (initials || '').slice(0, Number(size) <= 30 ? 1 : 2).toUpperCase();

  return (
    <div className={classes} role="img" aria-label={letters}>
      {type === 'photo' ? (
        <img className="si-avatar__photo" src={avatarPhoto} alt="" aria-hidden="true" />
      ) : (
        <span className="si-avatar__initials">{letters}</span>
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
