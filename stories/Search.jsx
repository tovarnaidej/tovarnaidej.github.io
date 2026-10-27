import React, { useId, useState } from 'react';
import PropTypes from 'prop-types';

import searchIcon from './assets/search/search-icon.svg';
import searchIconEmbedded from './assets/search/search-icon-embedded.svg';
import arrowAction from './assets/search/arrow-action.svg';
import './search.css';

const defaultSuggestions = [
  'Digitalno potrdilo',
  'Digitalna identiteta',
  'Pridobitev potrdila SIGEN-CA',
];

const defaultResults = [
  {
    title: 'Digitalno potrdilo',
    description: 'Pridobitev in uporaba kvalificiranega digitalnega potrdila.',
    href: '#',
  },
  {
    title: 'Digitalna identiteta',
    description: 'Varna elektronska identifikacija za uporabo javnih storitev.',
    href: '#',
  },
  {
    title: 'SIGEN-CA',
    description: 'Navodila za naročilo, prevzem in obnovitev potrdila.',
    href: '#',
  },
];

const isForcedInteraction = (state) =>
  ['hover', 'focus', 'pressed'].includes(state);

export const Search = ({
  variant = 'universal',
  size = 'large',
  state = 'default',
  value,
  defaultValue = '',
  placeholder = 'Kaj iščete?',
  actionLabel = 'Iskanje',
  label = 'Iskanje',
  suggestions = defaultSuggestions,
  showSuggestions = false,
  activeSuggestion = 0,
  resultsState = 'none',
  results = defaultResults,
  resultCount = 12,
  onChange,
  onSubmit,
  onSuggestionSelect,
  className = '',
  ...props
}) => {
  const inputId = useId();
  const listboxId = `${inputId}-suggestions`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const filledDemoValue = 'Digitalno potrdilo';
  const filledFromValue = Boolean(currentValue);
  const effectiveState =
    state === 'default' && filledFromValue ? 'filled' : state;
  const isDisabled = effectiveState === 'disabled';
  const isEmbedded = variant === 'embedded';
  const isCompact = variant === 'compact';
  const isUniversal = variant === 'universal';
  const showPanel = showSuggestions && suggestions?.length > 0;
  const isFocusEmpty =
    effectiveState === 'focus' && !filledFromValue && isUniversal;
  // Storybook forced "filled" without value should still show Figma copy.
  const resolvedValue =
    effectiveState === 'filled' && !filledFromValue
      ? filledDemoValue
      : currentValue;
  const resolvedPlaceholder = isFocusEmpty
    ? ''
    : isDisabled && isCompact && !resolvedValue
      ? 'Iskanje trenutno ni na voljo'
      : placeholder;
  const showFocusCaret = isFocusEmpty;

  const classes = [
    'search',
    `search--${variant}`,
    isEmbedded ? `search--size-${size}` : '',
    `search--state-${effectiveState}`,
    isDisabled ? 'search--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (event) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isDisabled) return;
    onSubmit?.(currentValue, event);
  };

  const field = (
    <div className="search__field">
      {!isEmbedded && (
        <img
          className="search__icon"
          src={searchIcon}
          width="20"
          height="20"
          alt=""
          aria-hidden="true"
        />
      )}
      <div className="search__input-wrap">
        {/*
          Visible face mirrors Figma Query text node (hug + AUTO leading,
          centered in the 48px field). Native <input> clips Medium
          descenders and mis-centers Republika; keep input for a11y/caret.
        */}
        <span
          className={[
            'search__face',
            resolvedValue ? 'search__face--value' : 'search__face--placeholder',
          ].join(' ')}
          aria-hidden="true"
        >
          {resolvedValue || resolvedPlaceholder}
        </span>
        <input
          id={inputId}
          className="search__input"
          type="text"
          name="q"
          value={resolvedValue}
          placeholder={resolvedPlaceholder}
          disabled={isDisabled}
          aria-invalid={effectiveState === 'error' || undefined}
          aria-autocomplete={showPanel ? 'list' : undefined}
          aria-controls={showPanel ? listboxId : undefined}
          aria-expanded={showPanel || undefined}
          autoComplete="off"
          spellCheck={false}
          onChange={handleChange}
          {...(isForcedInteraction(effectiveState) ||
          (effectiveState === 'filled' && !filledFromValue)
            ? { tabIndex: -1, readOnly: true }
            : {})}
        />
        {showFocusCaret && (
          <span className="search__caret" aria-hidden="true" />
        )}
      </div>
    </div>
  );

  const action = (
    <button
      className="search__action"
      type="submit"
      disabled={isDisabled}
      aria-label={isCompact || (isEmbedded && size === 'compact') ? actionLabel : undefined}
    >
      {isCompact && (
        <img
          className="search__action-icon"
          src={arrowAction}
          width="20"
          height="20"
          alt=""
          aria-hidden="true"
        />
      )}
      {isEmbedded && size === 'compact' && (
        <img
          className="search__action-icon"
          src={searchIconEmbedded}
          width="22"
          height="22"
          alt=""
          aria-hidden="true"
        />
      )}
      {!isCompact && !(isEmbedded && size === 'compact') && (
        <span className="search__action-label">{actionLabel}</span>
      )}
    </button>
  );

  return (
    <form className={classes} role="search" onSubmit={handleSubmit} {...props}>
      <label className="visually-hidden" htmlFor={inputId}>
        {label}
      </label>

      {isEmbedded ? (
        <div className="search__row">
          <div className="search__shell">
            {field}
            {action}
          </div>
        </div>
      ) : (
        <div className="search__row">
          {field}
          {action}
        </div>
      )}

      {showPanel && (
        <ul
          id={listboxId}
          className="search__suggestions"
          role="listbox"
          aria-label="Predlogi iskanja"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion} role="presentation">
              <button
                type="button"
                className={[
                  'search__suggestion',
                  index === activeSuggestion ? 'search__suggestion--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="option"
                aria-selected={index === activeSuggestion}
                onClick={() => onSuggestionSelect?.(suggestion, index)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      {resultsState !== 'none' && (
        <SearchResultsPanel
          state={resultsState}
          query={currentValue || 'digitalno potrdilo'}
          results={results}
          resultCount={resultCount}
        />
      )}
    </form>
  );
};

const SearchResultsPanel = ({
  state = 'loading',
  query = 'digitalno potrdilo',
  results = defaultResults,
  resultCount = 12,
}) => {
  const classes = [
    'search__results',
    `search__results--${state}`,
    state === 'error' ? 'search__results--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const title =
    state === 'loading'
      ? 'Iščem rezultate …'
      : state === 'results'
        ? `Rezultati za »${query.toLowerCase()}«`
        : state === 'empty'
          ? `Ni rezultatov za »${query.toLowerCase()}«`
          : 'Rezultatov ni mogoče naložiti';

  const meta =
    state === 'results'
      ? `${resultCount} zadetkov`
      : state === 'empty'
        ? 'Preverite zapis, uporabite širši izraz ali odstranite filtre.'
        : state === 'error'
          ? 'Poskusite znova. Če se težava ponavlja, se vrnite pozneje.'
          : null;

  return (
    <div className={classes} aria-live="polite">
      <h2 className="search__results-title">{title}</h2>
      {meta && <p className="search__results-meta">{meta}</p>}

      {state === 'loading' && (
        <>
          <div className="search__skeleton search__skeleton--sm" />
          <div className="search__skeleton search__skeleton--md" />
          <div className="search__skeleton search__skeleton--md" />
        </>
      )}

      {state === 'results' &&
        results.map((item) => (
          <a key={item.title} className="search__result" href={item.href || '#'}>
            <p className="search__result-title">{item.title}</p>
            <p className="search__result-description">{item.description}</p>
          </a>
        ))}
    </div>
  );
};

SearchResultsPanel.propTypes = {
  state: PropTypes.oneOf(['loading', 'results', 'empty', 'error']),
  query: PropTypes.string,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
  resultCount: PropTypes.number,
};

Search.propTypes = {
  variant: PropTypes.oneOf(['universal', 'compact', 'embedded']),
  size: PropTypes.oneOf(['large', 'compact']),
  state: PropTypes.oneOf([
    'default',
    'hover',
    'focus',
    'filled',
    'error',
    'disabled',
    'results',
  ]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  actionLabel: PropTypes.string,
  label: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  showSuggestions: PropTypes.bool,
  activeSuggestion: PropTypes.number,
  resultsState: PropTypes.oneOf(['none', 'loading', 'results', 'empty', 'error']),
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
  resultCount: PropTypes.number,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSuggestionSelect: PropTypes.func,
  className: PropTypes.string,
};

export { SearchResultsPanel, defaultSuggestions, defaultResults };
