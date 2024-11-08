import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import dayjs from "dayjs";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation
import SimpleGauge from "../components/SimpleGauge";
import { router } from "expo-router"; // Import router for navigation

const Dass21Success = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get the navigation object
  let { results } = route.params || {}; // Get results from params

  // Ensure `results` is parsed as an object
  if (typeof results === "string") {
    try {
      results = JSON.parse(results); // Explicitly parse the JSON string
    } catch (error) {
      console.error("Failed to parse results:", error);
    }
  }

  console.log(
    "Assessment Results in Success Screen (Parsed):",
    JSON.stringify(results, null, 2)
  );
  console.log("Type of results in Success Screen (Parsed):", typeof results);
  const currentDate = dayjs().format("MMMM D, YYYY");
  const currentTime = dayjs().format("h:mm A");

  // Define gauge data
  const gaugesData = [
    {
      category: "DEPRESSION",
      value: results.scores.depression,
      severity: results.depression,
    },
    {
      category: "ANXIETY",
      value: results.scores.anxiety,
      severity: results.anxiety,
    },
    {
      category: "STRESS",
      value: results.scores.stress,
      severity: results.stress,
    },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white p-5`}>
      <Text style={tw`text-2xl font-bold text-center text-gray-800 my-2`}>
        Your assessment is now complete
      </Text>
      <Text style={tw`text-lg text-center text-gray-600 mb-4`}>
        {`Completed on ${currentDate} at ${currentTime}`}
      </Text>

      {/* Display gauges for Depression, Anxiety, and Stress */}
      {gaugesData.map(({ category, value, severity }) => (
        <View key={category} style={tw`flex-row items-center mb-5`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-center text-gray-800 mb-1`}>
              {severity.toUpperCase()}
            </Text>
            <Text style={tw`text-lg text-center text-gray-600`}>
              {`Value: ${value}`}
            </Text>
          </View>
          <View style={tw`flex-1 items-center`}>
            <SimpleGauge value={value} label={category} />
          </View>
        </View>
      ))}

      {/* Return to Home Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-full mt-5`}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={tw`text-white text-lg text-center`}>Return to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dass21Success;
