import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import listItemChevron from './assets/mobile/alert/list-item-chevron.svg';
import './mobile-tokens.css';
import './list-item.css';

const joinClasses = (...names) => names.filter(Boolean).join(' ');

/**
 * Twin of SIListItem (components/flutter/lib/src/components/list_item/si_list_item.dart).
 * - Container: radius 8, 1px border (primary on outlined, transparent otherwise, none on clear).
 * - Content: padding 16 left, 24 right (no chevron) / 16 (chevron) / 0 (chevron + multiline);
 *   vertical 12 with supporting text, 16 title-only (iOS 16.5); min height 56.
 * - Multiline = supporting text actually wraps to 2 lines → row aligns top, chevron 25 with 8 side padding.
 */
export const ListItem = ({
  style = 'basic',
  title = 'Title',
  supportingText = '',
  supportingLineLimit = 2,
  showAvatar = false,
  avatarInitials = 'A',
  showChevron = true,
  chevronHidden = false,
  platform = 'android',
  className = '',
}) => {
  const supportingRef = useRef(null);
  const [wraps, setWraps] = useState(false);
  const hasSupporting = Boolean(supportingText);
  const lineLimit = Math.min(Math.max(supportingLineLimit, 1), 2);

  useLayoutEffect(() => {
    const el = supportingRef.current;
    if (!el || lineLimit <= 1) {
      setWraps(false);
      return undefined;
    }
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 21;
      setWraps(el.scrollHeight > lineHeight * 1.5);
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    document.fonts?.ready?.then(measure);
    return () => observer?.disconnect();
  }, [supportingText, lineLimit, showAvatar, showChevron]);

  const multiline = hasSupporting && wraps && lineLimit > 1;

  return (
    <div
      role="button"
      tabIndex={0}
      className={joinClasses(
        'si-list-item',
        `si-list-item--${style}`,
        `si-list-item--${platform}`,
        hasSupporting ? 'si-list-item--has-supporting' : 'si-list-item--title-only',
        multiline ? 'si-list-item--multiline' : 'si-list-item--single',
        showChevron ? 'si-list-item--has-chevron' : '',
        className,
      )}
    >
      {showAvatar && (
        <span className="si-list-item__avatar-slot">
          <span className="si-list-item__avatar" aria-hidden="true">
            <span className="si-cap-centred">{avatarInitials}</span>
          </span>
        </span>
      )}
      <span className="si-list-item__content">
        <span className="si-list-item__title">{title}</span>
        {hasSupporting && (
          <span
            ref={supportingRef}
            className="si-list-item__supporting"
            style={{ WebkitLineClamp: lineLimit }}
          >
            {supportingText}
          </span>
        )}
      </span>
      {showChevron && (
        <span className="si-list-item__chevron-slot" aria-hidden="true">
          {!chevronHidden && (
            <span
              className="si-list-item__chevron"
              style={{ '--si-icon': `url(${JSON.stringify(listItemChevron)})` }}
            />
          )}
        </span>
      )}
    </div>
  );
};

ListItem.propTypes = {
  style: PropTypes.oneOf(['basic', 'filled', 'outlined', 'clear']),
  title: PropTypes.string,
  supportingText: PropTypes.string,
  supportingLineLimit: PropTypes.oneOf([1, 2]),
  showAvatar: PropTypes.bool,
  avatarInitials: PropTypes.string,
  showChevron: PropTypes.bool,
  chevronHidden: PropTypes.bool,
  platform: PropTypes.oneOf(['ios', 'android']),
  className: PropTypes.string,
};
