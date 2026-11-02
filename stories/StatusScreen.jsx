import React from 'react';
import PropTypes from 'prop-types';

import updateIcon from './assets/mobile/status-screen/status-update.svg';
import wifiSlashIcon from './assets/mobile/status-screen/status-wifi-slash.svg';
import warningIcon from './assets/mobile/status-screen/status-warning.svg';
import './status-screen.css';

const SCENARIOS = {
  update: {
    tone: 'primary',
    icon: updateIcon,
    title: 'Posodobite aplikacijo',
    description:
      'Za nadaljnjo uporabo potrebujete najnovejšo različico aplikacije. Posodobitev vključuje pomembne varnostne izboljšave in popravke.',
    meta: 'Trenutna različica 2.4.1 · zahtevana 2.5.0',
    primary: 'Posodobi aplikacijo',
    secondary: 'Pomoč pri posodobitvi',
  },
  offline: {
    tone: 'primary',
    icon: wifiSlashIcon,
    title: 'Ni internetne povezave',
    description:
      'Za preverjanje in namestitev posodobitve se povežite z internetom. Ko bo povezava vzpostavljena, poskusite znova.',
    meta: 'Povezava je potrebna za nadaljevanje',
    primary: 'Poskusi znova',
    secondary: 'Pomoč pri posodobitvi',
  },
  unsupported: {
    tone: 'error',
    icon: warningIcon,
    title: 'Naprava ni več podprta',
    description:
      'Ta različica aplikacije zahteva novejši operacijski sistem. Posodobite napravo ali se obrnite na podporo.',
    meta: 'Najnižja podprta različica: iOS 17 / Android 12',
    primary: 'Pomoč pri posodobitvi',
    secondary: '',
  },
};

export const StatusScreen = ({
  presentation = 'fullScreen',
  scenario = 'update',
  title,
  description,
  meta,
  primaryLabel,
  secondaryLabel,
  className = '',
}) => {
  const preset = SCENARIOS[scenario] || SCENARIOS.update;
  const resolved = {
    title: title || preset.title,
    description: description || preset.description,
    // Empty Storybook args must fall back to scenario presets (Figma copy).
    meta: meta || preset.meta,
    primary: primaryLabel || preset.primary,
    secondary: secondaryLabel || preset.secondary,
    tone: preset.tone,
    icon: preset.icon,
  };
  const isPopup = presentation === 'popup';
  const iconSize = isPopup ? 36 : 44;

  const illustration = (
    <div className="si-status__illustration" aria-hidden="true">
      <img
        className="si-status__icon"
        src={resolved.icon}
        alt=""
        width={iconSize}
        height={iconSize}
      />
    </div>
  );

  const copy = (
    <div className="si-status__copy">
      <h2 className="si-status__title">{resolved.title}</h2>
      <p className="si-status__description">{resolved.description}</p>
    </div>
  );

  const metaEl = resolved.meta ? (
    <p className="si-status__meta">{resolved.meta}</p>
  ) : null;

  const actions = (
    <div
      className={[
        'si-status__actions',
        resolved.secondary ? '' : 'si-status__actions--single',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button type="button" className="si-status__primary">
        {resolved.primary}
      </button>
      {resolved.secondary ? (
        <button type="button" className="si-status__secondary">
          {resolved.secondary}
        </button>
      ) : null}
    </div>
  );

  if (isPopup) {
    return (
      <div
        className={[
          'si-status',
          'si-status--popup',
          `si-status--${resolved.tone}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="si-status__popup-card">
          <div className="si-status__popup-stack">
            {illustration}
            {copy}
            {metaEl}
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'si-status',
        'si-status--fullScreen',
        `si-status--${resolved.tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="si-status__frame">
        <div className="si-status__content">{illustration}{copy}{metaEl}</div>
        {actions}
      </div>
    </div>
  );
};

StatusScreen.propTypes = {
  presentation: PropTypes.oneOf(['fullScreen', 'popup']),
  scenario: PropTypes.oneOf(['update', 'offline', 'unsupported']),
  title: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.string,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.string,
  className: PropTypes.string,
};
