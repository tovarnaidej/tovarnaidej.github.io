import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import chevronDown from './assets/mobile/input/chevron-down.svg';
import './mobile-tokens.css';
import './input.css';

const cx = (...names) => names.filter(Boolean).join(' ');

/**
 * Twin of SIInput (components/flutter/lib/src/components/input/si_input.dart).
 * labelPosition: "above" (iOS default) · "floating" (Android default, Material
 * floating label with the outline notch) · "hidden".
 * `focused` forces the focused look for static previews; real focus works too.
 */
export const Input = ({
  style = 'outline',
  platform = 'ios',
  labelPosition,
  enabled = true,
  hasError = false,
  errorText = 'Besedilo napake',
  focused = false,
  showIcon = false,
  obscure = false,
  label = 'Oznaka',
  value = 'Besedilo',
  placeholder = '',
  className = '',
}) => {
  const position = labelPosition || (platform === 'ios' ? 'above' : 'floating');
  const [text, setText] = useState(value);
  const [hasFocus, setHasFocus] = useState(false);
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useLayoutEffect(() => setText(value), [value]);
  useLayoutEffect(() => {
    const measure = () => setLabelWidth(labelRef.current?.getBoundingClientRect().width || 0);
    measure();
    document.fonts?.ready?.then(measure);
  }, [label, position, text, focused, hasFocus]);

  const isFocused = focused || hasFocus;
  const floating = position === 'floating';
  const shouldFloat = floating && (isFocused || text.length > 0);
  const showPlaceholder = floating ? isFocused && !text : true;

  const field = (
    <input
      className="si-input__editor"
      type={obscure ? 'password' : 'text'}
      value={text}
      placeholder={showPlaceholder ? placeholder : ''}
      disabled={!enabled}
      aria-label={label}
      aria-invalid={hasError || undefined}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    />
  );

  const trailing = showIcon ? (
    <span className="si-input__trailing" aria-hidden="true">
      <img className="si-input__chevron" src={chevronDown} alt="" width="20" height="20" />
    </span>
  ) : null;

  // Outline notch: label rect (left 12, top -7, width label + 8, height 16).
  const notch = shouldFloat && style === 'outline' && labelWidth > 0;

  return (
    <div
      className={cx(
        'si-input',
        `si-input--${style}`,
        `si-input--${platform}`,
        `si-input--label-${position}`,
        hasError ? 'si-input--error' : '',
        isFocused ? 'si-input--focused' : '',
        shouldFloat ? 'si-input--floated' : '',
        showIcon ? 'si-input--has-icon' : '',
        !enabled ? 'si-input--disabled' : '',
        className,
      )}
      style={notch ? { '--si-notch-w': `${labelWidth + 8}px` } : undefined}
    >
      {position === 'above' && (
        <span className="si-input__label" aria-hidden="true">
          {label}
        </span>
      )}
      <div className="si-input__box">
        <span className={cx('si-input__decoration', notch ? 'si-input__decoration--notch' : '')} />
        <span className="si-input__editor-wrap">{field}</span>
        {floating && (
          <span ref={labelRef} className="si-input__floating-label" aria-hidden="true">
            {label}
          </span>
        )}
        {trailing}
      </div>
      {hasError && errorText ? <p className="si-input__error">{errorText}</p> : null}
    </div>
  );
};

Input.propTypes = {
  style: PropTypes.oneOf(['underline', 'outline', 'filled']),
  platform: PropTypes.oneOf(['ios', 'android']),
  labelPosition: PropTypes.oneOf(['above', 'floating', 'hidden']),
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
  focused: PropTypes.bool,
  showIcon: PropTypes.bool,
  obscure: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
