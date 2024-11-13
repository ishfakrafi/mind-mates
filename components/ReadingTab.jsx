import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

// Constants for the translation API
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Translation cache to store translated texts
const translationCache = {};

// Define and export readings data
export const readingsData = [
  {
    key: "What is Anxiety?",
    title: "What is Anxiety?",
    time: "5min",
    description: "Understand your mental well-being with a brief overview.",
    imageUrl:
      "https://edge.sitecorecloud.io/beyondblue1-beyondblueltd-p69c-fe1e/media/Project/Sites/beyondblue/Homepage/Vertical-Card-Group-600-x-330/understanding-anxiety.png?h=330&iar=0&w=600", // Placeholder URL
  },
  // Additional readings can be added here
];

// Modified translateText function with caching
const translateText = async (text, language) => {
  if (language === "en") return text;

  // Check cache first
  if (translationCache[language] && translationCache[language][text]) {
    return translationCache[language][text];
  }

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

    const translatedText = response.data[0]?.translations[0]?.text || text;

    // Save to cache
    if (!translationCache[language]) {
      translationCache[language] = {};
    }
    translationCache[language][text] = translatedText;

    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

// Your existing ReadingTab component
const ReadingTab = ({ setView, selectedLanguage }) => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;

  const [translatedText, setTranslatedText] = useState({
    title: "Reading 1",
    time: "5min",
    description: "Understand your mental well-being with a brief overview.",
  });

  // Load theme
  useFocusEffect(
    React.useCallback(() => {
      const loadTheme = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});
      };
      loadTheme();
    }, [])
  );

  // Load translations based on selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslatedText = {
        title:
          selectedLanguage === "en"
            ? "What is anxiety?"
            : await translateText("What is anxiety?", selectedLanguage),
        time:
          selectedLanguage === "en"
            ? "5min"
            : await translateText("5min", selectedLanguage),
        description: await translateText(
          "Understand your mental well-being with a brief overview.",
          selectedLanguage
        ),
      };
      setTranslatedText(newTranslatedText);
    };

    loadTranslations();
  }, [selectedLanguage]);

  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      <TouchableOpacity
        style={[
          tw`flex-row p-4 mb-4 items-center`,
          {
            backgroundColor: theme.colors.secondaryBackground || "#F8F9FA",
            borderRadius: 25,
          },
        ]}
        onPress={() => setView("READING1")}
      >
        <View style={[{ borderRadius: 45 }]} />
        <View style={tw`ml-4`}>
          <View style={tw`flex-row items-center`}>
            <Text
              style={{
                color: theme.colors.textPrimary || "black",
                fontSize: textSize - 2,
                fontWeight: "600",
              }}
            >
              {translatedText.title}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: theme.colors.textPrimary || "black",
                borderRadius: 2,
                marginHorizontal: 8,
              }}
            />
            <Text
              style={{
                color: theme.colors.textSecondary || "#666",
                fontSize: textSize - 4,
              }}
            >
              {translatedText.time}
            </Text>
          </View>
          <Text
            style={{
              color: theme.colors.textSecondary || "#666",
              fontSize: textSize - 4,
              marginTop: 4,
            }}
          >
            {translatedText.description}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReadingTab;
