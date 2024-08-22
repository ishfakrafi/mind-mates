import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
//import { getCurrentUser, signIn } from "../../lib/appwrite";
//import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
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
              handlePress={() => router.push("/sign-in")}
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
