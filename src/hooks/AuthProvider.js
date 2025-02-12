"use client";

import React, { useState, useEffect, createContext, useMemo } from "react";
import Cookies from "js-cookie";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import { logoutApiCall } from "@/api/auth";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for cookies
  const setCookie = (name, value, options = {}) => {
    Cookies.set(name, value, { path: "/", ...options });
  };

  const removeCookie = (name) => {
    Cookies.remove(name, { path: "/" });
  };

  const getCookie = (name) => {
    return Cookies.get(name);
  };

  // Create User
  const createUser = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify Email
  const verifyEmail = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
      }
      const actionCodeSettings = {
        url: `${window.location.origin}/verify?mode=verifyEmail`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };

  // Update User Profile
  const updateUserProfile = async (name, photo) => {
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      removeCookie("accessToken");
      removeCookie("refreshToken");
      logoutApiCall();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Password
  const signin = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user || !user.emailVerified) {
        await signOut(auth);
        removeCookie("accessToken");
        removeCookie("refreshToken");
        alert("Email not verified. Please check your inbox to verify your email.");
        return;
      }

      // Fetch tokens from backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName || "",
          lastName: "",
          role: "user",
          phone_number: "",
          display_url: user.photoURL || "",
        }),
      });

      const result = await response.json();

      if (result.accessToken && result.refreshToken) {
        setCookie("accessToken", result.accessToken, { expires: 15 / (24 * 60) }); // 15 minutes
        setCookie("refreshToken", result.refreshToken, { expires: 7 }); // 7 days
      }

      return userCredential;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify?mode=resetPassword`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = getCookie("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (result.accessToken && result.refreshToken) {
        setCookie("accessToken", result.accessToken, { expires: 15 / (24 * 60) }); // 15 minutes
        setCookie("refreshToken", result.refreshToken, { expires: 7 }); // 7 days
        return result.accessToken;
      } else {
        throw new Error("Failed to refresh tokens");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        removeCookie("accessToken");
        removeCookie("refreshToken");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      loading,
      setLoading,
      createUser,
      verifyEmail,
      updateUserProfile,
      signInWithGoogle,
      logout,
      signin,
      resetPassword,
      refreshAccessToken,
      auth,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full animate-spin border-4 border-solid border-cyan-500 border-t-transparent shadow-lg"></div>
            <p className="mt-4 text-lg font-semibold text-cyan-700">
              Loading, please wait...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;