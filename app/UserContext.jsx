import React, { createContext, useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../components/firebase-config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to load user data
  const loadUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Set user data with a default profile image if none exists
        setUser({
          displayName: currentUser.displayName || "User",
          email: currentUser.email,
          photoURL:
            userData.photoURL || "https://example.com/default-profile-pic.png", // Use Firestore value or default image
        });

        // Log the user data for verification
        console.log("User data from Firestore:", userData);
        console.log("Current user email from Auth:", currentUser.email);
        console.log(
          "Current user email name from Auth:",
          currentUser.displayName
        );
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    } else {
      console.log("No current user found in auth.");
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loadUserData }}>
      {children}
    </UserContext.Provider>
  );
};
