import { useEffect, useRef, useState } from 'react';

/**
 * State that a widget and a control share, as in the catalog (one `_checked` drives both the
 * preview and the "Označeno" switch):
 * - follows `value` whenever the prop changes (a control changed after the story mounted);
 * - the widget's own changes (tap, drag, typing) go to `onChange`, so the story can write them
 *   back to the control (`useArgs`).
 * Without `onChange` (Vse različice) the widget keeps its own state, starting from `value`.
 *
 * Written-back values come back as props a moment later (Storybook's args round trip). While
 * typing fast, an older one can arrive after a newer keystroke: a prop equal to a value the widget
 * itself reported and that is not the latest is that echo, not a new value, and is ignored
 * (otherwise "Novo besedilo" typed key by key came out as "Novo esedilo").
 */
export function useControlled(value, onChange) {
  const [state, setState] = useState(value);
  const [seen, setSeen] = useState(value);
  const sent = useRef([]);
  const echo = sent.current.some((v) => Object.is(v, value));
  if (!Object.is(seen, value)) {
    // React's "adjust state when a prop changes": during render, no frame with the old value.
    setSeen(value);
    if (!echo) setState(value);
  }
  useEffect(() => {
    const i = sent.current.findIndex((v) => Object.is(v, value));
    sent.current = i >= 0 ? sent.current.slice(i + 1) : [];
  }, [value]);
  const current = Object.is(seen, value) || echo ? state : value;
  const set = (next) => {
    const v = typeof next === 'function' ? next(current) : next;
    setState(v);
    if (onChange) {
      sent.current.push(v);
      onChange(v);
    }
  };
  return [current, set];
}
