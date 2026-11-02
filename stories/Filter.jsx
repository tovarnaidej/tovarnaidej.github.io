import React from 'react';
import PropTypes from 'prop-types';

import closeWindow from './assets/mobile/filter/close-window.svg';
import filterDiamond from './assets/mobile/filter/filter-diamond.svg';
import filterIcon from './assets/mobile/filter/filter.svg';
import sortIcon from './assets/mobile/filter/sort.svg';
import './filter.css';

const DEFAULT_LABELS = {
  category: 'Category',
  filters: 'Filters',
  applied: 'Applied filter',
  sort: 'Sort',
};

const BAR_CHIP_COUNT = 9;

const joinClasses = (...names) => names.filter(Boolean).join(' ');

/** Glyph from the Figma SVG, painted with currentColor through a mask. */
const Icon = ({ src, className = '' }) => (
  <span
    className={joinClasses('si-filter__icon', className)}
    style={{ '--si-icon': `url(${JSON.stringify(src)})` }}
    aria-hidden="true"
  />
);

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const Chip = ({
  type,
  style,
  label,
  leadingIcon = false,
  badgeCount = null,
  showDismiss = false,
  enabled = true,
  inBar = false,
}) => {
  const classes = joinClasses(
    'si-filter',
    `si-filter--${type}`,
    `si-filter--${style}`,
    inBar ? 'si-filter--in-bar' : '',
    !enabled ? 'si-filter--disabled' : '',
  );

  return (
    <button type="button" className={classes} disabled={!enabled}>
      {type === 'category' && leadingIcon && <Icon src={filterDiamond} />}
      {type === 'filters' && (
        <span className="si-filter__group">
          <Icon src={filterIcon} />
          <span className="si-filter__label">{label}</span>
        </span>
      )}
      {type === 'sort' && (
        <span className="si-filter__group">
          <Icon src={sortIcon} className="si-filter__icon--sort" />
          <span className="si-filter__label">{label}</span>
        </span>
      )}
      {(type === 'category' || type === 'applied') && (
        <span className="si-filter__label">{label}</span>
      )}
      {type === 'filters' && badgeCount != null && (
        <span className="si-filter__badge">
          <span className="si-filter__badge-count">{badgeCount}</span>
        </span>
      )}
      {type === 'applied' && showDismiss && <Icon src={closeWindow} />}
    </button>
  );
};

Chip.propTypes = {
  type: PropTypes.oneOf(['category', 'filters', 'applied', 'sort']).isRequired,
  style: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  label: PropTypes.string,
  leadingIcon: PropTypes.bool,
  badgeCount: PropTypes.number,
  showDismiss: PropTypes.bool,
  enabled: PropTypes.bool,
  inBar: PropTypes.bool,
};

export const Filter = ({
  previewAsBar = false,
  layout = 'singleRowScrollable',
  type = 'category',
  style = 'outlined',
  categoryState = 'unselected',
  label = '',
  leadingIcon = false,
  showBadge = false,
  showDismiss = false,
  className = '',
}) => {
  if (previewAsBar) {
    return (
      <div
        className={joinClasses(
          'si-filter-bar',
          `si-filter-bar--${layout}`,
          className,
        )}
      >
        {Array.from({ length: BAR_CHIP_COUNT }, (_, index) => (
          <Chip
            key={index}
            type="category"
            style="outlined"
            label="Label"
            inBar
          />
        ))}
      </div>
    );
  }

  let resolvedStyle = style === 'filled' ? 'filled' : 'outlined';
  let enabled = true;

  if (type === 'category') {
    resolvedStyle = categoryState === 'selected' ? 'filled' : 'outlined';
    enabled = categoryState !== 'disabled';
  }

  return (
    <div className={joinClasses('si-filter-wrap', className)}>
      <Chip
        type={type}
        style={resolvedStyle}
        label={label || DEFAULT_LABELS[type]}
        leadingIcon={type === 'category' && leadingIcon}
        badgeCount={type === 'filters' && showBadge ? 3 : null}
        showDismiss={type === 'applied' && showDismiss}
        enabled={enabled}
      />
    </div>
  );
};

Filter.propTypes = {
  previewAsBar: PropTypes.bool,
  layout: PropTypes.oneOf(['singleRowScrollable', 'multiRowOverflow']),
  type: PropTypes.oneOf(['category', 'filters', 'applied', 'sort']),
  style: PropTypes.oneOf(['outlined', 'filled']),
  categoryState: PropTypes.oneOf(['unselected', 'selected', 'disabled']),
  label: PropTypes.string,
  leadingIcon: PropTypes.bool,
  showBadge: PropTypes.bool,
  showDismiss: PropTypes.bool,
  className: PropTypes.string,
};
