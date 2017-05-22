import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationCancelModal as ReservationCancelModal,
} from 'containers/ReservationCancelModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Container: ReservationCancelModal', () => {
  const responsibleContactInfo = 'Some contact info.';
  const resource = Resource.build({ responsibleContactInfo });
  const props = {
    actions: {
      deleteReservation: simple.stub(),
      closeReservationCancelModal: simple.stub(),
    },
    isAdmin: false,
    isCancellingReservations: false,
    show: true,
    reservationsToCancel: Immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resources: Immutable({
      [resource.id]: resource,
    }),
  };

  function getExtraProps(reservation, isAdmin = false) {
    return {
      isAdmin,
      reservationsToCancel: Immutable([reservation]),
      resources: Immutable({
        [resource.id]: resource,
      }),
    };
  }

  function getTree(extraProps = {}) {
    return sd.shallowRender(<ReservationCancelModal {...Object.assign({}, props, extraProps)} />);
  }

  describe('render', () => {
    describe('when isAdmin is true', () => {
      const isAdmin = true;
      const reservation = Reservation.build({
        resource: resource.id,
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a CompactReservationsList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationsList');
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationsList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button should read "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and reservation is not preliminary', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: false,
        resource: resource.id,
        state: 'confirmed',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a CompactReservationsList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationsList');
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationsList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button should read "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and preliminary reservation state is not "confirmed"', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: true,
        resource: resource.id,
        state: 'requested',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a CompactReservationsList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationsList');
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationsList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button should read "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and preliminary reservation state is "confirmed"', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: true,
        resource: resource.id,
        state: 'confirmed',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Varauksen peruminen"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Varauksen peruminen');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render resource responsibleContactInfo', () => {
          const modalText = modalBodyTrees[0].subTree('.responsible-contact-info').text();

          expect(modalText).to.contain(responsibleContactInfo);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render one Button', () => {
            expect(buttonTrees.length).to.equal(1);
          });

          describe('the button', () => {
            const buttonTree = buttonTrees[0];

            it('should read "Takaisin"', () => {
              expect(buttonTree.props.children).to.equal('Takaisin');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });
        });
      });
    });
  });

  describe('handleCancel', () => {
    const tree = sd.shallowRender(<ReservationCancelModal {...props} />);
    const instance = tree.getMountedInstance();

    before(() => {
      props.actions.closeReservationCancelModal.reset();
      instance.handleCancel();
    });

    it('should call closeReservationCancelModal', () => {
      expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
    });

    it('should call deleteReservation for each selected reservation', () => {
      expect(props.actions.deleteReservation.callCount).to.equal(
        props.reservationsToCancel.length
      );
    });

    it('should call deleteReservation with correct arguments', () => {
      const actualArgs = props.actions.deleteReservation.lastCall.args;
      const expected = props.reservationsToCancel[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
