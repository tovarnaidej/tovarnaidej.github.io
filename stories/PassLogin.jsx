import React from 'react';
import PropTypes from 'prop-types';

import siPassLogo from './assets/mobile/pass-login/si-pass.svg';
import chevronIcon from './assets/mobile/pass-login/pass-login-chevron.svg';
import './pass-login.css';

const DEFAULT_DESCRIPTION =
  'Za uporabo spletnih storitev eUprave ustvarite svoj uporabniški račun.\nPotrebujete digitalno potrdilo ali mobilno indentiteto smsPASS.';

export const PassLogin = ({
  title = 'Prijava v aplikacijo',
  description = DEFAULT_DESCRIPTION,
  loginLabel = 'Prijava SI-PASS',
  readMoreLabel = 'Preberite več',
  className = '',
}) => (
  <div
    className={['si-pass-login', className].filter(Boolean).join(' ')}
  >
    <div className="si-pass-login__body">
      <div className="si-pass-login__copy">
        <h2 className="si-pass-login__title">{title}</h2>
        <p className="si-pass-login__text">{description}</p>
      </div>
      <button type="button" className="si-pass-login__primary">
        <img
          className="si-pass-login__logo"
          src={siPassLogo}
          alt=""
          width="25.36"
          height="30"
        />
        <span className="si-pass-login__primary-label">{loginLabel}</span>
      </button>
    </div>
    <div className="si-pass-login__actions">
      <button type="button" className="si-pass-login__link">
        <span className="si-pass-login__chevron" aria-hidden="true">
          <img src={chevronIcon} alt="" width="6.877" height="12.502" />
        </span>
        <span className="si-pass-login__link-label">{readMoreLabel}</span>
      </button>
    </div>
  </div>
);

PassLogin.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  loginLabel: PropTypes.string,
  readMoreLabel: PropTypes.string,
  className: PropTypes.string,
};
