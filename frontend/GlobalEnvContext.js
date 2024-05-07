// GlobalEnvContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalEnvContext = createContext();

export const useGlobalEnv = () => useContext(GlobalEnvContext);

export const GlobalEnvProvider = ({ children }) => {
 const [env, setEnv] = useState(global.env);

 return (
    <GlobalEnvContext.Provider value={{ env, setEnv }}>
      {children}
    </GlobalEnvContext.Provider>
 );
};