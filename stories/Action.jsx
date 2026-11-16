import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import closeIcon from './assets/mobile/shared/close-24.svg';
import './mobile-tokens.css';
import './action.css';

const joinClasses = (...names) => names.filter(Boolean).join(' ');

const countLines = (el) => {
  if (!el) return 0;
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 21;
  return Math.round(el.scrollHeight / lineHeight);
};

const Buttons = ({ showAction, showDismiss, actionLabel }) => (
  <>
    {showAction && (
      <button type="button" className="si-action__btn">
        {actionLabel}
      </button>
    )}
    {showDismiss && (
      <button type="button" className="si-action__dismiss" aria-label="Zapri">
        <span
          className="si-action__dismiss-icon"
          style={{ '--si-icon': `url(${JSON.stringify(closeIcon)})` }}
          aria-hidden="true"
        />
      </button>
    )}
  </>
);

Buttons.propTypes = {
  showAction: PropTypes.bool,
  showDismiss: PropTypes.bool,
  actionLabel: PropTypes.string,
};

/**
 * Twin of SIAction (components/flutter/lib/src/components/action/si_action.dart).
 * Inline row (min 48): message + [action] + [close]. With maxLines "unlimited" and
 * buttons, a message that needs ≥3 lines in the inline row switches to the stacked
 * layout (message on top, buttons right-aligned below).
 */
export const Action = ({
  style = 'elevated',
  maxLines = 'two',
  showAction = true,
  showDismiss = true,
  message = 'To je obvestilo',
  actionLabel = 'Razveljavi',
  className = '',
}) => {
  const hasButtons = showAction || showDismiss;
  const measureRef = useRef(null);
  const messageRef = useRef(null);
  const [inlineLines, setInlineLines] = useState(1);
  const [messageLines, setMessageLines] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      setInlineLines(countLines(measureRef.current));
      setMessageLines(countLines(messageRef.current));
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (measureRef.current) observer?.observe(measureRef.current);
    if (messageRef.current) observer?.observe(messageRef.current);
    document.fonts?.ready?.then(measure);
    return () => observer?.disconnect();
  }, [message, maxLines, showAction, showDismiss, actionLabel]);

  const stacked = maxLines === 'unlimited' && hasButtons && inlineLines >= 3;
  const lineLimit = maxLines === 'one' ? 1 : maxLines === 'two' ? 2 : 0;
  const clampedLines = lineLimit ? Math.min(messageLines, lineLimit) : messageLines;

  const classes = joinClasses(
    'si-action',
    `si-action--${style}`,
    `si-action--lines-${maxLines}`,
    stacked ? 'si-action--stacked' : 'si-action--inline',
    !stacked && clampedLines > 1 ? 'si-action--multiline' : '',
    showAction ? 'si-action--has-action' : '',
    showDismiss ? 'si-action--has-dismiss' : '',
    hasButtons ? 'si-action--has-buttons' : '',
    className,
  );

  return (
    <div className={classes} role="status">
      {/* Inline-width measurer (always the inline layout, unclamped). */}
      <div className="si-action__row si-action__measure" aria-hidden="true">
        <span className="si-action__text">
          <span ref={measureRef} className="si-action__message">
            {message}
          </span>
        </span>
        {hasButtons && (
          <span className="si-action__buttons">
            <Buttons showAction={showAction} showDismiss={showDismiss} actionLabel={actionLabel} />
          </span>
        )}
      </div>

      <div className="si-action__row">
        <span className="si-action__text">
          <span
            ref={messageRef}
            className="si-action__message"
            style={lineLimit ? { WebkitLineClamp: lineLimit } : undefined}
            dir="auto"
          >
            {message}
          </span>
        </span>
        {hasButtons && (
          <span className="si-action__buttons">
            <Buttons showAction={showAction} showDismiss={showDismiss} actionLabel={actionLabel} />
          </span>
        )}
      </div>
    </div>
  );
};

Action.propTypes = {
  style: PropTypes.oneOf(['elevated', 'outlined', 'filled']),
  maxLines: PropTypes.oneOf(['one', 'two', 'unlimited']),
  showAction: PropTypes.bool,
  showDismiss: PropTypes.bool,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  className: PropTypes.string,
};
