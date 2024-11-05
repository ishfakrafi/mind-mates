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

  // Update text size and save to AsyncStorage
  const handleTextSizeChangeComplete = async (value) => {
    setBaseFontSize(value);
    setTextSize(value);
    console.log("Text size changed to:", value);
  };

  // Reset theme settings to defaults
  const resetPreferences = async () => {
    try {
      await AsyncStorage.removeItem("themeConfig");
      setIsDarkMode(false);
      setTextSize(16);
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
          minimumValue={12}
          maximumValue={24}
          value={textSize}
          onSlidingComplete={handleTextSizeChangeComplete}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: textSize,
            color: theme.colors.textSecondary,
          }}
        >
          {textSize.toFixed(0)}
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
