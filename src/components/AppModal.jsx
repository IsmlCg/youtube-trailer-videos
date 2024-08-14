import React from "react";
import Modal from "react-modal";

const AppModal = ({ isOpen, onRequestClose, title, children }) => {
  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          contentLabel="Modal"
          className="p-modal"
          overlayClassName="modal-overlay"
      >
          <section class="p-modal_dialog">
              <header class="p-modal__header modal-header bg-transparent text-uppercase text-white">
                  <h2 class="p-modal__title" id="modal-title">{title}</h2>
                  <button type="button" class="btn btn-secondary" onClick={onRequestClose} >Close</button>
              </header>
              { children}              
          </section>
      </Modal>
  );
};

export default AppModal;
