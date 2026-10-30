import React from 'react';
import PropTypes from 'prop-types';

import './filter.css';

const defaultLabel = (type) => {
  const map = {
    category: 'Kategorija',
    filters: 'Filtri',
    applied: 'Uporabljeno',
    sort: 'Razvrščanje',
  };
  return map[type] || 'Filter';
};

const Chip = ({
  type,
  style,
  label,
  leadingIcon,
  badgeCount,
  showDismiss,
  enabled,
}) => {
  const classes = [
    'si-filter',
    `si-filter--${type}`,
    `si-filter--${style}`,
    !enabled ? 'si-filter--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} disabled={!enabled}>
      {leadingIcon && <span className="si-filter__icon" aria-hidden="true" />}
      <span className="si-filter__label">{label || defaultLabel(type)}</span>
      {type === 'filters' && badgeCount != null && (
        <span className="si-filter__badge">{badgeCount}</span>
      )}
      {type === 'applied' && showDismiss && (
        <span className="si-filter__dismiss" aria-hidden="true">
          ×
        </span>
      )}
    </button>
  );
};

Chip.propTypes = {
  type: PropTypes.string,
  style: PropTypes.string,
  label: PropTypes.string,
  leadingIcon: PropTypes.bool,
  badgeCount: PropTypes.number,
  showDismiss: PropTypes.bool,
  enabled: PropTypes.bool,
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
  let resolvedStyle = style;
  let enabled = true;

  if (type === 'category') {
    if (categoryState === 'selected') {
      resolvedStyle = 'filled';
    } else if (categoryState === 'disabled') {
      resolvedStyle = 'outlined';
      enabled = false;
    } else {
      resolvedStyle = 'outlined';
    }
  }

  const chipProps = {
    type,
    style: resolvedStyle,
    label: label || defaultLabel(type),
    leadingIcon: type === 'category' && leadingIcon,
    badgeCount: type === 'filters' && showBadge ? 3 : null,
    showDismiss: type === 'applied' && showDismiss,
    enabled,
  };

  if (!previewAsBar) {
    return (
      <div className={['si-filter-wrap', className].filter(Boolean).join(' ')}>
        <Chip {...chipProps} />
      </div>
    );
  }

  const samples = [
    { ...chipProps, label: 'Kategorija', type: 'category', style: 'filled', enabled: true },
    { type: 'filters', style: 'outlined', label: 'Filtri', badgeCount: 3, enabled: true },
    { type: 'applied', style: 'filled', label: 'Uporabljeno', showDismiss: true, enabled: true },
    { type: 'sort', style: 'outlined', label: 'Razvrščanje', enabled: true },
  ];

  return (
    <div
      className={[
        'si-filter-bar',
        `si-filter-bar--${layout}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {samples.map((item) => (
        <Chip key={`${item.type}-${item.label}`} {...item} />
      ))}
    </div>
  );
};

Filter.propTypes = {
  previewAsBar: PropTypes.bool,
  layout: PropTypes.oneOf(['singleRowScrollable', 'multiRowOverflow']),
  type: PropTypes.oneOf(['category', 'filters', 'applied', 'sort']),
  style: PropTypes.oneOf(['outlined', 'filled', 'tonal']),
  categoryState: PropTypes.oneOf(['unselected', 'selected', 'disabled']),
  label: PropTypes.string,
  leadingIcon: PropTypes.bool,
  showBadge: PropTypes.bool,
  showDismiss: PropTypes.bool,
  className: PropTypes.string,
};
