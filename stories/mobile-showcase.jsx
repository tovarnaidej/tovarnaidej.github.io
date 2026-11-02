import React from 'react';
import PropTypes from 'prop-types';

import './mobile-showcase.css';

export const FIGMA_MOBILE_FILE =
  'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-';

export const figmaMobileUrl = (nodeId) =>
  `${FIGMA_MOBILE_FILE}?node-id=${String(nodeId).replace(':', '-')}`;

export const MobileShowcase = ({
  title,
  subtitle,
  children,
  className = '',
  flush = false,
}) =>
  React.createElement(
    'div',
    {
      className: [
        'mobile-showcase',
        flush ? 'mobile-showcase--flush' : '',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    },
    title
      ? React.createElement('h2', { className: 'mobile-showcase__title' }, title)
      : null,
    subtitle
      ? React.createElement(
          'p',
          { className: 'mobile-showcase__subtitle' },
          subtitle,
        )
      : null,
    children,
  );

MobileShowcase.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  flush: PropTypes.bool,
};

export const ShowcaseSection = ({ title, children, className = '' }) =>
  React.createElement(
    'section',
    {
      className: ['mobile-showcase__section', className].filter(Boolean).join(' '),
    },
    title
      ? React.createElement(
          'h3',
          { className: 'mobile-showcase__section-title' },
          title,
        )
      : null,
    children,
  );

ShowcaseSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export const PlatformColumns = ({
  ios,
  android,
  gap = 33,
  className = '',
  showLabels = true,
}) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__platforms', className]
        .filter(Boolean)
        .join(' '),
      style: { gap },
    },
    React.createElement(
      'div',
      { className: 'mobile-showcase__platform' },
      showLabels
        ? React.createElement(
            'p',
            { className: 'mobile-showcase__platform-label' },
            'iOS',
          )
        : null,
      ios,
    ),
    React.createElement(
      'div',
      { className: 'mobile-showcase__platform' },
      showLabels
        ? React.createElement(
            'p',
            { className: 'mobile-showcase__platform-label' },
            'Android',
          )
        : null,
      android,
    ),
  );

PlatformColumns.propTypes = {
  ios: PropTypes.node.isRequired,
  android: PropTypes.node.isRequired,
  gap: PropTypes.number,
  className: PropTypes.string,
  showLabels: PropTypes.bool,
};

export const ShowcaseStack = ({ children, gap = 10, className = '' }) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__stack', className].filter(Boolean).join(' '),
      style: { gap },
    },
    children,
  );

ShowcaseStack.propTypes = {
  children: PropTypes.node,
  gap: PropTypes.number,
  className: PropTypes.string,
};

export const ShowcaseRow = ({ children, gap = 16, className = '' }) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__row', className].filter(Boolean).join(' '),
      style: { gap },
    },
    children,
  );

ShowcaseRow.propTypes = {
  children: PropTypes.node,
  gap: PropTypes.number,
  className: PropTypes.string,
};

export const ShowcaseGrid = ({
  children,
  columns = 2,
  gap = 16,
  className = '',
}) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__grid', className].filter(Boolean).join(' '),
      style: {
        gap,
        gridTemplateColumns: `repeat(${columns}, max-content)`,
      },
    },
    children,
  );

ShowcaseGrid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.number,
  gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export const ShowcasePanel = ({ children, className = '' }) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__panel', className].filter(Boolean).join(' '),
    },
    children,
  );

ShowcasePanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export const ShowcaseWidth = ({ width = 360, children, className = '' }) =>
  React.createElement(
    'div',
    {
      className: ['mobile-showcase__width', className].filter(Boolean).join(' '),
      style: { '--ms-width': `${width}px` },
    },
    children,
  );

ShowcaseWidth.propTypes = {
  width: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
};
