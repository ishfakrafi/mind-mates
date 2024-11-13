import { useState, useLayoutEffect, useContext } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { auth } from "../../components/firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import tw from "tailwind-react-native-classnames";
import { LanguageContext } from "../LanguageContext.jsx"; // Import the context

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);

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
          router.push("/home"); // Slight delay to allow navigation setup
        }, 500); // Adjust the delay if necessary
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        Alert.alert("Login Error", error.message);
      });
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#AB79FD" }]}>
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
            Log in to MindMates
          </Text>

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
          />

          <View style={[tw`relative`, { marginTop: 16 }]}>
            <CustomButton
              title="Login"
              handlePress={handleLogin}
              width={350}
              marginLeft={18}
              containerStyles={tw`mt-4`}
            />
          </View>

          <View style={tw`flex justify-center pt-5 flex-row`}>
            <Text
              style={[
                tw`text-lg pr-2`,
                { color: "#D3D3D3", fontFamily: "pregular" },
              ]}
            >
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              style={[
                tw`text-lg`,
                { fontFamily: "psemibold", color: "#3461FD" },
              ]}
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
