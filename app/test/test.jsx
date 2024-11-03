import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const Login = () => {
  return (
    <View style={tailwind("flex-1 bg-[#ab79fd] p-4")}>
      {/* Top Bar */}

      {/* Logo */}
      <View style={tailwind("items-center mt-12")}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={tailwind("w-[282px] h-[94px]")}
        />
        <Text style={tailwind("text-center text-[#e4e4e4] text-lg mt-2")}>
          Your Journey to Wellness Starts Here
        </Text>
      </View>

      {/* Social Media Login Buttons */}
      <View style={tailwind("flex-row justify-between mt-10")}>
        <TouchableOpacity
          style={tailwind("flex-row items-center bg-gray-50 p-4 rounded-lg")}
        >
          <Text style={tailwind("ml-2 text-gray-700")}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind("flex-row items-center bg-gray-50 p-4 rounded-lg")}
        >
          <Text style={tailwind("ml-2 text-gray-700")}>Google</Text>
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <View style={tailwind("bg-gray-50 p-4 rounded-lg mt-5")}>
        <Text style={tailwind("text-gray-900")}>alphainvent@gmail.com</Text>
      </View>

      {/* Password Input */}
      <View
        style={tailwind(
          "bg-gray-50 p-4 rounded-lg mt-5 flex-row justify-between items-center"
        )}
      >
        <Text style={tailwind("text-gray-800")}>••••••••</Text>

        <Text style={tailwind("text-[#e4e4e4] absolute right-4 bottom-2")}>
          Forget Password?
        </Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={tailwind("bg-[#3461fd] p-4 rounded-lg items-center mt-5")}
      >
        <Text style={tailwind("text-white text-lg")}>Log In</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={tailwind("text-center text-[#e4e4e4] mt-5")}>
        Don’t have an account?{" "}
        <Text style={tailwind("text-[#3461fd]")}>Sign Up</Text>
      </Text>
    </View>
  );
};
