import React, { useContext } from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppearanceContext } from "../app/AppearanceContext"; // Ensure correct path

const AppearanceScreen = () => {
  const { isDarkMode, setIsDarkMode, textSize, setTextSize } =
    useContext(AppearanceContext);

  // Toggle dark mode and update context
  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode); // Update context
    console.log("Dark mode toggled:", newMode); // Log the new mode value
    await AsyncStorage.setItem("themeMode", newMode ? "dark" : "light"); // Optional: Save to AsyncStorage
  };

  // Update text size in context when sliding completes
  const handleTextSizeChangeComplete = async (value) => {
    setTextSize(value); // Update context
    console.log("Text size changed to:", value);
    await AsyncStorage.setItem("textSize", value.toString()); // Optional: Save to AsyncStorage
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: isDarkMode ? "#333" : "#fff",
      }}
    >
      <Text style={{ fontSize: textSize + 4, fontWeight: "bold" }}>
        Appearance Settings
      </Text>

      {/* Dark Mode Toggle */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: textSize }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Text Size Adjustment */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: textSize }}>Text Size</Text>
        <Slider
          minimumValue={12}
          maximumValue={24}
          value={textSize}
          onSlidingComplete={handleTextSizeChangeComplete} // Only update on complete
        />
        <Text style={{ textAlign: "center", fontSize: textSize }}>
          {textSize.toFixed(0)}
        </Text>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={{
          padding: 12,
          backgroundColor: "gray",
          alignItems: "center",
          borderRadius: 8,
        }}
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("themeMode");
            await AsyncStorage.removeItem("textSize");
            setIsDarkMode(false); // Reset to default
            setTextSize(16); // Reset to default
            Alert.alert(
              "Preferences Reset",
              "Appearance settings have been reset."
            );
          } catch (error) {
            console.log("Failed to reset settings:", error);
          }
        }}
      >
        <Text style={{ color: "#fff" }}>Reset Preferences</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppearanceScreen;
