import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { postLogin } from 'actions/authActions';
import { closeLoginModal } from 'actions/uiActions';
import LoginForm from 'components/authentication/LoginForm';
import loginModalSelector from 'selectors/containers/loginModalSelector';

export class UnconnectedLoginModal extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values = {}) {
    const {
      actions,
    } = this.props;
    actions.postLogin(values);
  }

  render() {
    const {
      actions,
      isLoggingIn,
      passwordRequired,
      show,
    } = this.props;

    const fields = [
      'username',
    ];
    if (passwordRequired) {
      fields.push('password');
    }

    return (
      <Modal
        className="login-modal"
        onHide={actions.closeLoginModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage
              id="login.modal_title"
              defaultMessage="Kirjaudu sisään"
            />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <LoginForm
            fields={fields}
            isLoggingIn={isLoggingIn}
            onClose={actions.closeLoginModal}
            onLogin={this.handleLogin}
            visible={show}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

UnconnectedLoginModal.propTypes = {
  actions: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  passwordRequired: PropTypes.bool.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeLoginModal,
    postLogin,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(loginModalSelector, mapDispatchToProps)(
  UnconnectedLoginModal
);
