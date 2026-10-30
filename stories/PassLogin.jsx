import React from 'react';
import PropTypes from 'prop-types';

import './pass-login.css';

export const PassLogin = ({ className = '' }) => (
  <div className={['si-pass-login', className].filter(Boolean).join(' ')}>
    <div className="si-pass-login__logo" aria-hidden="true">
      SI
    </div>
    <h2 className="si-pass-login__title">Prijava v aplikacijo</h2>
    <p className="si-pass-login__text">
      Za nadaljevanje se prijavite z računom SI-PASS.
    </p>
    <button type="button" className="si-pass-login__primary">
      Prijava SI-PASS
    </button>
    <button type="button" className="si-pass-login__link">
      Preberite več
    </button>
  </div>
);

PassLogin.propTypes = {
  className: PropTypes.string,
};
