import React, { createContext, useState, useContext, ReactNode } from "react";
import ChallengeNotification from '../components/Notification';

interface NotificationContextType {
  showNotification: (message: string, onClick: () => void) => void;
}

interface NotificationProviderProps {
  children: ReactNode; // This allows NotificationProvider to accept any JSX elements as children
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{
    message: string;
    onClick: () => void;
  } | null>(null);

  const showNotification = (message: string, onClick: () => void) => {
    console.log("Showing Notification")
    setNotification({ message, onClick });
    setTimeout(() => {
      setNotification(null); // Hide after a few seconds
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <ChallengeNotification
          message={notification.message}
          onClick={notification.onClick}
        />
      )}
    </NotificationContext.Provider>
  );
};
