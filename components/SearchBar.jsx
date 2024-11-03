import React from "react";
import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function SearchBar() {
  return (
    <View style={tw`flex-row items-center my-4 bg-gray-200 rounded-lg p-2`}>
      <Text style={tw`ml-2 text-gray-500`}>Search mental health disorder</Text>
    </View>
  );
}
