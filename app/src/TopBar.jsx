import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select"; // Import picker for dropdown
import axios from "axios"; // Import axios for API requests

const TopBar = ({ firstName, selectedLanguage, setSelectedLanguage }) => {
  const [translatedGreeting, setTranslatedGreeting] = useState({
    hello: "Hello",
    goodMorning: `Good Morning, ${firstName}`,
  });

  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [notifications, setNotifications] = useState([]); // Notifications state

  // Dummy notifications for demonstration
  const dummyNotifications = [
    { id: "1", text: "Your profile was updated." },
    { id: "2", text: "New message from Support." },
    { id: "3", text: "Reminder: Complete your profile." },
  ];

  // Azure API key and region
  const apiKey = "c4601f1be388488aa7433f305ff71533";
  const apiRegion = "australiaeast";

  // Function to call Azure Translator API and translate text
  const translateText = async (text) => {
    try {
      const response = await axios.post(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${selectedLanguage}`,
        [{ text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": apiRegion,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data[0]?.translations[0]?.text || text;
    } catch (error) {
      console.error("Error translating text:", error);
      return text; // Return original text if there's an error
    }
  };

  // Translate the greeting text when the selectedLanguage changes
  useEffect(() => {
    const loadTranslations = async () => {
      const hello = await translateText("Hello");
      const goodMorning = await translateText(`Good Morning, ${firstName}`);
      setTranslatedGreeting({
        hello,
        goodMorning,
      });
    };

    loadTranslations();
  }, [selectedLanguage, firstName]);

  // Handle language change
  const handleLanguageChange = (value) => {
    setSelectedLanguage(value); // Update language in the Profile component
  };

  // Handle notification icon press to open modal
  const handleNotificationPress = () => {
    setIsModalVisible(true); // Show modal
    setNotifications(dummyNotifications); // Set notifications (can fetch real notifications here)
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View
      style={tw`flex-row justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-300`}
    >
      {/* Left: Greeting Text */}
      <View>
        <Text style={tw`text-lg text-gray-700`}>
          {translatedGreeting.hello}
        </Text>
        <Text style={tw`text-xl font-bold text-purple-500`}>
          {translatedGreeting.goodMorning} {/* Display first name */}
        </Text>
      </View>

      {/* Right: Language and Notification Buttons */}
      <View style={tw`flex-row items-center`}>
        {/* Language Picker Dropdown */}
        <RNPickerSelect
          onValueChange={handleLanguageChange}
          items={[
            { label: "English", value: "en" },
            { label: "Bangla", value: "bn" },
          ]}
          style={{
            inputIOS: { fontSize: 16, padding: 10, color: "#6B21A8" },
            inputAndroid: { fontSize: 16, padding: 10, color: "#6B21A8" },
          }}
          placeholder={{
            label: "Select Language",
            value: null,
            color: "#6B21A8",
          }}
          value={selectedLanguage} // Controlled picker
        />

        {/* Notification Button */}
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={tw`ml-3 p-2 bg-purple-200 rounded-lg`}
        >
          <Ionicons name="notifications-outline" size={24} color="#6B21A8" />
        </TouchableOpacity>
      </View>

      {/* Modal for Notifications */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`w-4/5 bg-white rounded-lg p-5 h-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Notifications</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={tw`border-b border-gray-300 py-2`}>
                  <Text style={tw`text-base`}>{item.text}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={closeModal}
              style={tw`mt-4 bg-purple-600 py-2 rounded-md items-center`}
            >
              <Text style={tw`text-white text-base`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TopBar;
