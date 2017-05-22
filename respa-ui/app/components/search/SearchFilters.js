import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';

class SearchFilters extends Component {
  render() {
    const {
      isFetchingPurposes,
      isFetchingUnits,
      onFiltersChange,
      filters,
      purposeOptions,
      unitOptions,
    } = this.props;

    return (
      <div style={{ marginBottom: '20px' }}>
        <h4>
          <FormattedMessage
            id="search_filters.unit"
            defaultMessage="Kirjasto"
          />
        </h4>
        <Select
          clearable
          isLoading={isFetchingUnits}
          name="unit-filter-select"
          onChange={(value) => onFiltersChange({ unit: value })}
          options={unitOptions}
          placeholder=" "
          value={filters.unit}
        />
        <h4>
          <FormattedMessage
            id="search_filters.purpose"
            defaultMessage="Laite, tila tai palvelu"
          />
        </h4>
        <Select
          clearable
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={(value) => onFiltersChange({ purpose: value })}
          options={purposeOptions}
          placeholder=" "
          value={filters.purpose}
        />
      </div>
    );
  }
}

SearchFilters.propTypes = {
  isFetchingPurposes: PropTypes.bool.isRequired,
  isFetchingUnits: PropTypes.bool.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  purposeOptions: PropTypes.array.isRequired,
  unitOptions: PropTypes.array.isRequired,
};

export default SearchFilters;
