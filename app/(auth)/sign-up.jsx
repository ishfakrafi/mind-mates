import { useState } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CustomButton, FormField } from "../../components";
import { auth } from "../../components/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUp = () => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // State to control loading spinner

  const handleSignUp = async () => {
    const { email, password, fname, lname } = form;

    if (!email || !password || !fname || !lname) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true); // Show the spinner

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the profile with first and last name
      await updateProfile(user, {
        displayName: `${fname} ${lname}`,
      });

      console.log("User profile updated successfully:", user);

      // Introduce a small delay to ensure the profile update is fully registered
      setTimeout(() => {
        router.push("/profile");
      }, 500); // 500ms delay
    } catch (error) {
      console.error("Error during sign-up:", error);
      Alert.alert("Sign-up Error", error.message);
    } finally {
      setLoading(false); // Hide the spinner
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust this offset as needed for iOS
      >
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

            {/* Form Fields */}
            <FormField
              title="First Name"
              handleChangeText={(e) => setForm({ ...form, fname: e })}
              otherStyles="mt-7"
              keyboardType="name"
            />
            <FormField
              title="Last Name"
              handleChangeText={(e) => setForm({ ...form, lname: e })}
              otherStyles="mt-7"
              keyboardType="name"
            />
            <FormField
              title="Date Of Birth"
              handleChangeText={(e) => setForm({ ...form, dob: e })}
              otherStyles="mt-7"
              keyboardType="name"
            />
            <FormField
              title="Gender"
              handleChangeText={(e) => setForm({ ...form, gender: e })}
              otherStyles="mt-7"
              keyboardType="name"
            />
            <FormField
              title="Email"
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              secureTextEntry
            />

            {/* Button and Spinner */}
            <View className="relative mt-5">
              {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <CustomButton
                  title="SignUp"
                  handlePress={handleSignUp}
                  width={350}
                  marginLeft={18}
                  containerStyles={{ marginTop: 16 }}
                />
              )}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
