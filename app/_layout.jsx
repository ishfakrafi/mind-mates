import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AppearanceProvider } from "../app/AppearanceContext";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    mono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <AppearanceProvider>
      <Stack>
        {/* This will act as the root route (i.e., index page) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AppearanceProvider>
  );
};

export default RootLayout;
