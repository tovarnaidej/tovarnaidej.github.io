import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './accordion.css';

export const Accordion = ({
  style = 'defaultStyle',
  title = 'Accordion Title',
  initiallyExpanded = false,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const items = ['Item 1', 'Item 2', 'Item 3'];
  const classes = [
    'si-accordion',
    `si-accordion--${style}`,
    expanded ? 'si-accordion--expanded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <button
        type="button"
        className="si-accordion__header"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="si-accordion__title">{title}</span>
        <span className="si-accordion__chevron" aria-hidden="true" />
      </button>
      {expanded && (
        <ul className="si-accordion__body">
          {items.map((item) => (
            <li key={item} className="si-accordion__item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Accordion.propTypes = {
  style: PropTypes.oneOf(['defaultStyle', 'outlined', 'filled']),
  title: PropTypes.string,
  initiallyExpanded: PropTypes.bool,
  className: PropTypes.string,
};
