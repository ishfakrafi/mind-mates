import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { Image, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, IconButton } from "../components";
import { icons } from "../constants";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { AppearanceProvider } from "../app/AppearanceContext";
import * as Notifications from "expo-notifications";
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../components/firebase-config";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  // Initialize Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  const [loading, setLoading] = useState(true); // State to show loading spinner while checking auth
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if user is signed in
  const [journeyText, setJourneyText] = useState(
    "Your Journey To Wellness Starts Here"
  );
  const [emailText, setEmailText] = useState("Login with Email");
  const [googleText, setGoogleText] = useState("Login with Google");

  // Notification Permission and Handler Setup
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Notification permissions not granted");
        }
      }
    };

    requestNotificationPermission();
  }, []);

  // Check if user is already authenticated when the app starts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true); // User is signed in
        router.push("/profile"); // Redirect to the profile or home screen
      } else {
        setIsSignedIn(false); // User is not signed in
      }
      setLoading(false); // Finish loading once auth state is checked
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      // Create a Firebase credential with the Google token
      const credential = GoogleAuthProvider.credential(id_token);

      // Sign in with the credential to Firebase
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // User successfully signed in
          console.log("User signed in: ", userCredential.user);
          router.push("/profile"); // Navigate to the profile page after successful login
        })
        .catch((error) => {
          console.error("Error signing in with Google: ", error);
        });
    }
  }, [response]);

  // Show loading indicator while checking authentication state
  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  // If the user is not signed in, show the login options
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-[500px] h-[100px]"
            resizeMode="contain"
          />

          {/* Display text */}
          <Text style={{ color: "#FFFFFF" }}>{journeyText}</Text>

          <View className="relative mt-5">
            <CustomButton
              title={emailText}
              handlePress={() => router.push("/sign-in")}
              width={350}
              containerStyles={{ marginTop: 16 }}
            />
          </View>
          <View className="relative mt-5">
            <IconButton
              title={googleText}
              handlePress={promptAsync}
              icon={icons.google}
              width={350}
              containerStyles={{ marginTop: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export SignIn wrapped in AppearanceProvider
export default () => <SignIn />;
