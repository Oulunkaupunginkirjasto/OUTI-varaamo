import omit from 'lodash/omit';
import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';

import { onRenderDayAvailability } from 'utils/renderUtils';

export default class AvailableDatePicker extends Component {
  constructor() {
    super();
    this.handleRenderDay = this.handleRenderDay.bind(this);
  }

  handleRenderDay(props) {
    const { availability, fetchDates } = this.props;
    return onRenderDayAvailability(props, availability, fetchDates);
  }

  render() {
    const rest = omit(this.props, ['availability', 'fetchDates']);
    return (<DatePicker
      onRenderDay={this.handleRenderDay}
      {...rest}
    />);
  }
}

AvailableDatePicker.propTypes = {
  availability: PropTypes.object,
  fetchDates: PropTypes.object,
};
