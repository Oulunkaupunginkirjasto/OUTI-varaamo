import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { capitalizeFirstLetter } from 'utils/renderUtils';

const messages = defineMessages({
  timeString: {
    id: 'timerange.timestring',
    defaultMessage: 'klo {begin} \u2013 {end}',
  },
});

class TimeRange extends Component {
  renderSingleDay(lineBreaks, dateString, timeString) {
    return lineBreaks ? (
      <div>
        <div>{capitalizeFirstLetter(dateString)}</div>
        <div>{timeString}</div>
      </div>
    ) : (
      `${capitalizeFirstLetter(dateString)} ${timeString}`
    );
  }

  renderMultiDay(lineBreaks, beginDate, beginTime, endDate, endTime) {
    return lineBreaks ? (
      <div>
        <div>{capitalizeFirstLetter(beginDate)}</div>
        <div>{beginTime} -</div>
        <div>{capitalizeFirstLetter(endDate)}</div>
        <div>{endTime}</div>
      </div>
    ) : (
      `${capitalizeFirstLetter(beginDate)} ${beginTime} \u2013 ` +
      `${capitalizeFirstLetter(endDate)} ${endTime}`
    );
  }

  render() {
    const {
      begin,
      className,
      dateFormat,
      end,
      intl,
      lineBreaks,
      timeFormat,
    } = this.props;
    const beginMoment = moment(begin);
    const endMoment = moment(end);
    const beginDateString = beginMoment.locale(intl.locale).format(dateFormat);
    const endDateString = endMoment.locale(intl.locale).format(dateFormat);
    const beginTimeString = beginMoment.format(timeFormat);
    const endTimeString = endMoment.format(timeFormat);
    const isMultiDay = !endMoment.isSame(beginMoment, 'day');
    const timeString = intl.formatMessage(messages.timeString, {
      begin: beginTimeString,
      end: endTimeString,
    });
    const ISORangeString = `${begin}/${end}`;

    return (
      <time className={className} dateTime={ISORangeString}>
        {isMultiDay ?
          this.renderMultiDay(lineBreaks, beginDateString, beginTimeString,
            endDateString, endTimeString) :
          this.renderSingleDay(lineBreaks, beginDateString, timeString)
        }
      </time>
    );
  }
}

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  className: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  lineBreaks: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
};

TimeRange.defaultProps = {
  dateFormat: 'dddd, LL',
  lineBreaks: false,
  timeFormat: 'H:mm',
};

export default injectIntl(TimeRange);
