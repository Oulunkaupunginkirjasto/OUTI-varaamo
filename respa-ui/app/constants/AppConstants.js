export default {
  API_URL: __API_URL__,
  CUSTOMIZATIONS: {
    'varaamo.espoo.fi': 'ESPOO',
    'varaamotest-espoo.hel.ninja': 'ESPOO',
    'localhost:3000': 'OULU',
    'varaamo.ouka.fi': 'OULU',
    'varaamo.jyrip.net': 'OULU',
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DAY_AVAILABILITY: {
    available: 'AVAILABLE',
    allReserved: 'ALL_RESERVED',
    noTimes: 'NO_RESERVABLE_TIMES',
  },
  FEEDBACK_URL: 'http://www.helmet-kirjasto.fi/varaamo-palaute/',
  DEFAULT_LOCALE: 'fi',
  LOCALES: {
    english: 'en',
    finnish: 'fi',
  },
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
  },
  REQUIRED_API_HEADERS: {
    Accept: 'application/json',
    'Accept-Language': 'fi',
    'Content-Type': 'application/json',
  },
  REQUIRED_STAFF_EVENT_FIELDS: [
    'eventDescription',
    'reserverName',
  ],
  RESERVATION_FORM_FIELDS: [
    'reserverName',
    'reserverEmailAddress',
    'reserverPhoneNumber',
    'eventDescription',
    'numberOfParticipants',
  ],
  RESERVATION_STATE_LABELS: {
    cancelled: {
      labelBsStyle: 'default',
      labelText: {
        en: 'Canceled',
        fi: 'Peruttu',
      },
    },
    confirmed: {
      labelBsStyle: 'success',
      labelText: {
        en: 'Accepted',
        fi: 'Hyväksytty',
      },
    },
    denied: {
      labelBsStyle: 'danger',
      labelText: {
        en: 'Rejected',
        fi: 'Hylätty',
      },
    },
    requested: {
      labelBsStyle: 'primary',
      labelText: {
        en: 'Requested',
        fi: 'Käsiteltävänä',
      },
    },
  },
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    people: '',
    purpose: '',
    search: '',
    unit: '',
  },
  TIME_FORMAT: 'H:mm',
  TIME_FORMAT_WEEKDAY: 'ddd H:mm',
  TRACKING: __TRACKING__,
};
