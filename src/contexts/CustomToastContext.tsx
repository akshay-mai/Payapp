import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IMessage } from '../components/CustomToast';

type ICustomToastContext = {
  message: IMessage;
  setMessage: (message: IMessage) => void;
};
type ICustomToastProviderProps = {
  children: ReactNode;
};

const CustomToastContext = createContext<ICustomToastContext | undefined>(undefined);

export const useCustomToast = () => {
  const context = useContext(CustomToastContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomToastProvider');
  }
  return context;
};

export const CustomToastProvider: React.FC<ICustomToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<IMessage>({
    success: false,
    text: '',
    show: false
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMessage = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMessage({
          text: '',
          success: false,
          show: false
        })
      }, 3000);
    };
    if (message.text) {
      handleMessage();
    }
    return () => {
      clearTimeout(timeoutId);
    }
  }, [message.success, message.text])

  const contextValue: ICustomToastContext = {
    message,
    setMessage
  };

  return <CustomToastContext.Provider value={contextValue}>{children}</CustomToastContext.Provider>;
};

