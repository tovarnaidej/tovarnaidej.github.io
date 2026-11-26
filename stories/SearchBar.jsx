import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import magnifier from './assets/mobile/search/magnifying-glass.svg';
import arrowLeft from './assets/mobile/search/arrow-left.svg';
import closeIcon from './assets/mobile/search/close.svg';
import './mobile-tokens.css';
import './search-bar.css';

const SUPPORTING = 'Supporting line text lorem ipsum dolor sit amet, consectetur';

const RESULTS = [
  {
    title: 'List Item One',
  },
  {
    title: 'List Item Two',
  },
  {
    title: 'List Item Three',
  },
];

export const SearchBar = ({
  style = 'defaultStyle',
  resultsMode = 'hide',
  showAvatar = false,
  showResultAvatars = true,
  showClearButton = true,
  placeholder = 'Input search text',
  supportingText = SUPPORTING,
  query,
  platform = 'android',
  className = '',
}) => {
  const showResults = resultsMode !== 'hide';
  // SISearchBar: the field's text (initialQuery: the catalog's demo text "Input text" while
  // results are shown and Zapri is on) and _isExpanded (starts at showResults).
  const [text, setText] = useState(query ?? (showResults && showClearButton ? 'Input text' : ''));
  const [expanded, setExpanded] = useState(showResults);
  const input = useRef(null);
  // didUpdateWidget sets _isExpanded = showResults on every rebuild of the catalog screen (a
  // changed control): a collapsed bar opens again. Slog, Rezultati and Zapri rebuild the
  // whole bar instead (the story keys it, as the catalog's ValueKey).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setExpanded(showResults);
  }, [showAvatar, showResultAvatars, placeholder, platform]);
  // Back arrow: _collapse - unfocus, clear, collapse. Clear (x): _clear - empties the text.
  const collapse = () => {
    input.current?.blur();
    setText('');
    setExpanded(false);
  };
  const field = (faceClass, hintClass) => (
    // SiExpandTouchTarget(onTap: requestFocus): the whole text area focuses the field
    <label className="si-search-bar__text">
      <span className={text ? faceClass : hintClass}>{text || placeholder}</span>
      <input
        ref={input}
        className="si-search-bar__input"
        type="text"
        value={text}
        aria-label={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onChange={(e) => setText(e.target.value)}
      />
    </label>
  );
  const classes = [
    'si-search-bar',
    `si-search-bar--${style}`,
    expanded ? 'si-search-bar--expanded' : 'si-search-bar--collapsed',
    `si-search-bar--${platform}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (expanded) {
    return (
      <div className={classes}>
        <div className="si-search-bar__expanded-inner">
          <div className="si-search-bar__header">
            <button
              type="button"
              className="si-search-bar__icon-btn"
              aria-label="Nazaj"
              onClick={collapse}
            >
              <img src={arrowLeft} alt="" width="24" height="24" />
            </button>
            <div className="si-search-bar__input-face">
              {field('si-search-bar__value', 'si-search-bar__value si-search-bar__value--hint')}
            </div>
            {/* The clear button exists only while the field has text. */}
            {showClearButton && text && (
              <button
                type="button"
                className="si-search-bar__icon-btn"
                aria-label="Počisti"
                onClick={() => { setText(''); input.current?.focus(); }}
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
                      {supportingText}
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
        {field('si-search-bar__placeholder', 'si-search-bar__placeholder')}
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

// Order = the catalog's controls: Slog, Rezultati, Avatar, Avatarji rezultatov, Zapri,
// Nadomestno besedilo.
SearchBar.propTypes = {
  style: PropTypes.oneOf(['defaultStyle', 'filled', 'outlined']),
  resultsMode: PropTypes.oneOf(['hide', 'empty', 'shown']),
  showAvatar: PropTypes.bool,
  showResultAvatars: PropTypes.bool,
  /** "Zapri": the clear (x) button of the open field, and the catalog's demo text with it. */
  showClearButton: PropTypes.bool,
  placeholder: PropTypes.string,
  /** Supporting line of every result (iOS catalog "Besedilo"). */
  supportingText: PropTypes.string,
  /** Text the field starts with (default: "Input text" while results show and Zapri is on). */
  query: PropTypes.string,
  platform: PropTypes.oneOf(['ios', 'android']),
  className: PropTypes.string,
};
