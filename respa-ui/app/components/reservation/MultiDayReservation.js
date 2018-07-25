import React, { Component, PropTypes } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import DateField from 'react-date-field';
import DatePicker from 'react-date-picker';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { onRenderDayAvailability } from 'utils/renderUtils';

class MultiDayReservation extends Component {
  constructor() {
    super();
    this.handleChangeBeginDate = this.handleChangeBeginDate.bind(this);
    this.handleRenderDay = this.handleRenderDay.bind(this);
  }

  handleChangeBeginDate(newDate) {
    this.props.onChangeBeginDate(newDate);
  }

  handleRenderDay(props) {
    const { calendarAvailability, fetchDates } = this.props;
    return onRenderDayAvailability(props, calendarAvailability, fetchDates);
  }

  render() {
    const {
      beginDate,
      defaultDate,
      endDate,
      intl,
      onCalendarViewDateChange,
      onCancel,
      onChangeBeginDate,
      onChangeEndDate,
      onConfirm,
      onOpen,
    } = this.props;
    return beginDate != null ? (
      <Well>
        <form className="form">
          <h2>
            <FormattedMessage
              id="multiday.header"
              defaultMessage="Tee useamman päivän varaus"
            />
          </h2>
          <FormGroup controlId="multiday-reservation-begin">
            <label htmlFor="multiday-reservation-begin">
              <FormattedMessage
                id="multiday.begin"
                defaultMessage="Alkaa"
              />
            </label>
            <DateField clearIcon={false} renderInput={this.renderInput}>
              <DatePicker
                date={beginDate || defaultDate}
                hideFooter
                locale={intl.locale}
                onChange={onChangeBeginDate}
                onRenderDay={this.handleRenderDay}
                onViewDateChange={onCalendarViewDateChange}
                style={{ height: 210 }}
              />
            </DateField>
          </FormGroup>
          <FormGroup controlId="multiday-reservation-end">
            <label htmlFor="multiday-reservation-end">
              <FormattedMessage
                id="multiday.end"
                defaultMessage="Loppuu"
              />
            </label>
            <DateField clearIcon={false}>
              <DatePicker
                date={endDate || defaultDate}
                hideFooter
                isDatePicker
                locale={intl.locale}
                onChange={onChangeEndDate}
                onRenderDay={this.handleRenderDay}
                onViewDateChange={onCalendarViewDateChange}
                style={{ height: 210 }}
              />
            </DateField>
          </FormGroup>
          <ButtonGroup style={{ width: '100%' }}>
            <Button
              bsStyle="primary"
              onClick={onConfirm}
              style={{ width: '50%' }}
            >
              <FormattedMessage
                id="reservation_calendar.reserve"
                defaultMessage="Varaa"
              />
            </Button>
            <Button
              bsStyle="default"
              onClick={onCancel}
              style={{ width: '50%' }}
            >
              <FormattedMessage
                id="multiday.cancel"
                defaultMessage="Peruuta"
              />
            </Button>
          </ButtonGroup>
        </form>
      </Well>
    ) : (
      <Button
        bsStyle="primary"
        onClick={onOpen}
        style={{ width: '100%' }}
      >
        <FormattedMessage
          id="multiday.header"
          defaultMessage="Tee useamman päivän varaus"
        />
      </Button>
    );
  }
}

MultiDayReservation.propTypes = {
  beginDate: PropTypes.string,
  endDate: PropTypes.string,
  calendarAvailability: PropTypes.object,
  fetchDates: PropTypes.object,
  onCalendarViewDateChange: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  onChangeBeginDate: PropTypes.func.isRequired,
  onChangeEndDate: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  defaultDate: PropTypes.string.isRequired,
  intl: intlShape,
};

export default injectIntl(MultiDayReservation);
