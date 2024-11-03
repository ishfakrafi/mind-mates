import React from "react";
import { View, Text, ScrollView } from "react-native";
import tw from "tailwind-react-native-classnames";

const ActdivityTab = () => {
  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      <View
        style={[
          tw`flex-row bg-white p-4 mb-4 rounded-[25px] items-center`,
          { borderRadius: "25" },
        ]}
      >
        <View
          style={[
            tw`w-[50px] h-[50px] bg-[#ac7afd4c] `,
            { borderRadius: "25" },
          ]}
        />
        <View style={tw`ml-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-black font-semibold text-sm`}>
              Activity 21
            </Text>
            <View style={tw`w-1 h-1 bg-black rounded-full mx-2`} />
            <Text style={tw`text-gray-500 text-xs`}>5min</Text>
          </View>
          <Text style={tw`text-gray-500 text-xs mt-1`}>
            Understand your mental well-being with our quick, insightful
            assessment.
          </Text>
        </View>
      </View>
      <View
        style={[
          tw`flex-row bg-white p-4 mb-4 rounded-[25px] items-center`,
          { borderRadius: "25" },
        ]}
      >
        <View
          style={[
            tw`w-[50px] h-[50px] bg-[#ac7afd4c] `,
            { borderRadius: "25" },
          ]}
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
      </View>
    </ScrollView>
  );
};

export default ActdivityTab;
