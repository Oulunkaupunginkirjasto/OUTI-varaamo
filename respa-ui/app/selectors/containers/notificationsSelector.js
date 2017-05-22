import map from 'lodash/map';
import reject from 'lodash/reject';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';
import localeSelector from 'selectors/localeSelector';

const notificationsInputSelector = (state) => state.notifications;

const notificationsSelector = createSelector(
  localeSelector, notificationsInputSelector, (locale, notifications) => ({
    notifications: map(reject(notifications, 'hidden'), (notification) => {
      if (notification.message && notification.message[locale]) {
        return Object.assign({}, notification, { message: notification.message[locale] });
      } else if (notification.message && notification.message[constants.DEFAULT_LOCALE]) {
        return Object.assign({}, notification, {
          message: notification.message[constants.DEFAULT_LOCALE],
        });
      }
      return notification;
    }),
  })
);

export default notificationsSelector;
