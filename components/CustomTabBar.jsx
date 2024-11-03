import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  toggleModal,
}) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={tw`flex-1 items-center justify-center`}
          >
            <Ionicons
              name={options.tabBarIcon ? options.tabBarIcon : "home-outline"}
              size={24}
              color={isFocused ? "#FFA001" : "#CDCDE0"}
            />
            <Text style={{ color: isFocused ? "#FFA001" : "#CDCDE0" }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={toggleModal}>
        <Ionicons name="alert-circle" size={32} color="white" />
        <Text style={tw`text-white font-semibold`}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#AB79FD",
    height: 84,
    borderTopColor: "#232533",
    justifyContent: "space-around",
  },
  sosButton: {
    backgroundColor: "red",
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20, // Adjust this based on where you want the button
  },
});
