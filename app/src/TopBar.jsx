import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { getThemeConfig } from "../themeConfig";
import { useFocusEffect } from "@react-navigation/native";

const TopBar = ({ firstName, selectedLanguage, setSelectedLanguage }) => {
  const [translatedGreeting, setTranslatedGreeting] = useState({
    hello: "Hello",
    goodMorning: `Good Morning, ${firstName}`,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState({ colors: {}, fontSizes: {} });
  const textSize = theme.baseFontSize;

  useFocusEffect(
    React.useCallback(() => {
      const loadTheme = async () => {
        const config = await getThemeConfig();
        setTheme(config || {}); // Set theme or empty object if config is null
      };
      loadTheme();
    }, [])
  );

  const dummyNotifications = [
    { id: "1", text: "Your profile was updated." },
    { id: "2", text: "New message from Support." },
    { id: "3", text: "Reminder: Complete your profile." },
  ];

  const apiKey = "c4601f1be388488aa7433f305ff71533";
  const apiRegion = "australiaeast";

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
      return text;
    }
  };

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

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleNotificationPress = () => {
    setIsModalVisible(true);
    setNotifications(dummyNotifications);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View
      style={[
        tw`flex-row justify-between items-center px-4 py-3`,
        {
          backgroundColor: theme.colors?.background || "#f0f0f0",
          borderBottomColor: theme.colors?.divider || "#ccc",
          borderBottomWidth: 1,
        },
      ]}
    >
      {/* Left: Greeting Text */}
      <View>
        <Text
          style={{
            fontSize: textSize + 2 || 16,
            color: theme.colors?.textSecondary || "#333",
          }}
        >
          {translatedGreeting.hello}
        </Text>
        <Text
          style={{
            fontSize: textSize + 4 || 18,
            fontWeight: "bold",
            color: theme.colors?.accent || "#6200EE",
          }}
        >
          {translatedGreeting.goodMorning}
        </Text>
      </View>

      {/* Right: Language and Notification Buttons */}
      <View style={tw`flex-row items-center`}>
        <RNPickerSelect
          onValueChange={handleLanguageChange}
          items={[
            { label: "English", value: "en" },
            { label: "Bangla", value: "bn" },
          ]}
          style={{
            inputIOS: {
              fontSize: textSize || 16,
              padding: 10,
              color: theme.colors?.accent || "#6200EE",
            },
            inputAndroid: {
              fontSize: textSize || 16,
              padding: 10,
              color: theme.colors?.accent || "#6200EE",
            },
          }}
          placeholder={{
            label: "Select Language",
            value: null,
            color: theme.colors?.accent || "#6200EE",
          }}
          value={selectedLanguage || null}
        />

        <TouchableOpacity
          onPress={handleNotificationPress}
          style={[
            tw`ml-3 p-2 rounded-lg`,
            { backgroundColor: theme.colors?.accent || "#6200EE" },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors?.cswhite || "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={[
            tw`flex-1 justify-center items-center`,
            {
              backgroundColor:
                theme.colors?.modalOverlay || "rgba(0, 0, 0, 0.5)",
            },
          ]}
        >
          <View
            style={[
              tw`w-4/5 rounded-lg p-5 h-4/5`,
              { backgroundColor: theme.colors?.background || "#FFFFFF" },
            ]}
          >
            <Text
              style={{
                fontSize: textSize || 18,
                fontWeight: "bold",
                color: theme.colors?.heading || "#000",
                marginBottom: 10,
              }}
            >
              Notifications
            </Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    tw`border-b py-2`,
                    { borderBottomColor: theme.colors?.divider || "#ccc" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: textSize || 16,
                      color: theme.colors?.textPrimary || "#333",
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={closeModal}
              style={[
                tw`mt-4 py-2 rounded-md items-center`,
                { backgroundColor: theme.colors?.accent || "#6200EE" },
              ]}
            >
              <Text
                style={{
                  color: theme.colors?.cswhite || "#FFFFFF",
                  fontSize: textSize + 2 || 16,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TopBar;
