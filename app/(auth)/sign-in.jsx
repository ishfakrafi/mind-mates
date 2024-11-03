import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

// Add this:
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { auth, provider } from "../../components/firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Email and password fields are required.");
      return;
    }

    // Firebase sign-in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        setTimeout(() => {
          router.push("/profile"); // Slight delay to allow navigation setup
        }, 500); // Adjust the delay if necessary
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        Alert.alert("Login Error", error.message);
      });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 500,
          }}
        >
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to MindMates
          </Text>

          <FormField
            title="Email"
            //value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            //value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <View className="relative mt-5">
            <CustomButton
              title="Login"
              handlePress={handleLogin}
              width={350}
              marginLeft={18}
              containerStyles={{ marginTop: 16 }}
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold">
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
