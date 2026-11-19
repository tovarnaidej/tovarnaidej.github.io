import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './tabs.css';

/* Fiksno: Flutter's `TextOverflow.ellipsis` keeps the longest prefix that fits together
   with "…" and centres the shortened line (`TextAlign.center`). CSS `text-overflow` would
   leave it at the start of the box, so the same cut is made here by measuring. */
const TabLabel = ({ label, selected, truncate }) => {
  const box = useRef(null);
  const probe = useRef(null);
  const [shown, setShown] = useState(label);

  useLayoutEffect(() => {
    if (!truncate) {
      setShown(label);
      return undefined;
    }
    const fit = () => {
      if (!box.current || !probe.current) return;
      const cs = getComputedStyle(box.current);
      const room =
        box.current.getBoundingClientRect().width -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      const width = (text) => {
        probe.current.textContent = text;
        return probe.current.getBoundingClientRect().width;
      };
      let next = label;
      if (width(label) > room + 0.01) {
        next = '…';
        for (let end = label.length - 1; end > 0; end -= 1) {
          const candidate = `${label.slice(0, end).trimEnd()}…`;
          if (width(candidate) <= room + 0.01) {
            next = candidate;
            break;
          }
        }
      }
      probe.current.textContent = '';
      setShown(next);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box.current);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [label, selected, truncate]);

  return (
    <span className="si-tabs__label" ref={box}>
      <span className="si-tabs__text" data-text={label}>
        {truncate ? shown : label}
      </span>
      <span className="si-tabs__probe" ref={probe} aria-hidden="true" />
    </span>
  );
};

TabLabel.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  truncate: PropTypes.bool.isRequired,
};

export const Tabs = ({
  style = 'underline',
  configuration = 'fixed',
  tabCount = 3,
  className = '',
}) => {
  const [selected, setSelected] = useState(0);
  const labels = Array.from({ length: tabCount }, (_, i) => `Zavihek ${i + 1}`);

  return (
    <div
      className={[
        'si-tabs',
        `si-tabs--${style}`,
        `si-tabs--${configuration}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
    >
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={selected === index}
          aria-label={label}
          className={[
            'si-tabs__tab',
            selected === index ? 'si-tabs__tab--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setSelected(index)}
        >
          <TabLabel
            label={label}
            selected={selected === index}
            truncate={configuration === 'fixed'}
          />
          {selected === index && style === 'underline' ? (
            <span className="si-tabs__pill" aria-hidden="true">
              <span className="si-tabs__pill-size">{label}</span>
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  style: PropTypes.oneOf(['underline', 'filled']),
  configuration: PropTypes.oneOf(['fixed', 'scrollable']),
  tabCount: PropTypes.oneOf([3, 4, 5, 8]),
  className: PropTypes.string,
};
