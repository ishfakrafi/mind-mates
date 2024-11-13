import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Default theme configuration
const defaultThemeConfig = {
  isDarkMode: false,
  baseFontSize: 16,
  fontScale: 1.125,
  colors: {
    light: {
      background: "#f0f0f0",
      bg2: "#dedcdc",
      textPrimary: "#333333",
      textSecondary: "#666666",
      heading: "#000000",
      accent: "#6200EE",
      divider: "#E0E0E0",
      danger: "#B00020",
      success: "#018786",
      cswhite: "#FFFFFF",
      secondaryBackground: "#FFFFFF",
    },
    dark: {
      background: "#0d0d0d",
      textPrimary: "#E0E0E0",
      textSecondary: "#B3B3B3",
      heading: "#FFFFFF",
      accent: "#BB86FC",
      divider: "#2C2C2E",
      secondaryBackground: "#1c1c1c",
      danger: "#CF6679",
      cswhite: "#FFFFFF",
      success: "#03DAC6",
    },
  },
};

// Internal theme state
let themeConfig = { ...defaultThemeConfig };

// Load theme configuration from AsyncStorage
export const loadThemeConfig = async () => {
  try {
    const savedConfig = await AsyncStorage.getItem("themeConfig");
    if (savedConfig) {
      themeConfig = JSON.parse(savedConfig);
      console.log("Theme config loaded:", themeConfig); // Debug log to see current colors
    }
  } catch (error) {
    console.error("Error loading theme config:", error);
  }
};

// Save theme configuration to AsyncStorage
export const saveThemeConfig = async () => {
  try {
    await AsyncStorage.setItem("themeConfig", JSON.stringify(themeConfig));
  } catch (error) {
    console.error("Error saving theme config:", error);
  }
};

// Function to get the current theme configuration
export const getThemeConfig = () => {
  const colors = themeConfig.isDarkMode
    ? themeConfig.colors.dark
    : themeConfig.colors.light;
  return { ...themeConfig, colors };
};

// Function to toggle dark mode
export const toggleDarkMode = () => {
  themeConfig.isDarkMode = !themeConfig.isDarkMode;
  saveThemeConfig();
};

export const updateThemeConfig = async (newConfig) => {
  themeConfig = { ...themeConfig, ...newConfig };
  await saveThemeConfig();
};

// Function to set the base font size and save it
export const setBaseFontSize = (size) => {
  themeConfig.baseFontSize = size;
  saveThemeConfig();
};

export const clearThemeConfig = async () => {
  try {
    await AsyncStorage.removeItem("themeConfig");
    themeConfig = { ...defaultThemeConfig }; // Reset to defaults in memory
    console.log("Theme config cleared and reset to defaults.");
  } catch (error) {
    console.error("Error clearing theme config:", error);
  }
};

// Function to calculate and retrieve dynamic font sizes
export const getFontSizes = () => {
  const { baseFontSize, fontScale } = themeConfig;
  return {
    md: baseFontSize,
    lg: baseFontSize * fontScale,
    xl: baseFontSize * fontScale * fontScale,
  };
};
