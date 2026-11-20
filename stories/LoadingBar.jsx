import React, { useEffect, useState } from 'react';
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
const CircularIndicator = ({ thickness, progress }) => {
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

  // progress <= 0 / >= 1: one full ring (track / indicator colour), butt caps
  if (progress <= 0 || progress >= 1) {
    return (
      <svg {...svgProps}>
        <circle
          className={progress >= 1 ? 'si-loading-bar__circle-active' : 'si-loading-bar__circle-track'}
          cx={c}
          cy={c}
          r={r}
          strokeWidth={stroke}
        />
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

  // the gaps have closed: full indicator ring
  if (drawGap <= 0) {
    return (
      <svg {...svgProps}>
        <circle className="si-loading-bar__circle-active" cx={c} cy={c} r={r} strokeWidth={stroke} />
      </svg>
    );
  }

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
};

// Curves.easeInOut = Cubic(0.42, 0, 0.58, 1)
const easeInOut = (x) => {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i += 1) {
    const t = (lo + hi) / 2;
    const bx = 3 * 0.42 * t * (1 - t) ** 2 + 3 * 0.58 * t ** 2 * (1 - t) + t ** 3;
    if (bx < x) lo = t;
    else hi = t;
  }
  const t = (lo + hi) / 2;
  return 3 * t ** 2 * (1 - t) + t ** 3;
};

// TokenLoadingBarV2.animationDuration * 2 and loopCompleteHold
const LOOP_MS = 1600;
const LOOP_HOLD_MS = 350;

/**
 * value == null in SILoadingBar ("Animacija" in the catalog): the same determinate indicator
 * fills 0 -> 1 (easeInOut, 1600 ms), holds 350 ms on the full indicator and restarts from 0.
 * There is no separate sliding / spinning shape.
 */
const useLoopProgress = (active) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    let timer = 0;
    const loop = () => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / LOOP_MS);
        setProgress(easeInOut(t));
        if (t < 1) raf = requestAnimationFrame(step);
        else timer = setTimeout(loop, LOOP_HOLD_MS);
      };
      raf = requestAnimationFrame(step);
    };
    setProgress(0);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [active]);
  return progress;
};

export const LoadingBar = ({
  variant = 'linear',
  thickness = 'thin',
  indeterminate = false,
  value = 0.5,
  className = '',
}) => {
  // The catalog keys the widget by its value, so a changed value shows at once (no tween).
  const loop = useLoopProgress(indeterminate);
  const progress = indeterminate ? loop : Math.min(1, Math.max(0, Number(value) || 0));
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
        <CircularIndicator thickness={thickness} progress={progress} />
      </div>
    );
  }

  // _LinearLoadingPainter: 0 = whole track, 1 = whole bar in the indicator colour, otherwise
  // the active fill, a 4px gap (linearActiveTrackGap) and the remaining track.
  return (
    <div className={classes} {...ariaProps}>
      {progress > 0 && (
        <div
          className="si-loading-bar__fill"
          style={{ flexBasis: `${progress * 100}%` }}
        />
      )}
      {progress < 1 && <div className="si-loading-bar__track" />}
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
