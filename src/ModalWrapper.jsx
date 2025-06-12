import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';

// Create context for modal
const ModalContext = createContext();

// Provider component
export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: null,
    title: '',
    size: 'md',
  });

  const openModal = (content, options = {}) => {
    setModalState({
      isOpen: true,
      content,
      title: options.title || '',
      size: options.size || 'md',
    });
  };

  const closeModal = () => {
    setModalState(prevState => ({
      ...prevState,
      isOpen: false,
    }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        size={modalState.size}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

// Hook for using modal anywhere in the app
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

// Simple wrapper component for easy access
const ModalWrapper = ({ children }) => {
  return <ModalProvider>{children}</ModalProvider>;
};

export default ModalWrapper; 