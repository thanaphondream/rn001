import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuth from './Apps';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { me, loading } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!loading) {
      setUser(me);
    }
  }, [me, loading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
