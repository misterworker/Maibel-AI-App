import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext<any>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const setModalWithDelay = (delay: number) => {
    setTimeout(() => {
      showModal();
    }, delay);
  };

  return (
    <ModalContext.Provider value={{ isModalVisible, showModal, hideModal, setModalWithDelay }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
