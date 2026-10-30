import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './tab-bar.css';

export const TabBar = ({
  tabCount = 3,
  className = '',
}) => {
  const [selected, setSelected] = useState(0);
  const tabs = Array.from({ length: tabCount }, (_, i) => `Oznaka ${i + 1}`);

  return (
    <nav
      className={['si-tab-bar', className].filter(Boolean).join(' ')}
      role="tablist"
    >
      {tabs.map((label, index) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={selected === index}
          className={[
            'si-tab-bar__item',
            selected === index ? 'si-tab-bar__item--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setSelected(index)}
        >
          <span className="si-tab-bar__icon" aria-hidden="true" />
          <span className="si-tab-bar__label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

TabBar.propTypes = {
  tabCount: PropTypes.oneOf([2, 3, 4, 5]),
  className: PropTypes.string,
};
