import React from 'react';
import PropTypes from 'prop-types';

import arrowLeft from './assets/mobile/app-bar/arrow-left.svg';
import avatarIcon from './assets/mobile/app-bar/avatar.svg';
import paperclip from './assets/mobile/app-bar/paperclip.svg';
import calendarIcon from './assets/mobile/app-bar/calendar.svg';
import moreVert from './assets/mobile/app-bar/more-vert.svg';
import './app-bar.css';

const MULTI_ACTIONS = [
  { src: paperclip, label: 'Priponka' },
  { src: calendarIcon, label: 'Koledar' },
  { src: moreVert, label: 'Več' },
];

export const AppBar = ({
  configuration = 'small',
  style = 'light',
  leading = 'defaultBack',
  actions = 'single',
  title = 'Page Title',
  className = '',
}) => {
  const isStacked = configuration === 'medium' || configuration === 'large';
  const actionIcons =
    actions === 'multiple'
      ? MULTI_ACTIONS
      : actions === 'single'
        ? [{ src: avatarIcon, label: 'Profil', size: 36 }]
        : [];

  const leadingBtn =
    leading !== 'none' ? (
      <button type="button" className="si-app-bar__icon-btn" aria-label="Nazaj">
        <img src={arrowLeft} alt="" width="24" height="24" />
      </button>
    ) : (
      <span className="si-app-bar__icon-btn si-app-bar__icon-btn--spacer" />
    );

  const actionsEl = (
    <div className="si-app-bar__actions">
      {actionIcons.map((a) => (
        <button
          key={a.label}
          type="button"
          className="si-app-bar__icon-btn"
          aria-label={a.label}
        >
          <img
            src={a.src}
            alt=""
            width={a.size || 24}
            height={a.size || 24}
          />
        </button>
      ))}
      {actionIcons.length === 0 && (
        <span className="si-app-bar__icon-btn si-app-bar__icon-btn--spacer" />
      )}
    </div>
  );

  const titleCentered =
    configuration === 'small' &&
    (actions === 'none' || actions === 'single');

  return (
    <header
      className={[
        'si-app-bar',
        `si-app-bar--${configuration}`,
        `si-app-bar--${style}`,
        titleCentered ? 'si-app-bar--title-centered' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isStacked ? (
        <>
          <div className="si-app-bar__top">
            {leadingBtn}
            <div className="si-app-bar__top-spacer" />
            {actionsEl}
          </div>
          <div className="si-app-bar__title">{title}</div>
        </>
      ) : (
        <div className="si-app-bar__row">
          {leadingBtn}
          <div className="si-app-bar__title">{title}</div>
          {actionsEl}
        </div>
      )}
    </header>
  );
};

AppBar.propTypes = {
  configuration: PropTypes.oneOf(['small', 'medium', 'large']),
  style: PropTypes.oneOf(['light', 'primary']),
  leading: PropTypes.oneOf(['defaultBack', 'none', 'custom']),
  actions: PropTypes.oneOf(['single', 'multiple', 'none']),
  title: PropTypes.string,
  className: PropTypes.string,
};
