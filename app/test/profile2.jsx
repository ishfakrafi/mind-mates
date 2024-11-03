import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import TopBar from "../src/TopBar";
import { icons } from "../../constants";

const Profile = () => {
  return (
    <View style={[tw`flex-1 p-4`, { backgroundColor: "#ab79fd" }]}>
      {/* Top Bar */}

      {/* Logo */}
      <View style={tw`items-center mt-12`}>
        <Image source={require("../../assets/images/icon.png")} style={tw``} />
        <Text style={tw`text-center text-lg mt-2`}>
          Your Journey to Wellness Starts Here
        </Text>
      </View>

      {/* Social Media Login Buttons */}
      <View style={tw`flex-row justify-between items-center px-24  mt-10`}>
        <TouchableOpacity
          style={tw`flex-row items-center bg-gray-50 p-4 rounded-lg`}
        >
          <Text style={tw`ml-2 text-gray-700`}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center bg-gray-50 p-4 rounded-lg`}
        >
          <Text style={tw`ml-2 text-gray-700`}>Google</Text>
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <View style={tw`bg-gray-50 p-4 rounded-lg mt-5`}>
        <Text style={tw`text-gray-900`}>alphainvent@gmail.com</Text>
      </View>

      {/* Password Input */}
      <View
        style={tw`bg-gray-50 p-4 rounded-lg mt-5 flex-row justify-between items-center`}
      >
        <Text style={tw`text-gray-800`}>••••••••</Text>

        <Text style={tw` absolute right-4 bottom-2`}>Forget Password?</Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={tw` p-4 rounded-lg items-center mt-5`}>
        <Text style={tw`text-white text-lg`}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={tw`text-center  mt-5`}>
        Don’t have an account? <Text style={tw``}>Sign Up</Text>
      </Text>
    </View>
  );
};

export default Profile;
