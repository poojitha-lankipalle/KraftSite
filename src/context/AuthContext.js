import React, { createContext, useContext, useState } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Login function
  const login = async (email, password) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    if (email && password.length >= 6) {
      setUser({
        id: '1',
        name: email.split('@')[0],
        email,
      });
      return true;
    }
    return false;
  };

  // Signup function
  const signup = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 800));
    if (name && email && password.length >= 6) {
      setUser({ id: '1', name, email });
      return true;
    }
    return false;
  };

  // Guest mode
  const continueAsGuest = () => {
    setIsGuest(true);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isAuthenticated: !!user,
        login,
        signup,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create the hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}