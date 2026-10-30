import React from 'react';
import PropTypes from 'prop-types';

import './search-bar.css';

export const SearchBar = ({
  style = 'defaultStyle',
  resultsMode = 'hide',
  showAvatar = false,
  showResultAvatars = true,
  placeholder = 'Input search text',
  className = '',
}) => {
  const results =
    resultsMode === 'shown'
      ? ['Ljubljana', 'Maribor', 'Celje']
      : [];

  return (
    <div
      className={[
        'si-search-bar',
        `si-search-bar--${style}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="si-search-bar__field">
        {showAvatar && <span className="si-search-bar__avatar" aria-hidden="true" />}
        <span className="si-search-bar__icon" aria-hidden="true" />
        <span className="si-search-bar__placeholder">{placeholder}</span>
      </div>
      {resultsMode !== 'hide' && (
        <div className="si-search-bar__results">
          {resultsMode === 'empty' && (
            <div className="si-search-bar__empty">Ni rezultatov</div>
          )}
          {results.map((item) => (
            <div key={item} className="si-search-bar__result">
              {showResultAvatars && (
                <span className="si-search-bar__result-avatar" aria-hidden="true" />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  style: PropTypes.oneOf(['defaultStyle', 'filled', 'outlined']),
  resultsMode: PropTypes.oneOf(['hide', 'empty', 'shown']),
  showAvatar: PropTypes.bool,
  showResultAvatars: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
