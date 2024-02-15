import React, { createContext, useContext, useState } from 'react';

export const RefreshedTokenContext = createContext();

export const RefreshedTokenProvider = ({ children }) => {
  const [globalRefreshedToken, setGlobalRefreshedToken] = useState(null);

  const setRefreshedToken = (token) => {
    setGlobalRefreshedToken(token);
  };

  return (
    <RefreshedTokenContext.Provider value={{ globalRefreshedToken, setRefreshedToken }}>
      {children}
    </RefreshedTokenContext.Provider>
  );
};

export const useRefreshedToken = () => {
  const context = useContext(RefreshedTokenContext);
  if (!context) {
    throw new Error('useRefreshedToken must be used within a RefreshedTokenProvider');
  }
  return context;
};