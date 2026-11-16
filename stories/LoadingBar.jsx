import React from 'react';
import PropTypes from 'prop-types';

import './loading-bar.css';

// Figma 3911:6592 — circular indicators
//   thin  → 40×40, stroke 4
//   thick → 44×44, stroke 8
// Both share the same circle radius: (40 − 4) / 2 = (44 − 8) / 2 = 18.
const CIRCULAR = {
  thin: { size: 40, stroke: 4 },
  thick: { size: 44, stroke: 8 },
};

// Share of the circumference drawn while indeterminate.
const INDETERMINATE_ARC = 0.3;
// TokenLoadingBarV2.circularActiveTrackGap
const CIRCULAR_GAP = 4;

const arcPath = (cx, cy, r, start, sweep) => {
  const end = start + sweep;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = sweep > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

/**
 * _CircularLoadingPainter: two arcs (active from 12 o'clock + remaining track)
 * with round caps and a visible gap of circularActiveTrackGap between them —
 * never a full grey ring under the active arc.
 */
const CircularIndicator = ({ thickness, progress, indeterminate }) => {
  const { size, stroke } = CIRCULAR[thickness] || CIRCULAR.thin;
  const c = size / 2;
  const r = (size - stroke) / 2;
  const full = Math.PI * 2;
  const top = -Math.PI / 2;
  const svgProps = {
    className: 'si-loading-bar__svg',
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    fill: 'none',
    'aria-hidden': 'true',
  };

  if (indeterminate || progress <= 0 || progress >= 1) {
    const share = indeterminate ? INDETERMINATE_ARC : progress >= 1 ? 1 : 0;
    const circumference = full * r;
    return (
      <svg {...svgProps}>
        {share < 1 && (
          <circle className="si-loading-bar__circle-track" cx={c} cy={c} r={r} strokeWidth={stroke} />
        )}
        {share > 0 && (
          <circle
            className="si-loading-bar__circle-active"
            cx={c}
            cy={c}
            r={r}
            strokeWidth={stroke}
            strokeLinecap={share < 1 ? 'round' : 'butt'}
            strokeDasharray={`${circumference * share} ${circumference}`}
            transform={`rotate(-90 ${c} ${c})`}
          />
        )}
      </svg>
    );
  }

  const gapAngle = (stroke + CIRCULAR_GAP) / r;
  const capAngle = stroke / 2 / r;
  const fillEnd = (full - 2 * gapAngle - 0.001) / full;
  const visibleGap = gapAngle - 2 * capAngle;
  const drawGap =
    progress < fillEnd ? visibleGap : visibleGap * (1 - Math.min(1, (progress - fillEnd) / (1 - fillEnd)));
  const progressAngle = full * progress;
  const activeSweep = Math.max(0.0001, progressAngle - 2 * capAngle);
  const trackStart = top + progressAngle + drawGap + capAngle;
  const trackSweep = full - progressAngle - 2 * drawGap - 2 * capAngle;

  return (
    <svg {...svgProps}>
      {trackSweep > 0 && (
        <path
          className="si-loading-bar__circle-track"
          d={arcPath(c, c, r, trackStart, trackSweep)}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      )}
      <path
        className="si-loading-bar__circle-active"
        d={arcPath(c, c, r, top + capAngle, activeSweep)}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
};

CircularIndicator.propTypes = {
  thickness: PropTypes.oneOf(['thin', 'thick']),
  progress: PropTypes.number.isRequired,
  indeterminate: PropTypes.bool,
};

export const LoadingBar = ({
  variant = 'linear',
  thickness = 'thin',
  indeterminate = false,
  value = 0.5,
  className = '',
}) => {
  const progress = Math.min(1, Math.max(0, Number(value) || 0));
  const pct = Math.round(progress * 100);
  const classes = [
    'si-loading-bar',
    `si-loading-bar--${variant}`,
    variant === 'circular' ? `si-loading-bar--${thickness}` : '',
    indeterminate ? 'si-loading-bar--indeterminate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaProps = {
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': indeterminate ? undefined : pct,
  };

  if (variant === 'circular') {
    return (
      <div className={classes} {...ariaProps}>
        <CircularIndicator
          thickness={thickness}
          progress={progress}
          indeterminate={indeterminate}
        />
      </div>
    );
  }

  if (indeterminate) {
    return (
      <div className={classes} {...ariaProps}>
        <div className="si-loading-bar__track">
          <div className="si-loading-bar__fill" />
        </div>
      </div>
    );
  }

  // Determinate: active fill, then a 4px gap (linearActiveTrackGap), then the remaining track.
  return (
    <div className={classes} {...ariaProps}>
      {pct > 0 && (
        <div
          className="si-loading-bar__fill"
          style={{ flexBasis: `${progress * 100}%` }}
        />
      )}
      {pct < 100 && <div className="si-loading-bar__track" />}
    </div>
  );
};

LoadingBar.propTypes = {
  variant: PropTypes.oneOf(['linear', 'circular']),
  thickness: PropTypes.oneOf(['thin', 'thick']),
  indeterminate: PropTypes.bool,
  value: PropTypes.number,
  className: PropTypes.string,
};
