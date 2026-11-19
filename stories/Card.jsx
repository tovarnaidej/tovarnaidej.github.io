import React from 'react';
import PropTypes from 'prop-types';

import moreVert from './assets/mobile/app-bar/more-vert.svg';
import mediaImage from './assets/mobile/card/media.png';
import mediaCompact from './assets/mobile/card/media-compact.png';
import './mobile-tokens.css';
import './card.css';

export const Card = ({
  style = 'outlined',
  layout = 'standard',
  showHeader = true,
  showMedia = true,
  showContent = true,
  showActions = true,
  platform = 'android',
  sampleMedia = false,
  className = '',
}) => {
  const isCompact = layout === 'compact';
  const classes = [
    'si-card',
    `si-card--${style}`,
    `si-card--${layout}`,
    `si-card--${platform}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isCompact) {
    return (
      <article className={classes}>
        <div className="si-card__compact-body">
          <span className="si-card__avatar" aria-hidden="true">
            <span className="si-cap-centred si-cap-centred--bold">A</span>
          </span>
          <div className="si-card__text">
            <div className="si-card__title">Header</div>
            <div className="si-card__subtitle">Subhead</div>
          </div>
        </div>
        {showMedia && !sampleMedia && (
          <div className="si-card__media si-card__media--compact" />
        )}
        {showMedia && sampleMedia && (
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
              <span className="si-cap-centred si-cap-centred--bold">A</span>
            </span>
            <div className="si-card__text">
              <div className="si-card__title">Header</div>
              <div className="si-card__subtitle">Subhead</div>
            </div>
          </div>
          <button type="button" className="si-card__more" aria-label="Več">
            <span
              className="si-card__more-icon"
              style={{ '--si-icon': `url(${JSON.stringify(moreVert)})` }}
              aria-hidden="true"
            />
          </button>
        </header>
      )}
      {showMedia && !sampleMedia && <div className="si-card__media" />}
      {showMedia && sampleMedia && (
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
  platform: PropTypes.oneOf(['ios', 'android']),
  /** Figma sample illustration instead of the catalog's plain placeholder (overview only). */
  sampleMedia: PropTypes.bool,
  className: PropTypes.string,
};
