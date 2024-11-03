import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

export default function home() {
  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold`}>Good Morning James,</Text>

      <View style={tw`flex-row items-center my-4 bg-gray-200 rounded-lg p-2`}>
        <Text style={tw`ml-2 text-gray-500`}>
          Search mental health disorder
        </Text>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Your Weekly Progress</Text>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Recommended Activities</Text>
        <ScrollView horizontal>
          <Image
            style={tw`w-36 h-24 rounded-lg mr-2`}
            source={require("../../assets/images/meditation.png")}
          />
          <Image
            style={tw`w-36 h-24 rounded-lg mr-2`}
            source={require("../../assets/images/breathe.png")}
          />
        </ScrollView>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>How Are You Feeling Today?</Text>
        <ScrollView horizontal>
          <Ionicons name="happy" size={48} color="green" />
          <Ionicons name="sad" size={48} color="red" />
          <Ionicons name="happy-outline" size={48} color="yellow" />
        </ScrollView>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Assessments For You</Text>
      </View>
    </ScrollView>
  );
}
