import orderBy from 'lodash/orderBy';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeCategory from 'components/purpose/PurposeCategory';
import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

export class UnconnectedPurposeCategoryList extends Component {
  constructor(props) {
    super(props);
    this.renderPurposeCategory = this.renderPurposeCategory.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  renderPurposeCategory(parent) {
    const { groupedPurposes, purposeCategories } = this.props;

    const purposes = groupedPurposes[parent];
    const category = purposeCategories[parent];

    return (
      <PurposeCategory
        key={parent}
        category={category}
        purposes={purposes}
      />
    );
  }

  render() {
    const { isFetchingPurposes, groupedPurposes, purposeCategories } = this.props;
    const sortedKeys = orderBy(Object.keys(groupedPurposes), [
      key => purposeCategories[key].displayOrder,
    ]);

    return (
      <Loader loaded={!isFetchingPurposes}>
        <div>
          {sortedKeys.map(this.renderPurposeCategory)}
        </div>
      </Loader>
    );
  }
}

UnconnectedPurposeCategoryList.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  groupedPurposes: PropTypes.object.isRequired,
  purposeCategories: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchPurposes,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(purposeCategoryListSelector, mapDispatchToProps)(UnconnectedPurposeCategoryList)
);
