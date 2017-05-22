import trim from 'lodash/trim';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

// import {} from 'actions/uiActions';
import Logo from 'components/customization/Logo';
import constants from 'constants/AppConstants';
import { getSearchPageUrl } from 'utils/SearchUtils';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.renderLanguageSelector = this.renderLanguageSelector.bind(this);
    this.renderUserNav = this.renderUserNav.bind(this);
  }

  renderLanguageSelector() {
    const { onLocaleChange, locale } = this.props;
    switch (locale) {
      case constants.LOCALES.finnish:
        return (
          <NavItem
            onClick={() => onLocaleChange(constants.LOCALES.english)}
          >
            In English
          </NavItem>
        );
      case constants.LOCALES.english:
      default:
        return (
          <NavItem
            onClick={() => onLocaleChange(constants.LOCALES.finnish)}
          >
            Suomeksi
          </NavItem>
        );
    }
  }

  renderUserNav() {
    const { isLoggedIn, logout, openLoginModal, user } = this.props;
    let name;
    if (user.firstName || user.lastName) {
      name = trim([user.firstName, user.lastName].join(' '));
    } else {
      name = user.emails && user.emails.length ? user.emails[0].value : '';
    }

    if (isLoggedIn) {
      return (
        <NavDropdown id="collapsible-navbar-dropdown" title={name}>
          <LinkContainer to="/my-reservations">
            <MenuItem>
              <FormattedMessage
                id="app.my_reservations"
                defaultMessage="Omat varaukset"
              />
            </MenuItem>
          </LinkContainer>
          <MenuItem divider />
          <MenuItem onClick={logout}>
            <FormattedMessage
              id="app.logout"
              defaultMessage="Kirjaudu ulos"
            />
          </MenuItem>
        </NavDropdown>
      );
    }

    return (
      <NavItem onClick={openLoginModal}>
        <FormattedMessage
          id="app.login"
          defaultMessage="Kirjaudu sisään"
        />
      </NavItem>
    );
  }

  render() {
    const { clearSearchResults } = this.props;

    return (
      <RBNavbar inverse>
        <RBNavbar.Header>
          <RBNavbar.Brand>
            <Link to={'/'}>
              <Logo />
              Varaamo
            </Link>
          </RBNavbar.Brand>
          <RBNavbar.Toggle />
        </RBNavbar.Header>
        <RBNavbar.Collapse>
          <Nav navbar>
            <LinkContainer to={getSearchPageUrl()}>
              <NavItem onClick={clearSearchResults}>
                <Glyphicon glyph="search" />{' '}
                <FormattedMessage
                  id="app.search"
                  defaultMessage="Haku"
                />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>
                <FormattedMessage
                  id="app.about"
                  defaultMessage="Tietoa palvelusta"
                />
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav navbar pullRight>
            {this.renderLanguageSelector()}
            {this.renderUserNav()}
          </Nav>
        </RBNavbar.Collapse>
      </RBNavbar>
    );
  }
}

Navbar.propTypes = {
  clearSearchResults: PropTypes.func.isRequired,
  onLocaleChange: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Navbar;
