import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './tabs.css';

export const Tabs = ({
  style = 'underline',
  configuration = 'fixed',
  tabCount = 3,
  className = '',
}) => {
  const [selected, setSelected] = useState(0);
  const labels = Array.from({ length: tabCount }, (_, i) => `Tab ${i + 1}`);

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
          className={[
            'si-tabs__tab',
            selected === index ? 'si-tabs__tab--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setSelected(index)}
        >
          {label}
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
