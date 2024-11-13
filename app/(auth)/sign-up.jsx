import { useState, useLayoutEffect } from "react";
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
import tw from "tailwind-react-native-classnames";

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
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#AB79FD" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[
              tw`flex justify-center px-4 my-6`,
              { minHeight: Dimensions.get("window").height - 500 },
            ]}
          >
            <Text
              style={[
                tw`text-2xl font-semibold mt-10`,
                { color: "#FFFFFF", fontFamily: "psemibold" },
              ]}
            >
              Get Started With MindMates
            </Text>

            {/* Form Fields */}
            <FormField
              title="First Name"
              handleChangeText={(e) => setForm({ ...form, fname: e })}
              otherStyles={tw`mt-2`}
              keyboardType="default"
            />
            <FormField
              title="Last Name"
              handleChangeText={(e) => setForm({ ...form, lname: e })}
              otherStyles={tw`mt-7`}
              keyboardType="default"
            />
            <FormField
              title="Date Of Birth"
              handleChangeText={(e) => setForm({ ...form, dob: e })}
              otherStyles={tw`mt-7`}
              keyboardType="default"
            />
            <FormField
              title="Gender"
              handleChangeText={(e) => setForm({ ...form, gender: e })}
              otherStyles={tw`mt-7`}
              keyboardType="default"
            />
            <FormField
              title="Email"
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles={tw`mt-7`}
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles={tw`mt-7`}
              secureTextEntry
            />

            {/* Button and Spinner */}
            <View style={[tw`relative`, { marginTop: 16 }]}>
              {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <CustomButton
                  title="SignUp"
                  handlePress={handleSignUp}
                  width={350}
                  marginLeft={18}
                  containerStyles={tw`mt-4`}
                />
              )}
            </View>

            <View style={tw`flex justify-center pt-5 flex-row`}>
              <Text
                style={[
                  tw`text-lg pr-2`,
                  { color: "#D3D3D3", fontFamily: "pregular" },
                ]}
              >
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                style={[
                  tw`text-lg`,
                  { fontFamily: "psemibold", color: "#3461FD" },
                ]}
              >
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
