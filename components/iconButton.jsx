import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";

const IconButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  icon,
  width = 200, // Default fixed width, you can adjust this
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.buttonContainer,
        { width }, // Apply fixed width
        isLoading && styles.buttonLoading,
        containerStyles,
      ]}
      disabled={isLoading}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
      )}
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.indicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#FFFFFF", // Secondary color
    borderRadius: 10, // Rounded corners
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // Ensures padding inside the button
  },
  buttonLoading: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#AB79FD", // Primary color
    fontFamily: "pbold", // Assuming you have the font configured
    fontSize: 20, // Text size
  },
  iconContainer: {
    marginRight: 8, // Space between icon and text
  },
  icon: {
    width: 24, // Adjust the size of the icon
    height: 24, // Adjust the size of the icon
  },
  indicator: {
    marginLeft: 8, // Space between text and loader
  },
});

export default IconButton;
