import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { LanguageProvider } from "../LanguageContext";
import { UserProvider } from "../UserContext";

const AuthLayout = () => {
  return (
    <UserProvider>
      <LanguageProvider>
        <Stack>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
      </LanguageProvider>
    </UserProvider>
  );
};

export default AuthLayout;
