import filter from 'lodash/filter';
import React from 'react';
import ReactFavicon from 'react-favicon';

import { getCurrentCustomization } from 'utils/CustomizationUtils';

import helsinkiFavicon from 'assets/images/helsinki-favicon.ico';
import espooFavicon from 'assets/images/espoo-favicon.ico';
import ouluFavicon from 'assets/images/oulu-favicon.ico';

class PatchedFavicon extends ReactFavicon {
  componentWillUnmount() {
    const activeInstance = ReactFavicon.getActiveInstance();
    clearInterval(activeInstance.state.animationLoop);
    ReactFavicon.mountedInstances = filter(ReactFavicon.mountedInstances,
      (element) => (element !== this));
  }
}

function Favicon() {
  let favicon = null;
  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      favicon = espooFavicon;
      break;
    }

    case 'OULU': {
      favicon = ouluFavicon;
      break;
    }

    default: {
      favicon = helsinkiFavicon;
      break;
    }
  }
  return <PatchedFavicon url={[favicon]} />;
}

Favicon.propTypes = {};

export default Favicon;
