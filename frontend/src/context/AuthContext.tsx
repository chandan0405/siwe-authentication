import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define types for AuthContext
interface AuthContextProps {
  address: string | null;
  setAddress: (address: string | null) => void;
  signOut: () => void; // Add signOut type
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  // Persist session across page reloads
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/session', { withCredentials: true });
        setAddress(data.address);
      } catch {
        setAddress(null);
      }
    };

    fetchSession();
  }, []);

  // Define sign-out function
  const signOut = async () => {
    try {
      await axios.post('http://localhost:4000/api/logout', {}, { withCredentials: true });
      setAddress(null);
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ address, setAddress, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
