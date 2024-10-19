import React, { createContext, useState, ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode; // Make sure the children prop is accepted
}

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ address, setAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
