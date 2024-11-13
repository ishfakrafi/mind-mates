import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import {
  toggleDarkMode,
  setBaseFontSize,
  getThemeConfig,
  loadThemeConfig,
  clearThemeConfig,
} from "../app/themeConfig"; // Ensure the correct path

const AppearanceScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(16);

  // Load theme settings from AsyncStorage on mount
  useEffect(() => {
    const initializeTheme = async () => {
      await loadThemeConfig();
      //await clearThemeConfig(); //use to update config
      const config = getThemeConfig();
      console.log("Loaded theme configuration:", config); // Log to verify colors and theme
      setIsDarkMode(config.isDarkMode);
      setTextSize(config.baseFontSize);
    };
    initializeTheme();
  }, []);
  const navigation = useNavigation();
  // Toggle dark mode and save to AsyncStorage
  const handleToggleDarkMode = async () => {
    toggleDarkMode();
    const updatedConfig = getThemeConfig();
    setIsDarkMode(updatedConfig.isDarkMode);
    console.log("Dark mode toggled:", updatedConfig.isDarkMode);
  };

  // Define text sizes and labels for the three steps
  const textSizes = [16, 20, 22];
  const textSizeLabels = ["Normal", "Large", "Extra Large"];

  const handleTextSizeChangeComplete = async (step) => {
    const newSize = textSizes[step]; // Map the slider step to the corresponding text size
    setBaseFontSize(newSize);
    setTextSize(newSize);
    console.log("Text size changed to:", newSize);
  };
  // Reset theme settings to defaults
  const resetPreferences = async () => {
    try {
      await clearThemeConfig();
      setIsDarkMode(false);
      setTextSize(16);
      await loadThemeConfig();
      Alert.alert("Preferences Reset", "Appearance settings have been reset.");
    } catch (error) {
      console.log("Failed to reset settings:", error);
    }
  };

  const theme = getThemeConfig();

  return (
    <View
      style={[tw`flex-1 p-4`, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 2 }}
      >
        <Text style={{ color: theme.colors.accent, fontSize: textSize }}>
          Back
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          tw`font-bold`,
          { fontSize: textSize + 4, color: theme.colors.heading },
        ]}
      >
        Appearance Settings
      </Text>

      {/* Dark Mode Toggle */}
      <View style={tw`flex-row justify-between items-center mb-5`}>
        <Text style={{ fontSize: textSize, color: theme.colors.textPrimary }}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} />
      </View>

      {/* Text Size Adjustment */}
      <View style={tw`mb-5`}>
        <Text style={{ fontSize: textSize, color: theme.colors.textPrimary }}>
          Text Size
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={2}
          step={1} // Set to move in increments of 1 (0, 1, 2)
          value={textSizes.indexOf(textSize)} // Start at the current text size step
          onSlidingComplete={handleTextSizeChangeComplete}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: textSize,
            color: theme.colors.textSecondary,
          }}
        >
          {textSizeLabels[textSizes.indexOf(textSize)]} {/* Display label */}
        </Text>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[
          tw`p-3 items-center rounded-lg`,
          { backgroundColor: theme.colors.accent },
        ]}
        onPress={resetPreferences}
      >
        <Text style={{ color: theme.colors.cswhite }}>Reset Preferences</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppearanceScreen;
