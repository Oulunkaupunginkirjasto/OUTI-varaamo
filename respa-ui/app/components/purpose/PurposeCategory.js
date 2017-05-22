import orderBy from 'lodash/orderBy';
import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Panel from 'react-bootstrap/lib/Panel';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import { getDescription, getName } from 'utils/DataUtils';

class PurposeCategoryList extends Component {
  getDescriptionHtml() {
    const { category, intl } = this.props;
    const description = getDescription(category, intl.locale);
    if (description.length) {
      return { __html: description };
    }
    return '';
  }

  renderDescription() {
    const { category } = this.props;
    const content = this.getDescriptionHtml();
    if (content) {
      return (
        <ListGroupItem className="panel-extra-heading" key={category.id}>
          <div dangerouslySetInnerHTML={this.getDescriptionHtml()} />
        </ListGroupItem>
      );
    }
    return false;
  }

  renderPurposeCategoryItem(purpose) {
    return (
      <PurposeCategoryItem
        key={purpose.id}
        purpose={purpose}
      />
    );
  }

  render() {
    const { category, intl, purposes } = this.props;
    const sortedPurposes = orderBy(purposes, [
      purpose => purpose.displayOrder,
      purpose => getName(purpose, intl.locale),
    ]);

    return (
      <Panel
        collapsible
        header={getName(category, intl.locale)}
      >
        <ListGroup fill>
          {this.renderDescription()}
          {sortedPurposes.map(this.renderPurposeCategoryItem)}
        </ListGroup>
      </Panel>
    );
  }
}

PurposeCategoryList.propTypes = {
  category: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  purposes: PropTypes.array.isRequired,
};

export default injectIntl(PurposeCategoryList);
