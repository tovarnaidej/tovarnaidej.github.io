import React, { useLayoutEffect, useRef, useState } from 'react';
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
  // AnimatedCrossFade(200 ms): height with Curves.easeInOut, the items fade linearly; the body
  // stays until the collapse has finished.
  const [bodyShown, setBodyShown] = useState(initiallyExpanded);
  const body = useRef(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    if (expanded) setBodyShown(true);
    return undefined;
  }, [expanded]);
  useLayoutEffect(() => {
    const el = body.current;
    if (!el || !el.animate) return undefined;
    if (!expanded && !bodyShown) return undefined;
    const full = el.scrollHeight;
    const [h0, h1, o0, o1] = expanded ? [0, full, 0, 1] : [full, 0, 1, 0];
    const size = el.animate([{ height: `${h0}px` }, { height: `${h1}px` }], { duration: 200, easing: 'cubic-bezier(0.42, 0, 0.58, 1)' });
    const fade = el.animate([{ opacity: o0 }, { opacity: o1 }], { duration: 200, easing: 'linear' });
    if (!expanded) size.onfinish = () => setBodyShown(false);
    return () => { size.cancel(); fade.cancel(); };
  }, [expanded, bodyShown]);
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
      {expanded || bodyShown ? (
        <ul className="si-accordion__body" ref={body}>
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
