import React, { useState } from 'react';
import PropTypes from 'prop-types';

import chevronPrimary from './assets/mobile/accordion/chevron-up-primary.svg';
import chevronWhite from './assets/mobile/accordion/chevron-up-white.svg';
import './accordion.css';

const ITEMS = ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'];

export const Accordion = ({
  style = 'defaultStyle',
  title = 'Accordion component',
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
            <img
              src={isFilled ? chevronWhite : chevronPrimary}
              alt=""
              width="40"
              height="40"
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
