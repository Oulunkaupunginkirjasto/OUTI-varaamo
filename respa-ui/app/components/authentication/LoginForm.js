import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import { reduxForm } from 'redux-form';

import ReduxFormField from 'components/common/ReduxFormField';

const messages = defineMessages({
  password: {
    id: 'login.password',
    defaultMessage: 'Salanumero',
  },
  username: {
    id: 'login.username',
    defaultMessage: 'Kirjastokortin numero',
  },
});

export class UnconnectedLoginForm extends Component {
  constructor() {
    super();
    this.focusUsername = this.focusUsername.bind(this);
  }

  componentDidMount() {
    this.focusUsername();
  }

  componentDidUpdate(oldProps) {
    if (this.props.visible && !oldProps.visible) {
      this.focusUsername();
    }
  }

  focusUsername() {
    if (this.usernameField && this.usernameField.refs && this.usernameField.refs.input) {
      const input = this.usernameField.refs.input;
      input.focus();
    }
  }

  render() {
    const {
      fields,
      handleSubmit,
      intl,
      isLoggingIn,
      loginButtonText,
      onClose,
      onLogin,
    } = this.props;

    return (
      <div>
        <form
          className="login-form form-horizontal"
          onSubmit={handleSubmit(onLogin)}
        >
          <ReduxFormField
            field={fields.username}
            label={intl.formatMessage(messages.username)}
            extraProps={{ ref: node => { this.usernameField = node; } }}
            type="text"
          />
          { fields.password &&
            <ReduxFormField
              field={fields.password}
              label={intl.formatMessage(messages.password)}
              type="password"
            />
          }
          <div className="form-controls">
            <Button
              bsStyle="default"
              onClick={onClose}
            >
              <FormattedMessage
                id="login.back"
                defaultMessage="Takaisin"
              />
            </Button>
            <Button
              bsStyle="primary"
              disabled={isLoggingIn}
              onClick={handleSubmit(onLogin)}
              type="submit"
            >
              {loginButtonText}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

UnconnectedLoginForm.defaultProps = {
  loginButtonText: (<FormattedMessage id="login.login" defaultMessage="Kirjaudu sisään" />),
};

UnconnectedLoginForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  loginButtonText: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'loginForm',
})(injectIntl(UnconnectedLoginForm));
