import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const AppearanceContext = createContext();

export const AppearanceProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [textSize, setTextSize] = useState(16);

  // Load stored preferences on mount
  useEffect(() => {
    console.log("AppearanceProvider initialized with values:", {
      isDarkMode,
      textSize,
    });
    (async () => {
      try {
        const storedMode = await AsyncStorage.getItem("themeMode");
        const storedTextSize = await AsyncStorage.getItem("textSize");

        if (storedMode !== null) setIsDarkMode(storedMode === "dark");
        if (storedTextSize !== null) setTextSize(parseFloat(storedTextSize));
      } catch (error) {
        console.log("Failed to load appearance settings:", error);
      }
    })();
  }, []);

  // Save preferences when they change
  useEffect(() => {
    console.log("AppearanceProvider initialized with values:", {
      isDarkMode,
      textSize,
    });
    (async () => {
      try {
        await AsyncStorage.setItem("themeMode", isDarkMode ? "dark" : "light");
        await AsyncStorage.setItem("textSize", textSize.toString());
      } catch (error) {
        console.log("Failed to save appearance settings:", error);
      }
    })();
  }, [isDarkMode, textSize]);

  return (
    <AppearanceContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        textSize,
        setTextSize,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => useContext(AppearanceContext);
