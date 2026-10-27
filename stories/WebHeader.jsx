import React, { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';

import { WebButton } from './WebButton';
import { Search } from './Search';

import coatOfArms from './assets/web-header/coat-of-arms.svg';
import coatOfArmsDark from './assets/web-header/coat-of-arms-dark.svg';
import spotLogoLight from './assets/web-header/spot-logo-light.svg';
import spotLogoDark from './assets/web-header/spot-logo-dark.svg';
import searchIcon from './assets/web-header/search-icon.svg';
import searchIconDark from './assets/web-header/search-icon-dark.svg';
import chevronDown from './assets/web-header/chevron-down.svg';
import chevronDownDark from './assets/web-header/chevron-down-dark.svg';
import sipassLogo from './assets/web-header/sipass-logo.svg';
import menuIcon from './assets/web-header/menu-icon.svg';
import closeIcon from './assets/web-header/close-icon.svg';
import './web-header.css';

const defaultItems = [
  {
    id: '1',
    label: 'Naslov 1',
    href: '#naslov-1',
    children: [
      { label: 'Lorem ipsum', href: '#lorem-1' },
      { label: 'Lorem ipsum', href: '#lorem-2' },
      { label: 'Lorem ipsum', href: '#lorem-3' },
      { label: 'Podstran 4', href: '#p1-4' },
      { label: 'Podstran 5', href: '#p1-5' },
      { label: 'Podstran 6', href: '#p1-6' },
    ],
  },
  {
    id: '2',
    label: 'Naslov 2',
    href: '#naslov-2',
    children: [
      { label: 'Podstran 1', href: '#p2-1' },
      { label: 'Podstran 2', href: '#p2-2' },
      { label: 'Podstran 3', href: '#p2-3' },
      { label: 'Podstran 4', href: '#p2-4' },
      { label: 'Podstran 5', href: '#p2-5' },
      { label: 'Podstran 6', href: '#p2-6' },
    ],
  },
  {
    id: '3',
    label: 'Naslov 3',
    href: '#naslov-3',
    children: [
      { label: 'Podstran 1', href: '#p3-1' },
      { label: 'Podstran 2', href: '#p3-2' },
      { label: 'Podstran 3', href: '#p3-3' },
      { label: 'Podstran 4', href: '#p3-4' },
      { label: 'Podstran 5', href: '#p3-5' },
      { label: 'Podstran 6', href: '#p3-6' },
    ],
  },
  {
    id: '4',
    label: 'Naslov 4',
    href: '#naslov-4',
    children: [
      { label: 'Podstran 1', href: '#p4-1' },
      { label: 'Podstran 2', href: '#p4-2' },
      { label: 'Podstran 3', href: '#p4-3' },
      { label: 'Podstran 4', href: '#p4-4' },
      { label: 'Podstran 5', href: '#p4-5' },
      { label: 'Podstran 6', href: '#p4-6' },
    ],
  },
  {
    id: '5',
    label: 'Naslov 5',
    href: '#naslov-5',
    children: [
      { label: 'Podstran 1', href: '#p5-1' },
      { label: 'Podstran 2', href: '#p5-2' },
      { label: 'Podstran 3', href: '#p5-3' },
      { label: 'Podstran 4', href: '#p5-4' },
      { label: 'Podstran 5', href: '#p5-5' },
      { label: 'Podstran 6', href: '#p5-6' },
    ],
  },
];

const megaFallbackItem = {
  id: '6',
  label: 'Naslov 6',
  children: [
    { label: 'Podstran 1', href: '#p6-1' },
    { label: 'Podstran 2', href: '#p6-2' },
    { label: 'Podstran 3', href: '#p6-3' },
    { label: 'Podstran 4', href: '#p6-4' },
    { label: 'Podstran 5', href: '#p6-5' },
    { label: 'Podstran 6', href: '#p6-6' },
  ],
};

const GovernmentBrand = ({ theme }) => {
  const isDark = theme === 'dark';
  return (
    <a className="web-header__gov" href="/">
      <img
        className="web-header__coat"
        src={isDark ? coatOfArmsDark : coatOfArms}
        width={18}
        height={23}
        alt=""
        decoding="async"
        aria-hidden="true"
      />
      <span className="web-header__gov-text">
        <span>Republika</span>
        <span>Slovenija</span>
      </span>
    </a>
  );
};

GovernmentBrand.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

const ProjectBrand = ({ theme, projectLogo, compact }) => {
  const isDark = theme === 'dark';
  const src =
    projectLogo || (isDark ? spotLogoDark : spotLogoLight);
  return (
    <a
      className={[
        'web-header__project',
        compact ? 'web-header__project--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      href="/"
      aria-label="SPOT – Slovenska poslovna točka"
    >
      <img
        className="web-header__project-logo"
        src={src}
        width={compact ? 127 : 200}
        height={compact ? 28 : 44}
        alt=""
        decoding="async"
      />
    </a>
  );
};

ProjectBrand.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  projectLogo: PropTypes.string,
  compact: PropTypes.bool,
};

const SiPassButton = ({ onClick }) => (
  <button
    type="button"
    className="web-header__sipass"
    onClick={onClick}
    aria-label="Prijava SI-PASS"
  >
    <img
      className="web-header__sipass-logo"
      src={sipassLogo}
      width="127"
      height="26"
      alt="Prijava SI-PASS"
    />
  </button>
);

SiPassButton.propTypes = {
  onClick: PropTypes.func,
};

const LanguageControl = ({
  theme,
  language,
  languageLabel,
  onClick,
  showFullLabel = false,
}) => {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="web-header__lang"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-label={`Jezik: ${languageLabel || language}`}
    >
      <span className="web-header__lang-code">
        {showFullLabel ? languageLabel || language : language}
      </span>
      <img
        className="web-header__chevron"
        src={isDark ? chevronDownDark : chevronDown}
        width="7"
        height="4"
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};

LanguageControl.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  language: PropTypes.string.isRequired,
  languageLabel: PropTypes.string,
  onClick: PropTypes.func,
  showFullLabel: PropTypes.bool,
};

const SearchTrigger = ({
  theme,
  labeled = false,
  onClick,
}) => {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className={[
        'web-header__search',
        labeled ? 'web-header__search--labeled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label="Iskanje"
    >
      {labeled ? (
        <span className="web-header__search-label">Iskanje</span>
      ) : null}
      <img
        className="web-header__search-icon"
        src={isDark ? searchIconDark : searchIcon}
        width="18"
        height="18"
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};

SearchTrigger.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  labeled: PropTypes.bool,
  onClick: PropTypes.func,
};

export const WebHeader = ({
  theme = 'light',
  layout = 'auto',
  menuState = 'closed',
  openItemId = null,
  activeHref,
  items = defaultItems,
  primaryAction = { label: 'Primer gumba' },
  showSiPass = true,
  language = 'SI',
  languageLabel = 'Slovenščina',
  showHelp = false,
  showNavChevrons = false,
  onSearchClick,
  onLanguageClick,
  onMenuToggle,
  onNavigate,
  onPrimaryAction,
  onSiPassClick,
  governmentLogo,
  projectLogo,
  className = '',
  ...props
}) => {
  const navId = useId();
  const [internalOpenId, setInternalOpenId] = useState(openItemId);
  const [mobileExpandedId, setMobileExpandedId] = useState(null);

  useEffect(() => {
    setInternalOpenId(openItemId);
  }, [openItemId]);

  useEffect(() => {
    if (menuState === 'closed') {
      setInternalOpenId(null);
      setMobileExpandedId(null);
    }
  }, [menuState]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setInternalOpenId(null);
        setMobileExpandedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isDark = theme === 'dark';
  const isDropdownMode =
    menuState === 'dropdown' || showNavChevrons || Boolean(internalOpenId);
  const showMegaPanel =
    menuState === 'mega' || (menuState === 'open' && layout === 'compact');
  const showMobilePanel =
    menuState === 'open' && (layout === 'mobile' || layout === 'auto');
  const isPanelOpen = showMegaPanel || showMobilePanel;
  const resolvedOpenId = internalOpenId;

  const megaItems =
    items.length >= 6 ? items.slice(0, 6) : [...items, megaFallbackItem].slice(0, 6);

  const handleNavToggle = (item) => {
    const next = resolvedOpenId === item.id ? null : item.id;
    setInternalOpenId(next);
    if (item.href && !item.children?.length) {
      onNavigate?.(item);
    }
  };

  const handleChildNavigate = (child, event) => {
    event.preventDefault();
    onNavigate?.(child);
  };

  const classes = [
    'web-header',
    `web-header--theme-${theme}`,
    `web-header--layout-${layout}`,
    `web-header--menu-${menuState}`,
    isDropdownMode ? 'web-header--has-chevrons' : '',
    isPanelOpen ? 'web-header--panel-open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes} {...props}>
      <div className="web-header__bar">
        <div className="web-header__brand">
          {governmentLogo ? (
            <span className="web-header__gov-slot">{governmentLogo}</span>
          ) : (
            <GovernmentBrand theme={theme} />
          )}
          <ProjectBrand
            theme={theme}
            projectLogo={projectLogo}
            compact={layout === 'mobile'}
          />
        </div>

        <div className="web-header__tools web-header__tools--desktop">
          <nav
            className="web-header__nav"
            aria-label="Glavna navigacija"
            id={navId}
          >
            <ul className="web-header__nav-list">
              {items.map((item) => {
                const isOpen = resolvedOpenId === item.id;
                const hasChildren = Boolean(item.children?.length);
                const showChevron = isDropdownMode;
                return (
                  <li
                    key={item.id}
                    className={[
                      'web-header__nav-item',
                      isOpen ? 'web-header__nav-item--open' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <button
                      type="button"
                      className="web-header__nav-link"
                      aria-expanded={hasChildren ? isOpen : undefined}
                      aria-haspopup={hasChildren ? 'true' : undefined}
                      onClick={() =>
                        hasChildren
                          ? handleNavToggle(item)
                          : onNavigate?.(item)
                      }
                    >
                      <span>{item.label}</span>
                      {showChevron ? (
                        <img
                          className={[
                            'web-header__chevron',
                            'web-header__nav-chevron',
                            isOpen ? 'web-header__chevron--up' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          src={isDark ? chevronDownDark : chevronDown}
                          width="7"
                          height="4"
                          alt=""
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                    {hasChildren && isOpen && !showMegaPanel ? (
                      <div className="web-header__dropdown" role="menu">
                        {item.children.map((child, index) => {
                          const isActive =
                            activeHref && child.href === activeHref;
                          return (
                            <a
                              key={`${item.id}-${index}`}
                              className={[
                                'web-header__dropdown-link',
                                isActive
                                  ? 'web-header__dropdown-link--active'
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              href={child.href || '#'}
                              role="menuitem"
                              onClick={(event) =>
                                handleChildNavigate(child, event)
                              }
                            >
                              {child.label}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="web-header__actions">
            <WebButton
              className={[
                'web-header__primary',
                isDark ? 'web-header__primary--on-dark' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              label={primaryAction.label}
              hierarchy="primary"
              size="medium"
              onClick={onPrimaryAction || primaryAction.onClick}
            />
            {showSiPass ? <SiPassButton onClick={onSiPassClick} /> : null}
            <SearchTrigger theme={theme} onClick={onSearchClick} />
            <LanguageControl
              theme={theme}
              language={language}
              languageLabel={languageLabel}
              onClick={onLanguageClick}
            />
          </div>
        </div>

        <div className="web-header__actions web-header__actions--compact">
          {showHelp ? (
            <button type="button" className="web-header__help">
              Pomoč
            </button>
          ) : null}
          <SearchTrigger theme={theme} labeled onClick={onSearchClick} />
          {showSiPass ? <SiPassButton onClick={onSiPassClick} /> : null}
          <LanguageControl
            theme={theme}
            language={language}
            languageLabel={languageLabel}
            onClick={onLanguageClick}
          />
          <button
            type="button"
            className="web-header__menu-toggle"
            aria-expanded={showMegaPanel}
            aria-controls={`${navId}-mega`}
            aria-label={showMegaPanel ? 'Zapri meni' : 'Odpri meni'}
            onClick={() => onMenuToggle?.(!showMegaPanel)}
          >
            <img
              src={showMegaPanel ? closeIcon : menuIcon}
              width="18"
              height="18"
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="web-header__actions web-header__actions--mobile">
          <button
            type="button"
            className="web-header__menu-toggle"
            aria-expanded={showMobilePanel}
            aria-controls={`${navId}-mobile`}
            aria-label={showMobilePanel ? 'Zapri meni' : 'Odpri meni'}
            onClick={() => onMenuToggle?.(!showMobilePanel)}
          >
            <img
              src={showMobilePanel ? closeIcon : menuIcon}
              width="16"
              height="16"
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div
        className="web-header__mega"
        id={`${navId}-mega`}
        hidden={!showMegaPanel}
      >
        <div className="web-header__mega-inner">
          {megaItems.map((item) => (
            <div key={item.id} className="web-header__mega-col">
              <p className="web-header__mega-title">{item.label}</p>
              <ul className="web-header__mega-list">
                {(item.children || []).map((child, index) => (
                  <li key={`${item.id}-m-${index}`}>
                    <a
                      className="web-header__mega-link"
                      href={child.href || '#'}
                      onClick={(event) => handleChildNavigate(child, event)}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        className="web-header__mobile-panel"
        id={`${navId}-mobile`}
        hidden={!showMobilePanel}
      >
        <nav className="web-header__mobile-nav" aria-label="Mobilna navigacija">
          <ul className="web-header__mobile-list">
            {items.map((item) => {
              const expanded = mobileExpandedId === item.id;
              const hasChildren = Boolean(item.children?.length);
              return (
                <li key={item.id} className="web-header__mobile-item">
                  <button
                    type="button"
                    className="web-header__mobile-link"
                    aria-expanded={hasChildren ? expanded : undefined}
                    onClick={() =>
                      hasChildren
                        ? setMobileExpandedId(expanded ? null : item.id)
                        : onNavigate?.(item)
                    }
                  >
                    <span>{item.label}</span>
                    {hasChildren ? (
                      <img
                        className={[
                          'web-header__chevron',
                          'web-header__chevron--right',
                          expanded ? 'web-header__chevron--up' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        src={chevronDown}
                        width="7"
                        height="5"
                        alt=""
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                  {hasChildren && expanded ? (
                    <ul className="web-header__mobile-sublist">
                      {item.children.map((child, index) => (
                        <li key={`${item.id}-s-${index}`}>
                          <a
                            className="web-header__mobile-sublink"
                            href={child.href || '#'}
                            onClick={(event) =>
                              handleChildNavigate(child, event)
                            }
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="web-header__mobile-divider" role="presentation" />

        <div className="web-header__mobile-meta">
          <button type="button" className="web-header__help">
            Pomoč
          </button>
          <LanguageControl
            theme={theme}
            language={language}
            languageLabel={languageLabel}
            onClick={onLanguageClick}
            showFullLabel
          />
        </div>

        <div className="web-header__mobile-actions">
          <WebButton
            className="web-header__primary"
            label={primaryAction.label}
            hierarchy="primary"
            size="medium"
            onClick={onPrimaryAction || primaryAction.onClick}
          />
          {showSiPass ? <SiPassButton onClick={onSiPassClick} /> : null}
        </div>

        <div className="web-header__mobile-search">
          <Search variant="compact" onSubmit={onSearchClick} />
        </div>
      </div>
    </header>
  );
};

WebHeader.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  layout: PropTypes.oneOf(['auto', 'desktop', 'compact', 'mobile']),
  menuState: PropTypes.oneOf(['closed', 'dropdown', 'mega', 'open']),
  openItemId: PropTypes.string,
  activeHref: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string,
        }),
      ),
    }),
  ),
  primaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  showSiPass: PropTypes.bool,
  language: PropTypes.string,
  languageLabel: PropTypes.string,
  showHelp: PropTypes.bool,
  showNavChevrons: PropTypes.bool,
  onSearchClick: PropTypes.func,
  onLanguageClick: PropTypes.func,
  onMenuToggle: PropTypes.func,
  onNavigate: PropTypes.func,
  onPrimaryAction: PropTypes.func,
  onSiPassClick: PropTypes.func,
  governmentLogo: PropTypes.node,
  projectLogo: PropTypes.string,
  className: PropTypes.string,
};
