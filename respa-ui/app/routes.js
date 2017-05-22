import React from 'react';
import { Route } from 'react-router';

import AboutPage from 'containers/AboutPage';
import App from 'containers/App';
import HomePage from 'containers/HomePage';
import UserReservationsPage from 'containers/UserReservationsPage';
import NotFoundPage from 'containers/NotFoundPage';
import ReservationPage from 'containers/ReservationPage';
import ResourcePage from 'containers/ResourcePage';
import SearchPage from 'containers/SearchPage';

export default (params) => {
  function removeFacebookAppendedHash(nextState, replaceState, cb) {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      replaceState(null, window.location.hash.replace('_=_', ''));
    }
    if (window.location.hash && window.location.hash.indexOf('clientkey=' !== -1)) {
      const hash = window.location.hash.substr(1);
      const clientKey = hash.substr(hash.indexOf('clientkey=')).split('&')[0].split('=')[1];
      if (clientKey === 'clear') {
        window.localStorage.removeItem('varaamoClientKey');
      } else if (clientKey) {
        window.localStorage.setItem('varaamoClientKey', clientKey);
      }
      replaceState('/');
    }
    cb();
  }

  function requireAuth(nextState, replaceState, cb) {
    const { auth } = params.getState();

    if (!auth.userId) {
      replaceState('/');
    }
    cb();
  }

  function scrollTop(nextState, replaceState, cb) {
    window.scrollTo(0, 0);
    cb();
  }

  return (
    <Route component={App} onEnter={removeFacebookAppendedHash}>
      <Route onEnter={requireAuth}>
        <Route component={UserReservationsPage} path="/my-reservations" />
      </Route>
      <Route component={HomePage} onEnter={scrollTop} path="/" />
      <Route component={AboutPage} onEnter={scrollTop} path="/about" />
      <Route component={ResourcePage} onEnter={scrollTop} path="/resources/:id" />
      <Route component={ReservationPage} path="/resources/:id/reservation" />
      <Route component={SearchPage} path="/search" />
      <Route component={NotFoundPage} path="*" />
    </Route>
  );
};
