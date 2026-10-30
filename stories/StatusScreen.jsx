import React from 'react';
import PropTypes from 'prop-types';

import './status-screen.css';

const SCENARIOS = {
  update: {
    tone: 'primary',
    title: 'Posodobite aplikacijo',
    description: 'Za nadaljnjo uporabo potrebujete najnovejšo različico.',
    meta: 'Trenutna različica 2.4.1 · zahtevana 2.5.0',
    primary: 'Posodobi aplikacijo',
    secondary: 'Pomoč pri posodobitvi',
  },
  offline: {
    tone: 'primary',
    title: 'Ni internetne povezave',
    description: 'Preverite povezavo in poskusite znova.',
    meta: '',
    primary: 'Poskusi znova',
    secondary: 'Pomoč',
  },
  unsupported: {
    tone: 'error',
    title: 'Naprava ni več podprta',
    description: 'Ta naprava ne izpolnjuje več zahtev aplikacije.',
    meta: '',
    primary: 'Pomoč',
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
    meta: meta ?? preset.meta,
    primary: primaryLabel || preset.primary,
    secondary: secondaryLabel ?? preset.secondary,
    tone: preset.tone,
  };

  return (
    <div
      className={[
        'si-status',
        `si-status--${presentation}`,
        `si-status--${resolved.tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="si-status__card">
        <div className="si-status__illustration" aria-hidden="true" />
        <h2 className="si-status__title">{resolved.title}</h2>
        <p className="si-status__description">{resolved.description}</p>
        {resolved.meta ? (
          <p className="si-status__meta">{resolved.meta}</p>
        ) : null}
        <button type="button" className="si-status__primary">
          {resolved.primary}
        </button>
        {resolved.secondary ? (
          <button type="button" className="si-status__secondary">
            {resolved.secondary}
          </button>
        ) : null}
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
