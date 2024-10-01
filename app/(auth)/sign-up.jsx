import { useState } from "react";
import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { CustomButton, FormField } from "../../components";
import { auth } from "../../components/firebase-config"; // Ensure the path is correct
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import the Firebase auth function

//import { icons } from "../constants";

const SignUp = () => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
  });
  const handleSignUp = () => {
    console.log("SignUp button pressed"); // Check if this is logged when pressing the button

    const { email, password } = form;

    // Check if email and password are being captured
    console.log("Email:", email, "Password:", password);

    if (!email || !password) {
      Alert.alert("Error", "Email and password fields are required.");
      return;
    }

    // Firebase email signup function
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered successfully:", userCredential.user);
        router.push("/profile");
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        Alert.alert("Sign-up Error", error.message);
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
            Get Started With MindMates
          </Text>
          <FormField
            title="First Name"
            //value={form.name}
            handleChangeText={(e) => setForm({ ...form, fname: e })}
            otherStyles="mt-7"
            keyboardType="name"
          />
          <FormField
            title="Last Name"
            //value={form.name}
            handleChangeText={(e) => setForm({ ...form, lname: e })}
            otherStyles="mt-7"
            keyboardType="name"
          />
          <FormField
            title="Date Of Birth"
            //value={form.name}
            handleChangeText={(e) => setForm({ ...form, dob: e })}
            otherStyles="mt-7"
            keyboardType="name"
          />
          <FormField
            title="Gender"
            //value={form.name}
            handleChangeText={(e) => setForm({ ...form, gender: e })}
            otherStyles="mt-7"
            keyboardType="name"
          />
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
              title="SignUp"
              handlePress={handleSignUp} //router.push("/home")}
              width={350}
              marginLeft={18}
              containerStyles={{ marginTop: 16 }}
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-lg font-psemibold">
              SignIn
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignUp;
