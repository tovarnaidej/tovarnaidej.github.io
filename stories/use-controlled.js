import { useState } from 'react';

/**
 * State that a widget and a control share, as in the catalog (one `_checked` drives both the
 * preview and the "Označeno" switch):
 * - follows `value` whenever the prop changes (a control changed after the story mounted);
 * - the widget's own changes (tap, drag, typing) go to `onChange`, so the story can write them
 *   back to the control (`useArgs`).
 * Without `onChange` (Vse različice) the widget keeps its own state, starting from `value`.
 */
export function useControlled(value, onChange) {
  const [state, setState] = useState(value);
  const [seen, setSeen] = useState(value);
  if (!Object.is(seen, value)) {
    // React's "adjust state when a prop changes": during render, no frame with the old value.
    setSeen(value);
    setState(value);
  }
  const current = Object.is(seen, value) ? state : value;
  const set = (next) => {
    const v = typeof next === 'function' ? next(current) : next;
    setState(v);
    onChange?.(v);
  };
  return [current, set];
}
