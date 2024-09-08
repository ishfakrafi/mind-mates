import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, IconButton } from "../components";
import { icons } from "../constants";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../components/firebase-config";

WebBrowser.maybeCompleteAuthSession(); // Ensure the browser session completes

const SignIn = () => {
  // Initialize Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "1038948232822-xxxxx.apps.googleusercontent.com",
    iosClientId:
      "385877791288-gordda0l9k2pahtf7umccsj6buiftcli.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId:
      "385877791288-s4pa6b9alm8466qb2am0n4hv6e51rrkt.apps.googleusercontent.com", // optional for web testing
  });

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
        })
        .catch((error) => {
          console.error("Error signing in with Google: ", error);
        });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-[500px] h-[100px]"
            resizeMode="contain"
          />
          <Text style={{ color: "#FFFFFF" }}>
            Your Journey To Wellness Starts Here
          </Text>
          <View className="relative mt-5">
            <CustomButton
              title="Login with Email"
              handlePress={() => router.push("/sign-in")}
              width={350}
              containerStyles={{ marginTop: 16 }}
            />
          </View>
          <View className="relative mt-5">
            <IconButton
              title="Login with Google"
              handlePress={signInWithGoogle}
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

export default SignIn;
