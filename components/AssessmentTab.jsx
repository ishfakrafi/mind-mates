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

// Modified translateText function with caching
const translateText = async (text, language) => {
  if (language === "en") return text;

  // Check cache first
  if (translationCache[language] && translationCache[language][text]) {
    return translationCache[language][text];
  }

  // Proceed with translation if not in cache
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

const AssessmentTab = ({ setView, selectedLanguage, view }) => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;

  const [translatedText, setTranslatedText] = useState({
    dassTitle: "DASS 21",
    time: "5min",
    description:
      "Understand your mental well-being with our quick, insightful assessment.",
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
        dassTitle:
          selectedLanguage === "en"
            ? "DASS 21"
            : await translateText(".DASS. 21", selectedLanguage),
        time:
          selectedLanguage === "en"
            ? "5min"
            : await translateText("5min", selectedLanguage),
        description: await translateText(
          "Understand your mental well-being with our quick, insightful assessment.",
          selectedLanguage
        ),
      };
      setTranslatedText(newTranslatedText);
    };

    loadTranslations();
  }, [selectedLanguage]);

  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      {view === "DASS21" ? ( // Check if view is set to DASS21
        <DASS21Screen selectedLanguage={selectedLanguage} />
      ) : (
        <TouchableOpacity
          style={[
            tw`flex-row p-4 mb-4 items-center`,
            {
              backgroundColor: theme.colors.secondaryBackground || "#FFFFFF",
              borderRadius: 25,
            },
          ]}
          onPress={() => setView("DASS21")}
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
                {translatedText.dassTitle}
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
      )}
    </ScrollView>
  );
};

export default AssessmentTab;
