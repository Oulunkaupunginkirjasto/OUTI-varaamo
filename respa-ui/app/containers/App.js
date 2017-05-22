import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { logout } from 'actions/authActions';
import { clearSearchResults } from 'actions/searchActions';
import { chooseEnglishLocale, chooseFinnishLocale, openLoginModal } from 'actions/uiActions';
import { fetchUser } from 'actions/userActions';
import Favicon from 'components/customization/Favicon';
import Footer from 'components/layout/Footer';
import constants from 'constants/AppConstants';
import LoginModal from 'containers/LoginModal';
import Navbar from 'components/layout/Navbar';
import Notifications from 'containers/Notifications';
import appSelector from 'selectors/containers/appSelector';
import { getCustomizationClassName } from 'utils/CustomizationUtils';

export class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.actions.fetchUser(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      this.props.actions.fetchUser(nextProps.userId);
    }
  }

  handleLocaleChange(newLocale) {
    const { actions } = this.props;
    switch (newLocale) {
      case constants.LOCALES.english:
        actions.chooseEnglishLocale();
        break;
      case constants.LOCALES.finnish:
      default:
        actions.chooseFinnishLocale();
        break;
    }
  }

  handleLogout() {
    const { actions } = this.props;
    actions.logout();
    actions.updatePath('/');
  }

  render() {
    const {
      actions,
      children,
      isLoggedIn,
      locale,
      user,
      userId,
    } = this.props;
    if (!user.uuid) {
      if (userId) {
        // this.props.actions.fetchUser(userId);
      }
    }
    return (
      <DocumentTitle title="Varaamo">
        <div className={`app ${getCustomizationClassName()}`}>
          <Favicon />
          <Navbar
            clearSearchResults={actions.clearSearchResults}
            isLoggedIn={isLoggedIn}
            locale={locale}
            logout={this.handleLogout}
            onLocaleChange={this.handleLocaleChange}
            openLoginModal={actions.openLoginModal}
            user={user}
          />
          <div className="app-content">
            <Grid>
              <Notifications />
              {children}
            </Grid>
          </div>
          <LoginModal />
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedApp.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  isLoggedIn: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    chooseEnglishLocale,
    chooseFinnishLocale,
    clearSearchResults,
    logout,
    openLoginModal,
    fetchUser,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(appSelector, mapDispatchToProps)(UnconnectedApp);
