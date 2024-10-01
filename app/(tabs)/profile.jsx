import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import TopBar from "../src/TopBar";
import { icons } from "../../constants";

const Profile = () => {
  return (
    <View style={tw`flex-1`}>
      {/* Fixed Top Bar */}
      <TopBar />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Profile Section */}
        <View style={tw`flex-col h-[801px] py-5`}>
          <View style={tw`flex-row items-start gap-2.5 px-6 py-10`}>
            <View style={tw`w-[186px] h-[130px]`}>
              <Image
                source={icons.google}
                style={tw`w-16 h-16`}
                alt="User image"
              />
              <View style={tw`mt-4`}>
                <Text style={tw`text-black text-2xl`}>James Frank</Text>
                <Text style={tw`text-gray-600 mt-1`}>james.f@hmail.co</Text>
              </View>
            </View>
          </View>

          {/* Notification Section */}
          <View style={tw`w-full`}>
            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Notification</Text>
            </View>

            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Privacy and Security</Text>
            </View>

            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Appearance</Text>
            </View>

            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Language</Text>
            </View>

            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Ask a Question</Text>
            </View>

            <View style={tw`px-4 border-b border-gray-300 py-4`}>
              <Text style={tw`text-lg text-black`}>Log out</Text>
            </View>

            {/* Delete Account Section */}
            <View style={tw`py-4 bg-red-600`}>
              <Text style={tw`text-lg text-center text-white`}>
                Delete my account
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
