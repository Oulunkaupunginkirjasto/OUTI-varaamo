import capitalize from 'lodash/capitalize';
import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import { Link } from 'react-router';

import { getName } from 'utils/DataUtils';
import { getSearchPageUrl } from 'utils/SearchUtils';

class PurposeCategoryItem extends Component {
  render() {
    const { intl, purpose } = this.props;

    return (
      <ListGroupItem key={purpose.id}>
        <Link to={getSearchPageUrl({ purpose: purpose.id })}>
          {capitalize(getName(purpose, intl.locale))}
        </Link>
      </ListGroupItem>
    );
  }
}

PurposeCategoryItem.propTypes = {
  intl: intlShape.isRequired,
  purpose: PropTypes.object.isRequired,
};

export default injectIntl(PurposeCategoryItem);
