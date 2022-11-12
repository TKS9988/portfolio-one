import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import Router from "next/router";

interface User {
  email: string;
  uid: string;
}

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const value = {
    user,
    loading,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User) => {
      if (user !== null) {
        setUser(user);
        setLoading(false);
      } else {
        Router.push("/dashboard/signin");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
