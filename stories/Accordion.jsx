import React, { useState } from 'react';
import PropTypes from 'prop-types';

import chevronDown from './assets/mobile/accordion/chevron-down.svg';
import './mobile-tokens.css';
import './accordion.css';

// accordion_configurator.dart
const ITEMS = ['Item 1', 'Item 2', 'Item 3'];

export const Accordion = ({
  style = 'defaultStyle',
  title = 'Accordion Title',
  initiallyExpanded = false,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const isFilled = style === 'filled';
  const classes = [
    'si-accordion',
    `si-accordion--${style}`,
    expanded ? 'si-accordion--expanded' : 'si-accordion--collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="si-accordion__header-wrap">
        <button
          type="button"
          className="si-accordion__header"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="si-accordion__title">{title}</span>
          <span className="si-accordion__chevron" aria-hidden="true">
            <span
              className="si-accordion__chevron-icon"
              style={{ '--si-icon': `url(${JSON.stringify(chevronDown)})` }}
            />
          </span>
        </button>
        {expanded ? (
          <div className="si-accordion__divider" aria-hidden="true" />
        ) : null}
      </div>
      {expanded ? (
        <ul className="si-accordion__body">
          {ITEMS.map((item, idx) => (
            <li key={`${item}-${idx}`} className="si-accordion__item">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

Accordion.propTypes = {
  style: PropTypes.oneOf(['defaultStyle', 'outlined', 'filled']),
  title: PropTypes.string,
  initiallyExpanded: PropTypes.bool,
  className: PropTypes.string,
};
