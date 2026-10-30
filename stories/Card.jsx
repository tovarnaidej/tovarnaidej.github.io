import React from 'react';
import PropTypes from 'prop-types';

import './card.css';

export const Card = ({
  style = 'outlined',
  layout = 'standard',
  showHeader = true,
  showMedia = true,
  showContent = true,
  showActions = true,
  className = '',
}) => {
  const isCompact = layout === 'compact';
  const classes = [
    'si-card',
    `si-card--${style}`,
    `si-card--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes}>
      {showHeader && (
        <header className="si-card__header">
          <div>
            <div className="si-card__title">Naslov kartice</div>
            <div className="si-card__subtitle">Podnaslov</div>
          </div>
          <button type="button" className="si-card__more" aria-label="Več">
            ⋯
          </button>
        </header>
      )}
      {showMedia && <div className="si-card__media" aria-hidden="true" />}
      {!isCompact && showContent && (
        <div className="si-card__content">
          <div className="si-card__content-title">Vsebina</div>
          <p className="si-card__body">
            Kratek opis kartice z osnovnimi podatki.
          </p>
        </div>
      )}
      {!isCompact && showActions && (
        <footer className="si-card__actions">
          <button type="button" className="si-card__btn si-card__btn--secondary">
            Prekliči
          </button>
          <button type="button" className="si-card__btn si-card__btn--primary">
            Potrdi
          </button>
        </footer>
      )}
    </article>
  );
};

Card.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  layout: PropTypes.oneOf(['standard', 'compact']),
  showHeader: PropTypes.bool,
  showMedia: PropTypes.bool,
  showContent: PropTypes.bool,
  showActions: PropTypes.bool,
  className: PropTypes.string,
};
