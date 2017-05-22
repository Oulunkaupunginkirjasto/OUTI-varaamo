import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import { reduxForm } from 'redux-form';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import isEmail from 'validator/lib/isEmail';

import ReduxFormField from 'components/common/ReduxFormField';
import constants from 'constants/AppConstants';

const messages = defineMessages({
  addressCity: {
    id: 'reservation_form.address_city',
    defaultMessage: 'Kaupunki',
  },
  addressStreet: {
    id: 'reservation_form.address_street',
    defaultMessage: 'Katuosoite',
  },
  addressZip: {
    id: 'reservation_form.address_zip',
    defaultMessage: 'Postinumero',
  },
  comments: {
    id: 'reservation_form.comments',
    defaultMessage: 'Kommentit',
  },
  commentsHelp: {
    id: 'reservation_form.comments_help',
    defaultMessage: 'Varauksen mahdolliset lisätiedot',
  },
  enterValidEmail: {
    id: 'reservation_form.enter_valid_email',
    defaultMessage: 'Syötä kunnollinen sähköpostiosoite',
  },
  eventDescription: {
    id: 'reservation_form.event_description',
    defaultMessage: 'Lisätiedot',
  },
  maxLength: {
    id: 'reservation_form.field_max_length',
    defaultMessage: 'Kentän maksimipituus on {maxLength} merkkiä',
  },
  mustAcceptTerms: {
    id: 'reservation_form.must_accept_terms',
    defaultMessage: 'Sinun on hyväksyttävä tilan käyttösäännöt varataksesi tilan',
  },
  numberOfParticipants: {
    id: 'reservation_form.number_of_participants',
    defaultMessage: 'Osallistujamäärä',
  },
  readTerms: {
    id: 'reservation_form.read_terms',
    defaultMessage: 'Olen lukenut ja hyväksynyt tilan käyttösäännöt',
  },
  requiredField: {
    id: 'reservation_form.required_field',
    defaultMessage: 'Pakollinen tieto',
  },
  reserverEmailAddress: {
    id: 'reservation_form.reserver_email',
    defaultMessage: 'Sähköposti',
  },
  reserverId: {
    id: 'reservation_form.reserver_id',
    defaultMessage: 'Y-tunnus / henkilötunnus',
  },
  reserverName: {
    id: 'reservation_form.reserver_name',
    defaultMessage: 'Varaaja / Vuokraaja',
  },
  reserverPhoneNumber: {
    id: 'reservation_form.reserver_phone_number',
    defaultMessage: 'Puhelin',
  },
  staffEvent: {
    id: 'reservation_form.staff_event',
    defaultMessage: 'Viraston oma tapahtuma',
  },
  staffEventHelp: {
    id: 'reservation_form.staff_event_help',
    defaultMessage: `
                  Viraston oma tapahtuma hyväksytään automaattisesti ja ainoat pakolliset tiedot
                  ovat varaajan nimi ja lisätiedot.
                  `,
  },
});

const validators = {
  reserverEmailAddress: ({ reserverEmailAddress }, { intl }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return intl.formatMessage(messages.enterValidEmail);
    }
    return null;
  },
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  company: 100,
  numberOfParticipants: 100,
  reserverAddressCity: 100,
  reserverAddressStreet: 100,
  reserverAddressZip: 30,
  reserverEmailAddress: 100,
  reserverId: 30,
  reserverName: 100,
  reserverPhoneNumber: 30,
};

export function validate(values, { fields, intl, requiredFields }) {
  const errors = {};
  const currentRequiredFields = values.staffEvent ?
    constants.REQUIRED_STAFF_EVENT_FIELDS :
    requiredFields;
  fields.forEach((field) => {
    const validator = validators[field];
    if (validator) {
      const error = validator(values, { intl });
      if (error) {
        errors[field] = error;
      }
    }
    if (maxLengths[field]) {
      if (values[field] && values[field].length > maxLengths[field]) {
        errors[field] = intl.formatMessage(messages.maxLength, {
          maxLength: maxLengths[field],
        });
      }
    }
    if (includes(currentRequiredFields, field)) {
      if (!values[field]) {
        errors[field] = (
          field === 'termsAndConditions' ?
          intl.formatMessage(messages.mustAcceptTerms) :
          intl.formatMessage(messages.requiredField)
        );
      }
    }
  });
  return errors;
}

export class UnconnectedReservationForm extends Component {
  renderField(type, label, field, extraProps) {
    if (!field) {
      return null;
    }
    const isRequired = includes(this.requiredFields, field.name);

    return (
      <ReduxFormField
        extraProps={extraProps}
        field={field}
        label={`${label}${isRequired ? '*' : ''}`}
        type={type}
      />
    );
  }

  render() {
    const {
      fields,
      intl,
      isMakingReservations,
      handleSubmit,
      onClose,
      onConfirm,
      requiredFields,
      showButtons,
    } = this.props;

    this.requiredFields = fields.staffEvent && fields.staffEvent.checked ?
      constants.REQUIRED_STAFF_EVENT_FIELDS :
      requiredFields;

    return (
      <div>
        <form
          className="reservation-form form-horizontal"
          onSubmit={handleSubmit(onConfirm)}
        >
          { fields.staffEvent && (
            <Well>
              {this.renderField(
                'checkbox',
                intl.formatMessage(messages.staffEvent),
                fields.staffEvent,
                {
                  help: intl.formatMessage(messages.staffEventHelp),
                }
              )}
            </Well>
          )}
          {this.renderField('text', intl.formatMessage(messages.reserverName), fields.reserverName)}
          {this.renderField('text', intl.formatMessage(messages.reserverId), fields.reserverId)}
          {this.renderField(
            'text',
            intl.formatMessage(messages.reserverPhoneNumber),
            fields.reserverPhoneNumber
          )}
          {this.renderField(
            'email',
            intl.formatMessage(messages.reserverEmailAddress),
            fields.reserverEmailAddress
          )}
          {this.renderField(
            'textarea',
            intl.formatMessage(messages.eventDescription),
            fields.eventDescription,
            { rows: 5 }
          )}
          {this.renderField(
            'number',
            intl.formatMessage(messages.numberOfParticipants),
            fields.numberOfParticipants,
            { min: '0' }
          )}
          { fields.reserverAddressStreet && (
            <Well>
              <p>
                <FormattedMessage
                  id="reservation_form.address"
                  defaultMessage="Osoite"
                />
              </p>
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressStreet),
                fields.reserverAddressStreet
              )}
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressZip),
                fields.reserverAddressZip
              )}
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressCity),
                fields.reserverAddressCity
              )}
            </Well>
          )}
          { fields.billingAddressStreet && (
            <Well>
              <p>
                <FormattedMessage
                  id="reservation_form.billing_address"
                  defaultMessage="Laskutusosoite"
                />
              </p>
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressStreet),
                fields.billingAddressStreet
              )}
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressZip),
                fields.billingAddressZip
              )}
              {this.renderField(
                'text',
                intl.formatMessage(messages.addressCity),
                fields.billingAddressCity
              )}
            </Well>
          )}
          {this.renderField(
            'textarea',
            intl.formatMessage(messages.comments),
            fields.comments,
            {
              placeholder: intl.formatMessage(messages.commentsHelp),
              rows: 5,
            }
          )}
          {this.renderField(
            'checkbox',
            intl.formatMessage(messages.readTerms),
            fields.termsAndConditions
          )}
          <div className="form-controls">
            { showButtons && (
              <Button
                bsStyle="default"
                onClick={onClose}
              >
                <FormattedMessage
                  id="reservation_form.back"
                  defaultMessage="Takaisin"
                />
              </Button>
            )}
            { showButtons && (
              <Button
                bsStyle="primary"
                disabled={isMakingReservations}
                onClick={handleSubmit(onConfirm)}
                type="submit"
              >
                {isMakingReservations ?
                  <FormattedMessage
                    id="reservation_form.saving"
                    defaultMessage="Tallennetaan..."
                  /> :
                  <FormattedMessage
                    id="reservation_form.save"
                    defaultMessage="Tallenna"
                  />}
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  fields: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

export default injectIntl(
  reduxForm({
    form: 'preliminaryReservation',
    validate,
  })(UnconnectedReservationForm),
  { withRef: true }
);
