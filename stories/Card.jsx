import React from 'react';
import PropTypes from 'prop-types';

import moreVert from './assets/mobile/app-bar/more-vert.svg';
import mediaImage from './assets/mobile/card/media.png';
import mediaCompact from './assets/mobile/card/media-compact.png';
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

  if (isCompact) {
    return (
      <article className={classes}>
        <div className="si-card__compact-body">
          <span className="si-card__avatar" aria-hidden="true">
            A
          </span>
          <div className="si-card__text">
            <div className="si-card__title">Header</div>
            <div className="si-card__subtitle">Subhead</div>
          </div>
        </div>
        {showMedia && (
          <img
            className="si-card__media si-card__media--compact"
            src={mediaCompact}
            alt=""
            width="80"
            height="80"
          />
        )}
      </article>
    );
  }

  return (
    <article className={classes}>
      {showHeader && (
        <header className="si-card__header">
          <div className="si-card__header-content">
            <span className="si-card__avatar" aria-hidden="true">
              A
            </span>
            <div className="si-card__text">
              <div className="si-card__title">Header</div>
              <div className="si-card__subtitle">Subhead</div>
            </div>
          </div>
          <button type="button" className="si-card__more" aria-label="Več">
            <img src={moreVert} alt="" width="24" height="24" />
          </button>
        </header>
      )}
      {showMedia && (
        <img
          className="si-card__media"
          src={mediaImage}
          alt=""
          width="360"
          height="188"
        />
      )}
      {showContent && (
        <>
          <div className="si-card__headline">
            <div className="si-card__title">Header</div>
            <div className="si-card__subtitle">Subhead</div>
          </div>
          <div className="si-card__content">
            <p className="si-card__body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>
        </>
      )}
      {showActions && (
        <footer className="si-card__actions">
          <button
            type="button"
            className="si-card__btn si-card__btn--secondary"
          >
            Example Button
          </button>
          <button
            type="button"
            className="si-card__btn si-card__btn--primary"
          >
            Example Button
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
