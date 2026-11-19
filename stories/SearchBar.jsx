import React from 'react';
import PropTypes from 'prop-types';

import magnifier from './assets/mobile/search/magnifying-glass.svg';
import arrowLeft from './assets/mobile/search/arrow-left.svg';
import closeIcon from './assets/mobile/search/close.svg';
import './mobile-tokens.css';
import './search-bar.css';

const RESULTS = [
  {
    title: 'List Item One',
    supporting: 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  },
  {
    title: 'List Item Two',
    supporting: 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  },
  {
    title: 'List Item Three',
    supporting: 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  },
];

export const SearchBar = ({
  style = 'defaultStyle',
  resultsMode = 'hide',
  showAvatar = false,
  showResultAvatars = true,
  placeholder = 'Input search text',
  query = 'Input text',
  platform = 'android',
  className = '',
}) => {
  const isExpanded = resultsMode !== 'hide';
  const classes = [
    'si-search-bar',
    `si-search-bar--${style}`,
    isExpanded ? 'si-search-bar--expanded' : 'si-search-bar--collapsed',
    `si-search-bar--${platform}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isExpanded) {
    return (
      <div className={classes}>
        <div className="si-search-bar__expanded-inner">
          <div className="si-search-bar__header">
            <button
              type="button"
              className="si-search-bar__icon-btn"
              aria-label="Nazaj"
            >
              <img src={arrowLeft} alt="" width="24" height="24" />
            </button>
            <div className="si-search-bar__input-face">
              {query ? (
                <>
                  <span className="si-search-bar__value">{query}</span>
                  <span className="si-search-bar__caret" aria-hidden="true" />
                </>
              ) : (
                <span className="si-search-bar__value si-search-bar__value--hint">{placeholder}</span>
              )}
            </div>
            {/* The clear button exists only while the field has text. */}
            {query && (
              <button
                type="button"
                className="si-search-bar__icon-btn"
                aria-label="Počisti"
              >
                <img src={closeIcon} alt="" width="24" height="24" />
              </button>
            )}
          </div>
          <div className="si-search-bar__divider" />
          {resultsMode === 'empty' ? (
            <div className="si-search-bar__empty" aria-hidden="true" />
          ) : (
            <div className="si-search-bar__list">
              {RESULTS.map((item, idx) => (
                <div key={idx} className="si-search-bar__result">
                  {showResultAvatars && (
                    <span
                      className="si-search-bar__result-avatar"
                      aria-hidden="true"
                    >
                      <span className="si-search-bar__avatar-letter si-cap-centred">A</span>
                    </span>
                  )}
                  <div className="si-search-bar__result-text">
                    <span className="si-search-bar__result-title">
                      {item.title}
                    </span>
                    <span className="si-search-bar__result-support">
                      {item.supporting}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="si-search-bar__field">
        <span className="si-search-bar__placeholder">{placeholder}</span>
        <div className="si-search-bar__trailing">
          <span className="si-search-bar__search-icon" aria-hidden="true">
            <img src={magnifier} alt="" width="24" height="24" />
          </span>
          {showAvatar && (
            <span className="si-search-bar__avatar" aria-hidden="true">
              <span className="si-search-bar__avatar-letter si-cap-centred">A</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  style: PropTypes.oneOf(['defaultStyle', 'filled', 'outlined']),
  resultsMode: PropTypes.oneOf(['hide', 'empty', 'shown']),
  showAvatar: PropTypes.bool,
  showResultAvatars: PropTypes.bool,
  placeholder: PropTypes.string,
  /** Text in the expanded field (catalog: `Input text`); empty shows the placeholder without the clear button. */
  query: PropTypes.string,
  /** SIIconButton (back / clear) is a 48 slot on Android and 40 on iOS. */
  platform: PropTypes.oneOf(['ios', 'android']),
  className: PropTypes.string,
};
