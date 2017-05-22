import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import SearchFilters from 'components/search/SearchFilters';

describe('Component: search/SearchFilters', () => {
  const props = {
    isFetchingPurposes: false,
    isFetchingUnits: false,
    onFiltersChange: simple.stub(),
    filters: { purpose: 'some-filter', unit: 'some-unit' },
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
    unitOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  const tree = sd.shallowRender(<SearchFilters {...props} />);

  describe('unit filter', () => {
    const selectTrees = tree.everySubTree('Select',
      (node) => node.props.name === 'unit-filter-select');

    it('should render a Select component', () => {
      expect(selectTrees.length).to.equal(1);
    });

    it('should pass correct props to the Select component', () => {
      const actualProps = selectTrees[0].props;

      expect(actualProps.clearable).to.equal(true);
      expect(actualProps.isLoading).to.equal(props.isFetchingUnits);
      expect(typeof actualProps.onChange).to.equal('function');
      expect(actualProps.options).to.deep.equal(props.unitOptions);
      expect(typeof actualProps.placeholder).to.equal('string');
      expect(actualProps.value).to.equal(props.filters.unit);
    });

    describe('onChange', () => {
      const filterValue = 'new-value';

      before(() => {
        selectTrees[0].props.onChange(filterValue);
      });

      it('should call onFiltersChange ', () => {
        expect(props.onFiltersChange.callCount).to.equal(1);
      });

      it('should call onFiltersChange with correct arguments', () => {
        const expected = { unit: filterValue };

        expect(props.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });

  describe('purpose filter', () => {
    const selectTrees = tree.everySubTree('Select',
      (node) => node.props.name === 'purpose-filter-select');

    it('should render a Select component', () => {
      expect(selectTrees.length).to.equal(1);
    });

    it('should pass correct props to the Select component', () => {
      const actualProps = selectTrees[0].props;

      expect(actualProps.clearable).to.equal(true);
      expect(actualProps.isLoading).to.equal(props.isFetchingPurposes);
      expect(typeof actualProps.onChange).to.equal('function');
      expect(actualProps.options).to.deep.equal(props.purposeOptions);
      expect(typeof actualProps.placeholder).to.equal('string');
      expect(actualProps.value).to.equal(props.filters.purpose);
    });

    describe('onChange', () => {
      const filterValue = 'new-value';

      before(() => {
        selectTrees[0].props.onChange(filterValue);
      });

      it('should call onFiltersChange ', () => {
        expect(props.onFiltersChange.callCount).to.equal(2);
      });

      it('should call onFiltersChange with correct arguments', () => {
        const expected = { purpose: filterValue };

        expect(props.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });
});
