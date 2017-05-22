import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import DocumentTitle from 'react-document-title';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ImagePanel from 'components/common/ImagePanel';
import ResourceDetails from 'components/resource/ResourceDetails';
import ResourceHeader from 'components/resource/ResourceHeader';
import NotFoundPage from 'containers/NotFoundPage';
import resourcePageSelector from 'selectors/containers/resourcePageSelector';
import {
  getAddressWithName,
  getDescription,
  getName,
  getPeopleCapacityString,
} from 'utils/DataUtils';

const messages = defineMessages({
  imageAlt: {
    id: 'resource.image_alt',
    defaultMessage: 'Kuva {resourceName} tilasta',
  },
  title: {
    id: 'resource.title',
    defaultMessage: '{resourceName} - Varaamo',
  },
});

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    const { actions, id } = this.props;
    actions.fetchResource(id);
  }

  render() {
    const {
      date,
      id,
      intl,
      isFetchingResource,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource, intl.locale);

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <DocumentTitle title={intl.formatMessage(messages.title, { resourceName })}>
        <Loader loaded={!isEmpty(resource)}>
          <div className="resource-page">
            <ResourceHeader
              address={getAddressWithName(unit, intl.locale)}
              name={resourceName}
            />
            <LinkContainer to={`/resources/${id}/reservation?date=${date.split('T')[0]}`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                className="responsive-button"
              >
                <FormattedMessage
                  id="resource.reserve"
                  defaultMessage="Tee varaus"
                />
              </Button>
            </LinkContainer>
            <ResourceDetails
              capacityString={getPeopleCapacityString(resource.peopleCapacity)}
              description={getDescription(resource, intl.locale)}
              type={getName(resource.type, intl.locale)}
            />
            <ImagePanel
              altText={intl.formatMessage(messages.imageAlt, { resourceName })}
              images={resource.images || []}
            />
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default injectIntl(
  connect(resourcePageSelector, mapDispatchToProps)(UnconnectedResourcePage)
);
