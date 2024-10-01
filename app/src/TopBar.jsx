import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const TopBar = ({}) => {
  return (
    <View
      style={tw`flex-row justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300`}
    >
      {/* Left: Greeting Text */}
      <View>
        <Text style={tw`text-lg text-gray-700`}>Hello,</Text>
        <Text style={tw`text-xl font-bold text-purple-500`}>Good Morning,</Text>
      </View>

      {/* Right: Language and Notification Buttons */}
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity
          /* onPress={onLanguagePress}*/ style={tw`ml-3 p-2 bg-purple-200 rounded-lg`}
        >
          <Ionicons name="language" size={24} color="#6B21A8" />
        </TouchableOpacity>
        <TouchableOpacity
          /*onPress={onNotificationPress} */ style={tw`ml-3 p-2 bg-purple-200 rounded-lg`}
        >
          <Ionicons name="notifications-outline" size={24} color="#6B21A8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;
