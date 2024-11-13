import React, { useEffect, useState, useContext } from "react";
import { Link, router } from "expo-router";
import { Image, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, IconButton } from "../components";
import { icons } from "../constants";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { AppearanceProvider } from "./AppearanceContext";
import { LanguageContext } from "./LanguageContext";
import { LanguageProvider } from "./LanguageContext";
import * as Notifications from "expo-notifications";
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../components/firebase-config";
import tw from "tailwind-react-native-classnames";
import { UserProvider } from "./UserContext";
import { UserContext } from "./UserContext";

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
  const { user } = useContext(UserContext);

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
  const languageContext = useContext(LanguageContext);
  console.log("Inside App - LanguageContext:", languageContext);
  useEffect(() => {
    console.log("UserContext data:", user);
  }, [user]); // Logs whenever user data changes
  // Show loading indicator while checking authentication state
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // If the user is not signed in, show the login options
  return (
    <UserProvider>
      <LanguageProvider>
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#AB79FD" }]}>
          <ScrollView
            contentContainerStyle={tw`flex-grow justify-center items-center px-4`}
          >
            <Image
              source={require("../assets/images/icon.png")}
              style={tw` mb-4`}
              resizeMode="contain"
            />

            {/* Display text */}
            <Text style={tw`text-white text-lg text-center mb-6`}>
              {journeyText}
            </Text>

            <View style={tw`w-full`}>
              <CustomButton
                title={emailText}
                handlePress={() => router.push("/sign-in")}
                width={350}
                containerStyles={tw`mt-6`}
              />
              <View style={tw`mt-4`}>
                <IconButton
                  title={googleText}
                  handlePress={promptAsync}
                  icon={icons.google}
                  width={350}
                  containerStyles={tw`mt-4`}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LanguageProvider>
    </UserProvider>
  );
};

export default function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <SignIn />
      </LanguageProvider>
    </UserProvider>
  );
}
