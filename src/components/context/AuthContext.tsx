import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUser } from '../../types/backend';

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
