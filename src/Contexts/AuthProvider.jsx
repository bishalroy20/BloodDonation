// src/Contexts/AuthProvider.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // Backend profile (role, status, etc.)
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // ✅ Fetch profile from backend using Firebase UID
          const res = await axios.get(
            `http://localhost:5000/api/users/${currentUser.uid}`
          );
          setProfile(res.data); // should include { name, email, role, status }
        } catch (err) {
          console.error("Failed to load profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    signOutUser,
    user,
    profile, // ✅ expose profile
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
