import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Footer from 'components/layout/Footer';
import Navbar from 'components/layout/Navbar';
import { UnconnectedApp as App } from 'containers/App';
import User from 'fixtures/User';

describe('Container: App', () => {
  const user = User.build();
  const defaultProps = {
    actions: {
      clearSearchResults: simple.stub(),
      fetchUser: simple.stub(),
      logout: simple.stub(),
      openLoginModal: simple.stub(),
      updatePath: simple.stub(),
    },
    children: <div id="child-div" />,
    isLoggedIn: true,
    locale: 'fi',
    user: Immutable(user),
    userId: user.id,
  };

  function getWrapper(extraProps) {
    return shallow(<App {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    const wrapper = getWrapper();

    describe('Navbar', () => {
      const navbar = wrapper.find(Navbar);

      it('should render Navbar component', () => {
        expect(navbar.length).to.equal(1);
      });

      it('should pass correct props to Navbar component', () => {
        const actualProps = navbar.props();
        expect(actualProps.clearSearchResults).to.equal(defaultProps.actions.clearSearchResults);
        expect(actualProps.isLoggedIn).to.equal(defaultProps.isLoggedIn);
        expect(actualProps.user).to.equal(defaultProps.user);
      });
    });

    describe('props.children', () => {
      it('should render props.children', () => {
        const children = wrapper.find('#child-div');
        expect(children.length).to.equal(1);
      });
    });

    it('should render Footer component', () => {
      const footer = wrapper.find(Footer);
      expect(footer.length).to.equal(1);
    });
  });

  describe('componentDidMount', () => {
    describe('when user is not logged in', () => {
      it('should not fetch user data', () => {
        defaultProps.actions.fetchUser.reset();
        const instance = getWrapper({ user: {}, userId: null }).instance();
        instance.componentDidMount();
        expect(defaultProps.actions.fetchUser.callCount).to.equal(0);
      });
    });

    describe('when user is logged in', () => {
      it('should fetch user data', () => {
        defaultProps.actions.fetchUser.reset();
        const instance = getWrapper().instance();
        instance.componentDidMount();
        expect(defaultProps.actions.fetchUser.callCount).to.equal(1);
        expect(defaultProps.actions.fetchUser.lastCall.args[0]).to.equal(user.id);
      });
    });
  });
});
