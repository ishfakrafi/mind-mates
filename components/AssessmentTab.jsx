import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const AssessmentTab = ({ setView }) => {
  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      {/* DASS 21 Button */}
      <TouchableOpacity
        style={[
          tw`flex-row bg-white p-4 mb-4 rounded-[25px] items-center`,
          { borderRadius: 25 },
        ]}
        onPress={() => setView("DASS21")} // Switch to DASS21Screen
      >
        <View
          style={[tw`w-[50px] h-[50px] bg-[#ac7afd4c]`, { borderRadius: 45 }]}
        />
        <View style={tw`ml-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-black font-semibold text-sm`}>DASS 21</Text>
            <View style={tw`w-1 h-1 bg-black rounded-full mx-2`} />
            <Text style={tw`text-gray-500 text-xs`}>5min</Text>
          </View>
          <Text style={tw`text-gray-500 text-xs mt-1`}>
            Understand your mental well-being with our quick, insightful
            assessment.
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AssessmentTab;
