import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";
import TopBar from "../src/TopBar";
import { useFocusEffect } from "@react-navigation/native";
import { loadThemeConfig, getThemeConfig } from "../themeConfig";
import { auth } from "../../components/firebase-config";
import axios from "axios";
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Function to translate text using Azure Translator API
const translateText = async (text, language) => {
  try {
    const response = await axios.post(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${language}`,
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
export default function home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;
  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndUser = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});

        const currentUser = auth.currentUser;
        console.log("Current User:", currentUser);
        if (currentUser) {
          const displayName = currentUser.displayName || "User";
          setFirstName(displayName.split(" ")[0]);
          setUserEmail(currentUser.email); // Store the user's email

          console.log("First Name:", displayName.split(" ")[0]);
          console.log("User Email:", currentUser.email);
        }
      };

      loadThemeAndUser();
    }, [])
  );
  const handleMoodPress = (mood) => {
    router.push({
      pathname: "/MoodDetail",
      params: { mood, userEmail: userEmail },
    });
  };
  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <TopBar
        firstName={firstName}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <Text style={tw`text-2xl font-bold`}>Good Morning James,</Text>

      <View style={tw`flex-row items-center my-4 bg-gray-200 rounded-lg p-2`}>
        <Text style={tw`ml-2 text-gray-500`}>
          Search mental health disorder
        </Text>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Your Weekly Progress</Text>
      </View>

      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Recommended Activities</Text>
        <ScrollView horizontal>
          <Image
            style={tw`w-36 h-24 rounded-lg mr-2`}
            source={require("../../assets/images/meditation.png")}
          />
          <Image
            style={tw`w-36 h-24 rounded-lg mr-2`}
            source={require("../../assets/images/breathe.png")}
          />
        </ScrollView>
      </View>

      <ScrollView horizontal>
        <TouchableOpacity onPress={() => handleMoodPress("Happy")}>
          <Ionicons name="happy" size={48} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMoodPress("Sad")}>
          <Ionicons name="sad" size={48} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMoodPress("Neutral")}>
          <Ionicons name="happy-outline" size={48} color="yellow" />
        </TouchableOpacity>
      </ScrollView>
      <View style={tw`my-4`}>
        <Text style={tw`text-lg font-bold`}>Assessments For You</Text>
      </View>
    </ScrollView>
  );
}
