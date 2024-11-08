import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import { useNavigation } from "@react-navigation/native"; // Import for back navigation
import tw from "tailwind-react-native-classnames";
import { db } from "../components/firebase-config"; // Adjust the path based on your project structure
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions

export default function MoodDetails() {
  const route = useRoute(); // Get the route object
  const { mood, userEmail } = route.params; // Destructure the mood and userEmail from params

  // Log the email to confirm it's passed correctly
  console.log("User Email: ", userEmail);
  const navigation = useNavigation(); // Use navigation for the back button
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [isJournalModalVisible, setIsJournalModalVisible] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");

  const moods = [
    { icon: "sad-outline", label: "Very Bad", color: "#8B0000" },
    { icon: "sad", label: "Bad", color: "#FF4500" },
    { icon: "ellipse-outline", label: "Neutral", color: "#FFD700" },
    { icon: "happy-outline", label: "Good", color: "#9ACD32" },
    { icon: "happy", label: "Very Good", color: "#006400" },
  ];

  const reasons = [
    { label: "Work", icon: "briefcase-outline" },
    { label: "Family", icon: "people-outline" },
    { label: "Friend", icon: "chatbox-ellipses-outline" },
    { label: "Relation", icon: "heart-outline" },
    { label: "Society", icon: "people-circle-outline" },
    { label: "Studies", icon: "school-outline" },
    { label: "Food", icon: "fast-food-outline" },
    { label: "Sleep", icon: "bed-outline" },
  ];

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
    setSelectedReasons([]);
  };

  const toggleReasonSelection = (reason) => {
    setSelectedReasons([reason]);
    setIsJournalModalVisible(true);
  };

  const closeJournalModal = () => {
    setIsJournalModalVisible(false);
    setJournalEntry("");
  };

  const handleSkip = async () => {
    await submitData(); // Submit data without journal entry
    closeJournalModal();
  };

  const handleSubmit = async () => {
    await submitData(); // Submit data with journal entry
    closeJournalModal();
  };

  const submitData = async () => {
    const submissionData = {
      userId: userEmail,
      mood: moods[selectedMood].label,
      reasons: selectedReasons,
      journal: journalEntry,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "moodEntries"), submissionData);
      Alert.alert("Submission Successful", "Your mood has been recorded.");
    } catch (error) {
      console.error("Error adding mood entry: ", error);
    }
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View>
        <Text style={tw`text-lg font-bold mb-4`}>Today I Am Feeling</Text>
        <View style={{ paddingVertical: 10, alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "start",
            }}
          >
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMoodSelect(index)}
                style={{
                  marginHorizontal: 5,
                  opacity: selectedMood === index ? 1 : 0.5,
                  alignItems: "center",
                  width: "15%", // Adjust the width to fit three moods per row
                }}
              >
                <Ionicons
                  name={mood.icon}
                  size={50}
                  color={selectedMood === index ? mood.color : "gray"}
                />
                {selectedMood === index && (
                  <Text
                    style={[
                      tw`text-center mt-2 text-lg font-bold`,
                      { color: mood.color },
                    ]}
                  >
                    {mood.label}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {selectedMood !== null && (
        <View style={tw`mt-6`}>
          <Text style={tw`text-lg font-bold mb-4`}>
            What Made You Feel {moods[selectedMood].label}?
          </Text>
          <View style={tw`flex-row flex-wrap justify-center`}>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleReasonSelection(reason.label)}
                style={[
                  tw`p-4 m-2 rounded-lg border`,
                  {
                    backgroundColor: selectedReasons.includes(reason.label)
                      ? moods[selectedMood].color
                      : "#f0f0f0",
                    borderColor: moods[selectedMood].color,
                    width: "30%", // Fixed width for each box
                  },
                ]}
              >
                <Ionicons
                  name={reason.icon}
                  size={24}
                  color={
                    selectedReasons.includes(reason.label)
                      ? "#FFFFFF"
                      : moods[selectedMood].color
                  }
                  style={{ alignSelf: "center" }} // Center the icon
                />
                <Text
                  style={[
                    tw`mt-2 text-center`,
                    {
                      color: selectedReasons.includes(reason.label)
                        ? "#FFFFFF"
                        : moods[selectedMood].color,
                    },
                  ]}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Journal Modal */}
      <Modal
        visible={isJournalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeJournalModal}
      >
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View
            style={[
              tw`p-6 rounded-t-lg`,
              { backgroundColor: "#FFF8DC", minHeight: "50%" },
            ]}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`p-2 rounded-full mr-2`,
                    { backgroundColor: moods[selectedMood]?.color },
                  ]}
                >
                  <Ionicons
                    name={moods[selectedMood]?.icon}
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View
                  style={[
                    tw`p-2 rounded-full`,
                    { backgroundColor: moods[selectedMood]?.color },
                  ]}
                >
                  <Text style={tw`text-white`}>{selectedReasons[0]}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeJournalModal}>
                <Ionicons name="close" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                tw`p-3 text-base mb-4 rounded-lg`,
                {
                  backgroundColor: "#FFF8DC",
                  borderWidth: 1,
                  borderColor: "transparent",
                },
              ]}
              placeholder="Write a note explaining why you felt that way..."
              multiline
              value={journalEntry}
              onChangeText={(text) => setJournalEntry(text)}
            />

            {/* Fixed Buttons at Bottom */}
            <View style={tw`flex-row justify-between mt-auto`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-300 p-3 mr-2 rounded-lg`}
                onPress={handleSkip}
              >
                <Text style={tw`text-center text-base`}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-green-500 p-3 ml-2 rounded-lg`}
                onPress={handleSubmit}
              >
                <Text style={tw`text-center text-white text-base`}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
