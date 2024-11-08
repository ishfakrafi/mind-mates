import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getFirestore } from "@react-native-firebase/firestore";
import tw from "tailwind-react-native-classnames";
import { db } from "./firebase-config"; // Adjust the path as necessary
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TestFirestore = () => {
  const addDummyAssessment = async () => {
    const dummyResults = {
      depression: 21, // Dummy values
      anxiety: 15,
      stress: 18,
    };

    const userId = "test_user"; // Use a dummy user ID

    try {
      await collection("assessments").add({
        userId: userId,
        assessmentData: dummyResults,
        timestamp: new Date(),
      });
      console.log("Dummy assessment added!");
    } catch (error) {
      console.error("Error adding dummy assessment: ", error);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-lg mb-4`}>Test Firestore Integration</Text>
      <TouchableOpacity
        onPress={addDummyAssessment}
        style={tw`p-4 bg-blue-500 rounded`}
      >
        <Text style={tw`text-white text-center`}>Add Dummy Assessment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestFirestore;
