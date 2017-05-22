import constants from 'constants/AppConstants';

function getCurrentCustomization() {
  const host = window.location.host;
  return constants.CUSTOMIZATIONS[host] || null;
}

function getCustomizationClassName() {
  switch (getCurrentCustomization()) {

    case 'ESPOO': {
      return 'espoo-customizations';
    }

    case 'OULU': {
      return 'oulu-customizations';
    }

    default: {
      return '';
    }
  }
}

export {
  getCurrentCustomization,
  getCustomizationClassName,
};
